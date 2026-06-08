import { NextResponse } from 'next/server'
import { getClient } from '@/lib/db'
import { encryptSession } from '@/lib/auth-session'

async function hashPassword(password: string, salt: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(password + salt)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function POST(request: Request) {
  let dbClient
  try {
    dbClient = await getClient()
    const { email, otpCode, newPassword } = await request.json()

    if (!email || !otpCode || !newPassword) {
      return NextResponse.json(
        { error: 'Email, verification code, and new password are required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    await dbClient.query('BEGIN')

    // 1. Verify OTP code
    const verificationRes = await dbClient.query(
      'SELECT code, expires_at FROM public.email_verifications WHERE email = $1',
      [email]
    )

    if (verificationRes.rows.length === 0 || verificationRes.rows[0].code !== otpCode) {
      await dbClient.query('ROLLBACK')
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 })
    }

    if (new Date(verificationRes.rows[0].expires_at) < new Date()) {
      await dbClient.query('ROLLBACK')
      return NextResponse.json({ error: 'Verification code expired' }, { status: 400 })
    }

    // 2. Fetch user to verify they exist
    const userRes = await dbClient.query('SELECT id FROM public.users WHERE email = $1', [email])
    if (userRes.rows.length === 0) {
      await dbClient.query('ROLLBACK')
      return NextResponse.json({ error: 'User account not found' }, { status: 404 })
    }
    const userId = userRes.rows[0].id

    // 3. Hash and update password
    const newSalt = crypto.randomUUID()
    const hashed = await hashPassword(newPassword, newSalt)
    const newPasswordHash = `${newSalt}:${hashed}`

    await dbClient.query('UPDATE public.users SET password_hash = $1 WHERE id = $2', [newPasswordHash, userId])

    // 4. Delete the email verification code
    await dbClient.query('DELETE FROM public.email_verifications WHERE email = $1', [email])

    // 5. Fetch updated user profile to create session
    const profileRes = await dbClient.query('SELECT * FROM public.profiles WHERE id = $1', [userId])
    if (profileRes.rows.length === 0) {
      await dbClient.query('ROLLBACK')
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }
    const profile = profileRes.rows[0]

    await dbClient.query('COMMIT')

    // 6. Generate and set the session cookie
    const sessionToken = await encryptSession({
      id: profile.id,
      email,
      role: profile.role,
      full_name: profile.full_name
    })

    const response = NextResponse.json({ user: profile })
    response.cookies.set('erudogix_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 1 day
    })

    return response

  } catch (err: any) {
    if (dbClient) {
      await dbClient.query('ROLLBACK')
    }
    console.error('Error in reset-password route:', err)
    return NextResponse.json({ error: err.message || 'Password reset failed' }, { status: 500 })
  } finally {
    if (dbClient) {
      dbClient.release()
    }
  }
}

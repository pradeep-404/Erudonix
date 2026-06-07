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
  const client = await getClient()
  try {
    const { email, password, fullName, role, requirementType, otpCode } = await request.json()

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    if (!otpCode) {
      return NextResponse.json({ error: 'Verification code is required' }, { status: 400 })
    }

    await client.query('BEGIN')

    // Verify OTP code
    const verifyRes = await client.query(
      'SELECT code, expires_at FROM public.email_verifications WHERE email = $1',
      [email]
    )
    if (verifyRes.rows.length === 0) {
      await client.query('ROLLBACK')
      return NextResponse.json({ error: 'No verification code found for this email' }, { status: 400 })
    }

    const { code: dbCode, expires_at: dbExpiresAt } = verifyRes.rows[0]
    if (dbCode !== otpCode) {
      await client.query('ROLLBACK')
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 })
    }

    if (new Date(dbExpiresAt) < new Date()) {
      await client.query('ROLLBACK')
      return NextResponse.json({ error: 'Verification code has expired' }, { status: 400 })
    }

    // Check if user exists
    const checkUser = await client.query('SELECT 1 FROM public.users WHERE email = $1', [email])
    if (checkUser.rows.length > 0) {
      await client.query('ROLLBACK')
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }

    // Delete verification code
    await client.query('DELETE FROM public.email_verifications WHERE email = $1', [email])

    const userId = crypto.randomUUID()
    const salt = crypto.randomUUID()
    const passwordHash = await hashPassword(password, salt)

    // Insert user credential with salt
    await client.query(
      'INSERT INTO public.users (id, email, password_hash) VALUES ($1, $2, $3)',
      [userId, email, `${salt}:${passwordHash}`]
    )

    // Allow registering as student or specialist, default to student. Restrict admin.
    let finalRole = 'student'
    if (role === 'specialist' || role === 'student') {
      finalRole = role
    }

    if (email === 'admin@erudogix.com') {
      await client.query('ROLLBACK')
      return NextResponse.json({ 
        error: 'Registration for administrative accounts is restricted.' 
      }, { status: 403 })
    }

    // Insert profile
    const profileRes = await client.query(
      `INSERT INTO public.profiles (id, full_name, role, requirement_type) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, full_name, role, university, course, requirement_type`,
      [userId, fullName, finalRole, requirementType || 'academic']
    )

    // If specialist, sync specialist details
    if (finalRole === 'specialist') {
      await client.query(
        `INSERT INTO public.specialists (id, bio, subject_specialties, is_available) 
         VALUES ($1, $2, $3, $4) 
         ON CONFLICT (id) DO NOTHING`,
        [userId, 'Erudogix Specialist', '{}', true]
      )
    }

    await client.query('COMMIT')

    const profile = profileRes.rows[0]
    const sessionToken = await encryptSession({
      id: profile.id,
      email,
      role: profile.role,
      full_name: profile.full_name,
      requirement_type: profile.requirement_type
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
    await client.query('ROLLBACK')
    return NextResponse.json({ error: err.message || 'Signup failed' }, { status: 500 })
  } finally {
    client.release()
  }
}

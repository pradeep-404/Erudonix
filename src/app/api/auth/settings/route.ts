import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decryptSession, encryptSession } from '@/lib/auth-session'
import { getClient, query } from '@/lib/db'

async function hashPassword(password: string, salt: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(password + salt)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function PUT(request: Request) {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('erudogix_session')?.value

  if (!sessionToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await decryptSession(sessionToken)
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let client

  try {
    client = await getClient()
    const { fullName, email, currentPassword, newPassword, avatarUrl, university, course } = await request.json()

    await client.query('BEGIN')

    // 1. Fetch user credentials from DB
    const userRes = await client.query('SELECT * FROM public.users WHERE id = $1', [payload.id])
    if (userRes.rows.length === 0) {
      await client.query('ROLLBACK')
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    const dbUser = userRes.rows[0]

    const changingSensitive = newPassword || (email && email !== dbUser.email)

    // 2. Validate current password if changing sensitive details
    if (changingSensitive) {
      if (!currentPassword) {
        await client.query('ROLLBACK')
        return NextResponse.json({ error: 'Current password is required to verify identity.' }, { status: 400 })
      }

      const [salt, storedHash] = dbUser.password_hash.split(':')
      const computedHash = await hashPassword(currentPassword, salt)
      if (computedHash !== storedHash) {
        await client.query('ROLLBACK')
        return NextResponse.json({ error: 'Incorrect current password.' }, { status: 401 })
      }
    }

    // 3. Update email / password in users table if needed
    if (email && email !== dbUser.email) {
      // Check if email already taken
      const checkEmail = await client.query('SELECT 1 FROM public.users WHERE email = $1 AND id != $2', [email, payload.id])
      if (checkEmail.rows.length > 0) {
        await client.query('ROLLBACK')
        return NextResponse.json({ error: 'Email address is already in use.' }, { status: 409 })
      }

      // Restrict employee email registrations if they are trying to bypass it
      if (payload.role === 'student' && (email === 'admin@erudogix.com' || email === 'tutor@erudogix.com' || email.endsWith('@erudogix.com'))) {
        await client.query('ROLLBACK')
        return NextResponse.json({ error: 'Cannot update student email to an employee domain.' }, { status: 403 })
      }

      await client.query('UPDATE public.users SET email = $1 WHERE id = $2', [email, payload.id])
    }

    if (newPassword) {
      const newSalt = crypto.randomUUID()
      const newHash = await hashPassword(newPassword, newSalt)
      const newPasswordHash = `${newSalt}:${newHash}`
      await client.query('UPDATE public.users SET password_hash = $1 WHERE id = $2', [newPasswordHash, payload.id])
    }

    // 4. Update profiles table
    await client.query(
      `UPDATE public.profiles 
       SET full_name = COALESCE($1, full_name), 
           avatar_url = COALESCE($2, avatar_url),
           university = COALESCE($3, university),
           course = COALESCE($4, course),
           updated_at = now()
       WHERE id = $5`,
      [fullName || null, avatarUrl || null, university || null, course || null, payload.id]
    )

    await client.query('COMMIT')

    // Fetch updated profile
    const profileRes = await query('SELECT * FROM public.profiles WHERE id = $1', [payload.id])
    const updatedProfile = profileRes.rows[0]

    // 5. Issue new session token
    const newSessionToken = await encryptSession({
      id: payload.id,
      email: email || dbUser.email,
      role: payload.role,
      full_name: fullName || payload.full_name
    })

    const response = NextResponse.json({ user: updatedProfile })
    response.cookies.set('erudogix_session', newSessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 1 day
    })

    return response

  } catch (err: any) {
    if (client) {
      await client.query('ROLLBACK')
    }
    return NextResponse.json({ error: err.message || 'Failed to update settings' }, { status: 500 })
  } finally {
    if (client) {
      client.release()
    }
  }
}

import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { encryptSession } from '@/lib/auth-session'

async function hashPassword(password: string, salt: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(password + salt)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Fetch user credentials
    const userRes = await query('SELECT * FROM public.users WHERE email = $1', [email])
    if (userRes.rows.length === 0) {
      return NextResponse.json({ error: 'User does not exist' }, { status: 401 })
    }

    const user = userRes.rows[0]
    const [salt, storedHash] = user.password_hash.split(':')

    const computedHash = await hashPassword(password, salt)
    if (computedHash !== storedHash) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    // Fetch profile info
    const profileRes = await query('SELECT * FROM public.profiles WHERE id = $1', [user.id])
    if (profileRes.rows.length === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }
    const profile = profileRes.rows[0]

    // Strict role check
    if (role && profile.role !== role) {
      return NextResponse.json({ 
        error: `Access Denied. This account is registered as a ${profile.role}. Please use the correct login portal.` 
      }, { status: 403 })
    }

    // Proceed to create session
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
    return NextResponse.json({ error: err.message || 'Login failed' }, { status: 500 })
  }
}

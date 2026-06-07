import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decryptSession } from '@/lib/auth-session'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('erudogix_session')?.value

    if (!sessionToken) {
      return NextResponse.json({ user: null })
    }

    const payload = await decryptSession(sessionToken)
    if (!payload) {
      return NextResponse.json({ user: null })
    }

    const profileRes = await query(
      `SELECT p.*, s.is_available, s.subject_specialties, s.bio
       FROM public.profiles p
       LEFT JOIN public.specialists s ON s.id = p.id
       WHERE p.id = $1`,
      [payload.id]
    )
    if (profileRes.rows.length === 0) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({ user: profileRes.rows[0] })
  } catch (err) {
    return NextResponse.json({ user: null })
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('erudogix_session')?.value

    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await decryptSession(sessionToken)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { fullName, university, course } = await request.json()

    const updateRes = await query(
      `UPDATE public.profiles 
       SET full_name = COALESCE($1, full_name), 
           university = COALESCE($2, university), 
           course = COALESCE($3, course),
           updated_at = now()
       WHERE id = $4
       RETURNING *`,
      [fullName, university, course, payload.id]
    )

    return NextResponse.json({ user: updateRes.rows[0] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

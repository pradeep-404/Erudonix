import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decryptSession } from '@/lib/auth-session'
import { query } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const requestId = searchParams.get('request_id')

    if (!requestId) {
      return NextResponse.json({ error: 'Request ID is required' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('erudogix_session')?.value

    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await decryptSession(sessionToken)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify request access
    const reqRes = await query('SELECT student_id, specialist_id FROM public.requests WHERE id = $1', [requestId])
    if (reqRes.rows.length === 0) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    const reqData = reqRes.rows[0]
    const hasAccess = 
      payload.role === 'admin' ||
      reqData.student_id === payload.id ||
      reqData.specialist_id === payload.id

    if (!hasAccess) {
      return NextResponse.json({ error: 'Access Denied' }, { status: 403 })
    }

    // Fetch messages
    const msgRes = await query(
      `SELECT m.*, p.full_name as sender_name 
       FROM public.messages m
       LEFT JOIN public.profiles p ON p.id = m.sender_id
       WHERE m.request_id = $1
       ORDER BY m.created_at ASC`,
      [requestId]
    )

    return NextResponse.json({ messages: msgRes.rows })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
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

    const { requestId, messageText } = await request.json()

    if (!requestId || !messageText) {
      return NextResponse.json({ error: 'Request ID and Message Text are required' }, { status: 400 })
    }

    // Verify request access
    const reqRes = await query('SELECT student_id, specialist_id FROM public.requests WHERE id = $1', [requestId])
    if (reqRes.rows.length === 0) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    const reqData = reqRes.rows[0]
    const hasAccess = 
      payload.role === 'admin' ||
      reqData.student_id === payload.id ||
      reqData.specialist_id === payload.id

    if (!hasAccess) {
      return NextResponse.json({ error: 'Access Denied' }, { status: 403 })
    }

    // Insert message
    const insertRes = await query(
      `INSERT INTO public.messages (request_id, sender_id, message_text) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [requestId, payload.id, messageText]
    )

    return NextResponse.json({ message: insertRes.rows[0] })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

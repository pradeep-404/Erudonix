import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decryptSession } from '@/lib/auth-session'
import { query } from '@/lib/db'

export async function GET() {
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

    let requestList
    if (payload.role === 'admin') {
      requestList = await query(`
        SELECT r.*, 
               s.full_name as student_name,
               t.full_name as specialist_name
        FROM public.requests r
        LEFT JOIN public.profiles s ON s.id = r.student_id
        LEFT JOIN public.profiles t ON t.id = r.specialist_id
        ORDER BY r.created_at DESC
      `)
    } else if (payload.role === 'specialist') {
      requestList = await query(`
        SELECT r.*, 
               s.full_name as student_name,
               s.university as student_university
        FROM public.requests r
        LEFT JOIN public.profiles s ON s.id = r.student_id
        WHERE r.specialist_id = $1
        ORDER BY r.created_at DESC
      `, [payload.id])
    } else {
      requestList = await query(`
        SELECT r.*, 
               t.full_name as specialist_name
        FROM public.requests r
        LEFT JOIN public.profiles t ON t.id = r.specialist_id
        WHERE r.student_id = $1
        ORDER BY r.created_at DESC
      `, [payload.id])
    }

    return NextResponse.json({ requests: requestList.rows })

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
    if (!payload || payload.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      serviceLine,
      serviceType,
      subjectCode,
      deadline,
      estimatedLength,
      description,
      couponCode,
      currency,
      price
    } = await request.json()

    if (!serviceLine || !serviceType || !deadline || !description || !currency || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Insert request - this will fire public.assign_specialist_to_request trigger!
    const insertRes = await query(
      `INSERT INTO public.requests 
       (student_id, service_line, service_type, subject_code, deadline, estimated_length, description, coupon_code, currency, price, price_approved)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        payload.id,
        serviceLine,
        serviceType,
        subjectCode || null,
        deadline,
        estimatedLength || null,
        description,
        couponCode || null,
        currency,
        price,
        true // Auto approved as approved on the multi-step form
      ]
    )

    return NextResponse.json({ request: insertRes.rows[0] })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

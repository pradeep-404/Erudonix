import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decryptSession } from '@/lib/auth-session'
import { query } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('erudogix_session')?.value

    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await decryptSession(sessionToken)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch request with client/specialist details
    const reqRes = await query(
      `SELECT r.*,
              s.full_name as student_name,
              s.university as student_university,
              s.course as student_course,
              t.full_name as specialist_name
       FROM public.requests r
       LEFT JOIN public.profiles s ON s.id = r.student_id
       LEFT JOIN public.profiles t ON t.id = r.specialist_id
       WHERE r.id = $1`,
      [id]
    )

    if (reqRes.rows.length === 0) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    const reqData = reqRes.rows[0]

    // Route Protection / RLS Check
    const hasAccess = 
      payload.role === 'admin' ||
      reqData.student_id === payload.id ||
      reqData.specialist_id === payload.id

    if (!hasAccess) {
      return NextResponse.json({ error: 'Access Denied' }, { status: 403 })
    }

    return NextResponse.json({ request: reqData })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('erudogix_session')?.value

    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await decryptSession(sessionToken)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { status, priceApproved, specialistId, extraUploadsApproved, price, rating, marks, resultScreenshot, feedback } = await request.json()

    // Fetch existing request to verify access
    const reqRes = await query('SELECT * FROM public.requests WHERE id = $1', [id])
    if (reqRes.rows.length === 0) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    const reqData = reqRes.rows[0]

    // Verify update permissions
    const isOwner = reqData.student_id === payload.id
    const isSpecialist = reqData.specialist_id === payload.id
    const isAdmin = payload.role === 'admin'

    if (!isOwner && !isSpecialist && !isAdmin) {
      return NextResponse.json({ error: 'Access Denied' }, { status: 403 })
    }

    let updateRes
    if (status !== undefined) {
      // Only matched specialist or admin can update status
      if (!isSpecialist && !isAdmin) {
        return NextResponse.json({ error: 'Access Denied: Only specialists can change status' }, { status: 403 })
      }
      
      updateRes = await query(
        `UPDATE public.requests 
         SET status = $1, updated_at = now() 
         WHERE id = $2 
         RETURNING *`,
        [status, id]
      )
    } else if (priceApproved !== undefined) {
      // Only student can approve price
      if (!isOwner) {
        return NextResponse.json({ error: 'Access Denied: Only the student can approve pricing' }, { status: 403 })
      }
      
      updateRes = await query(
        `UPDATE public.requests 
         SET price_approved = $1, updated_at = now() 
         WHERE id = $2 
         RETURNING *`,
        [priceApproved, id]
      )
    } else if (specialistId !== undefined) {
      // Only admin can assign specialists
      if (!isAdmin) {
        return NextResponse.json({ error: 'Access Denied: Only admins can assign specialists' }, { status: 403 })
      }
      
      const newStatus = (reqData.status === 'Submitted' && specialistId !== null) ? 'Matched' : reqData.status
      updateRes = await query(
        `UPDATE public.requests 
         SET specialist_id = $1, 
             status = $2,
             updated_at = now() 
         WHERE id = $3 
         RETURNING *`,
        [specialistId, newStatus, id]
      )
    } else if (extraUploadsApproved !== undefined) {
      // Only specialist or admin can update upload permission
      if (!isSpecialist && !isAdmin) {
        return NextResponse.json({ error: 'Access Denied: Only specialists or admins can approve extra uploads' }, { status: 403 })
      }
      
      updateRes = await query(
        `UPDATE public.requests 
         SET extra_uploads_approved = $1, updated_at = now() 
         WHERE id = $2 
         RETURNING *`,
        [extraUploadsApproved, id]
      )
    } else if (price !== undefined) {
      // Only admin can override price
      if (!isAdmin) {
        return NextResponse.json({ error: 'Access Denied: Only admins can override pricing' }, { status: 403 })
      }
      
      updateRes = await query(
        `UPDATE public.requests 
         SET price = $1, updated_at = now() 
         WHERE id = $2 
         RETURNING *`,
        [price, id]
      )
    } else if (rating !== undefined || marks !== undefined || resultScreenshot !== undefined || feedback !== undefined) {
      // Only student owner can submit feedback/rating/marks
      if (!isOwner) {
        return NextResponse.json({ error: 'Access Denied: Only the request owner can submit feedback' }, { status: 403 })
      }
      
      updateRes = await query(
        `UPDATE public.requests 
         SET rating = $1, 
             marks = $2, 
             result_screenshot = $3, 
             feedback = $4, 
             updated_at = now() 
         WHERE id = $5 
         RETURNING *`,
        [rating !== undefined ? rating : null, marks !== undefined ? marks : null, resultScreenshot !== undefined ? resultScreenshot : null, feedback !== undefined ? feedback : null, id]
      )
    } else {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    return NextResponse.json({ request: updateRes.rows[0] })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

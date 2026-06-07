import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decryptSession } from '@/lib/auth-session'
import { query } from '@/lib/db'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'

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

    // Verify request access first
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

    // Fetch files from DB
    const fileRes = await query('SELECT * FROM public.request_files WHERE request_id = $1', [requestId])

    // Map each file to a local public path download link
    const files = fileRes.rows.map((f) => ({
      ...f,
      download_url: `/uploads/${f.request_id}/${path.basename(f.file_path)}`
    }))

    return NextResponse.json({ files })

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

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const requestId = formData.get('request_id') as string | null
    const isDelivery = formData.get('is_delivery') === 'true'

    if (!file || !requestId) {
      return NextResponse.json({ error: 'File and Request ID are required' }, { status: 400 })
    }

    // Verify request access
    const reqRes = await query('SELECT student_id, specialist_id, extra_uploads_approved FROM public.requests WHERE id = $1', [requestId])
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

    // Enforce student upload limits
    if (payload.role === 'student') {
      const countRes = await query(
        'SELECT COUNT(*) FROM public.request_files WHERE request_id = $1 AND uploader_id = $2',
        [requestId, payload.id]
      )
      const uploadCount = parseInt(countRes.rows[0].count, 10)
      if (uploadCount >= 5 && !reqData.extra_uploads_approved) {
        return NextResponse.json({ 
          error: 'You have reached the upload limit of 5 files for this request. Please request permission from your specialist to upload more.' 
        }, { status: 403 })
      }
    }

    // Save file locally in public/uploads/[request_id]/
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', requestId)
    await mkdir(uploadDir, { recursive: true })

    const safeFileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`
    const filePath = path.join(uploadDir, safeFileName)
    await writeFile(filePath, buffer)

    // Save in public.request_files table
    const relativePath = `/uploads/${requestId}/${safeFileName}`
    const insertRes = await query(
      `INSERT INTO public.request_files 
       (request_id, uploader_id, file_name, file_path, file_size, file_type, is_delivery)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        requestId,
        payload.id,
        file.name,
        relativePath,
        file.size,
        file.type,
        isDelivery
      ]
    )

    // Insert an automated chat message with the file reference
    try {
      const msgText = `[File: ${file.name}|${relativePath}]`
      await query(
        `INSERT INTO public.messages (request_id, sender_id, message_text)
         VALUES ($1, $2, $3)`,
        [requestId, payload.id, msgText]
      )
    } catch (msgErr) {
      console.error('Error inserting automated upload message:', msgErr)
    }

    return NextResponse.json({ file: insertRes.rows[0] })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

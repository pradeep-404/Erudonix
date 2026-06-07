import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decryptSession } from '@/lib/auth-session'
import { query } from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

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

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Verify it is an image
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Uploaded file must be an image.' }, { status: 400 })
    }

    // Limit image sizes (e.g. 5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds maximum limit of 5MB.' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const fileExtension = file.name.split('.').pop() || 'png'
    const newFilename = `${payload.id}-${Date.now()}.${fileExtension}`
    
    // Save path: absolute workspace path public/uploads/profile/
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profile')
    
    // Make sure upload dir exists
    await mkdir(uploadDir, { recursive: true })
    
    const filePath = path.join(uploadDir, newFilename)
    await writeFile(filePath, buffer)

    const dbAvatarUrl = `/uploads/profile/${newFilename}`

    // Update in database
    await query('UPDATE public.profiles SET avatar_url = $1, updated_at = now() WHERE id = $2', [dbAvatarUrl, payload.id])

    return NextResponse.json({ success: true, avatarUrl: dbAvatarUrl })

  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'File upload failed' }, { status: 500 })
  }
}

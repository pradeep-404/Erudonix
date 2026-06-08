import { NextResponse } from 'next/server'
import { getSessionPayload } from '@/lib/auth-session'
import { query } from '@/lib/db'

async function hashPassword(password: string, salt: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(password + salt)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function GET() {
  try {
    const payload = await getSessionPayload()
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin permissions required' }, { status: 403 })
    }

    // Join with users table to fetch user emails
    const usersRes = await query(`
      SELECT p.*, u.email 
      FROM public.profiles p
      JOIN public.users u ON u.id = p.id
      ORDER BY p.role ASC, p.full_name ASC
    `)
    return NextResponse.json({ users: usersRes.rows })

  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const payload = await getSessionPayload()
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { targetUserId, role, isAvailable, email, password } = await request.json()

    if (payload.role === 'admin') {
      const uid = targetUserId || payload.id
      
      // Update email/password credentials
      if (email || password) {
        if (!uid) {
          return NextResponse.json({ error: 'Target user ID is required' }, { status: 400 })
        }
        
        if (email) {
          // Check if email already taken
          const emailCheck = await query('SELECT 1 FROM public.users WHERE email = $1 AND id != $2', [email, uid])
          if (emailCheck.rows.length > 0) {
            return NextResponse.json({ error: 'Email address is already in use.' }, { status: 409 })
          }
          await query('UPDATE public.users SET email = $1 WHERE id = $2', [email, uid])
        }
        
        if (password) {
          const salt = crypto.randomUUID()
          const hash = await hashPassword(password, salt)
          await query('UPDATE public.users SET password_hash = $1 WHERE id = $2', [`${salt}:${hash}`, uid])
        }

        const updatedProfile = await query(`
          SELECT p.*, u.email 
          FROM public.profiles p 
          JOIN public.users u ON u.id = p.id 
          WHERE p.id = $1
        `, [uid])
        return NextResponse.json({ user: updatedProfile.rows[0], success: true })
      }

      // Update role
      if (role) {
        const updateRes = await query(
          `UPDATE public.profiles 
           SET role = $1, updated_at = now() 
           WHERE id = $2 
           RETURNING *`,
          [role, uid]
        )
        return NextResponse.json({ user: updateRes.rows[0] })
      }
      
      // Update availability
      if (isAvailable !== undefined) {
        const updateRes = await query(
          `UPDATE public.specialists 
           SET is_available = $1 
           WHERE id = $2 
           RETURNING *`,
          [isAvailable, uid]
        )
        return NextResponse.json({ specialist: updateRes.rows[0] })
      }
    } else if (payload.role === 'specialist') {
      // Specialists can toggle their own queue availability status
      if (isAvailable !== undefined) {
        const updateRes = await query(
          `UPDATE public.specialists 
           SET is_available = $1 
           WHERE id = $2 
           RETURNING *`,
          [isAvailable, payload.id]
        )
        return NextResponse.json({ specialist: updateRes.rows[0] })
      }
    }

    return NextResponse.json({ error: 'Access Denied' }, { status: 403 })

  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const payload = await getSessionPayload()
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin permissions required' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const targetUserId = searchParams.get('id')

    if (!targetUserId) {
      return NextResponse.json({ error: 'Target user ID is required' }, { status: 400 })
    }

    // Prevent admins from deleting themselves
    if (targetUserId === payload.id) {
      return NextResponse.json({ error: 'Cannot delete your own administrative account' }, { status: 400 })
    }

    await query('DELETE FROM public.users WHERE id = $1', [targetUserId])

    return NextResponse.json({ success: true, message: 'User account deleted successfully' })

  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 })
  }
}

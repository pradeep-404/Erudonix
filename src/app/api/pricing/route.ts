import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decryptSession } from '@/lib/auth-session'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const priceRes = await query('SELECT * FROM public.pricing_config WHERE id = 1 LIMIT 1')
    if (priceRes.rows.length === 0) {
      return NextResponse.json({ error: 'Pricing config not found' }, { status: 404 })
    }
    return NextResponse.json({ pricing: priceRes.rows[0] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
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
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin permissions required' }, { status: 403 })
    }

    const {
      base_rate_usd,
      base_rate_eur,
      base_rate_aud,
      academic_support_multiplier,
      slm_multiplier,
      app_studio_multiplier,
      price_per_word_usd,
      price_per_word_eur,
      price_per_word_aud,
      price_per_page_usd,
      price_per_page_eur,
      price_per_page_aud
    } = await request.json()

    const updateRes = await query(
      `UPDATE public.pricing_config 
       SET base_rate_usd = $1, base_rate_eur = $2, base_rate_aud = $3,
           academic_support_multiplier = $4, slm_multiplier = $5, app_studio_multiplier = $6,
           price_per_word_usd = $7, price_per_word_eur = $8, price_per_word_aud = $9,
           price_per_page_usd = $10, price_per_page_eur = $11, price_per_page_aud = $12,
           updated_at = now()
       WHERE id = 1
       RETURNING *`,
      [
        base_rate_usd,
        base_rate_eur,
        base_rate_aud,
        academic_support_multiplier,
        slm_multiplier,
        app_studio_multiplier,
        price_per_word_usd,
        price_per_word_eur,
        price_per_word_aud,
        price_per_page_usd,
        price_per_page_eur,
        price_per_page_aud
      ]
    )

    return NextResponse.json({ pricing: updateRes.rows[0] })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

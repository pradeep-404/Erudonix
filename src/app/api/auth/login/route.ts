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
      return NextResponse.json({ error: 'Gmail does not exist' }, { status: 401 })
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

    const { otpCode } = await request.json().catch(() => ({}))

    // If no OTP provided, trigger the OTP sending process
    if (!otpCode) {
      // Fetch the host to call our own send-otp endpoint (or we can just reuse the DB logic)
      // It's cleaner to just reuse the DB logic for OTP generation
      const otpCodeGenerated = Math.floor(100000 + Math.random() * 900000).toString()
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

      await query(
        `INSERT INTO public.email_verifications (email, code, expires_at) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (email) 
         DO UPDATE SET code = $2, expires_at = $3, created_at = now()`,
        [email, otpCodeGenerated, expiresAt]
      )

      const isSmtpConfigured = !!(process.env.SMTP_USER && process.env.SMTP_PASS)
      
      if (isSmtpConfigured) {
        const nodemailer = require('nodemailer')
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER || '',
            pass: process.env.SMTP_PASS || '',
          },
        })
        const mailOptions = {
          from: `"Erudogix Login Verification" <${process.env.SMTP_USER}>`,
          to: email,
          subject: `${otpCodeGenerated} is your Erudogix Login Verification Code`,
          html: `<div style="font-family: sans-serif; background-color: #0d0e12; color: #f3f4f6; padding: 40px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #1f2937;">
            <div style="text-align: center; margin-bottom: 30px;">
              <span style="font-size: 28px; font-weight: bold; letter-spacing: -0.05em; color: #ffffff;">ERUDOGIX<span style="color: #d97706;">.</span></span>
            </div>
            <div style="background-color: #111827; border: 1px solid #374151; padding: 30px; border-radius: 12px; text-align: center;">
              <h2 style="margin-top: 0; color: #ffffff; font-size: 22px;">Login Verification</h2>
              <p style="color: #9ca3af; font-size: 14px; margin-bottom: 24px;">Please use the following 6-digit verification code to complete your login. This code is valid for 10 minutes.</p>
              <div style="background-color: #030712; border: 1px solid #e5e7eb; border-color: rgba(217, 119, 6, 0.3); color: #f59e0b; font-size: 36px; font-weight: bold; letter-spacing: 6px; padding: 16px; border-radius: 8px; display: inline-block; margin: 10px 0 20px 0; font-family: monospace;">
                ${otpCodeGenerated}
              </div>
            </div>
          </div>`
        }
        transporter.sendMail(mailOptions).catch((e: any) => console.error(e))
      }

      const responsePayload: any = { requiresOtp: true }
      if (!isSmtpConfigured && process.env.NODE_ENV !== 'production') {
        responsePayload.devOtp = otpCodeGenerated
        console.log(`[DEV OTP SERVICE] Login OTP code for ${email} is: ${otpCodeGenerated}`)
      }
      return NextResponse.json(responsePayload)
    }

    // Step 2: Verify OTP
    const verification = await query(
      'SELECT code, expires_at FROM public.email_verifications WHERE email = $1',
      [email]
    )

    if (verification.rows.length === 0 || verification.rows[0].code !== otpCode) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 })
    }

    if (new Date(verification.rows[0].expires_at) < new Date()) {
      return NextResponse.json({ error: 'Verification code expired' }, { status: 400 })
    }

    await query('DELETE FROM public.email_verifications WHERE email = $1', [email])

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

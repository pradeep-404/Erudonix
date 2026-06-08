import { NextResponse } from 'next/server'
import { getClient, query } from '@/lib/db'
import nodemailer from 'nodemailer'

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
})

export async function POST(request: Request) {
  let dbClient
  try {
    dbClient = await getClient()
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address format' }, { status: 400 })
    }

    // Verify if user exists
    const userCheck = await dbClient.query('SELECT id FROM public.users WHERE email = $1', [email])
    if (userCheck.rows.length === 0) {
      return NextResponse.json({ error: 'No account registered with this email address.' }, { status: 404 })
    }

    // Generate a secure 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    // Code expires in 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    // Store in DB
    await dbClient.query(
      `INSERT INTO public.email_verifications (email, code, expires_at) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (email) 
       DO UPDATE SET code = $2, expires_at = $3, created_at = now()`,
      [email, otpCode, expiresAt]
    )

    const isSmtpConfigured = !!(process.env.SMTP_USER && process.env.SMTP_PASS)

    if (isSmtpConfigured) {
      const mailOptions = {
        from: `"Erudogix Password Reset" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `${otpCode} is your Erudogix Password Reset Code`,
        html: `
          <div style="font-family: sans-serif; background-color: #0d0e12; color: #f3f4f6; padding: 40px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #1f2937;">
            <div style="text-align: center; margin-bottom: 30px;">
              <span style="font-size: 28px; font-weight: bold; letter-spacing: -0.05em; color: #ffffff;">ERUDOGIX<span style="color: #d97706;">.</span></span>
            </div>
            <div style="background-color: #111827; border: 1px solid #374151; padding: 30px; border-radius: 12px; text-align: center;">
              <h2 style="margin-top: 0; color: #ffffff; font-size: 22px;">Reset Your Console Password</h2>
              <p style="color: #9ca3af; font-size: 14px; margin-bottom: 24px;">Please use the following 6-digit verification code to reset your account password. This code is valid for 10 minutes.</p>
              <div style="background-color: #030712; border: 1px solid #e5e7eb; border-color: rgba(217, 119, 6, 0.3); color: #f59e0b; font-size: 36px; font-weight: bold; letter-spacing: 6px; padding: 16px; border-radius: 8px; display: inline-block; margin: 10px 0 20px 0; font-family: monospace;">
                ${otpCode}
              </div>
              <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">If you did not request this password reset, please ignore this message.</p>
            </div>
            <div style="text-align: center; margin-top: 30px; color: #4b5563; font-size: 12px;">
              &copy; ${new Date().getFullYear()} Erudogix App. All rights reserved.
            </div>
          </div>
        `,
      }

      transporter.sendMail(mailOptions)
        .then(() => console.log(`[Forgot Password OTP Sent] Sent to ${email}`))
        .catch((mailErr) => console.error(`[Forgot Password SMTP failed to ${email}]:`, mailErr))
    } else {
      console.log('\n==================================================')
      console.log(`[DEV OTP SERVICE] Password Reset OTP code for ${email} is:`)
      console.log(`\n       --->  ${otpCode}  <---\n`)
      console.log('To send real emails, configure SMTP_USER & SMTP_PASS in .env')
      console.log('==================================================\n')
    }

    const responsePayload: any = { success: true }
    if (!isSmtpConfigured && process.env.NODE_ENV !== 'production') {
      responsePayload.devOtp = otpCode
    }

    return NextResponse.json(responsePayload)

  } catch (err: any) {
    console.error('Error sending forgot-password OTP:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to request password reset' },
      { status: 500 }
    )
  } finally {
    if (dbClient) {
      dbClient.release()
    }
  }
}

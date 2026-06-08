import { Pool } from 'pg'
import AWS from 'aws-sdk'

const rdsHost = process.env.RDSHOST
const useRDS = process.env.USE_RDS === 'true' || !!process.env.RDSHOST

const poolConfig: any = {}

if (useRDS && rdsHost) {
  AWS.config.update({ region: 'eu-north-1' })
  poolConfig.host = rdsHost
  poolConfig.port = 5432
  poolConfig.database = process.env.DB_NAME || 'postgres'
  poolConfig.user = process.env.DB_USER || 'postgres'
  poolConfig.password = () => {
    const signer = new AWS.RDS.Signer({
      region: 'eu-north-1',
      hostname: rdsHost,
      port: 5432,
      username: poolConfig.user
    })
    return signer.getAuthToken({})
  }
  poolConfig.ssl = { rejectUnauthorized: false }
} else {
  poolConfig.connectionString = process.env.DATABASE_URL || 'postgresql://pradeep_choudhary:123456@localhost:5432/cortex'
}

poolConfig.max = 20
poolConfig.idleTimeoutMillis = 30000
poolConfig.connectionTimeoutMillis = 2000

const pool = new Pool(poolConfig)

async function hashPassword(password: string, salt: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(password + salt)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

let seeded = false

export const seedDefaultUsers = async () => {
  if (seeded) return
  try {
    const checkTutor1 = await pool.query('SELECT 1 FROM public.users WHERE email = $1', ['tutor1@erudogix.com'])
    if (checkTutor1.rows.length === 0) {
      console.log('Clean up old seed users and seed new admin + 4 tutors...')

      // 1. Clean up old student and tutor
      await pool.query(`
        DELETE FROM public.specialists WHERE id IN (SELECT id FROM public.users WHERE email IN ('student@erudogix.com', 'tutor@erudogix.com'))
      `)
      await pool.query(`
        DELETE FROM public.profiles WHERE id IN (SELECT id FROM public.users WHERE email IN ('student@erudogix.com', 'tutor@erudogix.com'))
      `)
      await pool.query(`
        DELETE FROM public.users WHERE email IN ('student@erudogix.com', 'tutor@erudogix.com')
      `)

      const usersToSeed = [
        { email: 'admin@erudogix.com', password: 'adminpass123', name: 'System Admin', role: 'admin' },
        { email: 'tutor1@erudogix.com', password: 'tutorpass1', name: 'Tutor Specialist 1', role: 'specialist' },
        { email: 'tutor2@erudogix.com', password: 'tutorpass2', name: 'Tutor Specialist 2', role: 'specialist' },
        { email: 'tutor3@erudogix.com', password: 'tutorpass3', name: 'Tutor Specialist 3', role: 'specialist' },
        { email: 'tutor4@erudogix.com', password: 'tutorpass4', name: 'Tutor Specialist 4', role: 'specialist' }
      ]

      for (const u of usersToSeed) {
        const userId = crypto.randomUUID()
        const salt = crypto.randomUUID()
        const hash = await hashPassword(u.password, salt)
        const passwordHash = `${salt}:${hash}`

        await pool.query(
          'INSERT INTO public.users (id, email, password_hash) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
          [userId, u.email, passwordHash]
        )

        await pool.query(
          'INSERT INTO public.profiles (id, full_name, role) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
          [userId, u.name, u.role]
        )

        if (u.role === 'specialist') {
          await pool.query(
            `INSERT INTO public.specialists (id, bio, subject_specialties, is_available) 
             VALUES ($1, $2, $3, $4) 
             ON CONFLICT (id) DO NOTHING`,
            [userId, 'Academic Tutor & Specialist', '{Mathematics, Computer Science, Economics, Physics}', true]
          )
        }
      }
      console.log('Seeding completed successfully!')
    }
    seeded = true
  } catch (err) {
    console.error('Error seeding default users:', err)
  }
}

export const query = async (text: string, params?: unknown[]) => {
  await seedDefaultUsers()
  const res = await pool.query(text, params)
  return res
}

export const getClient = () => {
  return pool.connect()
}

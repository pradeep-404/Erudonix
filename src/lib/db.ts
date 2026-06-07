import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL || 'postgresql://pradeep_choudhary:123456@localhost:5432/cortex'

const pool = new Pool({
  connectionString,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

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
    const checkAdmin = await pool.query('SELECT 1 FROM public.users WHERE email = $1', ['admin@erudogix.com'])
    if (checkAdmin.rows.length === 0) {
      console.log('Seeding permanent default users...')
      
      const usersToSeed = [
        { email: 'student@erudogix.com', password: 'studentpass123', name: 'Student Demo', role: 'student' },
        { email: 'tutor@erudogix.com', password: 'tutorpass123', name: 'Tutor Specialist', role: 'specialist' },
        { email: 'admin@erudogix.com', password: 'adminpass123', name: 'System Admin', role: 'admin' }
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
            [userId, 'Lead Developer & AI Specialist', '{Python, Machine Learning, Django, Flask}', true]
          )
        }
      }
      console.log('Permanent default users seeded successfully!')
    }
    seeded = true
  } catch (err) {
    console.error('Error seeding default users:', err)
  }
}

export const query = async (text: string, params?: any[]) => {
  await seedDefaultUsers()
  const res = await pool.query(text, params)
  return res
}

export const getClient = () => {
  return pool.connect()
}

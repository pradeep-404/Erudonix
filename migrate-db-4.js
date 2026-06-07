const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://pradeep_choudhary:123456@localhost:5432/cortex'
});

async function main() {
  await client.connect();
  console.log('Connected to DB for migration 4');

  // Add requirement_type to public.profiles table
  await client.query(`
    ALTER TABLE public.profiles 
    ADD COLUMN IF NOT EXISTS requirement_type VARCHAR DEFAULT 'academic';
  `);
  console.log('requirement_type column successfully added to profiles table!');
  
  await client.end();
}
main().catch(err => console.error(err));

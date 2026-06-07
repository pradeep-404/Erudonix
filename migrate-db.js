const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://pradeep_choudhary:123456@localhost:5432/cortex'
});

async function main() {
  await client.connect();
  console.log('Connected to DB for migration');
  
  // Add column extra_uploads_approved to public.requests if it does not exist
  await client.query(`
    ALTER TABLE public.requests 
    ADD COLUMN IF NOT EXISTS extra_uploads_approved BOOLEAN DEFAULT FALSE NOT NULL;
  `);
  console.log('Column extra_uploads_approved added successfully!');
  
  await client.end();
}
main().catch(err => console.error(err));

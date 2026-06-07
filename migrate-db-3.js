const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://pradeep_choudhary:123456@localhost:5432/cortex'
});

async function main() {
  await client.connect();
  console.log('Connected to DB for migration 3');

  // Add rating, marks, feedback, and result_screenshot columns to requests
  await client.query(`
    ALTER TABLE public.requests 
    ADD COLUMN IF NOT EXISTS rating INT CHECK (rating >= 1 AND rating <= 5),
    ADD COLUMN IF NOT EXISTS marks INT CHECK (marks >= 0 AND marks <= 100),
    ADD COLUMN IF NOT EXISTS result_screenshot TEXT,
    ADD COLUMN IF NOT EXISTS feedback TEXT;
  `);
  console.log('Feedback columns (rating, marks, feedback, result_screenshot) successfully added to requests table!');
  
  await client.end();
}
main().catch(err => console.error(err));

const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://pradeep_choudhary:123456@localhost:5432/cortex'
});

async function main() {
  await client.connect();
  console.log('Connected to DB for constraint migration');

  // Drop old check constraint and add updated check constraint allowing GBP
  try {
    await client.query("ALTER TABLE public.requests DROP CONSTRAINT IF EXISTS requests_currency_check");
  } catch(e) {
    console.log("Could not drop constraint requests_currency_check:", e.message);
  }
  
  await client.query(`
    ALTER TABLE public.requests 
    ADD CONSTRAINT requests_currency_check CHECK (currency IN ('USD', 'EUR', 'AUD', 'GBP'));
  `);
  console.log('Requests check constraint successfully updated to include GBP!');
  
  await client.end();
}
main().catch(err => console.error(err));

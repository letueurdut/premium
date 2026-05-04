require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@libsql/client');
const c = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
c.execute('SELECT id, username, role, auth_id FROM users').then(r => {
  console.log(JSON.stringify(r.rows, null, 2));
}).catch(e => console.error(e.message));
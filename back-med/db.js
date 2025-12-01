const { Pool } = require('pg');

// En la nube usaremos DATABASE_URL. En local, usaremos tus credenciales fijas.
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:root@localhost:5432/medicamentos';

const pool = new Pool({
  connectionString: connectionString,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

module.exports = pool;

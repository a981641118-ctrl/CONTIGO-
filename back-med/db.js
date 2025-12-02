const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:root@localhost:5432/medicamentos';

const pool = new Pool({
  connectionString: connectionString,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

module.exports = pool;
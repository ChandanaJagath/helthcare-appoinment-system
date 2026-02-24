require('dotenv').config();
const { Pool } = require('pg');

const connectionConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('neon.tech') ? { rejectUnauthorized: false } : undefined
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'healthcare_db',
      port: parseInt(process.env.DB_PORT || '5432', 10)
    };

const pool = process.env.DATABASE_URL || process.env.DB_HOST
  ? new Pool(connectionConfig)
  : null;

module.exports = pool;

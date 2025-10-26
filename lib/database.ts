/*import knex from 'knex';
import knexConfig from '../knexfile';

//const env = process.env.NODE_ENV || 'development';
const db = knex(knexConfig);

// Optional: Add MySQL-specific connection error handling
db.on('query-error', (error, obj) => {
  console.error('MySQL Query Error:', error);
});

export default db;
*/

import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || 'localhost',
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || 'Gopi@3008',
  database: process.env.DATABASE_NAME || 'ens_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
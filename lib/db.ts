// db.ts
import knex from 'knex';

let db: any;

// Skip database connection during build time
if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
  console.log('Skipping database connection during build');
  db = {};
} else {
  db = knex({
    client: 'mysql2',
    connection: {
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    },
  });
}

export default db;

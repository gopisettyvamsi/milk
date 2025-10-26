// knexfile.ts

import type { Knex } from "knex";
import * as dotenv from 'dotenv';
dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql2",
    connection: {
	  host: process.env.DATABASE_HOST || '127.0.0.1',
      user: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || '@19C11a0599',
      database: process.env.DATABASE_NAME || 'ens_latest_db',
    },
    migrations: {
      extension: 'ts',
      directory: './migrations'
    },
    seeds: {
      extension: 'ts',
      directory: './seeds'
    }
  }
};

export default config;
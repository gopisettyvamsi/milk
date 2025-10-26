// seeds/01_users.ts
import { Knex } from 'knex';
import bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  // Clear existing entries
  await knex('users').del();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Insert seed entries
  await knex('users').insert([
    {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'admin',
      is_active: true
    },
    {
      email: 'user@example.com',
      name: 'Regular User',
      password: hashedPassword,
      role: 'user',
      is_active: true
    }
  ]);
}
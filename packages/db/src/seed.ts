import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

import { db } from './client.js';
import { usersTable } from './schema/index.js';

const ADMIN_EMAIL = 'gjorgikrenkov@icloud.com';
const ADMIN_NAME = 'Gjorgi Krenkov';
const TEMP_PASSWORD = 'ChangeMe123!';

const createAdmin = async (): Promise<void> => {
  const passwordHash = await bcrypt.hash(TEMP_PASSWORD, 12);
  await db.insert(usersTable).values({
    email: ADMIN_EMAIL,
    name: ADMIN_NAME,
    role: 'admin',
    passwordHash,
  });
  console.warn(`✓ Admin user created:`);
  console.warn(`  Email:    ${ADMIN_EMAIL}`);
  console.warn(`  Password: ${TEMP_PASSWORD}`);
  console.warn(`  ⚠️  Change this password immediately after first login!`);
};

const seed = async (): Promise<void> => {
  console.warn('🌱 Seeding database...');
  const [existing] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.email, ADMIN_EMAIL));

  if (existing) {
    console.warn(`✓ Admin user already exists (${ADMIN_EMAIL})`);
    process.exit(0);
  }

  await createAdmin();
  process.exit(0);
};

seed().catch((err: unknown) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

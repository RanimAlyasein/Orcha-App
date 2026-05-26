const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Check all tables case-insensitively
  const tables = await prisma.$queryRawUnsafe(`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`);
  console.log('Tables:', tables.map(t => t.tablename));

  // Try to count users directly
  try {
    const count = await prisma.$queryRawUnsafe(`SELECT COUNT(*) FROM "User"`);
    console.log('User count:', count);
  } catch(e) {
    console.log('Error querying User:', e.message);
  }

  try {
    const count = await prisma.$queryRawUnsafe(`SELECT COUNT(*) FROM "user"`);
    console.log('user count:', count);
  } catch(e) {
    console.log('Error querying user:', e.message);
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

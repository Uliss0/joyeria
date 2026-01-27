const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    const c = await prisma.category.findUnique({ where: { id: 'cmkwxbr2y0000p9s00aftaffb' } });
    console.log(c);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();

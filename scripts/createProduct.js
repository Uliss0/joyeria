const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    const product = await prisma.product.create({
      data: {
        name: 'Anillo Crim',
        slug: `anillo-crim-${Date.now().toString().slice(-5)}`,
        description: 'Anillo de oro con gema roja',
        shortDescription: 'Anillo de oro con gema roja',
        sku: `SKU-${Date.now().toString().slice(-6)}`,
        price: '20000',
        stock: 3,
        category: { connect: { id: 'cmkwxbr2y0000p9s00aftaffb' } },
        material: 'Oro',
        images: { create: [{ url: 'https://example.com/sample.jpg', alt: 'Anillo Crim', isMain: true }] },
      },
      include: { images: true },
    });

    console.log('Created product:', product);
  } catch (e) {
    console.error('Error creating product:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();

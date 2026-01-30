import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get('search') || undefined;
    const featured = url.searchParams.get('featured');
    const limit = parseInt(url.searchParams.get('limit') || '0', 10) || undefined;
    const category = url.searchParams.get('category') || undefined;
    const sort = url.searchParams.get('sort') || undefined; // e.g., "price-asc", "price-desc", "newest"

    const where: any = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (featured === 'true') where.isFeatured = true;
    if (category) where.category = { slug: category };

    const orderBy: any = [];
    if (sort === 'price-asc') orderBy.push({ price: 'asc' });
    else if (sort === 'price-desc') orderBy.push({ price: 'desc' });
    else if (sort === 'newest') orderBy.push({ createdAt: 'desc' });
    else orderBy.push({ isFeatured: 'desc' }, { createdAt: 'desc' });

    const products = await prisma.product.findMany({
      where,
      take: limit,
      orderBy,
      include: { images: true, variants: true, tags: true, category: true },
    });

    const mapped = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : Number(p.price),
      description: p.description || '',
      shortDescription: p.shortDescription || '',
      sku: p.sku,
      material: p.material || '',
      careInstructions: p.careInstructions || '',
      stock: p.stock,
      isFeatured: p.isFeatured,
      isNew: false,
      images: (p.images || []).map((img) => ({ id: img.id, url: img.url, alt: img.alt || '', isMain: img.isMain })),
      variants: (p.variants || []).map((v) => ({ id: v.id, name: v.name, value: v.value, stock: v.stock || 0 })),
      tags: (p.tags || []).map((t) => ({ name: t.name, color: t.color || '#000' })),
      category: p.category ? { name: p.category.name, slug: p.category.slug } : { name: 'Colección', slug: 'coleccion' },
      rating: { average: 0, count: 0 },
      createdAt: p.createdAt?.toISOString(),
    }));

    return NextResponse.json({ products: mapped });
  } catch (err) {
    console.error('GET /api/products error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
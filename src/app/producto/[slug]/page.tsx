import { cache } from "react";
import ProductPage from "@/features/product/ProductPage";
import { Breadcrumbs } from "@/shared/components/Breadcrumbs";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Product, ProductImage as Image, ProductVariant as Variant, ProductTag as Tag, Category } from "@prisma/client";

type ProductWithDetails = Product & { images: Image[]; variants: Variant[]; tags: Tag[]; category: Category | null };

interface ProductPageProps {
  params: {
    slug: string;
  };
}

// Usamos React.cache para deduplicar las peticiones a la base de datos.
// generateMetadata y Page usarán la misma consulta cacheada.
const getProductBySlug = cache(async (slug: string) => {
  const productDb = await prisma.product.findUnique({
    where: { slug },
    include: { images: true, variants: true, tags: true, category: true },
  });

  if (!productDb) {
    notFound();
  }

  return productDb;
});

async function mapProductFromDb(p: ProductWithDetails | null) {
  if (!p) return null;

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : Number(p.price),
    description: p.description || "",
    shortDescription: p.shortDescription || "",
    sku: p.sku,
    material: p.material || "",
    careInstructions: p.careInstructions || "",
    stock: p.stock || 0,
    isFeatured: p.isFeatured,
    isNew: false,
    images: (p.images || []).map((img) => ({ id: img.id, url: img.url, alt: img.alt || "", isMain: img.isMain })),
    variants: (p.variants || []).map((v) => ({ id: v.id, name: v.name, value: v.value, stock: v.stock || 0 })),
    tags: (p.tags || []).map((t) => ({ name: t.name, color: t.color || "#000" })),
    category: p.category ? { name: p.category.name, slug: p.category.slug } : { name: "Colección", slug: "coleccion" },
    rating: { average: 0, count: 0 },
  };
}

export async function generateMetadata({ params }: ProductPageProps) {
const { slug } = await Promise.resolve(params);

  const productDb = await getProductBySlug(slug);
  const product = (await mapProductFromDb(productDb))!;

  const price = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(product.price);

  return {
    title: `${product.name} | MOKSHA - Joyería Premium`,
    description: `${product.description} Precio: ${price}. Joyería premium de alta calidad.`,
    keywords: [product.name, "joyería premium", "joyas artesanales", "oro 18k", "plata 925", "joyería argentina", "joyas contemporáneas"],
    openGraph: {
      title: `${product.name} - ${price}`,
      description: product.shortDescription,
      images: product.images.map((img: any) => ({ url: img.url, width: 800, height: 800, alt: img.alt })),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | MOKSHA`,
      description: product.description,
      images: [product.images.find(img => img.isMain)?.url || product.images[0]?.url],
    },
  };
}

export default async function Page({ params }: ProductPageProps) {
  const { slug } = await Promise.resolve(params);
  if (!slug) notFound();

  const productDb = await getProductBySlug(slug);
  const product = (await mapProductFromDb(productDb))!;

  const breadcrumbItems = [
    { name: "Colección", href: "/coleccion" },
    { name: product.name, href: `/producto/${slug}` },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} className="container mx-auto px-4 py-4" />
      <ProductPage product={product} />
    </>
  );
}

// Generate static params from DB
export async function generateStaticParams() {
  const products = await prisma.product.findMany({ select: { slug: true } });
  return products.map((p) => ({ slug: p.slug }));
}
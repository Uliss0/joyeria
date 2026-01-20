import ProductPage from "@/features/product/ProductPage";
import { Breadcrumbs } from "@/shared/components/Breadcrumbs";

// Mock data - in real app, this would be fetched from API
const mockProduct = {
  id: "1",
  name: "Anillo Clásico de Oro 18K",
  slug: "anillo-clasico-oro-18k",
  price: 85000,
  description: "Un anillo clásico que nunca pasa de moda...",
  images: [
    {
      url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop",
      alt: "Anillo clásico de oro",
    },
  ],
};

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps) {
  // In real app, fetch product data here
  const product = mockProduct;

  const price = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(product.price);

  return {
    title: `${product.name} | MOKSHA - Joyería Premium`,
    description: `${product.description} Precio: ${price}. Joyería premium de alta calidad.`,
    keywords: [product.name, 'joyería premium', 'joyas artesanales', 'oro 18k', 'plata 925', 'joyería argentina', 'joyas contemporáneas'],
    openGraph: {
      title: `${product.name} - ${price}`,
      description: product.description,
      images: product.images.map(img => ({
        url: img.url,
        width: 800,
        height: 800,
        alt: img.alt,
      })),
      type: 'product',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | MOKSHA`,
      description: product.description,
      images: [product.images[0]?.url],
    },
  };
}

export default async function Page({ params }: ProductPageProps) {
  const { slug } = await params;

  // In real app, fetch product data here
  const product = mockProduct;

  const breadcrumbItems = [
    { name: 'Colección', href: '/coleccion' },
    { name: product.name, href: `/producto/${slug}` },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} className="container mx-auto px-4 py-4" />
      <ProductPage productSlug={slug} />
    </>
  );
}

// Optional: Generate static params for known products
export async function generateStaticParams() {
  // In real app, return array of product slugs
  return [
    { slug: "anillo-clasico-oro-18k" },
    { slug: "collar-minimalista-plata" },
    { slug: "pulsera-elegante" },
  ];
}
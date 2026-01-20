import ProductPage from "@/features/product/ProductPage";

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

  return {
    title: `${product.name} | MOKSHA - Joyería Premium`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images.map(img => ({
        url: img.url,
        alt: img.alt,
      })),
    },
  };
}

export default function Page({ params }: ProductPageProps) {
  return <ProductPage productSlug={params.slug} />;
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
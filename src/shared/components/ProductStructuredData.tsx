interface ProductStructuredDataProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    description: string;
    images: Array<{
      url: string;
      alt: string;
    }>;
    category?: {
      name: string;
      slug: string;
    };
  };
}

export function ProductStructuredData({ product }: ProductStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map(img => img.url),
    offers: {
      '@type': 'Offer',
      price: product.price.toString(),
      priceCurrency: 'ARS',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'MOKSHA Joyería',
      },
    },
    brand: {
      '@type': 'Brand',
      name: 'MOKSHA',
    },
    category: product.category?.name,
    url: `https://mokshajoyeria.com/producto/${product.slug}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
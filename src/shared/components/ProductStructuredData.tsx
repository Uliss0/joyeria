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
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);

  const images = (product.images || []).map((img) =>
    img.url.startsWith('http')
      ? img.url
      : `https://mokshajoyeria.com${img.url.startsWith('/') ? '' : '/'}${img.url}`
  );

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: images.length > 0 ? images : ['https://mokshajoyeria.com/og-image.jpg'],
    sku: product.id,
    offers: {
      '@type': 'Offer',
      price: product.price.toString(),
      priceCurrency: 'ARS',
      priceValidUntil: nextYear.toISOString().split('T')[0],
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      url: `https://mokshajoyeria.com/producto/${product.slug}`,
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
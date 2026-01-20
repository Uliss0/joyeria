import { Product,WithContext } from 'schema-dts';
import { jsonLdScriptProps } from 'react-schemaorg';
import Head from 'next/head';


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
  const structuredData: WithContext<Product> = {
    '@type': 'Product',
    '@context': 'https://schema.org',
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
    url: `https://moksha-joyeria.com/producto/${product.slug}`,
  };

  return (
    <Head>
      <script
        {...jsonLdScriptProps<Product>(structuredData)}
      />
    </Head>
  );
}
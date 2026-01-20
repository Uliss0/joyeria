import { BreadcrumbList,WithContext } from 'schema-dts';
import { jsonLdScriptProps } from 'react-schemaorg';
import Head from 'next/head';
import Link from 'next/link';

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  // Crear datos estructurados para breadcrumbs
  const structuredData:  WithContext<BreadcrumbList> = {
    '@type': 'BreadcrumbList',
    '@context': 'https://schema.org',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://moksha-joyeria.com${item.href}`,
    })),
  };

  return (
    <>
      <Head>
        <script
          {...jsonLdScriptProps<BreadcrumbList>(structuredData)}
        />
      </Head>

      {/* Breadcrumbs visuales */}
      <nav aria-label="Breadcrumb" className={`flex ${className}`}>
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-gold-600 transition-colors">
              Inicio
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              {index === items.length - 1 ? (
                <span className="text-gray-900 font-medium" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-gold-600 transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
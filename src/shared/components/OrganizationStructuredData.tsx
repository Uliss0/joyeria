import { Organization,WithContext } from 'schema-dts';
import { jsonLdScriptProps } from 'react-schemaorg';
import Head from 'next/head';

export function OrganizationStructuredData() {
  const structuredData: WithContext<Organization> = {
    '@type': 'Organization',
    '@context': 'https://schema.org',
    name: 'MOKSHA Joyería',
    url: 'https://moksha-joyeria.com',
    logo: 'https://moksha-joyeria.com/logo.png',
    description: 'Joyería premium con diseños contemporáneos y elegantes. Anillos, collares, pulseras y joyas artesanales de alta calidad.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'AR',
      addressRegion: 'Buenos Aires', // Cambia según tu ubicación
      addressLocality: 'Bahia Blanca', // Cambia según tu ubicación
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+54-XXX-XXX-XXXX', // Cambia por tu número real
      contactType: 'customer service',
      availableLanguage: 'Spanish',
    },
    sameAs: [
      'https://facebook.com/moksha-joyeria', // Cambia por tus redes reales
      'https://instagram.com/moksha_joyeria',
      'https://twitter.com/moksha_joyeria',
    ],
    foundingDate: '2025', // Cambia por la fecha real
    knowsAbout: [
      'Joyería artesanal',
      'Diseños contemporáneos',
      'Anillos de compromiso',
      'Joyas premium',
      'Oro 18k',
      'Plata 925',
    ],
  };

  return (
    <Head>
      <script
        {...jsonLdScriptProps<Organization>(structuredData)}
      />
    </Head>
  );
}
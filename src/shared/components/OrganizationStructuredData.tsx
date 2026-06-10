export function OrganizationStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MOKSHA Joyería',
    url: 'https://mokshajoyeria.com',
    logo: 'https://mokshajoyeria.com/moksha-logo.png',
    description: 'Joyería premium con diseños contemporáneos y elegantes. Anillos, collares, pulseras y joyas artesanales de alta calidad.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'AR',
      addressRegion: 'Buenos Aires',
      addressLocality: 'Bahia Blanca',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '2915666668',
      contactType: 'customer service',
      availableLanguage: 'Spanish',
    },
    sameAs: [
      'https://facebook.com/moksha-joyeria',
      'https://instagram.com/moksha_joyeria',
      'https://twitter.com/moksha_joyeria',
    ],
    foundingDate: '2025',
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
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
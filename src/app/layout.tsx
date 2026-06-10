import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import Header from '@/shared/components/Header';
import { Footer } from '@/shared/components/Footer';
import { AuthProvider } from '@/lib/auth/provider';
import { OrganizationStructuredData } from '@/shared/components/OrganizationStructuredData';
import { WhatsAppFloatingButton } from '@/shared/components/WhatsAppFloatingButton';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Moksha Joyeria - Tienda Oficial',
    template: '%s | Moksha Joyeria'
  },
  description: 'Descubre joyería premium de MOKSHA. Diseños contemporáneos, elegantes y únicos que destacan cada momento especial. Anillos, collares, pulseras y joyas artesanales de alta calidad.',
  keywords: ['joyería', 'joyas', 'anillos', 'collares', 'pulseras', 'oro', 'plata', 'diamantes', 'joyería premium', 'joyería artesanal', 'MOKSHA'],
  authors: [{ name: 'MOKSHA Joyería' }],
  creator: 'MOKSHA Joyería',
  publisher: 'MOKSHA Joyería',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://mokshajoyeria.com'), // Cambia esto por tu dominio real
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/moksha-logo.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/moksha-logo.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://mokshajoyeria.com',
    title: 'Moksha Joyeria - Tienda Oficial',
    description: 'Descubre joyería premium de MOKSHA. Diseños contemporáneos, elegantes y únicos que destacan cada momento especial.',
    siteName: 'Moksha Joyería',
    images: [
      {
        url: '/moksha-joyeria.png',
        width: 1200,
        height: 630,
        alt: 'Moksha Joyeria - Tienda Oficial',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Moksha Joyeria - Tienda Oficial',
    description: 'Descubre joyería premium de MOKSHA. Diseños contemporáneos, elegantes y únicos.',
    images: ['/moksha-joyeria.png'],
    creator: '@moksha_joyeria', // Cambia por tu cuenta de Twitter
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'tu-codigo-de-verificacion-google', // Agrega tu código de verificación de Google Search Console
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <OrganizationStructuredData />
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppFloatingButton
            phoneNumber={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}
          />
        </AuthProvider>
        <GoogleAnalytics gaId="GA_MEASUREMENT_ID" />
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import Header from '@/shared/components/Header';
import { Footer } from '@/shared/components/Footer';
import { AuthProvider } from '@/lib/auth/provider';
import { OrganizationStructuredData } from '@/shared/components/OrganizationStructuredData';
import { WhatsAppFloatingButton } from '@/shared/components/WhatsAppFloatingButton';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'MOKSHA - Joyería Premium | Diseños Contemporáneos y Elegantes',
    template: '%s | MOKSHA - Joyería Premium'
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
  metadataBase: new URL('https://moksha-joyeria.com'), // Cambia esto por tu dominio real
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://moksha-joyeria.com',
    title: 'MOKSHA - Joyería Premium | Diseños Contemporáneos y Elegantes',
    description: 'Descubre joyería premium de MOKSHA. Diseños contemporáneos, elegantes y únicos que destacan cada momento especial.',
    siteName: 'MOKSHA Joyería',
    images: [
      {
        url: '/og-image.jpg', // Agrega esta imagen a public/
        width: 1200,
        height: 630,
        alt: 'MOKSHA - Joyería Premium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MOKSHA - Joyería Premium | Diseños Contemporáneos y Elegantes',
    description: 'Descubre joyería premium de MOKSHA. Diseños contemporáneos, elegantes y únicos.',
    images: ['/og-image.jpg'],
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
      <OrganizationStructuredData />
      <body className={inter.className}>
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

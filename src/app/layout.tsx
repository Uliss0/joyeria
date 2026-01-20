import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/shared/components/Header';
import { Footer } from '@/shared/components/Footer';
import { AuthProvider } from '@/lib/auth/provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MOKSHA - Joyería',
  description: 'Diseños contemporáneos, elegantes y pensados para destacar cada momento.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
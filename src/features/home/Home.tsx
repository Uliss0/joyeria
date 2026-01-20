"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Shield, Truck, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCarousel } from "@/shared/components/ProductCarousel";
import dynamic from "next/dynamic";

const InstagramFeedSection = dynamic(() => import("./components/InstagramFeedSection").then((mod) => mod.InstagramFeedSection), { ssr: false });

// Definición de la interfaz Product (copiada de ProductGrid para asegurar compatibilidad)
interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  images: Array<{
    url: string;
    alt: string;
    isMain: boolean;
  }>;
  category: {
    name: string;
    slug: string;
  };
  isFeatured?: boolean;
  isNew?: boolean;
  tags?: Array<{
    name: string;
    color?: string;
  }>;
  createdAt?: string; // Add createdAt property
}

// Mock data - replace with API call
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Anillo Clásico de Oro",
    slug: "anillo-clasico-oro",
    price: 85000,
    compareAtPrice: 95000,
    images: [
      {
        url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
        alt: "Anillo clásico de oro",
        isMain: true,
      },
    ],
    category: {
      name: "Anillos",
      slug: "anillos",
    },
    isFeatured: true,
    isNew: true,
    tags: [{ name: "Oro", color: "#FFD700" }],
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Collar Minimalista de Plata",
    slug: "collar-minimalista-plata",
    price: 45000,
    images: [
      {
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop",
        alt: "Collar minimalista de plata",
        isMain: true,
      },
    ],
    category: {
      name: "Collares",
      slug: "collares",
    },
    isFeatured: false,
    isNew: true,
    tags: [{ name: "Plata", color: "#C0C0C0" }],
    createdAt: "2025-01-20T11:00:00Z",
  },
  {
    id: "3",
    name: "Pulsera Elegante",
    slug: "pulsera-elegante",
    price: 65000,
    compareAtPrice: 75000,
    images: [
      {
        url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
        alt: "Pulsera elegante",
        isMain: true,
      },
    ],
    category: {
      name: "Pulseras",
      slug: "pulseras",
    },
    isFeatured: true,
    isNew: false,
    tags: [{ name: "Oro", color: "#FFD700" }],
    createdAt: "2025-01-10T09:00:00Z",
  },
  {
    id: "4",
    name: "Aros Geométricos",
    slug: "aros-geometricos",
    price: 35000,
    images: [
      {
        url: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=400&h=400&fit=crop",
        alt: "Aros geométricos",
        isMain: true,
      },
    ],
    category: {
      name: "Aros",
      slug: "aros",
    },
    isFeatured: false,
    isNew: false,
    tags: [{ name: "Plata", color: "#C0C0C0" }],
    createdAt: "2025-01-18T14:30:00Z",
  },
  {
    id: "5",
    name: "Pendientes de Diamante",
    slug: "pendientes-diamante",
    price: 180000,
    images: [
      {
        url: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&h=400&fit=crop",
        alt: "Pendientes de diamante",
        isMain: true,
      },
    ],
    category: {
      name: "Pendientes",
      slug: "pendientes",
    },
    isFeatured: true,
    isNew: true,
    tags: [{ name: "Diamante", color: "#B9F2FF" }],
    createdAt: "2025-01-22T16:00:00Z",
  },
  {
    id: "6",
    name: "Anillo de Compromiso",
    slug: "anillo-compromiso",
    price: 250000,
    images: [
      {
        url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
        alt: "Anillo de compromiso",
        isMain: true,
      },
    ],
    category: {
      name: "Anillos",
      slug: "anillos",
    },
    isFeatured: true,
    isNew: false,
    tags: [{ name: "Oro", color: "#FFD700" }, { name: "Diamante", color: "#B9F2FF" }],
    createdAt: "2025-01-05T12:00:00Z",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-80" // Ajusta la opacidad si es necesario
        >
          <source src="/videos/Video_Promocional_Joyería_Elegante.mp4" type="video/mp4" />
          Tu navegador no soporta la etiqueta de video.
        </video>

        <div className="absolute inset-0 bg-black/30 z-10"></div> {/* Overlay para oscurecer el video y mejorar legibilidad */}

        <div className="container relative z-20 mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light leading-tight mb-6 drop-shadow-lg">
              MOKSHA
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto font-sans drop-shadow-md">
              Donde cada joya cuenta una historia.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/coleccion">
                <Button size="lg" className="btn-gold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  Explorar Colección
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/novedades">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-gray-900 transition-colors duration-300"
                >
                  Ver Novedades
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Product Carousel Section - Popular Products */}
      <ProductCarousel
        title="Nuestras Piezas Más Populares"
        subtitle="Descubre la selección que nuestros clientes más aman."
        products={mockProducts}
        className="py-16"
      />

      {/* Value Proposition Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-light text-gray-900 mb-6 leading-snug">
              Diseño Exquisito. Artesanía Inigualable.
            </h2>
            <p className="text-lg md:text-xl text-gray-700 font-sans leading-relaxed">
              Cada pieza de MOKSHA es una obra de arte, meticulosamente diseñada
              y elaborada para capturar la esencia de la elegancia y la belleza atemporal.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-gold-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-gold-600" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2">Pagos Seguros</h3>
              <p className="text-gray-700 text-sm font-sans">
                Transacciones protegidas con encriptación de nivel bancario.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mb-4">
                <Truck className="w-8 h-8 text-gold-600" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2">Envíos Rápidos</h3>
              <p className="text-gray-700 text-sm font-sans">
                Entrega eficiente y seguimiento detallado hasta tu puerta.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col items-center p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mb-4">
                <Headphones className="w-8 h-8 text-gold-600" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2">Soporte Premium</h3>
              <p className="text-gray-700 text-sm font-sans">
                Atención al cliente dedicada para una experiencia sin igual.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Instagram Feed Section - Novedades */}
      <InstagramFeedSection className="py-16 bg-gray-50" />

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-light text-gray-900 mb-6 leading-snug">
              Nuestros Clientes lo Confirman
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center p-8 bg-gold-50 rounded-lg shadow-lg"
          >
            <blockquote className="text-xl md:text-2xl text-gray-800 italic mb-6 leading-relaxed font-serif">
              “Desde la búsqueda hasta la entrega, cada paso fue una experiencia de lujo.
              La joya superó mis expectativas. Absolutamente recomendable.”
            </blockquote>
            <cite className="block text-gold-700 font-sans text-lg font-semibold">
              — Ana M., Compradora Verificada
            </cite>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
        {/* Decorative overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-800 to-gray-950 opacity-90"></div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-light mb-8 leading-snug">
              Descubre tu Próxima Joya Atemporal
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 font-sans leading-relaxed">
              Explora nuestra colección exclusiva y encuentra esa pieza
              única que te acompañará en cada momento especial.
            </p>
            <Link href="/coleccion">
              <Button
                size="lg"
                className="btn-gold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Ver Colección Completa
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

import Collection from "@/features/collection/Collection";
import { Breadcrumbs } from "@/shared/components/Breadcrumbs";

export const metadata = {
  title: "Colección Completa | MOKSHA - Joyería Premium",
  description: "Explora nuestra colección completa de joyería premium MOKSHA. Anillos, collares, pulseras, aretes y joyas únicas. Diseños contemporáneos de alta calidad con materiales premium.",
  keywords: ['colección joyería', 'anillos premium', 'collares elegantes', 'pulseras modernas', 'joyas artesanales', 'joyería contemporánea', 'oro 18k', 'plata 925'],
  openGraph: {
    title: 'Colección Completa de Joyería MOKSHA',
    description: 'Descubre todas nuestras piezas de joyería premium. Diseños únicos y contemporáneos.',
    images: [
      {
        url: '/coleccion-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Colección completa de joyería MOKSHA',
      },
    ],
  },
};

export default function CollectionPage() {
  const breadcrumbItems = [
    { name: 'Colección', href: '/coleccion' },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} className="container mx-auto px-4 py-4" />
      <Collection />
    </>
  );
}
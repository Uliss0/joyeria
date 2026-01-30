import Home from "@/features/home/Home";

export const metadata = {
  title: 'Inicio',
  description: 'Bienvenido a MOKSHA, tu destino premium para joyería contemporánea. Descubre colecciones exclusivas de anillos, collares y pulseras artesanales de alta calidad.',
  keywords: ['joyería premium', 'joyas contemporáneas', 'anillos artesanales', 'collares elegantes', 'pulseras modernas', 'joyería argentina'],
  openGraph: {
    title: 'MOKSHA - Joyería Premium Contemporánea',
    description: 'Descubre joyería premium de MOKSHA. Diseños contemporáneos y elegantes para momentos especiales.',
    images: [
      {
        url: '/home-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Colección de joyería MOKSHA',
      },
    ],
  },
};

export default function Page() {
  return <Home />;
}
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet"></link>
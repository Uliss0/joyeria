import ProductPage from "@/features/product/ProductPage";
import { Breadcrumbs } from "@/shared/components/Breadcrumbs";

// Mock data - in real app, this would be fetched from API
const allMockProducts = [
  {
    id: "1",
    name: "Anillo Clásico de Oro 18K",
    slug: "anillo-clasico-oro-18k",
    price: 85000,
    compareAtPrice: 95000,
    description: "Un anillo clásico que nunca pasa de moda. Este diseño atemporal combina la elegancia del oro 18K con un estilo versátil que se adapta a cualquier ocasión.",
    shortDescription: "Diseño atemporal en oro 18K, perfecto para cualquier ocasión especial.",
    sku: "ANILLO-ORO-CLASICO-001",
    material: "Oro 18K amarillo, certificado con sello de autenticidad",
    careInstructions: "Limpie con un paño suave y jabón neutro. Evite el contacto con productos químicos agresivos. Guarde en estuche individual.",
    stock: 12,
    isFeatured: true,
    isNew: false,
    images: [
      {
        id: "1",
        url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop",
        alt: "Anillo clásico de oro visto desde arriba",
        isMain: true,
      },
      {
        id: "2",
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop",
        alt: "Anillo clásico de oro visto de lado",
      },
      {
        id: "3",
        url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop",
        alt: "Anillo clásico de oro con luz",
      },
      {
        id: "4",
        url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop",
        alt: "Detalle del sello de autenticidad",
      },
    ],
    variants: [
      { id: "1", name: "Talle", value: "15", stock: 3 },
      { id: "2", name: "Talle", value: "16", stock: 4 },
      { id: "3", name: "Talle", value: "17", stock: 3 },
      { id: "4", name: "Talle", value: "18", stock: 2 },
    ],
    tags: [
      { name: "Oro 18K", color: "#FFD700" },
      { name: "Clásico", color: "#8B4513" },
      { name: "Unisex", color: "#708090" },
    ],
    category: { name: "Anillos", slug: "anillos" },
    rating: { average: 4.8, count: 24 },
  },
  {
    id: "2",
    name: "Anillo Moderno de Plata",
    slug: "anillo-moderno-plata",
    price: 45000,
    compareAtPrice: 50000,
    description: "Anillo moderno de plata esterlina con diseño contemporáneo elegante.",
    shortDescription: "Diseño moderno en plata esterlina",
    sku: "ANILLO-PLATA-MODERNO-002",
    material: "Plata 925",
    careInstructions: "Limpie con paño suave",
    stock: 8,
    isFeatured: true,
    isNew: true,
    images: [
      {
        id: "1",
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop",
        alt: "Anillo moderno de plata visto desde arriba",
        isMain: true,
      },
      {
        id: "2",
        url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop",
        alt: "Anillo moderno de plata visto de lado",
      },
      {
        id: "3",
        url: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&h=800&fit=crop",
        alt: "Anillo moderno de plata con luz",
      },
    ],
    variants: [
      { id: "1", name: "Talle", value: "15", stock: 2 },
      { id: "2", name: "Talle", value: "16", stock: 3 },
      { id: "3", name: "Talle", value: "17", stock: 2 },
      { id: "4", name: "Talle", value: "18", stock: 1 },
    ],
    tags: [{ name: "Plata 925", color: "#C0C0C0" }],
    category: { name: "Anillos", slug: "anillos" },
    rating: { average: 4.6, count: 18 },
  },
  {
    id: "3",
    name: "Pulsera Elegante",
    slug: "pulsera-elegante",
    price: 65000,
    compareAtPrice: 75000,
    description: "Pulsera elegante con diseño sofisticado en oro 18K. Perfecta para cualquier ocasión especial.",
    shortDescription: "Pulsera elegante y sofisticada",
    sku: "PULSERA-ELEGANTE-003",
    material: "Oro 18K",
    careInstructions: "Limpie con paño suave",
    stock: 5,
    isFeatured: true,
    isNew: false,
    images: [
      {
        id: "1",
        url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop",
        alt: "Pulsera elegante visto desde arriba",
        isMain: true,
      },
      {
        id: "2",
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop",
        alt: "Pulsera elegante visto de lado",
      },
      {
        id: "3",
        url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop",
        alt: "Pulsera elegante con luz",
      },
    ],
    variants: [{ id: "1", name: "Tamaño", value: "Único", stock: 5 }],
    tags: [{ name: "Oro 18K", color: "#FFD700" }],
    category: { name: "Pulseras", slug: "pulseras" },
    rating: { average: 4.9, count: 32 },
  },
  {
    id: "4",
    name: "Collar Minimalista",
    slug: "collar-minimalista",
    price: 55000,
    description: "Collar minimalista de diseño elegante en plata 925. Simplicidad y sofisticación en una sola pieza.",
    shortDescription: "Collar minimalista elegante",
    sku: "COLLAR-MINIMALISTA-004",
    material: "Plata 925",
    careInstructions: "Limpie con paño suave",
    stock: 10,
    isFeatured: false,
    isNew: false,
    images: [
      {
        id: "1",
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop",
        alt: "Collar minimalista visto desde arriba",
        isMain: true,
      },
      {
        id: "2",
        url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop",
        alt: "Collar minimalista visto de lado",
      },
      {
        id: "3",
        url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop",
        alt: "Collar minimalista con luz",
      },
    ],
    variants: [{ id: "1", name: "Largo", value: "45cm", stock: 10 }],
    tags: [{ name: "Minimalista", color: "#708090" }],
    category: { name: "Collares", slug: "collares" },
    rating: { average: 4.7, count: 15 },
  },
  {
    id: "5",
    name: "Aros Geométricos",
    slug: "aros-geometricos",
    price: 35000,
    description: "Aros con diseño geométrico moderno. Un toque contemporáneo para tu estilo.",
    shortDescription: "Aros de diseño geométrico",
    sku: "AROS-GEOMETRICOS-005",
    material: "Oro 18K",
    careInstructions: "Limpie con paño suave",
    stock: 14,
    isFeatured: false,
    isNew: true,
    images: [
      {
        id: "1",
        url: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&h=800&fit=crop",
        alt: "Aros geométricos visto desde arriba",
        isMain: true,
      },
      {
        id: "2",
        url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop",
        alt: "Aros geométricos visto de lado",
      },
      {
        id: "3",
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop",
        alt: "Aros geométricos con luz",
      },
    ],
    variants: [{ id: "1", name: "Tamaño", value: "Único", stock: 14 }],
    tags: [{ name: "Geométrico", color: "#FFD700" }],
    category: { name: "Aros", slug: "aros" },
    rating: { average: 4.5, count: 9 },
  },
  {
    id: "6",
    name: "Pendientes de Diamante",
    slug: "pendientes-diamante",
    price: 180000,
    description: "Pendientes elegantes con diamantes certificados. Brillo y elegancia para ocasiones especiales.",
    shortDescription: "Pendientes de diamante certificados",
    sku: "PENDIENTES-DIAMANTE-006",
    material: "Oro 18K con diamantes",
    careInstructions: "Limpie con paño suave especializado",
    stock: 3,
    isFeatured: true,
    isNew: true,
    images: [
      {
        id: "1",
        url: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&h=800&fit=crop",
        alt: "Pendientes de diamante visto desde arriba",
        isMain: true,
      },
      {
        id: "2",
        url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop",
        alt: "Pendientes de diamante visto de lado",
      },
    ],
    variants: [{ id: "1", name: "Tamaño", value: "Único", stock: 3 }],
    tags: [{ name: "Diamante", color: "#B9F2FF" }],
    category: { name: "Pendientes", slug: "pendientes" },
    rating: { average: 4.9, count: 18 },
  },
  {
    id: "7",
    name: "Anillo de Compromiso",
    slug: "anillo-compromiso",
    price: 250000,
    description: "Anillo de compromiso de diseño clásico con diamante de alta calidad. El símbolo perfecto de tu amor.",
    shortDescription: "Anillo de compromiso con diamante",
    sku: "ANILLO-COMPROMISO-007",
    material: "Oro 18K con diamante",
    careInstructions: "Limpie con paño suave especializado",
    stock: 2,
    isFeatured: true,
    isNew: false,
    images: [
      {
        id: "1",
        url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop",
        alt: "Anillo de compromiso visto desde arriba",
        isMain: true,
      },
      {
        id: "2",
        url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop",
        alt: "Anillo de compromiso visto de lado",
      },
    ],
    variants: [
      { id: "1", name: "Talle", value: "15", stock: 1 },
      { id: "2", name: "Talle", value: "16", stock: 1 },
    ],
    tags: [{ name: "Oro", color: "#FFD700" }, { name: "Diamante", color: "#B9F2FF" }],
    category: { name: "Anillos", slug: "anillos" },
    rating: { average: 5.0, count: 8 },
  },
];

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  // Find product by slug
  const product = allMockProducts.find(p => p.slug === slug) || allMockProducts[0];

  const price = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(product.price);

  return {
    title: `${product.name} | MOKSHA - Joyería Premium`,
    description: `${product.description} Precio: ${price}. Joyería premium de alta calidad.`,
    keywords: [product.name, 'joyería premium', 'joyas artesanales', 'oro 18k', 'plata 925', 'joyería argentina', 'joyas contemporáneas'],
    openGraph: {
      title: `${product.name} - ${price}`,
      description: product.description,
      images: product.images.map(img => ({
        url: img.url,
        width: 800,
        height: 800,
        alt: img.alt,
      })),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | MOKSHA`,
      description: product.description,
      images: [product.images[0]?.url],
    },
  };
}

export default async function Page({ params }: ProductPageProps) {
  const { slug } = await params;

  // Find product by slug
  const product = allMockProducts.find(p => p.slug === slug) || allMockProducts[0];

  const breadcrumbItems = [
    { name: 'Colección', href: '/coleccion' },
    { name: product.name, href: `/producto/${slug}` },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} className="container mx-auto px-4 py-4" />
      <ProductPage product={product} />
    </>
  );
}

// Optional: Generate static params for known products
export async function generateStaticParams() {
  // In real app, return array of product slugs
  return [
    { slug: "anillo-clasico-oro-18k" },
    { slug: "anillo-moderno-plata" },
    { slug: "pulsera-elegante" },
    { slug: "collar-minimalista" },
    { slug: "aros-geometricos" },
    { slug: "pendientes-diamante" },
    { slug: "anillo-compromiso" },
  ];
}
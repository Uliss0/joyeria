/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Optimizar imágenes para SEO
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Optimizaciones de performance
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  // Compresión y optimización
  compress: true,
  poweredByHeader: false, // Remover header X-Powered-By
  // Configuración de headers de seguridad
  /*async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },*/// Configuración de headers de seguridad mejorada
  async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()',
        },
        {
            key: 'Content-Security-Policy',
  value: `
    default-src 'self';

    script-src 
      'self' 
      'unsafe-inline' 
      'unsafe-eval'
      https://www.googletagmanager.com
      https://www.google-analytics.com
      https://sdk.mercadopago.com
      https://www.instagram.com;

    style-src 
      'self' 
      'unsafe-inline'
      https://fonts.googleapis.com;

    img-src 
      'self' 
      data: 
      https://res.cloudinary.com
      https://www.google-analytics.com
      https://*.cdninstagram.com
      https://*.googleusercontent.com
      https://*.fbcdn.net;


      connect-src 
      'self'
      ws://127.0.0.1:*
      ws://localhost:*
      wss:
      https://api.mercadopago.com
      https://www.google-analytics.com
      https://*.googleapis.com
      https://www.instagram.com;

    frame-src 
      https://www.mercadopago.com
      https://accounts.google.com
      https://www.instagram.com;

    media-src
      'self'
      https://*.cdninstagram.com;
      
      

    object-src 'none';
    base-uri 'self';
    form-action 'self' https://www.mercadopago.com;
  `.replace(/\n/g, ''),
        },
      ],
    },
  ];
}
};

export default nextConfig;
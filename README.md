# MOKSHA - Tienda Online de Joyería Premium

Una tienda online de joyería premium construida con Next.js 16, React 19, TypeScript y Tailwind CSS. Diseñada para ofrecer una experiencia de usuario excepcional con un enfoque en la estética minimalista, animaciones sutiles y performance impecable.

## Características

- **UX/UI Premium**: Diseño minimalista con paleta sobria, tipografías elegantes y microinteracciones suaves.
- **Responsive**: Optimizado para dispositivos móviles, tabletas y escritorio.
- **Performance**: Server-Side Rendering (SSR) y Static Site Generation (SSG) para carga rápida.
- **Accesibilidad**: Cumple con estándares WCAG.
- **SEO**: Optimizado para motores de búsqueda.
- **Autenticación**: Registro/login tradicional y social (Google, Facebook).
- **Carrito Persistente**: Gestión avanzada de carrito de compras.
- **Pago Seguro**: Integración con Mercado Pago y opción de transferencia bancaria.
- **Panel Administrativo**: Gestión completa de productos, categorías, pedidos y usuarios.

## Tecnologías

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma, PostgreSQL
- **Autenticación**: NextAuth.js
- **Testing**: Vitest, Testing Library
- **Linting/Formatting**: ESLint, Prettier
- **Animaciones**: Framer Motion
- **Estado**: Zustand

## Instalación

1. Clona el repositorio
2. Instala dependencias: `npm install`
3. Configura variables de entorno (ver `.env.example`)
4. Ejecuta migraciones de base de datos: `npx prisma migrate dev`
5. Inicia el servidor de desarrollo: `npm run dev`

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run start`: Inicia el servidor de producción
- `npm run lint`: Ejecuta ESLint
- `npm run typecheck`: Ejecuta verificación de tipos TypeScript
- `npm run format`: Formatea el código con Prettier
- `npm test`: Ejecuta pruebas
- `npm run test:coverage`: Ejecuta pruebas con reporte de cobertura

## Arquitectura

El proyecto sigue los principios de Screaming Architecture y Scope Rule:

- `src/features/`: Funcionalidades específicas agrupadas por dominio
- `src/shared/`: Componentes, hooks y utilidades compartidas
- `src/infrastructure/`: Capas de infraestructura (API, autenticación, etc.)

## Contribución

1. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
2. Realiza tus cambios
3. Ejecuta tests y linting: `npm run lint && npm test`
4. Crea un commit descriptivo
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia ISC.
## Variables para Feed de Instagram

Para habilitar el feed de Instagram cacheado en servidor:

- `INSTAGRAM_USER_ID`: ID de la cuenta Business/Creator en Meta Graph API
- `INSTAGRAM_ACCESS_TOKEN`: token de larga duracion para Graph API
- `INSTAGRAM_API_VERSION` (opcional): default `v22.0`
- `INSTAGRAM_FEED_LIMIT` (opcional): default `4`
- `INSTAGRAM_CACHE_TTL_SECONDS` (opcional): default `3600`

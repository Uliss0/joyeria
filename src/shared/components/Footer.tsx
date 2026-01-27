import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const footerLinks = {
  coleccion: [
    { name: "Anillos", href: "/coleccion/anillos" },
    { name: "Collares", href: "/coleccion/collares" },
    { name: "Pulseras", href: "/coleccion/pulseras" },
    { name: "Aros", href: "/coleccion/aros" },
  ],
  servicio: [
    { name: "Dónde Encontrarnos", href: "/contacto" },
    { name: "Contacto", href: "/contacto" },
    { name: "Envíos", href: "/envios" },
    { name: "Devoluciones", href: "/devoluciones" },
  ],
  empresa: [
    { name: "Sobre Nosotros", href: "/nosotros" },
    { name: "Sostenibilidad", href: "/sostenibilidad" },
    { name: "Blog", href: "/blog" },
    { name: "Trabaja con Nosotros", href: "/trabajo" },
  ],
};

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn("bg-gray-900 text-white", className)}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">MOKSHA</h3>
            <p className="text-gray-300">
              Joyas que hablan de vos. Diseños contemporáneos, elegantes y pensados
              para destacar cada momento.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                href="@moksha.joyeriaa"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Colección */}
          <div>
            <h4 className="font-semibold mb-4">Colección</h4>
            <ul className="space-y-2">
              {footerLinks.coleccion.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Servicio al Cliente */}
          <div>
            <h4 className="font-semibold mb-4">Servicio al Cliente</h4>
            <ul className="space-y-2">
              {footerLinks.servicio.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  Teniente Farias 1509, Bahia Blanca, Buenos Aires
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+54 9 11 3650 7549</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">hola@moksha.com.ar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="max-w-md">
            <h4 className="font-semibold mb-2">Mantente al día</h4>
            <p className="text-gray-400 text-sm mb-4">
              Recibí las últimas novedades y ofertas exclusivas.
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-gold-400"
              />
              <button className="px-4 py-2 bg-gold-600 hover:bg-gold-700 text-white rounded transition-colors">
                Suscribirse
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2026 MOKSHA. Todos los derechos reservados.
          </p>
          {/* desarrollador */}
          <p><a href="https://origam-ia.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm"> Desarrollado por origam-ia</a></p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacidad" className="text-gray-400 hover:text-white text-sm">
              Privacidad
            </Link>
            <Link href="/terminos" className="text-gray-400 hover:text-white text-sm">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
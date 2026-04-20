import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const footerLinks = {
  coleccion: [
    { name: "Anillos", href: "/coleccion?categoria=anillos" },
    { name: "Collares", href: "/coleccion?categoria=collares" },
    { name: "Pulseras", href: "/coleccion?categoria=pulseras" },
    { name: "Aros", href: "/coleccion?categoria=aros" },
  ],
  servicio: [
    { name: "Donde encontrarnos", href: "/contacto" },
    { name: "Contacto", href: "/contacto" },
    { name: "Envios", href: "/envios" },
    { name: "Devoluciones", href: "/devoluciones" },
  ],
  empresa: [
    { name: "Sobre nosotros", href: "/nosotros" },
    { name: "Sostenibilidad", href: "/sostenibilidad" },
    { name: "Blog", href: "/blog" },
    { name: "Trabaja con nosotros", href: "/trabajo" },
  ],
};

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn("footer-surface text-white", className)}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-[0.22em] text-white">MOKSHA</h3>
            <p className="text-white/68">
              Joyas que hablan de vos. Diseños contemporaneos, elegantes y pensados para destacar cada momento.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-white/50 transition-colors hover:text-white" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="@moksha.joyeriaa" className="text-white/50 transition-colors hover:text-white" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Coleccion</h4>
            <ul className="space-y-2">
              {footerLinks.coleccion.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/55 transition-colors hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Servicio al cliente</h4>
            <ul className="space-y-2">
              {footerLinks.servicio.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/55 transition-colors hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 flex-shrink-0 text-gold-400" />
                <span className="text-sm text-white/55">Teniente Farias 1509, Bahia Blanca, Buenos Aires</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 flex-shrink-0 text-gold-400" />
                <span className="text-sm text-white/55">+54 9 11 3650 7549</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 flex-shrink-0 text-gold-400" />
                <span className="text-sm text-white/55">hola@moksha.com.ar</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-8">
          <div className="max-w-md">
            <h4 className="mb-2 font-semibold text-white">Mantente al dia</h4>
            <p className="mb-4 text-sm text-white/55">Recibi las ultimas novedades y ofertas exclusivas.</p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 rounded border border-white/12 bg-black/20 px-3 py-2 text-white placeholder:text-white/35 focus:border-gold-400 focus:outline-none"
              />
              <button className="rounded bg-gold-600 px-4 py-2 text-white transition-colors hover:bg-gold-700">
                Suscribirse
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-white/45">© 2026 MOKSHA. Todos los derechos reservados.</p>
          <p>
            <a href="https://origamia.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-sm text-white/45 hover:text-white">
              Desarrollado por origam-ia
            </a>
          </p>
          <div className="mt-4 flex space-x-6 md:mt-0">
            <Link href="/privacidad" className="text-sm text-white/45 hover:text-white">
              Privacidad
            </Link>
            <Link href="/terminos" className="text-sm text-white/45 hover:text-white">
              Terminos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

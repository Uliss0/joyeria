import { Clock3, Mail, MapPin, MessageCircleDashed, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const metadata = {
  title: "Contacto | MOKSHA - Joyeria Premium",
  description: "Ponete en contacto con MOKSHA Joyeria. Estamos para ayudarte con consultas, compras y atencion personalizada.",
};

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(212,178,125,0.16),_transparent_28%),linear-gradient(180deg,_#17181b_0%,_#0d0e11_100%)] text-white">
      <div className="container mx-auto px-4 py-16 md:px-6 md:py-20">
        <section className="overflow-hidden rounded-[2.5rem] border border-white/8 bg-white/[0.03] shadow-[0_32px_120px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="border-b border-white/8 p-8 md:p-12 lg:border-b-0 lg:border-r">
              <div className="max-w-xl">
                <p className="admin-kicker mb-4">Atencion personalizada</p>
                <h1 className="admin-title text-5xl font-light leading-none md:text-6xl">Hablemos de la pieza ideal para vos</h1>
                <p className="mt-6 text-base leading-7 text-white/70 md:text-lg">
                  Respondemos consultas de compra, disponibilidad, talles y asesoramiento para regalos con una experiencia mas cercana y cuidada.
                </p>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.75rem] border border-white/8 bg-black/20 p-5">
                  <Mail className="h-5 w-5 text-gold-600" />
                  <p className="mt-4 text-sm uppercase tracking-[0.25em] text-white/45">Email</p>
                  <a href="mailto:info@mokshajoyeria.com" className="mt-3 block text-lg text-white transition hover:text-gold-400">
                    info@mokshajoyeria.com
                  </a>
                </div>

                <div className="rounded-[1.75rem] border border-white/8 bg-black/20 p-5">
                  <Phone className="h-5 w-5 text-gold-600" />
                  <p className="mt-4 text-sm uppercase tracking-[0.25em] text-white/45">Telefono</p>
                  <a href="tel:+5491136507549" className="mt-3 block text-lg text-white transition hover:text-gold-400">
                    +54 9 11 3650 7549
                  </a>
                </div>

                <div className="rounded-[1.75rem] border border-white/8 bg-black/20 p-5">
                  <MessageCircleDashed className="h-5 w-5 text-gold-600" />
                  <p className="mt-4 text-sm uppercase tracking-[0.25em] text-white/45">Instagram</p>
                  <a href="https://instagram.com/moksha.joyeriaa" target="_blank" rel="noopener noreferrer" className="mt-3 block text-lg text-white transition hover:text-gold-400">
                    @moksha.joyeriaa
                  </a>
                </div>

                <div className="rounded-[1.75rem] border border-white/8 bg-black/20 p-5">
                  <Clock3 className="h-5 w-5 text-gold-600" />
                  <p className="mt-4 text-sm uppercase tracking-[0.25em] text-white/45">Horario</p>
                  <p className="mt-3 text-lg text-white">Lunes a sabados, 10 a 19 hs</p>
                </div>
              </div>

              <div id="ubicaciones" className="mt-10 rounded-[2rem] border border-white/8 bg-[#121317] p-5">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-full border border-white/10 bg-white/5 p-2 text-gold-600">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Nuestra ubicacion</h2>
                    <p className="text-sm text-white/55">Teniente Farias 1509, Bahia Blanca, Buenos Aires</p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[1.5rem] border border-white/8">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d388.98267976898626!2d-62.26518572662129!3d-38.74394176371671!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95edbdbc4db45dcf%3A0x2479e5b07a0ad30d!2sMoksha!5e0!3m2!1ses-419!2sar!4v1769527762255!5m2!1ses-419!2sar"
                    width="600"
                    height="450"
                    className="h-72 w-full"
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicacion de MOKSHA Joyeria"
                  />
                </div>
              </div>
            </div>

            <div className="p-8 md:p-12">
              <div className="flex items-center gap-3">
                <div className="rounded-full border border-white/10 bg-white/5 p-2 text-gold-600">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="admin-kicker">Formulario</p>
                  <h2 className="text-3xl font-light text-white">Envianos un mensaje</h2>
                </div>
              </div>

              <p className="mt-5 max-w-md text-sm leading-6 text-white/65">
                Si estas buscando una recomendacion, una disponibilidad puntual o queres asesoramiento, te respondemos a la brevedad.
              </p>

              <form className="mt-8 space-y-5">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-white/80">Nombre completo</label>
                  <Input type="text" id="name" name="name" placeholder="Tu nombre" className="admin-input h-11" />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-white/80">Correo electronico</label>
                  <Input type="email" id="email" name="email" placeholder="tu.email@ejemplo.com" className="admin-input h-11" />
                </div>
                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm font-medium text-white/80">Asunto</label>
                  <Input type="text" id="subject" name="subject" placeholder="Sobre que queres hablar" className="admin-input h-11" />
                </div>
                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-white/80">Tu mensaje</label>
                  <Textarea id="message" name="message" rows={6} placeholder="Contanos en que podemos ayudarte..." className="admin-input min-h-36" />
                </div>
                <Button type="submit" className="h-11 w-full bg-gold-600 text-base text-white hover:bg-gold-700">
                  Enviar mensaje
                </Button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

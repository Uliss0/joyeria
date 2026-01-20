import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const metadata = {
  title: "Contacto | MOKSHA - Joyería Premium",
  description: "Ponte en contacto con MOKSHA Joyería. Encuéntranos, llámanos o envíanos un mensaje. Estamos aquí para ayudarte con tus consultas.",
};

export default function ContactoPage() {
  return (
    <div className="container mx-auto px-4 py-16 min-h-screen">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-5xl font-serif font-light text-gray-900 mb-4">
          Hablemos
        </h1>
        <p className="text-xl text-gray-700 font-sans">
          Estamos aquí para responder a todas tus preguntas y ayudarte a encontrar la joya perfecta.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="bg-gold-50 p-8 rounded-lg shadow-sm">
          <h2 className="text-3xl font-serif font-semibold text-gray-900 mb-6">
            Información de Contacto
          </h2>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Mail className="w-6 h-6 text-gold-600" />
              <div>
                <p className="font-semibold text-gray-800">Correo Electrónico</p>
                <a href="mailto:info@mokshajoyeria.com" className="text-gray-700 hover:text-gold-700 font-sans">
                  info@mokshajoyeria.com
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Phone className="w-6 h-6 text-gold-600" />
              <div>
                <p className="font-semibold text-gray-800">Teléfono</p>
                <a href="tel:+34912345678" className="text-gray-700 hover:text-gold-700 font-sans">
                  +34 912 345 678
                </a>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <MapPin className="w-6 h-6 text-gold-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-800">Nuestra Ubicación</p>
                <p className="text-gray-700 font-sans">
                  Calle de la Joya, 123 <br />
                  28001 Madrid, España
                </p>
              </div>
            </div>
          </div>

          {/* Optional: Embed Google Map */}
          <div className="mt-8">
            <h3 className="text-2xl font-serif font-semibold text-gray-900 mb-4">Encuéntranos en el mapa</h3>
            <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden shadow-md">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1dXXXX.XXXX!2d-X.XXXXX!3dXX.XXXXX!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDQzJzA3LjEiTiA0wrAyOScwMi44Ilc!5e0!3m2!1sen!2ses!4vXXXXXXXXXXXXX"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de MOKSHA Joyería"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-3xl font-serif font-semibold text-gray-900 mb-6">
            Envíanos un Mensaje
          </h2>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 font-sans mb-2">
                Nombre Completo
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="Tu nombre"
                className="w-full border-gray-300 focus:border-gold-500 focus:ring-gold-500 font-sans"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 font-sans mb-2">
                Correo Electrónico
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="tu.email@ejemplo.com"
                className="w-full border-gray-300 focus:border-gold-500 focus:ring-gold-500 font-sans"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 font-sans mb-2">
                Asunto
              </label>
              <Input
                type="text"
                id="subject"
                name="subject"
                placeholder="Sobre qué quieres hablar"
                className="w-full border-gray-300 focus:border-gold-500 focus:ring-gold-500 font-sans"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 font-sans mb-2">
                Tu Mensaje
              </label>
              <Textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Escribe tu mensaje aquí..."
                className="w-full border-gray-300 focus:border-gold-500 focus:ring-gold-500 font-sans"
              />
            </div>
            <Button type="submit" className="btn-gold w-full text-lg py-3">
              Enviar Mensaje
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

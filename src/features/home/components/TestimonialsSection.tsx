"use client";

import { motion } from "framer-motion";

const StarIcon = () => (
  <svg viewBox="0 0 20 20" className="w-4 h-4" fill="var(--color-gold-500)" aria-hidden="true">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const Stars = ({ count = 5, large = false }: { count?: number; large?: boolean }) => (
  <div className="flex gap-1" aria-label={`${count} estrellas`}>
    {[...Array(count)].map((_, i) => (
      <svg
        key={i}
        viewBox="0 0 20 20"
        className={large ? "w-5 h-5" : "w-4 h-4"}
        fill="var(--color-gold-500)"
        aria-hidden="true"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const Avatar = ({ initials, size = "md" }: { initials: string; size?: "sm" | "md" | "lg" }) => {
  const sizes = { sm: "w-9 h-9 text-xs", md: "w-11 h-11 text-sm", lg: "w-12 h-12 text-sm" };
  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold flex-shrink-0`}
      style={{ background: "var(--color-gold-200)", color: "var(--color-gold-800)" }}
    >
      {initials}
    </div>
  );
};

const QuoteMark = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 60 44"
    className="absolute top-6 right-7 opacity-[0.07] w-16 h-16"
    fill="currentColor"
    style={{ color: "var(--color-gold-500)" }}
  >
    <path d="M0 44V27.2C0 18.453 2.347 11.4 7.04 6.04 11.733.68 18.453 0 25.6 0v8.96c-4.267.427-7.573 2.24-9.92 5.44-2.347 3.2-3.413 6.827-3.2 10.88H22.4V44H0Zm33.6 0V27.2c0-8.747 2.347-15.8 7.04-21.16C45.333.68 52.053 0 59.2 0v8.96c-4.267.427-7.573 2.24-9.92 5.44-2.347 3.2-3.413 6.827-3.2 10.88H56V44H33.6Z" />
  </svg>
);

const cardShadow = "0 4px 24px rgba(0,0,0,0.13), 0 0 0 1px rgba(212,178,125,0.09)";
const cardShadowFeatured = "0 8px 40px rgba(0,0,0,0.18), 0 0 0 1px rgba(212,178,125,0.13)";

interface TestimonialsSectionProps {
  className?: string;
}

export function TestimonialsSection({ className }: TestimonialsSectionProps) {
  return (
    <section className={`py-20 bg-transparent ${className ?? ""}`}>
      <div className="container mx-auto px-4">

        {/* Header — alineado a la izquierda, más editorial */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-14 max-w-xl"
        >
          <p className="admin-kicker mb-3">Clientes reales</p>
          <h2 className="text-4xl md:text-5xl font-serif font-light text-foreground leading-snug">
            Lo que dicen quienes eligen MOKSHA
          </h2>
        </motion.div>

        {/* Grid asimétrico: 2 cols en desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* ── Featured card (izquierda, ocupa 2 filas en md) ── */}
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            viewport={{ once: true }}
            className="relative bg-card rounded-2xl p-8 md:p-10 flex flex-col justify-between overflow-hidden md:row-span-2"
            style={{ boxShadow: cardShadowFeatured }}
          >
            <QuoteMark />

            <div>
              <Stars count={5} large />
              <blockquote className="font-serif text-xl md:text-2xl text-foreground leading-relaxed mt-6 mb-8 font-light">
                "Compré un anillo de compromiso y fue una experiencia completamente
                diferente a lo que esperaba. Me asesoraron con paciencia, sin apuro,
                y el resultado fue perfecto. Mi novia quedó sin palabras."
              </blockquote>
            </div>

            <div className="flex items-center gap-4 mt-auto">
              <Avatar initials="MR" size="md" />
              <div>
                <p className="text-foreground font-semibold text-sm">Martín R.</p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Anillo de compromiso · Verificado ✓
                </p>
              </div>
            </div>
          </motion.article>

          {/* ── Compact card 1 ── */}
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-6 flex flex-col justify-between"
            style={{ boxShadow: cardShadow }}
          >
            <div>
              <Stars count={5} />
              <blockquote className="font-serif text-base text-foreground leading-relaxed font-light mt-4 mb-5">
                "Llegó antes de lo esperado y el packaging era hermoso. Sentí que
                estaba abriendo algo de lujo. El collar es aún más delicado en persona."
              </blockquote>
            </div>
            <div className="flex items-center gap-3">
              <Avatar initials="SL" size="sm" />
              <div>
                <p className="text-foreground font-semibold text-sm">Sofía L.</p>
                <p className="text-muted-foreground text-xs">Collar · Verificada ✓</p>
              </div>
            </div>
          </motion.article>

          {/* ── Compact card 2 ── */}
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.25 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-6 flex flex-col justify-between"
            style={{ boxShadow: cardShadow }}
          >
            <div>
              <Stars count={5} />
              <blockquote className="font-serif text-base text-foreground leading-relaxed font-light mt-4 mb-5">
                "Busco regalos especiales para fechas importantes y MOKSHA siempre
                tiene la respuesta. La pulsera que elegí para mi mamá se convirtió en su favorita."
              </blockquote>
            </div>
            <div className="flex items-center gap-3">
              <Avatar initials="CP" size="sm" />
              <div>
                <p className="text-foreground font-semibold text-sm">Camila P.</p>
                <p className="text-muted-foreground text-xs">Pulsera · Verificada ✓</p>
              </div>
            </div>
          </motion.article>

          {/* ── Wide card (full width, fila de abajo) ── */}
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            className="relative bg-card rounded-2xl p-7 md:col-span-2 flex flex-col sm:flex-row sm:items-center gap-6 overflow-hidden"
            style={{ boxShadow: cardShadow }}
          >
            {/* Acento lateral dorado */}
            <div
              className="hidden sm:block absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
              style={{
                background: "linear-gradient(180deg, var(--color-gold-400), var(--color-gold-600))",
              }}
              aria-hidden="true"
            />
            <div className="sm:pl-5 flex-1">
              <Stars count={5} />
              <blockquote className="font-serif text-lg text-foreground leading-relaxed font-light mt-3">
                "Compré unos aros como regalo de cumpleaños y la persona que los recibió
                me preguntó dónde los conseguí. Terminé haciendo otros dos pedidos ese mismo mes."
              </blockquote>
            </div>
            <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:text-center sm:min-w-[90px] flex-shrink-0">
              <Avatar initials="JV" size="lg" />
              <div>
                <p className="text-foreground font-semibold text-sm">Julia V.</p>
                <p className="text-muted-foreground text-xs mt-0.5">Aros · Verificada ✓</p>
              </div>
            </div>
          </motion.article>

        </div>{/* /grid */}

        {/* Resumen de confianza */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-3 text-center"
        >
          {[
            { value: "+400", label: "clientes satisfechos" },
            { value: "4.9★", label: "valoración promedio" },
            { value: "100%", label: "compras verificadas" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center">
              <span
                className="text-2xl font-serif font-light"
                style={{ color: "var(--color-gold-600)" }}
              >
                {item.value}
              </span>
              <span className="text-muted-foreground text-xs mt-0.5 font-sans">{item.label}</span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

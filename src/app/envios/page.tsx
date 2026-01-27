export const metadata = {
  title: 'Envíos - MOKSHA',
  description: 'Políticas y plazos de envío de MOKSHA.'
}

export default function EnviosPage() {
  return (
    <main className="container mx-auto py-12">
      <h1 className="text-2xl font-bold mb-4">Política de Envíos</h1>

      <p className="text-gray-700 mb-4">Ofrecemos envíos dentro del país y opciones para envíos internacionales según disponibilidad.</p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Plazos</h2>
      <p className="text-gray-700">Los envíos locales suelen tardar entre 2-7 días hábiles, según la ubicación y el método seleccionado.</p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Costos</h2>
      <p className="text-gray-700">Los costos varían según el peso, destino y método de envío. Los verás al finalizar la compra.</p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Seguimiento</h2>
      <p className="text-gray-700">Una vez despachado, recibirás un número de seguimiento y el link del transportista.</p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Aduanas y demoras</h2>
      <p className="text-gray-700">En envíos internacionales pueden aplicarse impuestos y demoras por aduana, que son responsabilidad del comprador.</p>

      <p className="text-sm text-gray-500 mt-6">Actualizado: Enero 2026</p>
    </main>
  )
}

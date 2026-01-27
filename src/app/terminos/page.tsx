export const metadata = {
  title: 'Términos y Condiciones - MOKSHA',
  description: 'Términos y condiciones de uso y compra en MOKSHA.'
}

export default function TerminosPage() {
  return (
    <main className="container mx-auto py-12">
      <h1 className="text-2xl font-bold mb-4">Términos y Condiciones</h1>

      <p className="text-gray-700 mb-4">Estos términos regulan el uso del sitio y la compra de productos en MOKSHA. Al comprar aceptás estos términos.</p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Pedidos y disponibilidad</h2>
      <p className="text-gray-700">Todos los pedidos están sujetos a disponibilidad. Confirmaremos el pedido por email.</p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Precios y pagos</h2>
      <p className="text-gray-700">Los precios incluyen IVA cuando corresponda. Los pagos son procesados por terceros seguros.</p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Envíos y devoluciones</h2>
      <p className="text-gray-700">Consultar nuestras políticas de envío y devoluciones para plazos, costos y condiciones.</p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Propiedad intelectual</h2>
      <p className="text-gray-700">Todo el contenido del sitio es propiedad de MOKSHA y está protegido por leyes de propiedad intelectual.</p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Ley aplicable</h2>
      <p className="text-gray-700">Estos términos se rigen por las leyes de la República Argentina, salvo que se indique lo contrario.</p>

      <p className="text-sm text-gray-500 mt-6">Actualizado: Enero 2026</p>
    </main>
  )
}

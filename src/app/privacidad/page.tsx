export const metadata = {
  title: 'Privacidad - MOKSHA',
  description: 'Política de privacidad de MOKSHA: cómo recopilamos, usamos y protegemos tus datos personales.'
}

export default function PrivacidadPage() {
  return (
    <main className="container mx-auto py-12">
      <h1 className="text-2xl font-bold mb-4">Política de Privacidad</h1>
      <p className="text-gray-700 mb-4">
        En MOKSHA nos comprometemos a proteger tu privacidad. Esta política describe qué
        información recopilamos, cómo la usamos y tus derechos respecto a tus datos.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Información que recopilamos</h2>
      <ul className="list-disc list-inside text-gray-700">
        <li>Datos de contacto (nombre, email, dirección de envío).</li>
        <li>Información de pago (procesada por proveedores externos).</li>
        <li>Datos de navegación y uso del sitio (cookies y analytics).</li>
      </ul>

      <h2 className="text-lg font-semibold mt-6 mb-2">Cómo usamos la información</h2>
      <p className="text-gray-700">Para procesar pedidos, mejorar la experiencia y comunicarnos promociones relevantes.</p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Cookies y terceros</h2>
      <p className="text-gray-700">Utilizamos cookies para mejorar el sitio y proveedores externos para pagos y envío. Consulta nuestra política de cookies para más detalles.</p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Tus derechos</h2>
      <p className="text-gray-700">Podés solicitar acceso, rectificación o eliminación de tus datos contactándonos en <strong>hola@moksha.com.ar</strong>.</p>

      <p className="text-sm text-gray-500 mt-6">Actualizado: Enero 2026</p>
    </main>
  )
}

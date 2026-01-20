import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { OrdersList } from "@/features/account/components/OrdersList";

export const metadata = {
  title: "Mis Pedidos | MOKSHA - Joyería Premium",
  description: "Revisa el historial de tus pedidos en MOKSHA.",
};

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null; // El layout ya maneja la redirección
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mis Pedidos</h1>
        <p className="text-gray-600 mt-1">
          Revisa el historial de tus compras y el estado de tus pedidos.
        </p>
      </div>

      <OrdersList />
    </div>
  );
}
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
      <div className="border-b border-border/60 pb-5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-500/90 block">
          Historial de Compras
        </span>
        <h1 className="text-3xl md:text-4xl font-serif font-light text-foreground mt-1 tracking-tight">
          Mis Pedidos
        </h1>
        <p className="text-sm text-muted-foreground font-sans mt-1.5">
          Revisa el historial de tus compras y el estado de tus pedidos.
        </p>
      </div>

      <OrdersList />
    </div>
  );
}

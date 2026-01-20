import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { AddressesList } from "@/features/account/components/AddressesList";

export const metadata = {
  title: "Mis Direcciones | MOKSHA - Joyería Premium",
  description: "Gestiona tus direcciones de envío y facturación en MOKSHA.",
};

export default async function AddressesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null; // El layout ya maneja la redirección
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Direcciones</h1>
          <p className="text-gray-600 mt-1">
            Gestiona tus direcciones de envío y facturación.
          </p>
        </div>
        <button className="btn-gold">
          Agregar Dirección
        </button>
      </div>

      <AddressesList />
    </div>
  );
}
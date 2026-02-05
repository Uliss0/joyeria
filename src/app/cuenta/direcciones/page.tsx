import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { AddressesList } from "@/features/account/components/AddressesList";

export const metadata = {
  title: "Mis Direcciones | MOKSHA - Joyerí­a Premium",
  description: "Gestiona tus direcciones de envío y facturación en MOKSHA.",
};

export default async function AddressesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null; // El layout ya maneja la redirecciÃ³n
  }

  return (
    <div className="space-y-6">
      <AddressesList />
    </div>
  );
}

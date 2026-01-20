import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { ProfileForm } from "@/features/account/components/ProfileForm";

export const metadata = {
  title: "Mi Perfil | MOKSHA - Joyería Premium",
  description: "Gestiona tu información personal en MOKSHA.",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null; // El layout ya maneja la redirección
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-600 mt-1">
          Gestiona tu información personal y preferencias de cuenta.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <ProfileForm user={session.user} />
      </div>
    </div>
  );
}
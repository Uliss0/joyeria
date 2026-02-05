import { AccountSettings } from "@/features/account/components/AccountSettings";

export const metadata = {
  title: "Configuración | MOKSHA - Joyería Premium",
  description: "Configura las preferencias y la seguridad de tu cuenta en MOKSHA.",
};

export default function AccountSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600">
          Ajusta tus preferencias y prepara tu cuenta para nuevas integraciones.
        </p>
      </div>

      <AccountSettings />
    </div>
  );
}

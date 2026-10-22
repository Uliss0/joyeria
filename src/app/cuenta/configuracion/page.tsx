import { AccountSettings } from "@/features/account/components/AccountSettings";

export const metadata = {
  title: "Configuración | MOKSHA - Joyería Premium",
  description: "Configura las preferencias y la seguridad de tu cuenta en MOKSHA.",
};

export default function AccountSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-border/60 pb-5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-500/90 block">
          Ajustes
        </span>
        <h1 className="text-3xl md:text-4xl font-serif font-light text-foreground mt-1 tracking-tight">
          Configuración
        </h1>
        <p className="text-sm text-muted-foreground font-sans mt-1.5">
          Ajusta tus preferencias de comunicación y seguridad de la cuenta.
        </p>
      </div>

      <AccountSettings />
    </div>
  );
}

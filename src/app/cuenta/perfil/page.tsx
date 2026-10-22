import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { ProfileForm } from "@/features/account/components/ProfileForm";

export const metadata = {
  title: "Mi Perfil | MOKSHA - Joyería Premium",
  description: "Gestiona tu información personal y datos de contacto en MOKSHA.",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null; // El layout ya maneja la redirección
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-border/60 pb-5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-500/90 block">
          Información Personal
        </span>
        <h1 className="text-3xl md:text-4xl font-serif font-light text-foreground mt-1 tracking-tight">
          Mi Perfil
        </h1>
        <p className="text-sm text-muted-foreground font-sans mt-1.5">
          Gestiona tus datos personales, preferencias de contacto y detalles de tu cuenta.
        </p>
      </div>

      <div className="bg-card/95 border border-border/80 rounded-3xl p-6 md:p-8 shadow-sm backdrop-blur-sm">
        <ProfileForm user={session.user} />
      </div>
    </div>
  );
}

import { AuthForm } from "@/features/auth/components/AuthForm";

export const metadata = {
  title: "Iniciar Sesión | MOKSHA - Joyería Premium",
  description: "Inicia sesión en tu cuenta de MOKSHA para acceder a tu perfil y pedidos.",
};

export default function SignInPage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 md:py-16 px-4 relative overflow-hidden">
      {/* Ambient gold glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-gold-500/10 rounded-full blur-[140px] pointer-events-none"
      />
      <div className="relative w-full max-w-md">
        <AuthForm mode="signin" />
      </div>
    </div>
  );
}

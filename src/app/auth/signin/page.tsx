import { AuthForm } from "@/features/auth/components/AuthForm";

export const metadata = {
  title: "Iniciar Sesión | MOKSHA - Joyería Premium",
  description: "Inicia sesión en tu cuenta de MOKSHA para acceder a tu perfil y pedidos.",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <AuthForm mode="signin" />
    </div>
  );
}
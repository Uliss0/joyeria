import { AuthForm } from "@/features/auth/components/AuthForm";

export const metadata = {
  title: "Crear Cuenta | MOKSHA - Joyería Premium",
  description: "Regístrate en MOKSHA y descubre joyas únicas pensadas para destacar cada momento.",
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <AuthForm mode="signup" />
    </div>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AuthFormProps {
  mode: "signin" | "signup";
  className?: string;
}

export function AuthForm({ mode, className }: AuthFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const isSignUp = mode === "signup";

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isSignUp) {
        // Sign up logic
        if (formData.password !== formData.confirmPassword) {
          setError("Las contraseñas no coinciden");
          setIsLoading(false);
          return;
        }

        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Error al crear la cuenta");
        }

        // Auto sign in after successful registration
        const signInResult = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
          callbackUrl: "/",
        });

        if (signInResult?.error) {
          setError("No se pudo iniciar sesión automáticamente");
          return;
        }

        window.location.href = signInResult?.url ?? "/";
      } else {
        // Sign in logic
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
          callbackUrl: "/",
        });

        if (result?.error) {
          setError("Credenciales inválidas. Verifica tu correo y contraseña.");
        } else {
          window.location.href = result?.url ?? "/";
        }
      }
    } catch (error: any) {
      setError(error.message || "Ocurrió un error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: string) => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl: "/" });
    } catch (error) {
      setError("Error al iniciar sesión con Google");
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "w-full rounded-3xl border border-border/80 bg-card/95 backdrop-blur-xl p-8 sm:p-10 shadow-2xl shadow-black/20 text-foreground transition-all",
        className
      )}
    >
      {/* Brand Icon Header */}
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-gold-500/25 bg-gold-500/10 text-gold-500 shadow-sm shadow-gold-500/10">
          <Sparkles className="h-5 w-5" />
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-500/90 block mb-1">
          {isSignUp ? "Nueva Cuenta" : "Acceso Exclusivo"}
        </span>
        <h1 className="text-3xl md:text-4xl font-serif font-light text-foreground tracking-tight">
          {isSignUp ? "Crear cuenta" : "Iniciar sesión"}
        </h1>
        <p className="text-sm text-muted-foreground font-sans mt-2 max-w-sm mx-auto">
          {isSignUp
            ? "Únete a MOKSHA y descubre joyas únicas pensadas para destacar cada momento."
            : "Bienvenido de vuelta a tu espacio en MOKSHA."}
        </p>
      </div>

      {/* Social Google Login */}
      <div>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialSignIn("google")}
          disabled={isLoading}
          className="w-full h-11 bg-background/80 hover:bg-accent/60 border border-border text-foreground hover:border-gold-500/40 rounded-xl flex items-center justify-center gap-3 transition-all cursor-pointer shadow-sm text-sm font-medium"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Continuar con Google</span>
        </Button>
      </div>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/70" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card px-3 text-muted-foreground font-sans uppercase tracking-widest text-[11px]">
            O con tu email
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs uppercase tracking-wider font-semibold text-foreground/80">
              Nombre completo
            </Label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Tu nombre y apellido"
                required
                disabled={isLoading}
                className="pl-10 h-11 rounded-xl border-input bg-background/80 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-gold-500/50 focus-visible:border-gold-500/50"
              />
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs uppercase tracking-wider font-semibold text-foreground/80">
            Correo electrónico
          </Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="tu@email.com"
              required
              disabled={isLoading}
              className="pl-10 h-11 rounded-xl border-input bg-background/80 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-gold-500/50 focus-visible:border-gold-500/50"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs uppercase tracking-wider font-semibold text-foreground/80">
            Contraseña
          </Label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
              minLength={6}
              className="pl-10 pr-10 h-11 rounded-xl border-input bg-background/80 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-gold-500/50 focus-visible:border-gold-500/50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 cursor-pointer"
              tabIndex={-1}
              aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {isSignUp && (
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-xs uppercase tracking-wider font-semibold text-foreground/80">
              Confirmar contraseña
            </Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
                minLength={6}
                className="pl-10 pr-10 h-11 rounded-xl border-input bg-background/80 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-gold-500/50 focus-visible:border-gold-500/50"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 cursor-pointer"
                tabIndex={-1}
                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-500 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <Button
          type="submit"
          variant="gold"
          disabled={isLoading}
          className="w-full h-11 btn-gold !bg-[#c19659] hover:!bg-[#a47a4a] !text-white rounded-xl font-medium tracking-wide shadow-md shadow-gold-950/20 hover:shadow-gold-500/25 transition-all duration-300 disabled:opacity-50 cursor-pointer text-sm flex items-center justify-center gap-2 mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{isSignUp ? "Creando cuenta..." : "Iniciando sesión..."}</span>
            </>
          ) : (
            <span>{isSignUp ? "Crear cuenta" : "Iniciar sesión"}</span>
          )}
        </Button>
      </form>

      {/* Footer Switcher */}
      <div className="mt-8 pt-6 border-t border-border/60 text-center">
        <p className="text-sm text-muted-foreground font-sans">
          {isSignUp ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta aún?"}{" "}
          <Link
            href={isSignUp ? "/auth/signin" : "/auth/signup"}
            className="text-gold-500 hover:text-gold-400 font-medium transition-colors hover:underline underline-offset-4 ml-1"
          >
            {isSignUp ? "Inicia sesión" : "Regístrate ahora"}
          </Link>
        </p>
      </div>
    </div>
  );
}

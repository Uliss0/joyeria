"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { AlertCircle, Calendar, CheckCircle2, Loader2, Mail, Phone, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ProfileFormProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: "",
    dateOfBirth: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (message) setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Error al actualizar el perfil");
      }

      // Update next-auth session in browser
      await update({
        ...session,
        user: {
          ...session?.user,
          name: formData.name,
          email: formData.email,
        },
      });

      setMessage({ text: "Perfil actualizado exitosamente", type: "success" });
    } catch (error: any) {
      setMessage({
        text: error.message || "Error al actualizar el perfil",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 text-foreground">
      {/* User Header Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/25 flex items-center justify-center text-gold-500 shadow-sm shrink-0">
          <User className="w-8 h-8" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-xl md:text-2xl font-serif font-light text-foreground truncate">
              {formData.name || user.name || "Cliente MOKSHA"}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-gold-500/15 text-gold-500 border border-gold-500/25">
              Miembro
            </span>
          </div>
          <p className="text-sm text-muted-foreground truncate mt-0.5 font-sans">
            {user.email}
          </p>
        </div>
      </div>

      <Separator className="bg-border/60" />

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs uppercase tracking-wider font-semibold text-foreground/80">
              Nombre completo
            </Label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="pl-10 h-11 rounded-xl border-input bg-background/80 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-gold-500/50 focus-visible:border-gold-500/50"
                placeholder="Tu nombre completo"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs uppercase tracking-wider font-semibold text-foreground/80">
              Correo electrónico
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled={true}
                className="pl-10 h-11 rounded-xl border-input bg-background/50 text-muted-foreground opacity-85 cursor-not-allowed"
                placeholder="tu@email.com"
              />
            </div>
            <p className="text-[11px] text-muted-foreground/70">
              El correo está vinculado a tu cuenta y no puede modificarse directamente.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-xs uppercase tracking-wider font-semibold text-foreground/80">
              Teléfono de contacto
            </Label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="pl-10 h-11 rounded-xl border-input bg-background/80 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-gold-500/50 focus-visible:border-gold-500/50"
                placeholder="+54 291 566-6668"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dateOfBirth" className="text-xs uppercase tracking-wider font-semibold text-foreground/80">
              Fecha de nacimiento
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                className="pl-10 h-11 rounded-xl border-input bg-background/80 text-foreground [color-scheme:light] dark:[color-scheme:dark] focus-visible:ring-1 focus-visible:ring-gold-500/50 focus-visible:border-gold-500/50"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {message && (
          <div
            className={cn(
              "p-4 rounded-2xl text-sm flex items-center gap-3 border transition-all",
              message.type === "success"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"
                : "bg-destructive/10 text-destructive border-destructive/25"
            )}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 text-destructive" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="gold"
            disabled={isLoading}
            className="h-11 px-6 btn-gold !bg-[#c19659] hover:!bg-[#a47a4a] !text-white rounded-xl font-medium tracking-wide shadow-md shadow-gold-950/20 hover:shadow-gold-500/25 transition-all cursor-pointer flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <span>Guardar Cambios</span>
            )}
          </Button>
        </div>
      </form>

      <Separator className="bg-border/60" />

      {/* Account Info Details */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-gold-500" />
          <h3 className="text-base font-serif font-light text-foreground">
            Detalles de la cuenta
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl border border-border/60 bg-background/50">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold block">
              Tipo de acceso
            </span>
            <p className="text-sm font-medium text-foreground mt-1">Cuenta MOKSHA Verificada</p>
          </div>
          <div className="p-4 rounded-2xl border border-border/60 bg-background/50">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold block">
              Fecha de sesión
            </span>
            <p className="text-sm font-medium text-foreground mt-1">
              {new Date().toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

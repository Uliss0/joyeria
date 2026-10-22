"use client";

import { useState } from "react";
import { Bell, Lock, Mail, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function AccountSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [promoNotifications, setPromoNotifications] = useState(false);

  return (
    <div className="space-y-8 text-foreground">
      <div>
        <h3 className="text-xl font-serif font-light text-foreground">Preferencias de notificaciones</h3>
        <p className="text-sm text-muted-foreground font-sans mt-1">
          Controla cómo te comunicamos novedades, pedidos y actualizaciones exclusivas.
        </p>
      </div>

      <div className="bg-card/95 border border-border/80 rounded-3xl p-6 space-y-5 shadow-sm backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-gold-500/10 border border-gold-500/20 text-gold-500 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">Alertas de pedidos</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Confirmaciones, envíos y actualizaciones del estado de tu compra.
            </p>
          </div>
          <input
            type="checkbox"
            className="h-4 w-4 mt-1 accent-gold-600 rounded cursor-pointer"
            checked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
          />
        </div>

        <div className="border-t border-border/60 pt-4 flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-background/80 border border-border/60 text-muted-foreground flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">Promociones y lanzamientos</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Acceso anticipado a colecciones exclusivas y novedades de MOKSHA.
            </p>
          </div>
          <input
            type="checkbox"
            className="h-4 w-4 mt-1 accent-gold-600 rounded cursor-pointer"
            checked={promoNotifications}
            onChange={(e) => setPromoNotifications(e.target.checked)}
          />
        </div>
      </div>

      <Separator className="bg-border/60" />

      <div>
        <h3 className="text-xl font-serif font-light text-foreground">Seguridad</h3>
        <p className="text-sm text-muted-foreground font-sans mt-1">
          Administra la seguridad y credenciales de acceso a tu cuenta.
        </p>
      </div>

      <div className="bg-card/95 border border-border/80 rounded-3xl p-6 space-y-5 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-background/80 border border-border/60 text-muted-foreground flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <Label htmlFor="newPassword" className="text-xs uppercase tracking-wider font-semibold text-foreground/80">
              Nueva contraseña
            </Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="••••••••"
              disabled
              className="h-11 rounded-xl border-input bg-background/50 text-muted-foreground opacity-80"
            />
            <p className="text-xs text-muted-foreground">
              Próximamente habilitaremos el cambio de contraseña directo desde este panel.
            </p>
          </div>
          <Button variant="outline" size="sm" disabled className="rounded-xl border-border">
            Guardar
          </Button>
        </div>

        <div className="border-t border-border/60 pt-4 flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">Autenticación segura</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Tu sesión está cifrada y protegida por los protocolos de seguridad de MOKSHA.
            </p>
          </div>
        </div>
      </div>

      <Separator className="bg-border/60" />

      <div>
        <h3 className="text-xl font-serif font-light text-foreground">Preferencias de envío</h3>
        <p className="text-sm text-muted-foreground font-sans mt-1">
          Configuración avanzada de logística y entrega.
        </p>
      </div>

      <div className="bg-card/95 border border-dashed border-border rounded-3xl p-6 flex items-start gap-4 shadow-sm backdrop-blur-sm">
        <div className="w-10 h-10 rounded-2xl bg-gold-500/10 border border-gold-500/20 text-gold-500 flex items-center justify-center shrink-0">
          <Truck className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Preferencias de entrega personalizadas</p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Podrás seleccionar sucursales preferidas y horarios convenientes cuando la integración logística esté habilitada.
          </p>
        </div>
      </div>
    </div>
  );
}

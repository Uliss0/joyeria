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
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Preferencias de notificaciones</h3>
        <p className="text-sm text-gray-600">
          Controla cómo te comunicamos novedades y actualizaciones.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center">
            <Bell className="w-5 h-5 text-gold-700" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Alertas de pedidos</p>
            <p className="text-sm text-gray-600">
              Confirmaciones, envíos y actualizaciones de tu compra.
            </p>
          </div>
          <input
            type="checkbox"
            className="h-4 w-4 accent-gold-600"
            checked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
          />
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <Mail className="w-5 h-5 text-gray-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Promociones y lanzamientos</p>
            <p className="text-sm text-gray-600">
              Descuentos exclusivos y novedades de MOKSHA.
            </p>
          </div>
          <input
            type="checkbox"
            className="h-4 w-4 accent-gold-600"
            checked={promoNotifications}
            onChange={(e) => setPromoNotifications(e.target.checked)}
          />
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold text-gray-900">Seguridad</h3>
        <p className="text-sm text-gray-600">
          Cambia tu contraseña o refuerza la seguridad de tu cuenta.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <Lock className="w-5 h-5 text-gray-600" />
          </div>
          <div className="flex-1 space-y-3">
            <Label htmlFor="newPassword">Nueva contraseña</Label>
            <Input id="newPassword" type="password" placeholder="********" disabled />
            <p className="text-xs text-gray-500">
              Próximamente habilitaremos el cambio de contraseña desde aquí. 
            </p>
          </div>
          <Button variant="outline" size="sm" disabled>
            Guardar
          </Button>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Autenticación segura</p>
            <p className="text-sm text-gray-600">
              Estamos preparando mejoras de seguridad para tu cuenta.
            </p>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold text-gray-900">Preferencias de envío</h3>
        <p className="text-sm text-gray-600">
          Esta sección quedarán lista cuando integremos la API de envíos.
        </p>
      </div>

      <div className="bg-white border border-dashed border-gray-300 rounded-lg p-6 flex items-start space-x-3">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
          <Truck className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">Configura tus preferencias de entrega</p>
          <p className="text-sm text-gray-600">
            Podrás seleccionar transportistas y horarios preferidos cuando la integración
            esté disponible.
          </p>
        </div>
      </div>
    </div>
  );
}

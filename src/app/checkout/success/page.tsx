"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle, Truck, Package, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccess() {
  // In real app, you might want to clear any temporary checkout data here

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          ¡Pedido confirmado!
        </h1>
        <p className="text-gray-600 mb-8">
          Gracias por tu compra. Hemos recibido tu pedido y lo estamos procesando.
        </p>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="font-semibold text-gray-900 mb-4">Detalles del pedido</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Número de pedido:</span>
              <span className="font-medium text-gray-900">#MOK-{Date.now()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Fecha:</span>
              <span className="font-medium text-gray-900">
                {new Date().toLocaleDateString('es-AR')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total:</span>
              <span className="font-medium text-gray-900">$137.000</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h3 className="font-semibold text-blue-900 mb-3">¿Qué sucede ahora?</h3>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start space-x-3">
              <Mail className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>Recibirás un email de confirmación con los detalles de tu pedido</span>
            </div>
            <div className="flex items-start space-x-3">
              <Package className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>Procesaremos tu pedido en 1-2 días hábiles</span>
            </div>
            <div className="flex items-start space-x-3">
              <Truck className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>Te enviaremos actualizaciones de envío por email</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button asChild className="w-full bg-gold-600 hover:bg-gold-700">
            <Link href="/cuenta/pedidos">
              Ver estado del pedido
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/coleccion">
              Continuar comprando
            </Link>
          </Button>
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>¿Necesitas ayuda? Contactanos:</p>
          <p className="mt-1">
            <a href="mailto:hola@moksha.com.ar" className="text-gold-600 hover:text-gold-700">
              hola@moksha.com.ar
            </a>
            {" • "}
            <a href="tel:+541112345678" className="text-gold-600 hover:text-gold-700">
              +54 11 1234-5678
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
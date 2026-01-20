"use client";

import { useState } from "react";
import { CheckCircle, Truck, CreditCard, MapPin, User, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ReviewStepProps {
  shippingData: any;
  paymentData: any;
  onComplete: () => void;
  onBack: () => void;
  className?: string;
}

export function ReviewStep({ shippingData, paymentData, onComplete, onBack, className }: ReviewStepProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCompleteOrder = async () => {
    setIsProcessing(true);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In real app, this would create the order in the backend
    console.log('Order completed:', { shippingData, paymentData });

    onComplete();
  };

  const shippingCost = shippingData.shippingMethod === 'express' ? 12000 : 5000;

  return (
    <div className={cn("max-w-4xl mx-auto", className)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revisar y confirmar</h3>

            {/* Shipping Information */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2 mb-3">
                <MapPin className="w-5 h-5 text-gray-600" />
                <h4 className="font-medium text-gray-900">Dirección de envío</h4>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>{shippingData.firstName} {shippingData.lastName}</p>
                <p>{shippingData.address1}</p>
                {shippingData.address2 && <p>{shippingData.address2}</p>}
                <p>{shippingData.city}, {shippingData.state} {shippingData.zipCode}</p>
                <p>Argentina</p>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{shippingData.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{shippingData.email}</span>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2 mb-3">
                <Truck className="w-5 h-5 text-gray-600" />
                <h4 className="font-medium text-gray-900">Método de envío</h4>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  {shippingData.shippingMethod === 'express' ? 'Envío express' : 'Envío estándar'}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  ${shippingCost.toLocaleString('es-AR')}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {shippingData.shippingMethod === 'express' ? '2-3 días hábiles' : '5-7 días hábiles'}
              </p>
            </div>

            {/* Payment Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <h4 className="font-medium text-gray-900">Método de pago</h4>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  {paymentData.paymentMethod === 'credit_card' ? 'Tarjeta de crédito' : 'Tarjeta de débito'}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  •••• •••• •••• {paymentData.cardNumber.slice(-4)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {paymentData.cardholderName}
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-4 sticky top-4">
            <h4 className="font-medium text-gray-900 mb-4">Resumen del pedido</h4>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>$125.000</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span>${shippingCost.toLocaleString('es-AR')}</span>
              </div>
              <div className="flex justify-between font-semibold text-base border-t border-gray-200 pt-2 mt-2">
                <span>Total</span>
                <span>${(125000 + shippingCost).toLocaleString('es-AR')}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button
                onClick={handleCompleteOrder}
                disabled={isProcessing}
                className="w-full bg-gold-600 hover:bg-gold-700"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirmar pedido
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={isProcessing}
                className="w-full"
              >
                Volver
              </Button>
            </div>

            <div className="mt-4 text-xs text-gray-500 text-center">
              <p>Al confirmar, aceptas nuestros términos y condiciones.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
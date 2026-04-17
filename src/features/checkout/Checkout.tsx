"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartClearCart, useCartItems } from "@/shared/store/cartStore";
import { CheckoutSteps } from "./components/CheckoutSteps";
import { OrderSummary } from "./components/OrderSummary";
import { PaymentStep } from "./steps/PaymentStep";
import { ReviewStep } from "./steps/ReviewStep";
import { ShippingStep } from "./steps/ShippingStep";
import type { CheckoutOrderResponse, PaymentInfo, ShippingInfo } from "./types";

const steps = [
  { id: "shipping", title: "Envío", description: "Dirección y envío" },
  { id: "payment", title: "Pago", description: "Información de pago" },
  { id: "review", title: "Revisar", description: "Confirmar pedido" },
];

export default function Checkout() {
  const [currentStep, setCurrentStep] = useState("shipping");
  const [checkoutData, setCheckoutData] = useState<{
    shipping: ShippingInfo | null;
    payment: PaymentInfo | null;
  }>({
    shipping: null,
    payment: null,
  });
  const items = useCartItems();
  const clearCart = useCartClearCart();
  const router = useRouter();

  useEffect(() => {
    if (items.length === 0) {
      setCurrentStep("shipping");
    }
  }, [items.length]);

  const handleShippingNext = (data: ShippingInfo) => {
    setCheckoutData((prev) => ({ ...prev, shipping: data }));
    setCurrentStep("payment");
  };

  const handlePaymentNext = (data: PaymentInfo) => {
    setCheckoutData((prev) => ({ ...prev, payment: data }));
    setCurrentStep("review");
  };

  const handleReviewComplete = (order: CheckoutOrderResponse) => {
    clearCart();
    router.push(`/checkout/success?orderId=${order.id}`);
  };

  const handleBack = () => {
    if (currentStep === "payment") {
      setCurrentStep("shipping");
    } else if (currentStep === "review") {
      setCurrentStep("payment");
    }
  };

  const handleEditCart = () => {
    router.push("/carrito");
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "shipping":
        return (
          <ShippingStep
            initialData={checkoutData.shipping || undefined}
            onNext={handleShippingNext}
          />
        );
      case "payment":
        return (
          <PaymentStep
            shippingData={checkoutData.shipping as ShippingInfo}
            onNext={handlePaymentNext}
            onBack={handleBack}
          />
        );
      case "review":
        return (
          <ReviewStep
            shippingData={checkoutData.shipping as ShippingInfo}
            paymentData={checkoutData.payment as PaymentInfo}
            items={items}
            onComplete={handleReviewComplete}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {items.length === 0 ? (
          <div className="mx-auto flex max-w-2xl flex-col items-center rounded-[2rem] border border-white/10 bg-white p-10 text-center shadow-sm">
            <div className="mb-4 rounded-full bg-gold-50 p-4 text-gold-600">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-semibold text-gray-900">Tu carrito está vacío</h1>
            <p className="mt-3 max-w-lg text-gray-600">
              Agregá productos antes de continuar al checkout. Así podemos generar un pedido real con tu selección.
            </p>
            <Button asChild className="mt-6 bg-gold-600 hover:bg-gold-700">
              <Link href="/coleccion">Explorar colección</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-light text-gray-900">Checkout</h1>
              <p className="text-gray-600">Completa tu pedido de manera segura</p>
            </div>

            <CheckoutSteps currentStep={currentStep} steps={steps} />

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">{renderCurrentStep()}</div>

              {(currentStep === "shipping" || currentStep === "payment") && (
                <div className="lg:col-span-1">
                  <OrderSummary onEditCart={handleEditCart} />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

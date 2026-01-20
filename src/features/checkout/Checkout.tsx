"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { CheckoutSteps } from "./components/CheckoutSteps";
import { ShippingStep } from "./steps/ShippingStep";
import { PaymentStep } from "./steps/PaymentStep";
import { ReviewStep } from "./steps/ReviewStep";
import { useCartClearCart } from "@/shared/store/cartStore";

const OrderSummary = dynamic(() => import("./components/OrderSummary").then(mod => ({ default: mod.OrderSummary })), { ssr: false });

const steps = [
  { id: "shipping", title: "Envío", description: "Dirección y envío" },
  { id: "payment", title: "Pago", description: "Información de pago" },
  { id: "review", title: "Revisar", description: "Confirmar pedido" },
];

export default function Checkout() {
  const [currentStep, setCurrentStep] = useState("shipping");
  const [checkoutData, setCheckoutData] = useState({
    shipping: null as any,
    payment: null as any,
  });
  const clearCart = useCartClearCart();
  const router = useRouter();

  const handleShippingNext = (data: any) => {
    setCheckoutData(prev => ({ ...prev, shipping: data }));
    setCurrentStep("payment");
  };

  const handlePaymentNext = (data: any) => {
    setCheckoutData(prev => ({ ...prev, payment: data }));
    setCurrentStep("review");
  };

  const handleReviewComplete = () => {
    // In real app, this would submit the order to the backend
    console.log("Order completed:", checkoutData);

    // Clear cart and redirect to success page
    clearCart();
    router.push("/checkout/success");
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
            initialData={checkoutData.shipping}
            onNext={handleShippingNext}
          />
        );
      case "payment":
        return (
          <PaymentStep
            shippingData={checkoutData.shipping}
            onNext={handlePaymentNext}
            onBack={handleBack}
          />
        );
      case "review":
        return (
          <ReviewStep
            shippingData={checkoutData.shipping}
            paymentData={checkoutData.payment}
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Completa tu pedido de manera segura</p>
        </div>

        {/* Progress Steps */}
        <CheckoutSteps currentStep={currentStep} steps={steps} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {renderCurrentStep()}
          </div>

          {/* Order Summary - Only show for shipping and payment steps */}
          {(currentStep === "shipping" || currentStep === "payment") && (
            <div className="lg:col-span-1">
              <OrderSummary onEditCart={handleEditCart} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
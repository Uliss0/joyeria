import { Suspense } from "react";
import { CheckoutSuccessClient } from "./CheckoutSuccessClient";

export const metadata = {
  title: "Confirmación de Pedido | MOKSHA - Joyería Premium",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 text-gray-600">
          Cargando confirmación del pedido...
        </div>
      }
    >
      <CheckoutSuccessClient />
    </Suspense>
  );
}

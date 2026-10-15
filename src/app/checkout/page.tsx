import Checkout from "@/features/checkout/Checkout";

export const metadata = {
  title: "Checkout | MOKSHA - Joyería Premium",
  description: "Completa tu pedido de manera segura en MOKSHA.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutPage() {
  return <Checkout />;
}
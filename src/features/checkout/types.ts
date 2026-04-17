import type { PaymentMethodValue } from "@/lib/orders";

export interface ShippingInfo {
  email: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  saveAddress: boolean;
  shippingMethod: "standard" | "express";
}

export interface PaymentInfo {
  paymentMethod: PaymentMethodValue;
  cardType?: "credit" | "debit";
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  cardholderName?: string;
}

export interface CheckoutItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string;
  variants: Record<string, string>;
  maxStock: number;
}

export interface CheckoutOrderResponse {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  paymentMethod: string | null;
  trackingNumber: string | null;
  createdAt: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: Array<{
    id: string;
    productId: string;
    name: string;
    slug: string;
    image: string | null;
    quantity: number;
    price: number;
  }>;
}

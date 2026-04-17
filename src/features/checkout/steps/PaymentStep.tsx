"use client";

import { useState } from "react";
import { Banknote, CreditCard, HandCoins, Landmark, Lock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { PAYMENT_METHOD_LABELS, type PaymentMethodValue } from "@/lib/orders";
import type { PaymentInfo, ShippingInfo } from "../types";

interface PaymentStepProps {
  shippingData: ShippingInfo;
  onNext: (data: PaymentInfo) => void;
  onBack: () => void;
  className?: string;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear + i);
const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));

const paymentChoices: Array<{
  value: PaymentMethodValue;
  label: string;
  description: string;
  icon: typeof CreditCard;
}> = [
  {
    value: "MERCADO_PAGO",
    label: PAYMENT_METHOD_LABELS.MERCADO_PAGO,
    description: "Cobro online con tu cuenta o tarjeta guardada.",
    icon: Landmark,
  },
  {
    value: "TRANSFERENCIA",
    label: PAYMENT_METHOD_LABELS.TRANSFERENCIA,
    description: "Recibís los datos bancarios al confirmar el pedido.",
    icon: Banknote,
  },
  {
    value: "EFECTIVO",
    label: PAYMENT_METHOD_LABELS.EFECTIVO,
    description: "Coordinamos el pago en efectivo con la entrega o retiro.",
    icon: HandCoins,
  },
  {
    value: "TARJETA",
    label: PAYMENT_METHOD_LABELS.TARJETA,
    description: "Débito o crédito con validación segura.",
    icon: CreditCard,
  },
];

export function PaymentStep({ shippingData, onNext, onBack, className }: PaymentStepProps) {
  const [formData, setFormData] = useState<PaymentInfo>({
    paymentMethod: "TARJETA",
    cardType: "credit",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardholderName: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof PaymentInfo, value: string | boolean) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value } as PaymentInfo;

      if (field === "paymentMethod" && value !== "TARJETA") {
        next.cardType = undefined;
        next.cardNumber = "";
        next.expiryMonth = "";
        next.expiryYear = "";
        next.cvv = "";
        next.cardholderName = "";
      }

      return next;
    });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const formatCardNumber = (value: string) => {
    const normalized = value.replace(/\s+/g, "").replace(/[^0-9]/g, "");
    const match = (normalized.match(/\d{1,16}/g) || [""])[0];
    const chunks = [];

    for (let index = 0; index < match.length; index += 4) {
      chunks.push(match.slice(index, index + 4));
    }

    return chunks.join(" ") || normalized;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "Selecciona un método de pago";
    }

    if (formData.paymentMethod === "TARJETA") {
      if (!formData.cardType) newErrors.cardType = "Selecciona el tipo de tarjeta";
      if (!formData.cardholderName) newErrors.cardholderName = "Nombre del titular es requerido";
      if (!formData.cardNumber) newErrors.cardNumber = "Número de tarjeta es requerido";
      if (!formData.expiryMonth) newErrors.expiryMonth = "Mes es requerido";
      if (!formData.expiryYear) newErrors.expiryYear = "Año es requerido";
      if (!formData.cvv) newErrors.cvv = "CVV es requerido";

      const cardNumberRegex = /^[0-9]{13,19}$/;
      if (formData.cardNumber && !cardNumberRegex.test(formData.cardNumber.replace(/\s/g, ""))) {
        newErrors.cardNumber = "Número de tarjeta inválido";
      }

      if (formData.cvv && !/^[0-9]{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = "CVV inválido";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    if (formatted.replace(/\s/g, "").length <= 19) {
      handleInputChange("cardNumber", formatted);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (validateForm()) {
      onNext(formData);
    }
  };

  return (
    <div className={cn("max-w-2xl mx-auto", className)}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Método de pago</h3>

          <div className="grid gap-4 md:grid-cols-2">
            {paymentChoices.map((choice) => {
              const Icon = choice.icon;

              return (
                <label key={choice.value} className="relative">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={choice.value}
                    checked={formData.paymentMethod === choice.value}
                    onChange={() => handleInputChange("paymentMethod", choice.value)}
                    className="sr-only peer"
                  />
                  <div className="h-full cursor-pointer rounded-2xl border border-gray-200 bg-white p-4 transition-all peer-checked:border-gold-600 peer-checked:bg-gold-50 peer-checked:shadow-md hover:border-gray-300">
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl border border-white/60 bg-white p-2 text-gold-600 shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900">{choice.label}</div>
                        <div className="text-sm leading-5 text-gray-600">{choice.description}</div>
                      </div>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {formData.paymentMethod === "TARJETA" ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Información de la tarjeta</h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="cardType">Tipo de tarjeta *</Label>
                <Select
                  value={formData.cardType || ""}
                  onValueChange={(value) => handleInputChange("cardType", value as "credit" | "debit")}
                >
                  <SelectTrigger className={cn(errors.cardType && "border-red-500")}>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit">Crédito</SelectItem>
                    <SelectItem value="debit">Débito</SelectItem>
                  </SelectContent>
                </Select>
                {errors.cardType && <p className="mt-1 text-sm text-red-600">{errors.cardType}</p>}
              </div>

              <div>
                <Label htmlFor="cardholderName">Nombre del titular *</Label>
                <Input
                  id="cardholderName"
                  value={formData.cardholderName || ""}
                  onChange={(event) => handleInputChange("cardholderName", event.target.value)}
                  className={cn(errors.cardholderName && "border-red-500")}
                  placeholder="Como aparece en la tarjeta"
                />
                {errors.cardholderName && <p className="mt-1 text-sm text-red-600">{errors.cardholderName}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="cardNumber">Número de tarjeta *</Label>
              <Input
                id="cardNumber"
                value={formData.cardNumber || ""}
                onChange={(event) => handleCardNumberChange(event.target.value)}
                className={cn(errors.cardNumber && "border-red-500")}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
              {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="expiryMonth">Mes *</Label>
                <Select
                  value={formData.expiryMonth || ""}
                  onValueChange={(value) => handleInputChange("expiryMonth", value)}
                >
                  <SelectTrigger className={cn(errors.expiryMonth && "border-red-500")}>
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.expiryMonth && <p className="mt-1 text-sm text-red-600">{errors.expiryMonth}</p>}
              </div>

              <div>
                <Label htmlFor="expiryYear">Año *</Label>
                <Select
                  value={formData.expiryYear || ""}
                  onValueChange={(value) => handleInputChange("expiryYear", value)}
                >
                  <SelectTrigger className={cn(errors.expiryYear && "border-red-500")}>
                    <SelectValue placeholder="YYYY" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year.toString()} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.expiryYear && <p className="mt-1 text-sm text-red-600">{errors.expiryYear}</p>}
              </div>

              <div>
                <Label htmlFor="cvv">CVV *</Label>
                <Input
                  id="cvv"
                  type="password"
                  value={formData.cvv || ""}
                  onChange={(event) => handleInputChange("cvv", event.target.value.replace(/\D/g, "").slice(0, 4))}
                  className={cn(errors.cvv && "border-red-500")}
                  placeholder="123"
                  maxLength={4}
                />
                {errors.cvv && <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Instrucciones de pago</h4>
                <p className="text-sm text-gray-600">
                  {formData.paymentMethod === "MERCADO_PAGO" &&
                    "Al confirmar vas a recibir el enlace o la instrucción para completar Mercado Pago."}
                  {formData.paymentMethod === "TRANSFERENCIA" &&
                    "Te mostraremos los datos bancarios para validar el pago por transferencia."}
                  {formData.paymentMethod === "EFECTIVO" &&
                    "Coordinamos el pago en efectivo según el método de entrega elegido."}
                </p>
              </div>
            </div>
          </div>
        )}

        {formData.paymentMethod === "TARJETA" && (
          <div className="flex items-center space-x-2">
            <Checkbox id="saveCard" checked={false} disabled />
            <Label htmlFor="saveCard" className="text-sm text-gray-500">
              La tarjeta no se guarda en este flujo simplificado.
            </Label>
          </div>
        )}

        <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
          <div className="flex items-start space-x-3">
            <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
            <div>
              <h4 className="font-medium text-green-800">Pago seguro</h4>
              <p className="mt-1 text-sm text-green-700">
                Tus datos están protegidos con encriptación SSL. No almacenamos información sensible de tu tarjeta.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={onBack}>
            Volver
          </Button>
          <Button type="submit" className="bg-gold-600 hover:bg-gold-700">
            <Lock className="mr-2 h-4 w-4" />
            Continuar
          </Button>
        </div>
      </form>
    </div>
  );
}

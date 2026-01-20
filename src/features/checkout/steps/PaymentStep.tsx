"use client";

import { useState } from "react";
import { CreditCard, Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface PaymentInfo {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderName: string;
  saveCard: boolean;
  paymentMethod: 'credit_card' | 'debit_card';
}

interface PaymentStepProps {
  shippingData: any;
  onNext: (data: PaymentInfo) => void;
  onBack: () => void;
  className?: string;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear + i);
const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));

export function PaymentStep({ shippingData, onNext, onBack, className }: PaymentStepProps) {
  const [formData, setFormData] = useState<PaymentInfo>({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    saveCard: false,
    paymentMethod: 'credit_card',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cardNumber) newErrors.cardNumber = 'Número de tarjeta es requerido';
    if (!formData.expiryMonth) newErrors.expiryMonth = 'Mes es requerido';
    if (!formData.expiryYear) newErrors.expiryYear = 'Año es requerido';
    if (!formData.cvv) newErrors.cvv = 'CVV es requerido';
    if (!formData.cardholderName) newErrors.cardholderName = 'Nombre del titular es requerido';

    // Card number validation (basic)
    const cardNumberRegex = /^[0-9]{13,19}$/;
    if (formData.cardNumber && !cardNumberRegex.test(formData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Número de tarjeta inválido';
    }

    // CVV validation
    if (formData.cvv && !/^[0-9]{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'CVV inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext(formData);
    }
  };

  const handleInputChange = (field: keyof PaymentInfo, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    if (formatted.replace(/\s/g, '').length <= 19) {
      handleInputChange('cardNumber', formatted);
    }
  };

  return (
    <div className={cn("max-w-2xl mx-auto", className)}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Method Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Método de pago</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="relative">
              <input
                type="radio"
                name="paymentMethod"
                value="credit_card"
                checked={formData.paymentMethod === 'credit_card'}
                onChange={() => handleInputChange('paymentMethod', 'credit_card')}
                className="sr-only peer"
              />
              <div className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer peer-checked:border-gold-600 peer-checked:bg-gold-50 hover:border-gray-300 transition-colors">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-6 h-6 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Tarjeta de crédito</div>
                    <div className="text-sm text-gray-600">Visa, Mastercard, American Express</div>
                  </div>
                </div>
              </div>
            </label>

            <label className="relative">
              <input
                type="radio"
                name="paymentMethod"
                value="debit_card"
                checked={formData.paymentMethod === 'debit_card'}
                onChange={() => handleInputChange('paymentMethod', 'debit_card')}
                className="sr-only peer"
              />
              <div className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer peer-checked:border-gold-600 peer-checked:bg-gold-50 hover:border-gray-300 transition-colors">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-6 h-6 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Tarjeta de débito</div>
                    <div className="text-sm text-gray-600">Visa Débito, Mastercard Débito</div>
                  </div>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Card Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Información de la tarjeta</h3>

          <div>
            <Label htmlFor="cardholderName">Nombre del titular *</Label>
            <Input
              id="cardholderName"
              value={formData.cardholderName}
              onChange={(e) => handleInputChange('cardholderName', e.target.value)}
              className={cn(errors.cardholderName && "border-red-500")}
              placeholder="Como aparece en la tarjeta"
            />
            {errors.cardholderName && <p className="text-sm text-red-600 mt-1">{errors.cardholderName}</p>}
          </div>

          <div>
            <Label htmlFor="cardNumber">Número de tarjeta *</Label>
            <Input
              id="cardNumber"
              value={formData.cardNumber}
              onChange={(e) => handleCardNumberChange(e.target.value)}
              className={cn(errors.cardNumber && "border-red-500")}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
            />
            {errors.cardNumber && <p className="text-sm text-red-600 mt-1">{errors.cardNumber}</p>}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="expiryMonth">Mes *</Label>
              <Select value={formData.expiryMonth} onValueChange={(value) => handleInputChange('expiryMonth', value)}>
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
              {errors.expiryMonth && <p className="text-sm text-red-600 mt-1">{errors.expiryMonth}</p>}
            </div>

            <div>
              <Label htmlFor="expiryYear">Año *</Label>
              <Select value={formData.expiryYear} onValueChange={(value) => handleInputChange('expiryYear', value)}>
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
              {errors.expiryYear && <p className="text-sm text-red-600 mt-1">{errors.expiryYear}</p>}
            </div>

            <div>
              <Label htmlFor="cvv">CVV *</Label>
              <Input
                id="cvv"
                type="password"
                value={formData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                className={cn(errors.cvv && "border-red-500")}
                placeholder="123"
                maxLength={4}
              />
              {errors.cvv && <p className="text-sm text-red-600 mt-1">{errors.cvv}</p>}
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-800">Pago seguro</h4>
              <p className="text-sm text-green-700 mt-1">
                Tus datos están protegidos con encriptación SSL de 256 bits.
                No guardamos información de tu tarjeta.
              </p>
            </div>
          </div>
        </div>

        {/* Save Card Option */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="saveCard"
            checked={formData.saveCard}
            onCheckedChange={(checked) => handleInputChange('saveCard', !!checked)}
          />
          <Label htmlFor="saveCard" className="text-sm">
            Guardar esta tarjeta para futuras compras
          </Label>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={onBack}>
            Volver
          </Button>
          <Button type="submit" className="bg-gold-600 hover:bg-gold-700">
            <Lock className="w-4 h-4 mr-2" />
            Completar compra
          </Button>
        </div>
      </form>
    </div>
  );
}
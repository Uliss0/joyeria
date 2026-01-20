"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface ShippingInfo {
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
  shippingMethod: 'standard' | 'express';
}

interface ShippingStepProps {
  initialData?: Partial<ShippingInfo>;
  onNext: (data: ShippingInfo) => void;
  onBack?: () => void;
  className?: string;
}

const states = [
  'Buenos Aires', 'Córdoba', 'Santa Fe', 'Mendoza', 'Tucumán',
  'Entre Ríos', 'Salta', 'Chaco', 'Corrientes', 'Misiones',
  'San Juan', 'Jujuy', 'Río Negro', 'Formosa', 'Neuquén',
  'Chubut', 'San Luis', 'Catamarca', 'La Rioja', 'La Pampa',
  'Santa Cruz', 'Santiago del Estero', 'Tierra del Fuego'
];

export function ShippingStep({ initialData, onNext, onBack, className }: ShippingStepProps) {
  const [formData, setFormData] = useState<ShippingInfo>({
    email: initialData?.email || '',
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    address1: initialData?.address1 || '',
    address2: initialData?.address2 || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    zipCode: initialData?.zipCode || '',
    phone: initialData?.phone || '',
    saveAddress: initialData?.saveAddress || false,
    shippingMethod: initialData?.shippingMethod || 'standard',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = 'Email es requerido';
    if (!formData.firstName) newErrors.firstName = 'Nombre es requerido';
    if (!formData.lastName) newErrors.lastName = 'Apellido es requerido';
    if (!formData.address1) newErrors.address1 = 'Dirección es requerida';
    if (!formData.city) newErrors.city = 'Ciudad es requerida';
    if (!formData.state) newErrors.state = 'Provincia es requerida';
    if (!formData.zipCode) newErrors.zipCode = 'Código postal es requerido';
    if (!formData.phone) newErrors.phone = 'Teléfono es requerido';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
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

  const handleInputChange = (field: keyof ShippingInfo, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className={cn("max-w-2xl mx-auto", className)}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Información de contacto</h3>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={cn(errors.email && "border-red-500")}
              placeholder="tu@email.com"
            />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Dirección de envío</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Nombre *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={cn(errors.firstName && "border-red-500")}
              />
              {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>}
            </div>

            <div>
              <Label htmlFor="lastName">Apellido *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={cn(errors.lastName && "border-red-500")}
              />
              {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="address1">Dirección *</Label>
            <Input
              id="address1"
              value={formData.address1}
              onChange={(e) => handleInputChange('address1', e.target.value)}
              className={cn(errors.address1 && "border-red-500")}
              placeholder="Calle y número"
            />
            {errors.address1 && <p className="text-sm text-red-600 mt-1">{errors.address1}</p>}
          </div>

          <div>
            <Label htmlFor="address2">Apartamento, piso, etc. (opcional)</Label>
            <Input
              id="address2"
              value={formData.address2}
              onChange={(e) => handleInputChange('address2', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">Ciudad *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className={cn(errors.city && "border-red-500")}
              />
              {errors.city && <p className="text-sm text-red-600 mt-1">{errors.city}</p>}
            </div>

            <div>
              <Label htmlFor="state">Provincia *</Label>
              <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                <SelectTrigger className={cn(errors.state && "border-red-500")}>
                  <SelectValue placeholder="Seleccionar provincia" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state && <p className="text-sm text-red-600 mt-1">{errors.state}</p>}
            </div>

            <div>
              <Label htmlFor="zipCode">Código postal *</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                className={cn(errors.zipCode && "border-red-500")}
              />
              {errors.zipCode && <p className="text-sm text-red-600 mt-1">{errors.zipCode}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Teléfono *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={cn(errors.phone && "border-red-500")}
              placeholder="+54 11 1234-5678"
            />
            {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
          </div>
        </div>

        {/* Shipping Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Método de envío</h3>

          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="shipping"
                value="standard"
                checked={formData.shippingMethod === 'standard'}
                onChange={() => handleInputChange('shippingMethod', 'standard')}
                className="text-gold-600 focus:ring-gold-500"
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-medium">Envío estándar</span>
                  <span className="font-medium">$5.000</span>
                </div>
                <p className="text-sm text-gray-600">5-7 días hábiles</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="shipping"
                value="express"
                checked={formData.shippingMethod === 'express'}
                onChange={() => handleInputChange('shippingMethod', 'express')}
                className="text-gold-600 focus:ring-gold-500"
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-medium">Envío express</span>
                  <span className="font-medium">$12.000</span>
                </div>
                <p className="text-sm text-gray-600">2-3 días hábiles</p>
              </div>
            </label>
          </div>
        </div>

        {/* Save Address */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="saveAddress"
            checked={formData.saveAddress}
            onCheckedChange={(checked) => handleInputChange('saveAddress', !!checked)}
          />
          <Label htmlFor="saveAddress" className="text-sm">
            Guardar esta dirección para futuras compras
          </Label>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          {onBack && (
            <Button type="button" variant="outline" onClick={onBack}>
              Volver al carrito
            </Button>
          )}
          <Button type="submit" className="bg-gold-600 hover:bg-gold-700 ml-auto">
            Continuar al pago
          </Button>
        </div>
      </form>
    </div>
  );
}
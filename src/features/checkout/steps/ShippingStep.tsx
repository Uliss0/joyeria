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
    <div className={cn("max-w-2xl mx-auto bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm text-foreground", className)}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-serif font-semibold text-foreground border-b border-border/50 pb-2">Información de contacto</h3>

          <div>
            <Label htmlFor="email" className="text-foreground font-medium text-sm">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={cn("mt-1.5", errors.email && "border-red-500")}
              placeholder="tu@email.com"
            />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="space-y-4">
          <h3 className="text-lg font-serif font-semibold text-foreground border-b border-border/50 pb-2">Dirección de envío</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-foreground font-medium text-sm">Nombre *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={cn("mt-1.5", errors.firstName && "border-red-500")}
              />
              {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>}
            </div>

            <div>
              <Label htmlFor="lastName" className="text-foreground font-medium text-sm">Apellido *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={cn("mt-1.5", errors.lastName && "border-red-500")}
              />
              {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="address1" className="text-foreground font-medium text-sm">Dirección *</Label>
            <Input
              id="address1"
              value={formData.address1}
              onChange={(e) => handleInputChange('address1', e.target.value)}
              className={cn("mt-1.5", errors.address1 && "border-red-500")}
              placeholder="Calle y número"
            />
            {errors.address1 && <p className="text-sm text-red-600 mt-1">{errors.address1}</p>}
          </div>

          <div>
            <Label htmlFor="address2" className="text-foreground font-medium text-sm">Apartamento, piso, etc. (opcional)</Label>
            <Input
              id="address2"
              value={formData.address2}
              onChange={(e) => handleInputChange('address2', e.target.value)}
              className="mt-1.5"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city" className="text-foreground font-medium text-sm">Ciudad *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className={cn("mt-1.5", errors.city && "border-red-500")}
              />
              {errors.city && <p className="text-sm text-red-600 mt-1">{errors.city}</p>}
            </div>

            <div>
              <Label htmlFor="state" className="text-foreground font-medium text-sm">Provincia *</Label>
              <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                <SelectTrigger className={cn("mt-1.5", errors.state && "border-red-500")}>
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
              <Label htmlFor="zipCode" className="text-foreground font-medium text-sm">Código postal *</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                className={cn("mt-1.5", errors.zipCode && "border-red-500")}
              />
              {errors.zipCode && <p className="text-sm text-red-600 mt-1">{errors.zipCode}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="phone" className="text-foreground font-medium text-sm">Teléfono *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={cn("mt-1.5", errors.phone && "border-red-500")}
              placeholder="+54 2915666668"
            />
            {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
          </div>
        </div>

        {/* Shipping Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-serif font-semibold text-foreground border-b border-border/50 pb-2">Método de envío</h3>

          <div className="space-y-3">
            <label className={cn(
              "flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer",
              formData.shippingMethod === 'standard'
                ? "bg-gold-500/10 border-gold-500 shadow-sm"
                : "bg-background/60 border-border hover:border-border/80"
            )}>
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
                  <span className="font-medium text-foreground">Envío estándar</span>
                  <span className="font-medium text-foreground">$5.000</span>
                </div>
                <p className="text-sm text-muted-foreground">5-7 días hábiles</p>
              </div>
            </label>

            <label className={cn(
              "flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer",
              formData.shippingMethod === 'express'
                ? "bg-gold-500/10 border-gold-500 shadow-sm"
                : "bg-background/60 border-border hover:border-border/80"
            )}>
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
                  <span className="font-medium text-foreground">Envío express</span>
                  <span className="font-medium text-foreground">$12.000</span>
                </div>
                <p className="text-sm text-muted-foreground">2-3 días hábiles</p>
              </div>
            </label>
          </div>
        </div>

        {/* Save Address */}
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="saveAddress"
            checked={formData.saveAddress}
            onCheckedChange={(checked) => handleInputChange('saveAddress', !!checked)}
          />
          <Label htmlFor="saveAddress" className="text-sm text-foreground cursor-pointer">
            Guardar esta dirección para futuras compras
          </Label>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t border-border">
          {onBack && (
            <Button type="button" variant="outline" onClick={onBack} className="border-border text-foreground hover:bg-muted cursor-pointer">
              Volver al carrito
            </Button>
          )}
          <Button type="submit" className="btn-gold text-white ml-auto cursor-pointer">
            Continuar al pago
          </Button>
        </div>
      </form>
    </div>
  );
}
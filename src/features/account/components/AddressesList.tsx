"use client";

import { useState, useEffect } from "react";
import { MapPin, Edit, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Address {
  id: string;
  type: 'shipping' | 'billing';
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

// Mock data - replace with API call
const mockAddresses: Address[] = [
  {
    id: '1',
    type: 'shipping',
    firstName: 'Juan',
    lastName: 'Pérez',
    address1: 'Av. Corrientes 1234',
    address2: 'Piso 5, Depto 2B',
    city: 'Buenos Aires',
    state: 'Buenos Aires',
    zipCode: 'C1000',
    country: 'Argentina',
    phone: '+54 11 1234-5678',
    isDefault: true,
  },
  {
    id: '2',
    type: 'billing',
    firstName: 'Juan',
    lastName: 'Pérez',
    address1: 'Av. Corrientes 1234',
    address2: 'Piso 5, Depto 2B',
    city: 'Buenos Aires',
    state: 'Buenos Aires',
    zipCode: 'C1000',
    country: 'Argentina',
    phone: '+54 11 1234-5678',
    isDefault: true,
  },
];

export function AddressesList() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchAddresses = async () => {
      setLoading(true);
      // In real app: await fetch('/api/addresses')
      setTimeout(() => {
        setAddresses(mockAddresses);
        setLoading(false);
      }, 1000);
    };

    fetchAddresses();
  }, []);

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta dirección?')) {
      return;
    }

    try {
      // In real app: await fetch(`/api/addresses/${addressId}`, { method: 'DELETE' })
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
    } catch (error) {
      alert('Error al eliminar la dirección');
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      // In real app: await fetch(`/api/addresses/${addressId}/set-default`, { method: 'PUT' })
      setAddresses(prev =>
        prev.map(addr => ({
          ...addr,
          isDefault: addr.id === addressId,
        }))
      );
    } catch (error) {
      alert('Error al establecer dirección por defecto');
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="animate-pulse space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No tienes direcciones guardadas
        </h3>
        <p className="text-gray-600 mb-6">
          Agrega tu primera dirección para facilitar tus futuras compras.
        </p>
        <Button className="bg-gold-600 hover:bg-gold-700">
          Agregar Dirección
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {addresses.map((address) => (
        <div key={address.id} className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2">
              <Badge
                variant={address.type === 'shipping' ? 'default' : 'secondary'}
                className={cn(
                  address.type === 'shipping'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-purple-100 text-purple-800'
                )}
              >
                {address.type === 'shipping' ? 'Envío' : 'Facturación'}
              </Badge>
              {address.isDefault && (
                <Badge className="bg-gold-100 text-gold-800 flex items-center space-x-1">
                  <Star className="w-3 h-3" />
                  <span>Predeterminada</span>
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteAddress(address.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <p className="font-medium text-gray-900">
              {address.firstName} {address.lastName}
            </p>
            <p>{address.address1}</p>
            {address.address2 && <p>{address.address2}</p>}
            <p>
              {address.city}, {address.state} {address.zipCode}
            </p>
            <p>{address.country}</p>
            {address.phone && <p>Tel: {address.phone}</p>}
          </div>

          {!address.isDefault && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSetDefault(address.id)}
                className="w-full"
              >
                Establecer como predeterminada
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
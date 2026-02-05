"use client";

import { useEffect, useState, type FormEvent } from "react";
import { MapPin, Edit, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type AddressType = "shipping" | "billing";

interface Address {
  id: string;
  type: AddressType;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

interface AddressForm {
  type: AddressType;
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

const initialFormState: AddressForm = {
  type: "shipping",
  firstName: "",
  lastName: "",
  company: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  zipCode: "",
  country: "Argentina",
  phone: "",
  isDefault: false,
};

const requiredFields: Array<keyof AddressForm> = [
  "firstName",
  "lastName",
  "address1",
  "city",
  "state",
  "zipCode",
  "country",
];

export function AddressesList() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<AddressForm>(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setListError(null);
      const res = await fetch("/api/addresses", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Error al cargar las direcciones");
      }
      const data = await res.json();
      setAddresses(Array.isArray(data?.addresses) ? data.addresses : []);
    } catch (error) {
      console.error(error);
      setListError("No pudimos cargar tus direcciones. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const openModal = () => {
    setFormData(initialFormState);
    setFormErrors({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (address: Address) => {
    setFormData({
      type: address.type,
      firstName: address.firstName,
      lastName: address.lastName,
      company: address.company ?? "",
      address1: address.address1,
      address2: address.address2 ?? "",
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone ?? "",
      isDefault: address.isDefault,
    });
    setFormErrors({});
    setEditingId(address.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setIsModalOpen(false);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    requiredFields.forEach((field) => {
      const value = formData[field];
      if (typeof value === "string" && !value.trim()) {
        errors[field] = "Este campo es obligatorio";
      }
    });
    return errors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(editingId ? `/api/addresses/${editingId}` : "/api/addresses", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formData.type,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          company: formData.company.trim() || undefined,
          address1: formData.address1.trim(),
          address2: formData.address2.trim() || undefined,
          city: formData.city.trim(),
          state: formData.state.trim(),
          zipCode: formData.zipCode.trim(),
          country: formData.country.trim(),
          phone: formData.phone.trim() || undefined,
          isDefault: formData.isDefault,
        }),
      });

      if (!res.ok) {
        throw new Error("Error al guardar la dirección");
      }

      setIsModalOpen(false);
      setFormData(initialFormState);
      setEditingId(null);
      await fetchAddresses();
    } catch (error) {
      console.error(error);
      alert("No se pudo guardar la dirección. Intenta nuevamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta dirección?")) {
      return;
    }

    try {
      const res = await fetch(`/api/addresses/${addressId}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Error al eliminar la dirección");
      }
      await fetchAddresses();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar la dirección");
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      const res = await fetch(`/api/addresses/${addressId}/set-default`, {
        method: "PUT",
      });
      if (!res.ok) {
        throw new Error("Error al establecer dirección por defecto");
      }
      await fetchAddresses();
    } catch (error) {
      console.error(error);
      alert("Error al establecer dirección por defecto");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Direcciones</h1>
          <p className="text-gray-600 mt-1">
            Gestiona tus direcciones de envío y facturación.
          </p>
        </div>
        <Button className="btn-gold" onClick={openModal}>
          Agregar Dirección
        </Button>
      </div>

      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
      >
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar dirección" : "Agregar dirección"}</DialogTitle>
            <DialogDescription>
              {editingId
                ? "Actualiza los datos y guarda los cambios."
                : "Completa los datos para guardar una nueva dirección."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, type: value as AddressType }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="shipping">Envío</SelectItem>
                    <SelectItem value="billing">Facturación</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre *</Label>
                <Input
                  id="firstName"
                  className="bg-white"
                  value={formData.firstName}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, firstName: event.target.value }))
                  }
                />
                {formErrors.firstName && (
                  <p className="text-sm text-red-600">{formErrors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido *</Label>
                <Input
                  id="lastName"
                  className="bg-white"
                  value={formData.lastName}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, lastName: event.target.value }))
                  }
                />
                {formErrors.lastName && (
                  <p className="text-sm text-red-600">{formErrors.lastName}</p>
                )}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="company">Empresa</Label>
                <Input
                  id="company"
                  className="bg-white"
                  value={formData.company}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, company: event.target.value }))
                  }
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address1">Dirección *</Label>
                <Input
                  id="address1"
                  className="bg-white"
                  value={formData.address1}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, address1: event.target.value }))
                  }
                />
                {formErrors.address1 && (
                  <p className="text-sm text-red-600">{formErrors.address1}</p>
                )}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address2">Apartamento, piso, etc.</Label>
                <Input
                  id="address2"
                  className="bg-white"
                  value={formData.address2}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, address2: event.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Ciudad *</Label>
                <Input
                  id="city"
                  className="bg-white"
                  value={formData.city}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, city: event.target.value }))
                  }
                />
                {formErrors.city && <p className="text-sm text-red-600">{formErrors.city}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">Provincia / Estado *</Label>
                <Input
                  id="state"
                  className="bg-white"
                  value={formData.state}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, state: event.target.value }))
                  }
                />
                {formErrors.state && <p className="text-sm text-red-600">{formErrors.state}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">Código Postal *</Label>
                <Input
                  id="zipCode"
                  className="bg-white"
                  value={formData.zipCode}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, zipCode: event.target.value }))
                  }
                />
                {formErrors.zipCode && (
                  <p className="text-sm text-red-600">{formErrors.zipCode}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">País *</Label>
                <Input
                  id="country"
                  className="bg-white"
                  value={formData.country}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, country: event.target.value }))
                  }
                />
                {formErrors.country && (
                  <p className="text-sm text-red-600">{formErrors.country}</p>
                )}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  className="bg-white"
                  value={formData.phone}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, phone: event.target.value }))
                  }
                />
              </div>

              <div className="flex items-center gap-2 sm:col-span-2">
                <Checkbox
                  id="isDefault"
                  checked={formData.isDefault}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isDefault: Boolean(checked) }))
                  }
                />
                <Label htmlFor="isDefault">Marcar como predeterminada</Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeModal} disabled={saving}>
                Cancelar
              </Button>
              <Button type="submit" className="btn-gold" disabled={saving}>
                {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Guardar dirección"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {listError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          {listError}
        </div>
      )}

      {loading ? (
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
      ) : addresses.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tienes direcciones guardadas
          </h3>
          <p className="text-gray-600 mb-6">
            Agrega tu primera dirección para facilitar tus futuras compras.
          </p>
          <Button className="btn-gold" onClick={openModal}>
            Agregar Dirección
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div key={address.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={address.type === "shipping" ? "default" : "secondary"}
                    className={cn(
                      address.type === "shipping"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    )}
                  >
                    {address.type === "shipping" ? "Envío" : "Facturación"}
                  </Badge>
                  {address.isDefault && (
                    <Badge className="bg-gold-100 text-gold-800 flex items-center space-x-1">
                      <Star className="w-3 h-3" />
                      <span>Predeterminada</span>
                    </Badge>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => openEditModal(address)}>
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
                {address.company && <p>{address.company}</p>}
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
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Category = { id: string; name: string };

type ProductForm = {
  name: string;
  categoryId: string;
  price: string;
  compareAtPrice: string;
  quantity: string;
  gender: string;
  metal: string;
  description: string;
  isActive: boolean;
};

export default function AdminEditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const productId = params?.id;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>({
    name: "",
    categoryId: "",
    price: "",
    compareAtPrice: "",
    quantity: "",
    gender: "",
    metal: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!productId) return;

        const [productRes, categoryRes] = await Promise.all([
          fetch(`/api/admin/products/${productId}`, { credentials: "include" }),
          fetch("/api/admin/categories", { credentials: "include" }),
        ]);

        if (!productRes.ok) {
          const err = await productRes.json().catch(() => null);
          throw new Error(err?.message || "Error al cargar producto");
        }

        const product = await productRes.json();
        const categoriesData = categoryRes.ok ? await categoryRes.json() : [];

        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setForm({
          name: product.name || "",
          categoryId: product.categoryId || "",
          price: product.price ? String(product.price) : "",
          compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : "",
          quantity: product.stock ? String(product.stock) : "0",
          gender: product.gender || "",
          metal: product.material || "",
          description: product.description || "",
          isActive: product.isActive !== false,
        });
      } catch (err: any) {
        setError(err.message || "Error al cargar producto");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Error al guardar");
      }

      router.push("/admin/products");
    } catch (err: any) {
      setError(err.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm("Â¿Eliminar este producto? Esta acciÃ³n no se puede deshacer.");
    if (!ok) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Error al eliminar");
      }
      router.push("/admin/products");
    } catch (err: any) {
      setError(err.message || "Error al eliminar");
    } finally {
      setSaving(false);
    }
  };

  if (!productId) return <div className="container mx-auto py-8">Cargando...</div>;
  if (loading) return <div className="container mx-auto py-8">Cargando...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Editar producto</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm font-medium">Nombre</label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>

        <div>
          <label className="block text-sm font-medium">CategorÃ­a</label>
          <select
            className="w-full border rounded p-2"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          >
            <option value="">-- Seleccionar --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Precio</label>
          <Input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        </div>

        <div>
          <label className="block text-sm font-medium">Precio anterior (opcional)</label>
          <Input
            value={form.compareAtPrice}
            onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })}
            placeholder="Ej: 120000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Cantidad</label>
          <Input value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
        </div>

        <div>
          <label className="block text-sm font-medium">Genero</label>
          <select
            className="w-full border rounded p-2"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option value="">-- Seleccionar --</option>
            <option value="Hombre">Hombre</option>
            <option value="Mujer">Mujer</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Tipo de metal</label>
          <Input value={form.metal} onChange={(e) => setForm({ ...form, metal: e.target.value })} />
        </div>

        <div>
          <label className="block text-sm font-medium">DescripciÃ³n</label>
          <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>

        <div className="flex items-center space-x-2">
          <input
            id="active"
            type="checkbox"
            className="h-4 w-4"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
          <label htmlFor="active" className="text-sm">Producto activo</label>
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <div className="flex items-center space-x-3">
          <Button type="submit" disabled={saving}>{saving ? "Guardando..." : "Guardar cambios"}</Button>
          <Button type="button" variant="destructive" disabled={saving} onClick={handleDelete}>
            Eliminar producto
          </Button>
        </div>
      </form>
    </div>
  );
}

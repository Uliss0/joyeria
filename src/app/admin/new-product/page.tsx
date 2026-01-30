"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    price: "",
    quantity: "",
    sizes: "",
    metal: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/admin/categories", { credentials: "include" });
        if (!res.ok) {
          setCategories([]);
          return;
        }
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch {
        setCategories([]);
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageFile]);

  async function seedCategories() {
    setError(null);
    try {
      const res = await fetch("/api/admin/categories/seed", { method: "POST", credentials: "include" });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Error al crear categorías");
      }
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Error al crear categorías");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!imageFile) return setError("Seleccione una imagen");
    setLoading(true);

    try {
      // Convert image to base64
      const reader = new FileReader();
      const file = imageFile;
      const dataUrl: string = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const payload = {
        ...form,
        price: form.price,
        imageDataUrl: dataUrl,
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Error al crear producto");
      }

      router.push("/coleccion");
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Cargar nuevo producto</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm font-medium">Nombre</label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>

        <div>
          <label className="block text-sm font-medium">Categoría</label>
          {categories.length === 0 ? (
            <div className="flex items-center space-x-4 mt-2">
              <p className="text-sm text-gray-500">No hay categorías. Podés crear categorías de ejemplo.</p>
              <Button onClick={seedCategories}>Crear categorías de ejemplo</Button>
            </div>
          ) : (
            <select className="w-full border rounded p-2" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              <option value="">-- Seleccionar --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Precio</label>
          <Input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        </div>

        <div>
          <label className="block text-sm font-medium">Cantidad</label>
          <Input value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
        </div>

        <div>
          <label className="block text-sm font-medium">Talles (coma separados)</label>
          <Input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} />
        </div>

        <div>
          <label className="block text-sm font-medium">Tipo de metal</label>
          <Input value={form.metal} onChange={(e) => setForm({ ...form, metal: e.target.value })} />
        </div>

        <div>
          <label className="block text-sm font-medium">Descripción</label>
          <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>

        <div>
          <label className="block text-sm font-medium">Imagen</label>
          <div className="mt-2 flex items-center space-x-4">
            <label className="inline-flex items-center px-3 py-2 bg-gray-100 border rounded cursor-pointer">
              <input type="file" className="hidden" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
              <span className="text-sm">Seleccionar imagen</span>
            </label>
            {previewUrl ? (
              <div className="flex items-center space-x-2">
                <img src={previewUrl} alt="preview" className="w-24 h-24 object-cover rounded border" />
                <Button variant="ghost" onClick={() => setImageFile(null)}>Eliminar</Button>
              </div>
            ) : (
              <div className="w-24 h-24 bg-gray-100 border rounded flex items-center justify-center text-sm text-gray-500">Previsualización</div>
            )}
          </div>
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <div>
          <Button type="submit" disabled={loading}>{loading ? "Subiendo..." : "Crear producto"}</Button>
        </div>
      </form>
    </div>
  );
}

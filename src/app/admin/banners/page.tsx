"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Banner = {
  id: string;
  imageUrl: string;
  linkUrl?: string | null;
  createdAt: string;
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBanners = async () => {
    try {
      const res = await fetch("/api/admin/banners", { credentials: "include" });
      if (!res.ok) throw new Error("No se pudieron cargar los banners");
      const data = await res.json();
      setBanners(Array.isArray(data?.banners) ? data.banners : []);
    } catch (err: any) {
      setError(err.message || "Error al cargar banners");
    }
  };

  useEffect(() => {
    loadBanners();
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!imageFile) return setError("Seleccione una imagen");
    setLoading(true);

    try {
      const reader = new FileReader();
      const dataUrl: string = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });

      const res = await fetch("/api/admin/banners", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageDataUrl: dataUrl,
          linkUrl,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Error al crear banner");
      }

      setImageFile(null);
      setLinkUrl("");
      await loadBanners();
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setError(null);
    try {
      const res = await fetch(`/api/admin/banners/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Error al eliminar banner");
      }
      setBanners((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      setError(err.message || "Error al eliminar banner");
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Gestionar banners</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm font-medium">Link (opcional)</label>
          <Input
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Imagen</label>
          <div className="mt-2 flex items-center space-x-4">
            <label className="inline-flex items-center px-3 py-2 bg-gray-100 border rounded cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              />
              <span className="text-sm">Seleccionar imagen</span>
            </label>
            {previewUrl ? (
              <div className="flex items-center space-x-2">
                <img src={previewUrl} alt="preview" className="w-24 h-24 object-cover rounded border" />
                <Button variant="ghost" onClick={() => setImageFile(null)}>Eliminar</Button>
              </div>
            ) : (
              <div className="w-24 h-24 bg-gray-100 border rounded flex items-center justify-center text-sm text-gray-500">
                Previsualización
              </div>
            )}
          </div>
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <div>
          <Button type="submit" disabled={loading}>
            {loading ? "Subiendo..." : "Crear banner"}
          </Button>
        </div>
      </form>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Banners existentes</h2>
        {banners.length === 0 ? (
          <p className="text-gray-500">No hay banners cargados.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banners.map((banner) => (
              <div key={banner.id} className="border rounded p-4 flex flex-col gap-3">
                <img src={banner.imageUrl} alt="Banner" className="w-full h-48 object-cover rounded" />
                {banner.linkUrl && (
                  <p className="text-sm text-gray-700 truncate">Link: {banner.linkUrl}</p>
                )}
                <Button variant="destructive" onClick={() => handleDelete(banner.id)}>
                  Eliminar
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { GalleryVerticalEnd, ImagePlus, Link2, Wand2 } from "lucide-react";
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
    void loadBanners();
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
    if (!imageFile) {
      setError("Seleccione una imagen");
      return;
    }

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
      setBanners((prev) => prev.filter((banner) => banner.id !== id));
    } catch (err: any) {
      setError(err.message || "Error al eliminar banner");
    }
  }

  return (
    <div className="admin-shell min-h-screen">
      <div className="container mx-auto px-4 py-10 md:px-6">
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="admin-panel rounded-[2rem] px-6 py-8 md:px-8">
            <div className="border-b border-white/10 pb-8">
              <p className="admin-kicker mb-3">Subir banner</p>
              <h1 className="admin-title text-4xl font-light md:text-5xl">Banners con presencia de campana</h1>
              <p className="admin-muted mt-4 max-w-xl text-sm md:text-base">
                Esta pantalla ahora prioriza visualizacion, linkeo y una carga mas prolija para cada promocion.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="admin-panel-soft rounded-[1.75rem] p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-full border border-white/10 bg-white/5 p-2 text-gold-600">
                    <Link2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Destino del banner</h2>
                    <p className="admin-muted text-sm">Opcional, pero ideal para campanas o colecciones.</p>
                  </div>
                </div>

                <label className="mb-2 block text-sm font-medium text-white/90">Link</label>
                <Input className="admin-input" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." />
              </div>

              <div className="admin-panel-soft rounded-[1.75rem] p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-full border border-white/10 bg-white/5 p-2 text-gold-600">
                    <ImagePlus className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Pieza visual</h2>
                    <p className="admin-muted text-sm">Cargamos la imagen principal del carrusel.</p>
                  </div>
                </div>

                <label className="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-white/20 bg-black/20 p-6 text-center transition hover:border-gold-600/60">
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
                  {previewUrl ? (
                    <img src={previewUrl} alt="preview" className="max-h-44 rounded-2xl object-cover" />
                  ) : (
                    <>
                      <Wand2 className="h-8 w-8 text-gold-600" />
                      <p className="mt-4 text-sm font-medium text-white">Seleccionar imagen</p>
                      <p className="mt-2 max-w-xs text-sm text-white/55">
                        Arranca con un visual limpio y con buen contraste para que el home gane impacto.
                      </p>
                    </>
                  )}
                </label>

                {previewUrl ? (
                  <Button type="button" variant="ghost" className="mt-4 text-white/75 hover:bg-white/5 hover:text-white" onClick={() => setImageFile(null)}>
                    Quitar imagen
                  </Button>
                ) : null}
              </div>

              {error && <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div>}

              <Button type="submit" disabled={loading} className="bg-gold-600 text-white hover:bg-gold-700">
                {loading ? "Subiendo..." : "Crear banner"}
              </Button>
            </form>
          </section>

          <section className="admin-panel rounded-[2rem] px-6 py-8 md:px-8">
            <div className="mb-8 flex items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <p className="admin-kicker mb-3">Galeria actual</p>
                <h2 className="text-2xl font-semibold text-white">Banners existentes</h2>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 p-3 text-gold-600">
                <GalleryVerticalEnd className="h-5 w-5" />
              </div>
            </div>

            {banners.length === 0 ? (
              <div className="admin-panel-soft rounded-[1.75rem] px-6 py-14 text-center">
                <p className="admin-kicker mb-3">Sin banners</p>
                <p className="text-lg text-white">Todavia no hay piezas cargadas para el carrusel.</p>
                <p className="admin-muted mt-2 text-sm">
                  Cuando subas el primero, lo vas a poder revisar y eliminar desde esta misma vista.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {banners.map((banner, index) => (
                  <article key={banner.id} className="admin-panel-soft overflow-hidden rounded-[1.75rem] border border-white/8">
                    <div className="relative">
                      <img src={banner.imageUrl} alt="Banner" className="h-56 w-full object-cover" />
                      <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-white/80 backdrop-blur">
                        Banner {index + 1}
                      </span>
                    </div>

                    <div className="space-y-4 p-5">
                      <div>
                        <p className="admin-kicker">Destino</p>
                        <p className="mt-2 truncate text-sm text-white/80">{banner.linkUrl || "Sin link asignado"}</p>
                      </div>

                      <Button variant="destructive" className="w-full" onClick={() => handleDelete(banner.id)}>
                        Eliminar
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

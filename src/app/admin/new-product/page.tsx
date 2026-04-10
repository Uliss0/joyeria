"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Layers3, Package, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    price: "",
    compareAtPrice: "",
    quantity: "",
    sizes: "",
    gender: "",
    metal: "",
    themes: "",
    description: "",
    backgroundType: "none",
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

    void loadCategories();
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
      const res = await fetch("/api/admin/categories/seed", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Error al crear categorias");
      }
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Error al crear categorias");
    }
  }

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

      router.push("/admin/products");
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  const selectedCategory = categories.find((category) => category.id === form.categoryId)?.name;

  return (
    <div className="admin-shell min-h-screen">
      <div className="container mx-auto px-4 py-10 md:px-6">
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="admin-panel rounded-[2rem] px-6 py-8 md:px-10 md:py-10">
            <div className="border-b border-white/10 pb-8">
              <p className="admin-kicker mb-3">Subir producto</p>
              <h1 className="admin-title text-4xl font-light md:text-5xl">Carga editorial para piezas nuevas</h1>
              <p className="admin-muted mt-4 max-w-2xl text-sm md:text-base">
                Ordenamos la informacion en bloques para que publicar sea mas rapido, claro y consistente con la tienda.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-8">
              <section className="admin-panel-soft rounded-[1.75rem] p-5 md:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-full border border-white/10 bg-white/5 p-2 text-gold-600">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Identidad del producto</h2>
                    <p className="admin-muted text-sm">Nombre, categoria y narrativa principal.</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-white/90">Nombre</label>
                    <Input className="admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej: Anillo Atlas" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-white/90">Categoria</label>
                    {categories.length === 0 ? (
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="admin-muted text-sm">
                          Todavia no hay categorias disponibles. Podes generar una base inicial en un clic.
                        </p>
                        <Button type="button" className="mt-4 bg-gold-600 text-white hover:bg-gold-700" onClick={seedCategories}>
                          Crear categorias de ejemplo
                        </Button>
                      </div>
                    ) : (
                      <select className="admin-input flex h-10 w-full rounded-md border px-3 py-2 text-sm" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                        <option value="">Seleccionar categoria</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/90">Genero</label>
                    <select className="admin-input flex h-10 w-full rounded-md border px-3 py-2 text-sm" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                      <option value="">Seleccionar</option>
                      <option value="Hombre">Hombre</option>
                      <option value="Mujer">Mujer</option>
                      <option value="Unisex">Unisex</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/90">Tipo de metal</label>
                    <Input className="admin-input" value={form.metal} onChange={(e) => setForm({ ...form, metal: e.target.value })} placeholder="Ej: Plata 925" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-white/90">Descripcion</label>
                    <Textarea className="admin-input min-h-36" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Contanos que hace especial a esta pieza." />
                  </div>
                </div>
              </section>

              <section className="admin-panel-soft rounded-[1.75rem] p-5 md:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-full border border-white/10 bg-white/5 p-2 text-gold-600">
                    <Package className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Precio y disponibilidad</h2>
                    <p className="admin-muted text-sm">Valores comerciales y datos de inventario.</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/90">Precio</label>
                    <Input className="admin-input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Ej: 85000" />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/90">Precio anterior</label>
                    <Input className="admin-input" value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })} placeholder="Ej: 120000" />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/90">Cantidad</label>
                    <Input className="admin-input" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="Ej: 12" />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/90">Talles</label>
                    <Input className="admin-input" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} placeholder="Ej: 16, 18, 20" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-white/90">Tematicas</label>
                    <Input className="admin-input" value={form.themes} onChange={(e) => setForm({ ...form, themes: e.target.value })} placeholder="Ej: Esta temporada, San Valentin" />
                  </div>
                </div>
              </section>

              <section className="admin-panel-soft rounded-[1.75rem] p-5 md:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-full border border-white/10 bg-white/5 p-2 text-gold-600">
                    <Layers3 className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Tratamiento visual</h2>
                    <p className="admin-muted text-sm">Defini el fondo y carga la imagen principal.</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/90">Fondo de imagen</label>
                    <select className="admin-input flex h-10 w-full rounded-md border px-3 py-2 text-sm" value={form.backgroundType} onChange={(e) => setForm({ ...form, backgroundType: e.target.value })}>
                      <option value="none">Sin fondo</option>
                      <option value="white">Fondo marmol blanco</option>
                      <option value="black">Fondo marmol negro</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/90">Imagen</label>
                    <label className="flex h-10 cursor-pointer items-center justify-center rounded-md border border-dashed border-white/20 bg-black/20 px-4 text-sm text-white/80 transition hover:border-gold-600/60 hover:text-white">
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
                      Seleccionar archivo
                    </label>
                  </div>
                </div>
              </section>

              {error && <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div>}

              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={loading} className="bg-gold-600 text-white hover:bg-gold-700">
                  {loading ? "Subiendo..." : "Crear producto"}
                </Button>
                <Button type="button" variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white" onClick={() => router.push("/admin/products")}>
                  Volver a gestion
                </Button>
              </div>
            </form>
          </section>

          <aside className="space-y-6">
            <section className="admin-panel rounded-[2rem] p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-full border border-white/10 bg-white/5 p-2 text-gold-600">
                  <ImagePlus className="h-4 w-4" />
                </div>
                <div>
                  <p className="admin-kicker">Preview</p>
                  <h2 className="text-xl font-semibold text-white">Como se percibe la pieza</h2>
                </div>
              </div>

              <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/20">
                <div className="flex aspect-[4/5] items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(212,178,125,0.18),_transparent_38%),linear-gradient(180deg,_rgba(34,36,40,1),_rgba(15,16,18,1))]">
                  {previewUrl ? (
                    <img src={previewUrl} alt="preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="px-8 text-center">
                      <p className="text-sm uppercase tracking-[0.3em] text-white/40">Sin imagen</p>
                      <p className="mt-3 text-sm text-white/55">La previsualizacion aparecera aca apenas cargues el archivo.</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-white">{form.name || "Nombre del producto"}</p>
                      <p className="admin-muted mt-1 text-sm">{selectedCategory || "Categoria pendiente"}</p>
                    </div>
                    <p className="text-lg font-semibold text-white">{form.price ? `$${Number(form.price).toLocaleString("es-AR")}` : "$0"}</p>
                  </div>

                  <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                    <p className="admin-muted text-sm">
                      {form.description || "La descripcion del producto se mostrara aca para validar tono y legibilidad."}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="admin-panel-soft rounded-[2rem] p-6">
              <p className="admin-kicker mb-3">Checklist rapido</p>
              <ul className="space-y-3 text-sm text-white/75">
                <li>Nombre claro y facil de identificar en listados.</li>
                <li>Categoria y genero definidos para filtrar mejor.</li>
                <li>Precio y stock listos antes de publicar.</li>
                <li>Imagen principal con fondo coherente con la marca.</li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

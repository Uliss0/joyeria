"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ImagePlus, Layers3, Package, Sparkles } from "lucide-react";
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

type ExistingImage = { id: string; url: string; isMain: boolean; order: number };

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

  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newPreviewUrls, setNewPreviewUrls] = useState<string[]>([]);
  const [mainImageId, setMainImageId] = useState<string | null>(null);

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

        const imgs = product.images || [];
        setExistingImages(imgs);
        const mainImg = imgs.find((img: any) => img.isMain) || imgs[0];
        setMainImageId(mainImg ? mainImg.id : null);
      } catch (err: any) {
        setError(err.message || "Error al cargar producto");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [productId]);

  useEffect(() => {
    if (newImageFiles.length === 0) {
      setNewPreviewUrls([]);
      return;
    }

    const objectUrls = newImageFiles.map((file) => URL.createObjectURL(file));
    setNewPreviewUrls(objectUrls);

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newImageFiles]);

  const handleSetMain = (id: string) => {
    setMainImageId(id);
    setExistingImages((prev) =>
      prev.map((img) => ({
        ...img,
        isMain: img.id === id,
      }))
    );
  };

  const handleDeleteExistingImage = (id: string) => {
    setDeletedImageIds((prev) => [...prev, id]);
    setExistingImages((prev) => prev.filter((img) => img.id !== id));
    if (mainImageId === id) {
      const remaining = existingImages.filter((img) => img.id !== id);
      setMainImageId(remaining[0]?.id || null);
    }
  };

  const handleNewFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImageFiles((prev) => [...prev, ...files]);
    }
  };

  const removeNewFile = (index: number) => {
    setNewImageFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const dataUrls = await Promise.all(
        newImageFiles.map((file) => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );

      const payload = {
        ...form,
        deletedImageIds,
        newImageDataUrls: dataUrls,
        mainImageId,
      };

      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
    const ok = window.confirm("¿Eliminar este producto? Esta accion no se puede deshacer.");
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

  // Get active preview image URL
  const getPreviewImage = () => {
    if (mainImageId) {
      const mainImg = existingImages.find((img) => img.id === mainImageId);
      if (mainImg) return mainImg.url;
    }
    if (existingImages.length > 0) {
      return existingImages[0].url;
    }
    if (newPreviewUrls.length > 0) {
      return newPreviewUrls[0];
    }
    return null;
  };

  const selectedCategory = categories.find((c) => c.id === form.categoryId)?.name;
  const totalImagesCount = existingImages.length + newPreviewUrls.length;
  const activePreviewImage = getPreviewImage();

  if (!productId) return <div className="admin-shell min-h-screen flex items-center justify-center text-white">Cargando...</div>;
  if (loading) return <div className="admin-shell min-h-screen flex items-center justify-center text-white">Cargando...</div>;

  return (
    <div className="admin-shell min-h-screen">
      <div className="container mx-auto px-4 py-10 md:px-6">
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="admin-panel rounded-[2rem] px-6 py-8 md:px-10 md:py-10">
            <div className="border-b border-white/10 pb-8">
              <p className="admin-kicker mb-3">Modificar producto</p>
              <h1 className="admin-title text-4xl font-light md:text-5xl">Edición editorial de la pieza</h1>
              <p className="admin-muted mt-4 max-w-2xl text-sm md:text-base">
                Actualizá la información, imágenes y disponibilidad de la pieza en tiempo real.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-8">
              {/* Identidad del producto */}
              <section className="admin-panel-soft rounded-[1.75rem] p-5 md:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-full border border-white/10 bg-white/5 p-2 text-gold-600">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Identidad del producto</h2>
                    <p className="admin-muted text-sm">Nombre, categoría y narrativa principal.</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-white/90">Nombre</label>
                    <Input className="admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej: Anillo Atlas" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-white/90">Categoría</label>
                    <select className="admin-input flex h-10 w-full rounded-md border px-3 py-2 text-sm" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                      <option value="">Seleccionar categoría</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/90">Género</label>
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
                    <label className="mb-2 block text-sm font-medium text-white/90">Descripción</label>
                    <Textarea className="admin-input min-h-36" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Contanos qué hace especial a esta pieza." />
                  </div>
                </div>
              </section>

              {/* Precio y disponibilidad */}
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
                    <label className="mb-2 block text-sm font-medium text-white/90">Precio anterior (opcional)</label>
                    <Input className="admin-input" value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })} placeholder="Ej: 120000" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-white/90">Cantidad disponible</label>
                    <Input className="admin-input" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="Ej: 12" />
                  </div>
                </div>
              </section>

              {/* Imágenes del producto */}
              <section className="admin-panel-soft rounded-[1.75rem] p-5 md:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-full border border-white/10 bg-white/5 p-2 text-gold-600">
                    <Layers3 className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Imágenes del producto</h2>
                    <p className="admin-muted text-sm">Administrá la galería y cargá fotos adicionales.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {existingImages.length > 0 && (
                    <div className="space-y-3">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-white/40">Imágenes actuales</label>
                      <div className="grid grid-cols-4 gap-3">
                        {existingImages.map((img) => (
                          <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black/40 group shadow-sm">
                            <img src={img.url} alt="product" className="w-full h-full object-cover" />
                            
                            <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 z-10">
                              <button
                                type="button"
                                onClick={() => handleDeleteExistingImage(img.id)}
                                className="self-end bg-red-600/90 hover:bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-md transition-colors font-sans font-medium"
                              >
                                Eliminar
                              </button>
                              
                              {!img.isMain && (
                                <button
                                  type="button"
                                  onClick={() => handleSetMain(img.id)}
                                  className="bg-gold-600 hover:bg-gold-700 text-white text-[9px] py-1 rounded-md transition-colors uppercase font-sans tracking-wide font-medium"
                                >
                                  Hacer Principal
                                </button>
                              )}
                            </div>

                            {img.isMain && (
                              <span className="absolute bottom-2 left-2 bg-gold-600 text-white text-[8px] px-1.5 py-0.5 rounded font-sans uppercase tracking-wider font-semibold shadow-sm z-10">
                                Portada
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-white/40">Cargar nuevas imágenes</label>
                    <label className="flex h-11 cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/20 bg-black/20 px-4 text-sm text-white/80 transition hover:border-gold-600 hover:text-white">
                      <input type="file" className="hidden" accept="image/*" multiple onChange={handleNewFilesChange} />
                      Seleccionar archivos
                    </label>

                    {newPreviewUrls.length > 0 && (
                      <div className="mt-3 grid grid-cols-4 gap-3">
                        {newPreviewUrls.map((url, idx) => (
                          <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black/40 group shadow-sm">
                            <img src={url} alt={`new-preview-${idx}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeNewFile(idx)}
                              className="absolute top-1.5 right-1.5 w-5 h-5 bg-black/80 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-[10px] transition-colors z-10"
                            >
                              ✕
                            </button>
                            <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-[8px] px-1.5 py-0.5 rounded font-sans uppercase font-semibold tracking-wider">
                              Nuevo
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Estado de publicación */}
              <section className="admin-panel-soft rounded-[1.75rem] p-5 md:p-6">
                <div className="flex items-center gap-4">
                  <input
                    id="active"
                    type="checkbox"
                    className="h-5 w-5 rounded border-white/20 bg-black/20 text-gold-600 focus:ring-gold-600 focus:ring-offset-0 cursor-pointer"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  />
                  <div>
                    <label htmlFor="active" className="text-sm font-semibold text-white/90 cursor-pointer block">
                      Producto disponible para venta
                    </label>
                    <p className="admin-muted text-xs mt-0.5">Si se desactiva, no aparecerá en los listados del catálogo.</p>
                  </div>
                </div>
              </section>

              {error && <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div>}

              <div className="flex flex-wrap gap-3 pt-2">
                <Button type="submit" disabled={saving} className="bg-gold-600 text-white hover:bg-gold-700">
                  {saving ? "Guardando..." : "Guardar cambios"}
                </Button>
                <Button type="button" variant="destructive" disabled={saving} onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white border-0">
                  Eliminar pieza
                </Button>
                <Button type="button" variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white" onClick={() => router.push("/admin/products")}>
                  Cancelar y volver
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
                  <p className="admin-kicker">Vista previa</p>
                  <h2 className="text-xl font-semibold text-white">Cómo se percibe la pieza</h2>
                </div>
              </div>

              <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/20">
                <div className="flex aspect-[4/5] items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(212,178,125,0.18),_transparent_38%),linear-gradient(180deg,_rgba(34,36,40,1),_rgba(15,16,18,1))] relative">
                  {activePreviewImage ? (
                    <div className="relative w-full h-full">
                      <img src={activePreviewImage} alt="preview" className="h-full w-full object-cover" />
                      {totalImagesCount > 1 && (
                        <div className="absolute bottom-3 right-3 bg-black/75 text-white text-xs px-2.5 py-1 rounded-full font-sans border border-white/10">
                          + {totalImagesCount - 1} imágenes
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="px-8 text-center">
                      <p className="text-sm uppercase tracking-[0.3em] text-white/40">Sin imagen</p>
                      <p className="mt-3 text-sm text-white/55">La pieza se mostrará sin portada en el catálogo.</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-white">{form.name || "Nombre del producto"}</p>
                      <p className="admin-muted mt-1 text-sm">{selectedCategory || "Categoría pendiente"}</p>
                    </div>
                    <p className="text-lg font-semibold text-white">{form.price ? `$${Number(form.price).toLocaleString("es-AR")}` : "$0"}</p>
                  </div>

                  <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                    <p className="admin-muted text-sm">
                      {form.description || "La descripción del producto se mostrará acá para validar tono y legibilidad."}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="admin-panel-soft rounded-[2rem] p-6">
              <p className="admin-kicker mb-3">Recomendaciones de edición</p>
              <ul className="space-y-3 text-sm text-white/75">
                <li>Desactivá la pieza si te quedaste temporalmente sin stock y no querés pedidos.</li>
                <li>Hacé clic en "Hacer Principal" en la imagen que mejor represente el producto en el catálogo.</li>
                <li>Escribí una descripción rica en detalles como dimensiones y consejos de cuidado.</li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

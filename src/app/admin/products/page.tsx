"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Sparkles, Tag, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

type ProductRow = {
  id: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  isActive: boolean;
  category: { id: string; name: string } | null;
  image: string | null;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/products", { credentials: "include" });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Error al cargar productos");
      }
      const data = await res.json();
      setProducts(Array.isArray(data?.products) ? data.products : []);
    } catch (err: any) {
      setError(err.message || "Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    const ok = window.confirm("Eliminar este producto? Esta accion no se puede deshacer.");
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Error al eliminar producto");
      }
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (err: any) {
      alert(err.message || "Error al eliminar producto");
    }
  };

  const activeProducts = products.filter((product) => product.isActive).length;
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const averagePrice =
    products.length > 0
      ? Math.round(
          products.reduce((sum, product) => sum + product.price, 0) / products.length
        )
      : 0;

  const stats = [
    {
      label: "Catalogo activo",
      value: activeProducts.toLocaleString("es-AR"),
      detail: `${products.length - activeProducts} pausados`,
      icon: Sparkles,
    },
    {
      label: "Stock total",
      value: totalStock.toLocaleString("es-AR"),
      detail: "unidades listas para vender",
      icon: Package,
    },
    {
      label: "Categorias",
      value: new Set(products.map((product) => product.category?.name).filter(Boolean)).size.toString(),
      detail: "familias presentes",
      icon: Tag,
    },
    {
      label: "Precio medio",
      value: `$${averagePrice.toLocaleString("es-AR")}`,
      detail: "referencia del catalogo",
      icon: Wallet,
    },
  ];

  return (
    <div className="admin-shell min-h-screen">
      <div className="container mx-auto px-4 py-10 md:px-6">
        <section className="admin-panel rounded-[2rem] px-6 py-8 md:px-10 md:py-10">
          <div className="flex flex-col gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="admin-kicker mb-3">Gestion de productos</p>
              <h1 className="admin-title text-4xl font-light md:text-5xl">Catalogo listo para decidir rapido</h1>
              <p className="admin-muted mt-4 max-w-xl text-sm md:text-base">
                Revisamos stock, estado y precio desde una vista mas clara para que el equipo pueda editar sin perder contexto.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                onClick={loadProducts}
              >
                Actualizar listado
              </Button>
              <Button asChild className="bg-gold-600 text-white hover:bg-gold-700">
                <Link href="/admin/new-product">Crear producto</Link>
              </Button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="admin-panel-soft rounded-3xl p-5">
                  <div className="mb-6 flex items-center justify-between">
                    <span className="admin-kicker">{stat.label}</span>
                    <div className="rounded-full border border-white/10 bg-white/5 p-2 text-gold-600">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-semibold text-white">{stat.value}</p>
                  <p className="admin-muted mt-2 text-sm">{stat.detail}</p>
                </div>
              );
            })}
          </div>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          )}

          <div className="mt-8">
            {loading ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="admin-panel-soft rounded-3xl p-5">
                    <div className="animate-pulse space-y-4">
                      <div className="h-36 rounded-2xl bg-white/8" />
                      <div className="h-5 w-2/3 rounded bg-white/8" />
                      <div className="h-4 w-1/2 rounded bg-white/8" />
                      <div className="h-10 rounded-2xl bg-white/8" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="admin-panel-soft rounded-[2rem] px-6 py-14 text-center">
                <p className="admin-kicker mb-3">Catalogo vacio</p>
                <h2 className="admin-title text-3xl font-light">Todavia no hay productos cargados</h2>
                <p className="admin-muted mx-auto mt-3 max-w-md text-sm">
                  Empezar con una primera pieza te va a dar una base visual y comercial para el resto de la coleccion.
                </p>
                <Button asChild className="mt-6 bg-gold-600 text-white hover:bg-gold-700">
                  <Link href="/admin/new-product">Subir primer producto</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <article
                    key={product.id}
                    className="admin-panel-soft flex flex-col overflow-hidden rounded-[2rem] border border-white/8"
                  >
                    <div className="relative h-56 overflow-hidden border-b border-white/8 bg-white/5">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-white/35">
                          Sin imagen
                        </div>
                      )}
                      <span
                        className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium ${
                          product.isActive
                            ? "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/30"
                            : "bg-white/10 text-white/70 ring-1 ring-white/10"
                        }`}
                      >
                        {product.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-lg font-semibold text-white">{product.name}</p>
                          <p className="admin-muted mt-1 text-sm">{product.category?.name || "Sin categoria"}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-white">
                            ${product.price.toLocaleString("es-AR")}
                          </p>
                          {product.compareAtPrice ? (
                            <p className="text-xs text-white/40 line-through">
                              ${product.compareAtPrice.toLocaleString("es-AR")}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-white/8 bg-black/20 p-3">
                          <p className="admin-kicker">Stock</p>
                          <p className="mt-2 text-xl font-semibold text-white">{product.stock}</p>
                        </div>
                        <div className="rounded-2xl border border-white/8 bg-black/20 p-3">
                          <p className="admin-kicker">Categoria</p>
                          <p className="mt-2 text-sm text-white/80">{product.category?.name || "-"}</p>
                        </div>
                      </div>

                      <div className="mt-5 flex gap-3">
                        <Button
                          asChild
                          variant="outline"
                          className="flex-1 border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                        >
                          <Link href={`/admin/products/${product.id}`}>Editar</Link>
                        </Button>
                        <Button
                          variant="destructive"
                          className="flex-1"
                          onClick={() => handleDelete(product.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

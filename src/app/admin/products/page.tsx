"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    const ok = window.confirm("Â¿Eliminar este producto? Esta acciÃ³n no se puede deshacer.");
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
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || "Error al eliminar producto");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Link href="/admin/new-product">
          <Button>Crear producto</Button>
        </Link>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {loading ? (
        <p>Cargando productos...</p>
      ) : products.length === 0 ? (
        <p>No hay productos.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="text-left p-3">Producto</th>
                <th className="text-left p-3">Precio</th>
                <th className="text-left p-3">Stock</th>
                <th className="text-left p-3">CategorÃ­a</th>
                <th className="text-left p-3">Estado</th>
                <th className="text-right p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="p-3">
                    <div className="flex items-center space-x-3">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded object-cover border"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-gray-100 border" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        {product.compareAtPrice ? (
                          <p className="text-xs text-gray-500 line-through">
                            ${product.compareAtPrice.toLocaleString("es-AR")}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    ${product.price.toLocaleString("es-AR")}
                  </td>
                  <td className="p-3">{product.stock}</td>
                  <td className="p-3">{product.category?.name || "-"}</td>
                  <td className="p-3">
                    {product.isActive ? "Activo" : "Inactivo"}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end space-x-2">
                      <Link href={`/admin/products/${product.id}`}>
                        <Button variant="outline" size="sm">Editar</Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

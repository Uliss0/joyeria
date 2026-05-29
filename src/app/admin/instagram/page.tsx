"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Instagram, Link2, Trash2, GripVertical, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type InstagramPost = {
  id: string;
  postUrl: string;
  order: number;
  createdAt: string;
};

export default function AdminInstagramPage() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [postUrl, setPostUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [saving, setSaving] = useState(false);

  // Drag state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragNodeRef = useRef<HTMLElement | null>(null);

  const loadPosts = async () => {
    try {
      const res = await fetch("/api/admin/instagram", { credentials: "include" });
      if (!res.ok) throw new Error("No se pudieron cargar las publicaciones");
      const data = await res.json();
      setPosts(Array.isArray(data?.posts) ? data.posts : []);
    } catch (err: any) {
      setError(err.message || "Error al cargar las publicaciones");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    void loadPosts();
  }, []);

  // ──── Drag & Drop handlers ────
  const handleDragStart = useCallback((e: React.DragEvent<HTMLElement>, index: number) => {
    setDraggedIndex(index);
    dragNodeRef.current = e.currentTarget;
    e.dataTransfer.effectAllowed = "move";
    // Slight delay so the browser captures the element before styling
    setTimeout(() => {
      if (dragNodeRef.current) {
        dragNodeRef.current.style.opacity = "0.4";
      }
    }, 0);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  }, []);

  const handleDragEnd = useCallback(() => {
    if (dragNodeRef.current) {
      dragNodeRef.current.style.opacity = "1";
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
    dragNodeRef.current = null;
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLElement>, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      handleDragEnd();
      return;
    }

    // Reorder locally
    const reordered = [...posts];
    const [moved] = reordered.splice(draggedIndex, 1);
    reordered.splice(dropIndex, 0, moved);
    setPosts(reordered);
    handleDragEnd();

    // Persist to backend
    setSaving(true);
    try {
      const res = await fetch("/api/admin/instagram", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: reordered.map((p) => p.id) }),
      });
      if (!res.ok) throw new Error("Error al guardar el orden");
    } catch (err: any) {
      setError(err.message || "Error al guardar el orden");
      // Revert on failure
      await loadPosts();
    } finally {
      setSaving(false);
    }
  }, [draggedIndex, posts, handleDragEnd]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const cleanUrl = postUrl.trim();
    if (!cleanUrl) {
      setError("Ingrese un enlace de Instagram");
      return;
    }

    if (!cleanUrl.toLowerCase().includes("instagram.com")) {
      setError("El enlace debe ser una URL de Instagram válida");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/instagram", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postUrl: cleanUrl }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Error al guardar la publicación");
      }

      setPostUrl("");
      await loadPosts();
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setError(null);
    try {
      const res = await fetch(`/api/admin/instagram/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Error al eliminar la publicación");
      }
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (err: any) {
      setError(err.message || "Error al eliminar la publicación");
    }
  }

  // Extract the shortcode from the URL for a compact label
  const getShortcode = (url: string) => {
    const match = url.match(/\/(p|reel)\/([^/]+)/);
    return match ? `/${match[1]}/${match[2]}` : url;
  };

  return (
    <div className="admin-shell min-h-screen">
      <div className="container mx-auto px-4 py-10 md:px-6">
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          {/* Panel de Creación */}
          <section className="admin-panel rounded-[2rem] px-6 py-8 md:px-8">
            <div className="border-b border-white/10 pb-8">
              <p className="admin-kicker mb-3">Feed del Home</p>
              <h1 className="admin-title text-4xl font-light md:text-5xl">Publicaciones de Instagram</h1>
              <p className="admin-muted mt-4 max-w-xl text-sm md:text-base">
                Administra manualmente las publicaciones y reels que deseas que tus clientes vean en la sección de novedades del inicio.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="admin-panel-soft rounded-[1.75rem] p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-full border border-white/10 bg-white/5 p-2 text-gold-600">
                    <Link2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Enlace de la publicación</h2>
                    <p className="admin-muted text-sm">Copia y pega la URL de un post o reel.</p>
                  </div>
                </div>

                <label className="mb-2 block text-sm font-medium text-white/90">Link</label>
                <Input
                  className="admin-input"
                  value={postUrl}
                  onChange={(e) => setPostUrl(e.target.value)}
                  placeholder="https://www.instagram.com/p/..."
                />
                <div className="mt-2 space-y-1">
                  <span className="block text-xs text-white/40">
                    Ejemplo: https://www.instagram.com/p/DRpLiXQDVBs/ o https://www.instagram.com/reel/DTBqai0jTCn/
                  </span>
                  <span className="block text-xs text-gold-600/70">
                    Nota: La cuenta de Instagram debe ser <strong>Pública</strong>. Los enlaces con nombres de usuario (ej. /usuario/p/...) se normalizarán automáticamente.
                  </span>
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="bg-gold-600 text-white hover:bg-gold-700 w-full md:w-auto"
              >
                {loading ? "Guardando..." : "Agregar publicación"}
              </Button>
            </form>
          </section>

          {/* Panel de Listado con Drag & Drop */}
          <section className="admin-panel rounded-[2rem] px-6 py-8 md:px-8">
            <div className="mb-8 flex items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <p className="admin-kicker mb-3">Feed actual</p>
                <h2 className="text-2xl font-semibold text-white">Publicaciones activas</h2>
                {posts.length > 1 && (
                  <p className="admin-muted mt-1 text-xs">
                    Arrastrá las publicaciones para cambiar el orden en el que se muestran.
                    {saving && <span className="ml-2 text-gold-600 animate-pulse">Guardando orden...</span>}
                  </p>
                )}
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 p-3 text-gold-600">
                <Instagram className="h-5 w-5" />
              </div>
            </div>

            {loadingList ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="admin-panel-soft rounded-2xl h-16 animate-pulse bg-white/5" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="admin-panel-soft rounded-[1.75rem] px-6 py-14 text-center">
                <p className="admin-kicker mb-3">Sin publicaciones</p>
                <p className="text-lg text-white">No hay publicaciones de Instagram guardadas en la base de datos.</p>
                <p className="admin-muted mt-2 text-sm">
                  Al agregar la primera, se renderizará automáticamente en la página principal.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {posts.map((post, index) => (
                  <article
                    key={post.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`
                      admin-panel-soft rounded-2xl border transition-all duration-200 select-none
                      ${dragOverIndex === index && draggedIndex !== index
                        ? "border-gold-600/60 bg-gold-600/5 scale-[1.01]"
                        : "border-white/8"
                      }
                      ${draggedIndex === index ? "opacity-40" : "opacity-100"}
                    `}
                  >
                    <div className="flex items-center gap-3 px-4 py-3">
                      {/* Drag Handle */}
                      <div className="cursor-grab active:cursor-grabbing text-white/30 hover:text-white/60 transition-colors shrink-0">
                        <GripVertical className="h-5 w-5" />
                      </div>

                      {/* Position Badge */}
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gold-600/15 text-gold-600 text-xs font-bold shrink-0">
                        {index + 1}
                      </div>

                      {/* Post URL */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">
                          {getShortcode(post.postUrl)}
                        </p>
                        <p className="text-xs text-white/30 truncate">
                          {post.postUrl}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={post.postUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-white/30 hover:text-gold-600 transition-colors rounded-lg hover:bg-white/5"
                          title="Ver en Instagram"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-white/30 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10 cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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

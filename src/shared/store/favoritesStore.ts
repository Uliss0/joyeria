import { create } from "zustand";

export interface FavoriteProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  images: Array<{
    url: string;
    alt: string;
    isMain: boolean;
  }>;
  category: {
    name: string;
    slug: string;
  };
  isFeatured?: boolean;
  isNew?: boolean;
  tags?: Array<{
    name: string;
    color?: string;
  }>;
}

interface FavoritesState {
  items: FavoriteProduct[];
  isLoading: boolean;
  setFavorites: (items: FavoriteProduct[]) => void;
  addFavorite: (item: FavoriteProduct) => void;
  removeFavorite: (productId: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useFavoritesStore = create<FavoritesState>((set) => ({
  items: [],
  isLoading: false,
  setFavorites: (items) => set({ items }),
  addFavorite: (item) =>
    set((state) => {
      if (state.items.some((favorite) => favorite.id === item.id)) return state;
      return { items: [item, ...state.items] };
    }),
  removeFavorite: (productId) =>
    set((state) => ({
      items: state.items.filter((favorite) => favorite.id !== productId),
    })),
  setLoading: (loading) => set({ isLoading: loading }),
}));

export const useFavoritesItems = () => useFavoritesStore((state) => state.items);
export const useFavoritesIsLoading = () => useFavoritesStore((state) => state.isLoading);
export const useFavoritesSetFavorites = () => useFavoritesStore((state) => state.setFavorites);
export const useFavoritesAddFavorite = () => useFavoritesStore((state) => state.addFavorite);
export const useFavoritesRemoveFavorite = () => useFavoritesStore((state) => state.removeFavorite);
export const useFavoritesSetLoading = () => useFavoritesStore((state) => state.setLoading);

import { create } from "zustand";
import { productService } from "@/services/product.service";
import { BestSellerItem, BestSellerState } from "@/types";

export const useBestSellerStore = create<BestSellerState>((set) => ({
  bestSellers: [],
  bestSellerIds: [],
  isLoading: false,
  fetchBestSellers: async () => {
    set({ isLoading: true });
    try {
      const res = await productService.getBestSellers(3);
      const rawProducts = res.data || res || [];
      const products = Array.isArray(rawProducts) ? rawProducts : [];

      const mappedBestSellers: BestSellerItem[] = products
        .map((p: any) => ({
          id: String(p.id),
          name: p.name,
          sold: Number(p.sold_count || 0),
        }))
        .filter((b: BestSellerItem) => b.sold > 0);

      set({
        bestSellers: mappedBestSellers,
        bestSellerIds: mappedBestSellers.map((b) => b.id),
      });
    } catch (error) {
      console.error("Failed to fetch best sellers:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));

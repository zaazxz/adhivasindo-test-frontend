import { useState } from "react";
import { Product } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "@/store/useToastStore";

export function useProductGrid(products: Product[], selectedCategoryId?: string | null, searchQuery?: string) {
  const { addItem } = useCartStore();
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = !!user;

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const getQty = (id: number | string) => quantities[String(id)] || 1;

  const setQty = (id: number | string, val: number) => {
    setQuantities((prev) => ({ ...prev, [String(id)]: Math.max(1, Math.min(99, val)) }));
  };

  const handleAddToCart = (prod: Product) => {
    if (!isLoggedIn) {
      toast.error("Please sign in to add items to your cart.");
      return;
    }
    const key = String(prod.id);
    addItem(prod, getQty(prod.id));
    setAddedIds((prev) => new Set(prev).add(key));
    toast.success(`${prod.name} added to cart!`);
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }, 1200);
  };

  const activeFilter = selectedCategoryId || null;
  const filtered = products.filter((p) => {
    const matchesCategory = activeFilter ? (p.type_id || p.product_type_id) === activeFilter : true;
    const matchesSearch = searchQuery ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    return matchesCategory && matchesSearch;
  });

  const relatedProducts = selectedProduct
    ? products.filter((p) => (p.type_id || p.product_type_id) === (selectedProduct.type_id || selectedProduct.product_type_id) && p.id !== selectedProduct.id).slice(0, 4)
    : [];

  const hasImage = (img?: string | null) => !!img && img.length > 0 && img !== "/banana_juice.png" && img !== "null";

  const getImageUrl = (img?: string | null) => {
    if (!img) return "";
    return img.startsWith('http') ? img : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000'}/storage/${img}`;
  };

  return {
    quantities,
    addedIds,
    selectedProduct,
    setSelectedProduct,
    getQty,
    setQty,
    handleAddToCart,
    activeFilter,
    filtered,
    relatedProducts,
    hasImage,
    getImageUrl
  };
}

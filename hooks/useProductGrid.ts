import { useState } from "react";
import { Product } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "@/store/useToastStore";

export function useProductGrid(products: Product[], selectedCategoryId?: string | null, searchQuery?: string, bestSellerIds: string[] = []) {
  const { addItem } = useCartStore();
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = !!user;

  const [quantities, setQuantities] = useState<Record<string, number | string>>({});
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [sortMethod, setSortMethod] = useState("new");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getQty = (id: number | string): number | string => quantities[String(id)] ?? 1;

  const setQty = (id: number | string, val: number | string, maxStock: number = 99) => {
    if (val === "") {
      setQuantities((prev) => ({ ...prev, [String(id)]: "" }));
      return;
    }
    const num = Number(val);
    if (!isNaN(num)) {
      setQuantities((prev) => ({ ...prev, [String(id)]: Math.max(0, Math.min(maxStock, num)) }));
    }
  };

  const handleAddToCart = (prod: Product) => {
    if (!isLoggedIn) {
      toast.error("Please sign in to add items to your cart.");
      return;
    }
    const key = String(prod.id);
    const qty = Number(getQty(prod.id));
    addItem(prod, qty > 0 ? qty : 1);
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

  const isAdmin = user?.role === "admin";
  const activeFilter = selectedCategoryId || null;
  const filtered = products.filter((p) => {
    // Hide non-active products (draft, inactive) from non-admin users
    const isNotActive = p.status !== "active";
    if (isNotActive && !isAdmin) return false;

    const inStock = (p.stock ?? 0) > 0 || isAdmin;
    const matchesCategory = activeFilter ? (p.type_id || p.product_type_id) === activeFilter : true;
    const matchesSearch = searchQuery ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    return inStock && matchesCategory && matchesSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch(sortMethod) {
      case "old":
        return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
      case "price-asc":
        return Number(a.price) - Number(b.price);
      case "price-desc":
        return Number(b.price) - Number(a.price);
      case "best-seller":
        const aBest = bestSellerIds.includes(String(a.id)) ? 1 : 0;
        const bBest = bestSellerIds.includes(String(b.id)) ? 1 : 0;
        return bBest - aBest;
      case "new":
      default:
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    }
  });

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const relatedProducts = selectedProduct
    ? products
        .filter((p) => {
          const isNotActive = p.status !== "active";
          if (isNotActive && !isAdmin) return false;
          return (p.type_id || p.product_type_id) === (selectedProduct.type_id || selectedProduct.product_type_id) && p.id !== selectedProduct.id;
        })
        .slice(0, 4)
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
    paginated,
    sortMethod,
    setSortMethod,
    currentPage,
    setCurrentPage,
    totalPages,
    relatedProducts,
    hasImage,
    getImageUrl
  };
}

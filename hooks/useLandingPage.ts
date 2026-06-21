import { useState, useEffect } from "react";
import { Category, Product } from "@/types";
import { productService } from "@/services/product.service";
import { productTypeService } from "@/services/product-type.service";

export function useLandingPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const [productsRes, categoriesRes] = await Promise.allSettled([
        productService.getAll(),
        productTypeService.getAll(),
      ]);

      // Map products from API
      if (productsRes.status === "fulfilled") {
        const rawProducts = productsRes.value.data || productsRes.value || [];
        const mappedProducts: Product[] = rawProducts.map((p: any) => ({
          id: p.id,
          name: p.name,
          desc: p.desc || "",
          price: Number(p.price) || 0,
          image: p.image_url || p.image || "",
          stock: p.stock ?? 0,
          status: p.status || "active",
          product_type_id: p.type_id,
          type_name: p.type?.type_name || "",
          created_at: p.created_at || "",
        }));
        setProducts(mappedProducts);
      }

      // Map categories from API (product types = categories)
      if (categoriesRes.status === "fulfilled") {
        const rawCategories = categoriesRes.value.data || categoriesRes.value || [];
        const mappedCategories: Category[] = rawCategories.map((c: any) => ({
          id: c.id,
          name: c.type_name || c.name,
        }));
        setCategories(mappedCategories);
      }
    } catch (error) {
      console.error("Failed to fetch landing data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategoryId((prev) => (prev === categoryId ? null : categoryId));
  };

  return {
    categories,
    products,
    isLoading,
    selectedCategoryId,
    setSelectedCategoryId,
    handleCategorySelect
  };
}

"use client";

import { useState, useEffect } from "react";
import CategorySection from "@/components/modules/landing/CategorySection";
import ProductGrid from "@/components/modules/landing/ProductGrid";
import { Category, Product } from "@/types";
import { productService } from "@/services/product.service";
import { productTypeService } from "@/services/product-type.service";
import { useSearchParams } from "next/navigation";

export default function LandingPage() {
  const searchParams = useSearchParams();
  const searchQ = searchParams.get("search") || "";

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

  if (isLoading) {
    return (
      <>
        {/* Categories skeleton */}
        <section className="mb-16">
          <div className="h-6 w-24 bg-gray-200 rounded mb-6 animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col items-center justify-center py-8 px-6 bg-white border border-gray-100 rounded-xl">
                <div className="w-8 h-8 bg-gray-100 rounded-full mb-4 animate-pulse" />
                <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </section>

        {/* Products skeleton */}
        <section>
          <div className="h-6 w-16 bg-gray-200 rounded mb-8 animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-x-5 gap-y-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div key={i} className="flex flex-col">
                <div className="bg-[#f8f9fa] rounded-2xl p-6 mb-4 aspect-square animate-pulse" />
                <div className="h-3 w-24 bg-gray-100 rounded mb-2 animate-pulse" />
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {categories.length > 0 && (
        <CategorySection
          categories={categories}
          selectedId={selectedCategoryId}
          onSelect={handleCategorySelect}
        />
      )}
      <ProductGrid
        products={products}
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onCategoryChange={setSelectedCategoryId}
        searchQuery={searchQ}
      />
    </>
  );
}

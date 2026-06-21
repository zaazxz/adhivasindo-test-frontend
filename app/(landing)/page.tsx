"use client";

import { Carrot, Croissant, Milk, Wine, Beef } from "lucide-react";
import CategorySection from "@/components/modules/landing/CategorySection";
import ProductGrid from "@/components/modules/landing/ProductGrid";
import { Category, Product } from "@/types";

const CATEGORIES: Category[] = [
  { name: "Fruits & Veges", icon: Carrot, color: "text-green-600" },
  { name: "Breads & Sweets", icon: Croissant, color: "text-amber-800" },
  { name: "Fruits & Veges", icon: Milk, color: "text-yellow-500" }, 
  { name: "Fruits & Veges", icon: Wine, color: "text-red-600" },
  { name: "Fruits & Veges", icon: Beef, color: "text-green-600" },
];

const PRODUCTS: Product[] = [
  { id: 1, name: "Sunstar Fresh Banana Juice", price: 20000, image: "/banana_juice.png" },
  { id: 2, name: "Chocolate", price: 40000, image: "/chocolate.png" },
  { id: 3, name: "Sunstar Fresh Melon Juice", price: 10000, image: "/melon_juice.png" },
  { id: 4, name: "Sunstar Fresh Fruit Juice", price: 60000, image: "/fruit_juice.png" },
  { id: 5, name: "Sunstar Fresh Banana Juice", price: 20000, image: "/banana_juice.png" },
  { id: 6, name: "Chocolate", price: 40000, image: "/chocolate.png" },
  { id: 7, name: "Sunstar Fresh Melon Juice", price: 10000, image: "/melon_juice.png" },
  { id: 8, name: "Sunstar Fresh Fruit Juice", price: 60000, image: "/fruit_juice.png" },
  { id: 9, name: "Sunstar Fresh Banana Juice", price: 20000, image: "/banana_juice.png" },
  { id: 10, name: "Chocolate", price: 40000, image: "/chocolate.png" },
];

export default function LandingPage() {
  return (
    <>
      <CategorySection categories={CATEGORIES} />
      <ProductGrid products={PRODUCTS} />
    </>
  );
}

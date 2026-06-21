import type { IconType } from "react-icons";
import type { ElementType } from "react";

export interface Category {
  id?: string;
  name: string;
  icon?: ElementType;
  color?: string;
}

export interface ProductType {
  id: string;
  name?: string;
  type_name?: string;
  products_count?: number;
}

export interface Product {
  id: number | string;
  name: string;
  desc?: string | null;
  description?: string | null;
  price: number;
  image: string;
  image_url?: string | null;
  type_id?: string;
  product_type_id?: string;
  type_name?: string;
  type?: { id: string; type_name: string };
  product_type?: ProductType;
  stock?: number;
  status?: string;
  created_at?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface StatCardData {
  label: string;
  value: string;
  icon: ElementType;
  accent: string;
}

export interface CategorySectionProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export interface ProductGridProps {
  products: Product[];
  categories?: Category[];
  selectedCategoryId?: string | null;
  onCategoryChange?: (id: string | null) => void;
  searchQuery?: string;
}

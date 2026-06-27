import type { IconType } from "react-icons";
import type { ElementType, ReactNode } from "react";

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

// Used in Kasir/POS: cart item nests the product object
export interface KasirCartItem {
  product: Product;
  quantity: number;
}

export interface StatCardData {
  label: string;
  value: string;
  icon: ElementType;
  accent: string;
}

export interface StatCardProps {
  value: string;
  label: string;
  valueColor: string;
  bottomColor: string;
  bgColor: string;
  icon: ReactNode;
  detail: { title: string; items: { label: string; value: string }[] };
  isLoading?: boolean;
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

export interface BestSellerItem {
  id: string;
  name: string;
  sold: number;
}

export interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  qty?: number;
  price: number;
  product?: {
    name: string;
    image_url?: string;
    price?: number;
  };
}

export interface Order {
  id: string;
  order_no?: string;
  invoice_number?: string;
  total_price?: number;
  total_amount?: number;
  total?: number;
  status: string;
  payment_method?: string;
  customer_name?: string;
  name?: string;
  created_at: string;
  user?: {
    name: string;
    email?: string;
  };
  customer?: {
    name: string;
  };
  items?: OrderItem[];
  order_details?: OrderItem[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at?: string;
}

export interface Notification {
  id: number;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  link?: string;
}

export interface NavSubItem {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href?: string;
  icon: ElementType | any;
  hasArrow?: boolean;
  subItems?: NavSubItem[];
}

export interface NavGroup {
  section: string | null;
  sectionSub?: string;
  items: NavItem[];
}

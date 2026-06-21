import type { IconType } from "react-icons";
import type { ElementType } from "react";

export interface Category {
  name: string;
  icon: ElementType;
  color: string;
}

export interface Product {
  id: number | string;
  name: string;
  price: number;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
  desc?: string;
}

export interface StatCardData {
  label: string;
  value: string;
  icon: ElementType;
  accent: string;
}

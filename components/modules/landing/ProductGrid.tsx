"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/types";
import { useCartStore } from "@/store/useCartStore";

const TABS = ["All", "Fruits & Veges", "Juices"] as const;

export default function ProductGrid({ products }: { products: Product[] }) {
  const { addItem } = useCartStore();
  const [activeTab, setActiveTab] = useState<string>("All");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const getQty = (id: number | string) => quantities[String(id)] || 1;

  const setQty = (id: number | string, val: number) => {
    setQuantities((prev) => ({ ...prev, [String(id)]: Math.max(1, Math.min(99, val)) }));
  };

  const handleAddToCart = (prod: Product, index: number) => {
    const uniqueKey = `${prod.id}-${index}`;
    addItem(prod, getQty(prod.id));
    setAddedIds((prev) => new Set(prev).add(uniqueKey));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(uniqueKey);
        return next;
      });
    }, 1200);
  };

  // Dummy filtering based on tab
  const filtered = activeTab === "All"
    ? products
    : activeTab === "Fruits & Veges"
      ? products.filter((_, i) => i % 2 === 0)
      : products.filter((_, i) => i % 2 !== 0);

  return (
    <section>
      <div className="flex justify-between items-end mb-8 flex-wrap gap-4">
        <h2 className="text-xl font-bold text-gray-800">Barang</h2>
        <div className="flex gap-6 text-[10px] font-bold tracking-[1px] text-gray-400 uppercase">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`transition-colors pb-2 px-1 ${
                activeTab === tab
                  ? "text-[#f59e0b] border-b-[3px] border-[#f59e0b]"
                  : "hover:text-gray-600 border-b-[3px] border-transparent"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-x-5 gap-y-8">
        {filtered.map((prod, index) => {
          const uniqueKey = `${prod.id}-${index}`;
          const isAdded = addedIds.has(uniqueKey);

          return (
            <div key={uniqueKey} className="flex flex-col group">
              <div className="bg-[#f8f9fa] rounded-2xl p-6 mb-4 aspect-square flex items-center justify-center relative overflow-hidden">
                <Image
                  src={prod.image}
                  alt={prod.name}
                  width={130}
                  height={130}
                  className="object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500 ease-out"
                />
                {isAdded && (
                  <div className="absolute inset-0 bg-green-500/90 flex items-center justify-center animate-[fadeIn_0.2s_ease-out]">
                    <div className="text-white text-center">
                      <div className="text-2xl mb-1">✓</div>
                      <div className="text-[11px] font-bold">Added!</div>
                    </div>
                  </div>
                )}
              </div>
              <h3 className="text-[12px] font-bold text-gray-500 mb-1 line-clamp-1">{prod.name}</h3>
              <p className="text-[15px] font-extrabold text-gray-900 mb-3">
                Rp. {prod.price.toLocaleString("id-ID")}
              </p>
              <div className="flex items-center justify-between mt-auto pt-1">
                <div className="flex items-center gap-3 text-xs font-semibold text-gray-400">
                  <button
                    onClick={() => setQty(prod.id, getQty(prod.id) - 1)}
                    className="hover:text-black active:scale-90 transition-all w-5 h-5 flex items-center justify-center rounded-full border border-gray-200 hover:border-gray-400"
                  >
                    -
                  </button>
                  <span className="text-black w-4 text-center">{getQty(prod.id)}</span>
                  <button
                    onClick={() => setQty(prod.id, getQty(prod.id) + 1)}
                    className="hover:text-black active:scale-90 transition-all w-5 h-5 flex items-center justify-center rounded-full border border-gray-200 hover:border-gray-400"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleAddToCart(prod, index)}
                  disabled={isAdded}
                  className={`text-[11px] font-bold transition-all ${
                    isAdded
                      ? "text-green-500"
                      : "text-gray-400 hover:text-[#f59e0b] active:scale-95"
                  }`}
                >
                  {isAdded ? "Added ✓" : "Add to Cart"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400 text-sm">
          No products found in this category.
        </div>
      )}
    </section>
  );
}

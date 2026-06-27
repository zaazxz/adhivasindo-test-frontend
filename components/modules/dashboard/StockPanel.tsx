"use client";

import { useState, useEffect } from "react";
import { toast } from "@/store/useToastStore";
import { productService } from "@/services/product.service";
import { Product } from "@/types";

export default function StockPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await productService.getAll();
      const data = res.data || res || [];
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products for stock panel:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Take top 5 products sorted by stock
  const maxStock = products.length > 0 ? Math.max(...products.map((p) => p.stock || 0), 1) : 100;
  const sorted = [...products]
    .sort((a, b) => sortAsc ? (a.stock || 0) - (b.stock || 0) : (b.stock || 0) - (a.stock || 0))
    .slice(0, 5);

  // Color palette for bars
  const barColors = ["bg-[#3b82f6]", "bg-[#4b5563]", "bg-[#60a5fa]", "bg-[#4b5563]", "bg-[#3b82f6]"];

  return (
    <div className="bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5 h-auto lg:h-[340px]">
      <div className="flex justify-between items-center mb-6">
        <div className="font-bold text-[13px] text-gray-800">Stok Barang</div>
        <button
          onClick={() => setSortAsc(!sortAsc)}
          className="text-[9px] font-bold text-[#3b82f6] hover:underline cursor-pointer"
        >
          Sort: {sortAsc ? "Low → High" : "High → Low"}
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-[18px]">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between">
                <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
                <div className="h-3 w-10 bg-gray-50 rounded animate-pulse" />
              </div>
              <div className="w-full h-[5px] bg-gray-100 rounded-full" />
            </div>
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-6 text-gray-400 text-[12px]">No products found.</div>
      ) : (
        <div className="flex flex-col gap-[18px]">
          {sorted.map((item, i) => {
            const percentage = maxStock > 0 ? ((item.stock || 0) / maxStock) * 100 : 0;
            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => toast.info(`${item.name} | Stok: ${item.stock} units | Status: ${(item.stock || 0) < 10 ? "Low Stock ⚠️" : "In Stock ✓"}`)}
                className={`cursor-pointer transition-all rounded-lg px-2 py-1 -mx-2 ${hoveredIndex === i ? "bg-gray-50" : ""}`}
              >
                <div className="flex justify-between items-center text-[11px] mb-1.5">
                  <span className={`font-semibold transition-colors truncate max-w-[180px] ${hoveredIndex === i ? "text-[#3b82f6]" : "text-gray-700"}`}>
                    {item.name}
                  </span>
                  <span className="font-medium text-gray-400 flex items-center gap-1 shrink-0">
                    {(item.stock || 0) < 10 && <span className="text-[8px] text-red-400 font-bold">LOW</span>}
                    {item.stock || 0}
                  </span>
                </div>
                <div className="w-full h-[5px] bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${(item.stock || 0) < 10 ? "bg-red-400" : barColors[i % barColors.length]} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.max(percentage, 2)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

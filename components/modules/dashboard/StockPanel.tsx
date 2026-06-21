"use client";

import { useState } from "react";

const stockData = [
  { name: "Sunstar Fresh Melon Juice", qty: 80, max: 100, color: "bg-[#3b82f6]" },
  { name: "Sunstar Fresh Fruit Juice", qty: 50, max: 100, color: "bg-[#4b5563]" },
  { name: "Sunstar Fresh Strawberry Juice", qty: 20, max: 100, color: "bg-[#60a5fa]" },
  { name: "Sunstar Fresh Banana Juice", qty: 60, max: 100, color: "bg-[#4b5563]" },
  { name: "Chocolate", qty: 40, max: 100, color: "bg-[#3b82f6]" },
];

export default function StockPanel() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = [...stockData].sort((a, b) => sortAsc ? a.qty - b.qty : b.qty - a.qty);

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

      <div className="flex flex-col gap-[18px]">
        {sorted.map((item, i) => (
          <div
            key={item.name}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => alert(`${item.name}\nStok: ${item.qty}/${item.max} units\nStatus: ${item.qty < 30 ? "Low Stock ⚠️" : "In Stock ✓"}`)}
            className={`cursor-pointer transition-all rounded-lg px-2 py-1 -mx-2 ${hoveredIndex === i ? "bg-gray-50" : ""}`}
          >
            <div className="flex justify-between items-center text-[11px] mb-1.5">
              <span className={`font-semibold transition-colors ${hoveredIndex === i ? "text-[#3b82f6]" : "text-gray-700"}`}>
                {item.name}
              </span>
              <span className="font-medium text-gray-400 flex items-center gap-1">
                {item.qty < 30 && <span className="text-[8px] text-red-400 font-bold">LOW</span>}
                {item.qty}/{item.max}
              </span>
            </div>
            <div className="w-full h-[5px] bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${item.color} rounded-full transition-all duration-500`}
                style={{ width: `${item.qty}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

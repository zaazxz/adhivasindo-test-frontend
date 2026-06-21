"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Youtube", value: 30, color: "#ef4444" },
  { name: "Facebook", value: 30, color: "#3b82f6" },
  { name: "Twitter", value: 40, color: "#06b6d4" },
];

const productData = [
  { name: "Strawberry", sold: 500, color: "text-[#3b82f6]" },
  { name: "Blueberry", sold: 300, color: "text-[#10b981]" },
  { name: "Melon", sold: 100, color: "text-[#f59e0b]" },
];

export default function BestSellerPanel() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5 flex flex-col h-auto lg:h-[340px]">
      <div className="font-bold text-[13px] text-gray-800 mb-6">Best Seller</div>

      <div className="h-[130px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.color}
                  opacity={activeIndex !== null && activeIndex !== index ? 0.4 : 1}
                  style={{ transition: "opacity 0.2s", cursor: "pointer" }}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "11px" }}
              formatter={(value: number, name: string) => [`${value}%`, name]}
            />
          </PieChart>
        </ResponsiveContainer>
        {activeIndex !== null && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-[18px] font-extrabold text-gray-800">{data[activeIndex].value}%</div>
              <div className="text-[9px] font-semibold text-gray-400">{data[activeIndex].name}</div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4 text-[10px] font-semibold text-gray-500 mt-4 mb-auto">
        {data.map((item, i) => (
          <button
            key={i}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
            className={`flex items-center gap-1.5 transition-opacity cursor-pointer ${activeIndex !== null && activeIndex !== i ? "opacity-40" : ""}`}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            {item.name}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-100 text-center px-2">
        {productData.map((prod, i) => (
          <button
            key={i}
            onClick={() => alert(`${prod.name}: ${prod.sold} units sold (Dummy)`)}
            className="hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors cursor-pointer"
          >
            <div className="text-[11px] font-bold text-gray-800">{prod.name}</div>
            <div className={`text-[13px] font-bold ${prod.color} mt-0.5`}>{prod.sold}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Category } from "@/types";

export default function CategorySection({ categories }: { categories: Category[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="mb-16">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
        {categories.map((cat, i) => (
          <div
            key={i}
            onClick={() => setActiveIndex(activeIndex === i ? null : i)}
            className={`flex flex-col items-center justify-center py-8 px-6 bg-white border rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] cursor-pointer transition-all duration-300 select-none ${
              activeIndex === i
                ? "border-amber-400 shadow-lg shadow-amber-100 scale-[1.03]"
                : "border-gray-100 hover:border-amber-200 hover:shadow-md"
            }`}
          >
            <cat.icon
              className={`w-8 h-8 mb-4 transition-transform duration-300 ${cat.color} ${
                activeIndex === i ? "scale-125" : ""
              }`}
              strokeWidth={1.2}
            />
            <span className="text-[13px] font-bold text-gray-700">{cat.name}</span>
            {activeIndex === i && (
              <span className="text-[9px] font-semibold text-amber-500 mt-2 animate-[fadeIn_0.2s_ease-out]">
                ✓ Selected
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

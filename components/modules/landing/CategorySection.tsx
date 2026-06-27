"use client";

import { useState } from "react";
import { ImageIcon, ChevronDown, ChevronUp } from "lucide-react";
import { CategorySectionProps } from "@/types";

export default function CategorySection({ categories, selectedId, onSelect }: CategorySectionProps) {
  const [showAll, setShowAll] = useState(false);
  const maxInitial = 5;
  
  const hasMore = categories.length > maxInitial;
  const visibleCategories = (showAll || !hasMore) ? categories : categories.slice(0, maxInitial - 1);

  return (
    <section className="mb-16">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
        {visibleCategories.map((cat) => {
          const isActive = selectedId === cat.id;
          return (
            <div
              key={cat.id || cat.name}
              onClick={() => onSelect(cat.id || null)}
              className={`flex flex-col items-center justify-center py-8 px-6 bg-white border rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] cursor-pointer transition-all duration-300 select-none ${
                isActive
                  ? "border-amber-400 shadow-lg shadow-amber-100 scale-[1.03]"
                  : "border-gray-100 hover:border-amber-200 hover:shadow-md"
              }`}
            >
              <ImageIcon
                className={`w-8 h-8 mb-4 transition-all duration-300 ${
                  isActive ? "text-amber-500 scale-125" : "text-gray-400"
                }`}
                strokeWidth={1.2}
              />
              <span className="text-[13px] font-bold text-gray-700">{cat.name}</span>
              {isActive && (
                <span className="text-[9px] font-semibold text-amber-500 mt-2 animate-[fadeIn_0.2s_ease-out]">
                  ✓ Selected
                </span>
              )}
            </div>
          );
        })}

        {hasMore && (
          <div
            onClick={() => setShowAll(!showAll)}
            className="flex flex-col items-center justify-center py-8 px-6 bg-gray-50 border border-gray-100 rounded-xl cursor-pointer transition-all duration-300 select-none hover:bg-gray-100 hover:shadow-md"
          >
            {showAll ? (
              <>
                <ChevronUp className="w-8 h-8 mb-4 text-gray-400" strokeWidth={1.2} />
                <span className="text-[13px] font-bold text-gray-700">Show Less</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-8 h-8 mb-4 text-gray-400" strokeWidth={1.2} />
                <span className="text-[13px] font-bold text-gray-700">See More</span>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

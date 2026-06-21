"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Cyan", value: 30, color: "#06b6d4" },
  { name: "Blue", value: 30, color: "#3b82f6" },
  { name: "Red", value: 40, color: "#ef4444" },
];

export default function BestSellerPanel() {
  return (
    <div className="bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5 flex flex-col h-[340px]">
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
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-center gap-4 text-[10px] font-semibold text-gray-500 mt-4 mb-auto">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#ef4444]"></div> Youtube
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#3b82f6]"></div> Facebook
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#06b6d4]"></div> Twitter
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-100 text-center px-2">
        <div>
          <div className="text-[11px] font-bold text-gray-800">Strawbery</div>
          <div className="text-[13px] font-bold text-[#3b82f6] mt-0.5">500</div>
        </div>
        <div>
          <div className="text-[11px] font-bold text-gray-800">Bluebery</div>
          <div className="text-[13px] font-bold text-[#10b981] mt-0.5">300</div>
        </div>
        <div>
          <div className="text-[11px] font-bold text-gray-800">Melon</div>
          <div className="text-[13px] font-bold text-[#f59e0b] mt-0.5">100</div>
        </div>
      </div>
    </div>
  );
}

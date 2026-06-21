"use client";

import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { FiTrendingDown } from "react-icons/fi";

const data = [
  { name: "Jan", value: 1200 },
  { name: "Feb", value: 1600 },
  { name: "Mar", value: 1400 },
  { name: "Apr", value: 2800 },
  { name: "May", value: 1500 },
  { name: "Jun", value: 3200 },
  { name: "Jul", value: 2000 },
];

export default function SalesChartPanel() {
  return (
    <div className="bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col h-[340px]">
      {/* Top Blue Part */}
      <div className="bg-[#3b63f6] p-5 pb-2 text-white">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-[13px]">Penjualan per Bulan</span>
          <span className="text-xs flex items-center gap-1 opacity-90">
            <FiTrendingDown /> 3%
          </span>
        </div>
        <div className="h-[120px] w-[105%] -ml-[2.5%]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line type="monotone" dataKey="value" stroke="#ffffff" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Bottom White Part */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-center px-4">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-800">Rp. 1.000.000</div>
            <div className="text-[10px] font-semibold text-gray-400 mt-0.5">Total Pendapatan Hari Ini</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-800">321</div>
            <div className="text-[10px] font-semibold text-gray-400 mt-0.5">Transaksi</div>
          </div>
        </div>
        
        {/* Bottom Row */}
        <div className="flex justify-between items-center px-4 pt-4 mt-auto border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-gray-500">Stok Habis</span>
            <span className="font-bold text-[#ef4444]">3</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-gray-500">Barang Terjual</span>
            <span className="font-bold text-[#10b981]">200</span>
          </div>
        </div>
      </div>
    </div>
  );
}

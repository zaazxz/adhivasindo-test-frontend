"use client";

import { useState } from "react";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { FiTrendingDown, FiTrendingUp } from "react-icons/fi";

const monthlyData = [
  { name: "Jan", value: 1200 },
  { name: "Feb", value: 1600 },
  { name: "Mar", value: 1400 },
  { name: "Apr", value: 2800 },
  { name: "May", value: 1500 },
  { name: "Jun", value: 3200 },
  { name: "Jul", value: 2000 },
];

const weeklyData = [
  { name: "Mon", value: 400 },
  { name: "Tue", value: 600 },
  { name: "Wed", value: 350 },
  { name: "Thu", value: 800 },
  { name: "Fri", value: 950 },
  { name: "Sat", value: 1200 },
  { name: "Sun", value: 700 },
];

type Period = "monthly" | "weekly";

export default function SalesChartPanel() {
  const [period, setPeriod] = useState<Period>("monthly");
  const data = period === "monthly" ? monthlyData : weeklyData;
  const total = data.reduce((s, d) => s + d.value, 0);
  const avg = Math.round(total / data.length);

  return (
    <div className="bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col h-auto lg:h-[340px]">
      <div className="bg-[#3b63f6] p-5 pb-2 text-white">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-[13px]">Penjualan per {period === "monthly" ? "Bulan" : "Minggu"}</span>
          <div className="flex items-center gap-2">
            <div className="flex bg-white/10 rounded-md overflow-hidden">
              <button onClick={() => setPeriod("weekly")} className={`text-[9px] font-bold px-2.5 py-1 transition-colors ${period === "weekly" ? "bg-white/20 text-white" : "text-white/60 hover:text-white/80"}`}>Week</button>
              <button onClick={() => setPeriod("monthly")} className={`text-[9px] font-bold px-2.5 py-1 transition-colors ${period === "monthly" ? "bg-white/20 text-white" : "text-white/60 hover:text-white/80"}`}>Month</button>
            </div>
            <span className="text-xs flex items-center gap-1 opacity-90">
              {period === "monthly" ? <FiTrendingDown /> : <FiTrendingUp />} {period === "monthly" ? "3%" : "12%"}
            </span>
          </div>
        </div>
        <div className="h-[120px] w-[105%] ml-[-2.5%]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e3a8a", border: "none", borderRadius: "8px", fontSize: "11px", color: "#fff" }}
                formatter={(value: any) => [`Rp. ${(Number(value) * 1000).toLocaleString("id-ID")}`, "Revenue"]}
                labelStyle={{ color: "rgba(255,255,255,0.7)", fontSize: "10px" }}
              />
              <Line type="monotone" dataKey="value" stroke="#ffffff" strokeWidth={2} dot={{ fill: "#fff", r: 3, strokeWidth: 0 }} activeDot={{ fill: "#fbbf24", r: 5, strokeWidth: 2, stroke: "#fff" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-center px-4">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-800">Rp. {(avg * 1000).toLocaleString("id-ID")}</div>
            <div className="text-[10px] font-semibold text-gray-400 mt-0.5">Rata-rata</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-800">321</div>
            <div className="text-[10px] font-semibold text-gray-400 mt-0.5">Transaksi</div>
          </div>
        </div>
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

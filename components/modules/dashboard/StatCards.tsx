"use client";

import { useState } from "react";
import { FiCalendar, FiFileText, FiThumbsUp, FiX } from "react-icons/fi";
import { AiOutlineDollarCircle } from "react-icons/ai";

interface StatCardProps {
  value: string;
  label: string;
  valueColor: string;
  bottomColor: string;
  bgColor: string;
  icon: React.ReactNode;
  detail: { title: string; items: { label: string; value: string }[] };
}

function StatCard({ value, label, valueColor, bottomColor, bgColor, icon, detail }: StatCardProps) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <div
        onClick={() => setShowDetail(true)}
        className={`bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col relative overflow-hidden h-[105px] cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] select-none`}
      >
        <div className="flex-1 flex justify-between items-center px-4 md:px-6">
          <div className="min-w-0">
            <div className={`text-[18px] md:text-[22px] font-bold tracking-tight ${valueColor} truncate`}>{value}</div>
            <div className="text-[10px] md:text-[11px] text-gray-500 mt-1 font-semibold truncate">{label}</div>
          </div>
          <div className="shrink-0 ml-2">{icon}</div>
        </div>
        {/* Bottom thick border */}
        <div className={`h-2.5 w-full ${bottomColor}`} />
      </div>

      {/* Detail Modal */}
      {showDetail && (
        <>
          <div className="fixed inset-0 bg-black/30 z-50" onClick={() => setShowDetail(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 w-[90vw] max-w-[380px] overflow-hidden animate-[scaleIn_0.2s_ease-out]">
            <div className={`${bgColor} px-6 py-4 flex items-center justify-between`}>
              <h3 className="text-white font-bold text-[14px]">{detail.title}</h3>
              <button onClick={() => setShowDetail(false)} className="text-white/80 hover:text-white">
                <FiX size={18} />
              </button>
            </div>
            <div className="p-6">
              <div className={`text-3xl font-extrabold ${valueColor} mb-4`}>{value}</div>
              <div className="flex flex-col gap-3">
                {detail.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                    <span className="text-[11px] font-medium text-gray-500">{item.label}</span>
                    <span className="text-[12px] font-bold text-gray-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

const cards: StatCardProps[] = [
  {
    value: "Rp. 50.000.000",
    label: "Total Semua Pendapatan",
    valueColor: "text-[#f59e0b]",
    bottomColor: "bg-[#f59e0b]",
    bgColor: "bg-[#f59e0b]",
    icon: (
      <div className="w-10 h-10 rounded-full border-2 border-[#f59e0b] flex items-center justify-center text-[#f59e0b]">
        <AiOutlineDollarCircle size={22} />
      </div>
    ),
    detail: {
      title: "Revenue Breakdown",
      items: [
        { label: "Hari ini", value: "Rp. 1.200.000" },
        { label: "Minggu ini", value: "Rp. 8.500.000" },
        { label: "Bulan ini", value: "Rp. 35.000.000" },
        { label: "Total Keseluruhan", value: "Rp. 50.000.000" },
      ],
    },
  },
  {
    value: "145",
    label: "Stok Barang",
    valueColor: "text-[#ef4444]",
    bottomColor: "bg-[#ef4444]",
    bgColor: "bg-[#ef4444]",
    icon: <FiCalendar className="text-[#ef4444]" size={32} />,
    detail: {
      title: "Stock Details",
      items: [
        { label: "Juice Products", value: "65 items" },
        { label: "Chocolate", value: "30 items" },
        { label: "Fresh Fruits", value: "35 items" },
        { label: "Low Stock (<10)", value: "3 items" },
      ],
    },
  },
  {
    value: "290+",
    label: "Barang Telah Terjual",
    valueColor: "text-[#10b981]",
    bottomColor: "bg-[#10b981]",
    bgColor: "bg-[#10b981]",
    icon: <FiFileText className="text-[#10b981]" size={32} />,
    detail: {
      title: "Sales Summary",
      items: [
        { label: "Hari ini", value: "12 items" },
        { label: "Minggu ini", value: "85 items" },
        { label: "Bulan ini", value: "230 items" },
        { label: "Total Terjual", value: "290+ items" },
      ],
    },
  },
  {
    value: "5",
    label: "Kategori Barang",
    valueColor: "text-[#3b82f6]",
    bottomColor: "bg-[#3b82f6]",
    bgColor: "bg-[#3b82f6]",
    icon: <FiThumbsUp className="text-[#3b82f6]" size={32} />,
    detail: {
      title: "Category List",
      items: [
        { label: "Fruits & Vegetables", value: "45 items" },
        { label: "Juices", value: "38 items" },
        { label: "Chocolates", value: "30 items" },
        { label: "Dairy Products", value: "20 items" },
        { label: "Breads & Sweets", value: "12 items" },
      ],
    },
  },
];

export default function StatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-5">
      {cards.map((card, i) => (
        <StatCard key={i} {...card} />
      ))}
    </div>
  );
}

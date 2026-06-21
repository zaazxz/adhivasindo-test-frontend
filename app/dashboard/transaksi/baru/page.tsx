"use client";

import { useState } from "react";

export default function TransaksiBaruPage() {
  const [items, setItems] = useState([{ name: "Sunstar Fresh Melon Juice", qty: 2, price: 10000 }]);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6">
        <h1 className="text-[18px] font-bold text-gray-800 mb-6">Kasir / Transaksi Baru</h1>
        <div className="mb-4">
          <input type="text" placeholder="Scan Barcode / Cari Nama Barang..." className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#3b63f6]" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {["Melon Juice", "Fruit Juice", "Strawberry", "Chocolate", "Banana Juice", "Milk"].map((item, i) => (
            <button key={i} className="border border-gray-100 rounded-lg p-3 text-left hover:border-[#3b63f6] hover:bg-blue-50 transition-colors">
              <div className="text-[12px] font-bold text-gray-700">{item}</div>
              <div className="text-[11px] font-bold text-[#f59e0b] mt-1">Rp. {(i + 1) * 10000}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-[350px] bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 flex flex-col h-[500px]">
        <h2 className="text-[14px] font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Order Items</h2>
        <div className="flex-1 overflow-y-auto">
          {items.map((item, i) => (
            <div key={i} className="flex justify-between items-start mb-3 border-b border-gray-50 pb-3">
              <div>
                <div className="text-[12px] font-bold text-gray-800">{item.name}</div>
                <div className="text-[10px] text-gray-500 mt-1">Rp. {item.price} x {item.qty}</div>
              </div>
              <div className="text-[12px] font-bold text-gray-800">Rp. {item.price * item.qty}</div>
            </div>
          ))}
        </div>
        <div className="pt-4 border-t border-gray-100 mt-auto">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[14px] font-bold text-gray-800">Total</span>
            <span className="text-[18px] font-extrabold text-[#3b63f6]">Rp. 20.000</span>
          </div>
          <button className="w-full bg-[#10b981] hover:bg-emerald-600 text-white font-bold py-3 rounded-lg text-sm transition-colors shadow-md">
            Bayar Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}

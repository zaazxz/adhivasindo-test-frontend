"use client";

import { useState, useEffect } from "react";
import { orderService } from "@/services/order.service";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function RecentTransactionsPanel() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.getAll();
        const data = res.data?.data || res.data || res || [];
        const sorted = Array.isArray(data) ? data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5) : [];
        setOrders(sorted);
      } catch (error) {
        console.error("Failed to fetch recent transactions", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatRupiah = (number: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(number);

  const getStatusBadge = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "paid" || s === "completed") return { cls: "bg-green-100 text-green-700", label: "PAID" };
    if (s === "acc" || s === "accepted") return { cls: "bg-blue-100 text-blue-700", label: "ACC" };
    if (s === "cancelled" || s === "reject" || s === "rejected") return { cls: "bg-red-100 text-red-700", label: s === "cancelled" ? "CANCELLED" : "REJECTED" };
    return { cls: "bg-amber-100 text-amber-700", label: (status || "PENDING").toUpperCase() };
  };

  const getTotal = (order: any) => Number(order.total_price || order.total_amount || order.total || 0);

  return (
    <div className="bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 mt-5">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-[16px] font-bold text-gray-800">Transaksi Terbaru</h2>
          <p className="text-[12px] text-gray-500 mt-1">Daftar 5 transaksi terakhir yang masuk.</p>
        </div>
        <Link href="/dashboard/transaksi/riwayat" className="text-[12px] font-bold text-[#3b63f6] hover:text-blue-700 flex items-center gap-1 transition-colors">
          Lihat Semua <FiArrowRight />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <svg className="animate-spin h-5 w-5 text-[#3b63f6]" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-10 text-gray-400 text-[12px] font-medium bg-gray-50 rounded-xl">Belum ada transaksi.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-3">Order ID</th>
                <th className="py-3 px-3">Tanggal</th>
                <th className="py-3 px-3">Pelanggan</th>
                <th className="py-3 px-3">Total</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-gray-700">
              {orders.map((order) => {
                const badge = getStatusBadge(order.status);
                return (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-3 font-bold text-[#3b63f6] text-[12px]">
                      {order.order_no || order.invoice_number || `#${String(order.id).substring(0, 8).toUpperCase()}`}
                    </td>
                    <td className="py-3 px-3 text-gray-500 text-[12px]">
                      {(() => { const d = order.created_at; const dt = d?.endsWith?.("Z") ? d : (d || "").replace(" ", "T") + "Z"; return new Date(dt).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" }); })()}
                    </td>
                    <td className="py-3 px-3 font-medium text-[12px]">{order.user?.name || order.customer?.name || order.customer_name || order.name || "Tanpa Nama"}</td>
                    <td className="py-3 px-3 font-bold text-gray-900 text-[12px]">{formatRupiah(getTotal(order))}</td>
                    <td className="py-3 px-3 text-right">
                      <span className={`py-1 px-2.5 rounded-md text-[9px] font-bold ${badge.cls}`}>{badge.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

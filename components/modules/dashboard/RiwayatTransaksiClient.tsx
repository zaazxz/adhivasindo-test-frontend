"use client";

import { useState, useEffect } from "react";
import { orderService } from "@/services/order.service";
import { toast } from "@/store/useToastStore";
import { FiSearch, FiChevronLeft, FiChevronRight, FiArrowDown, FiArrowUp, FiX, FiCheck, FiXCircle, FiEye } from "react-icons/fi";
import { FORMAT_RUPIAH, FORMAT_DATE_TIME, ITEMS_PER_PAGE_TRANSAKSI } from "@/constants";
import { Order, OrderItem } from "@/types";

export default function RiwayatTransaksiClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // DataTable states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = ITEMS_PER_PAGE_TRANSAKSI;

  // Modal states
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ orderId: string; action: string } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await orderService.getAll();
      const data = res.data?.data || res.data || res || [];
      const sorted = Array.isArray(data) ? data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) : [];
      setOrders(sorted);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Gagal memuat riwayat transaksi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setIsUpdating(true);
      await orderService.updateStatus(orderId, { status: newStatus });
      toast.success(`Status pesanan berhasil diubah ke "${newStatus.toUpperCase()}"`);
      setConfirmAction(null);
      fetchOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal mengubah status pesanan.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getCustomerName = (order: any) => {
    return order.user?.name || order.customer?.name || order.customer_name || order.name || "Tanpa Nama";
  };

  const getTotal = (order: Order) => Number(order.total_price || order.total_amount || order.total || 0);
  const getItems = (order: Order) => order.items || order.order_details || [];

  const getStatusBadge = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "paid" || s === "completed") return { cls: "bg-green-100 text-green-700", label: "PAID" };
    if (s === "acc" || s === "accepted") return { cls: "bg-blue-100 text-blue-700", label: "ACC" };
    if (s === "cancelled" || s === "reject" || s === "rejected") return { cls: "bg-red-100 text-red-700", label: s === "cancelled" ? "CANCELLED" : "REJECTED" };
    return { cls: "bg-amber-100 text-amber-700", label: (status || "PENDING").toUpperCase() };
  };

  // Sorting
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const processedOrders = [...orders]
    .filter((o) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      const ordNo = o.order_no || o.invoice_number || o.id || "";
      const userName = getCustomerName(o);
      return ordNo.toLowerCase().includes(q) || userName.toLowerCase().includes(q) || o.status.toLowerCase().includes(q);
    })
    .sort((a: any, b: any) => {
      if (!sortConfig) return 0;
      const { key, direction } = sortConfig;
      let aVal: any, bVal: any;
      if (key === "total") { aVal = getTotal(a); bVal = getTotal(b); }
      else if (key === "customer") { aVal = getCustomerName(a); bVal = getCustomerName(b); }
      else if (key === "date") { aVal = new Date(a.created_at).getTime(); bVal = new Date(b.created_at).getTime(); }
      else { aVal = a[key]; bVal = b[key]; }

      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(processedOrders.length / itemsPerPage);
  const currentData = processedOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchQuery]);

  const SortIcon = ({ col }: { col: string }) => {
    if (sortConfig?.key !== col) return null;
    return sortConfig.direction === "asc" ? <FiArrowUp className="inline" /> : <FiArrowDown className="inline" />;
  };

  const canAcc = (s: string) => !["acc", "accepted", "paid", "completed", "cancelled", "reject", "rejected"].includes(s.toLowerCase());
  const canPay = (s: string) => ["acc", "accepted"].includes(s.toLowerCase());
  const canReject = (s: string) => !["paid", "completed", "cancelled", "reject", "rejected"].includes(s.toLowerCase());

  return (
    <div className="bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 relative min-h-[400px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div>
          <h1 className="text-[18px] font-bold text-gray-800">Riwayat Transaksi</h1>
          <p className="text-[12px] text-gray-500 mt-1">Kelola semua pesanan masuk. Acc, bayar, atau tolak pesanan.</p>
        </div>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari invoice, pelanggan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#3b63f6] focus:ring-2 focus:ring-blue-50 w-full sm:w-72"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <svg className="animate-spin h-6 w-6 text-[#3b63f6]" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-10 text-gray-500 text-sm">Belum ada riwayat transaksi.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-3 cursor-pointer hover:text-gray-700" onClick={() => handleSort("id")}>
                  <div className="flex items-center gap-1">Order <SortIcon col="id" /></div>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-gray-700" onClick={() => handleSort("date")}>
                  <div className="flex items-center gap-1">Tanggal <SortIcon col="date" /></div>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-gray-700" onClick={() => handleSort("customer")}>
                  <div className="flex items-center gap-1">Pelanggan <SortIcon col="customer" /></div>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-gray-700" onClick={() => handleSort("total")}>
                  <div className="flex items-center gap-1">Total <SortIcon col="total" /></div>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-gray-700" onClick={() => handleSort("status")}>
                  <div className="flex items-center gap-1">Status <SortIcon col="status" /></div>
                </th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-gray-700">
              {currentData.length > 0 ? currentData.map((order) => {
                const badge = getStatusBadge(order.status);
                const s = (order.status || "").toLowerCase();
                return (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-3 font-bold text-[#3b63f6] text-[12px]">
                      {order.order_no || order.invoice_number || `#${String(order.id).substring(0, 8).toUpperCase()}`}
                    </td>
                    <td className="py-3 px-3 text-gray-500 text-[12px]">{FORMAT_DATE_TIME(order.created_at)}</td>
                    <td className="py-3 px-3 font-medium text-[12px]">{getCustomerName(order)}</td>
                    <td className="py-3 px-3 font-bold text-gray-900 text-[12px]">{FORMAT_RUPIAH(getTotal(order))}</td>
                    <td className="py-3 px-3">
                      <span className={`py-1 px-2.5 rounded-md text-[10px] font-bold ${badge.cls}`}>{badge.label}</span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setSelectedOrder(order)} className="text-gray-500 hover:text-[#3b63f6] hover:bg-blue-50 p-1.5 rounded-md transition-colors" title="Detail">
                          <FiEye size={14} />
                        </button>
                        {canAcc(s) && (
                          <button onClick={() => setConfirmAction({ orderId: String(order.id), action: "acc" })} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-md transition-colors" title="ACC & Lunas">
                            <FiCheck size={14} />
                          </button>
                        )}
                        {canReject(s) && (
                          <button onClick={() => setConfirmAction({ orderId: String(order.id), action: "reject" })} className="text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors" title="Reject">
                            <FiXCircle size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan={6} className="py-10 text-center text-gray-400 text-sm">Data tidak ditemukan.</td></tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 px-4 py-3 bg-gray-50/50 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-500">
                Menampilkan <span className="font-bold text-gray-800">{((currentPage - 1) * itemsPerPage) + 1}</span> - <span className="font-bold text-gray-800">{Math.min(currentPage * itemsPerPage, processedOrders.length)}</span> dari <span className="font-bold text-gray-800">{processedOrders.length}</span> transaksi
              </span>
              <div className="flex items-center gap-1">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-50 transition-colors">
                  <FiChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-7 h-7 rounded-md text-xs font-bold transition-colors ${currentPage === i + 1 ? "bg-[#3b63f6] text-white" : "border border-gray-200 text-gray-600 hover:bg-white"}`}>
                    {i + 1}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-50 transition-colors">
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="bg-white rounded-2xl w-full max-w-lg relative z-10 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 shrink-0">
              <h2 className="text-[16px] font-bold text-gray-800">Detail Pesanan</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 transition-colors"><FiX size={20} /></button>
            </div>
            <div className="p-5 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Order ID</div>
                  <div className="text-[13px] font-bold text-[#3b63f6]">{selectedOrder.order_no || selectedOrder.invoice_number || `#${String(selectedOrder.id).substring(0, 8)}`}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Status</div>
                  <span className={`py-0.5 px-2 rounded-md text-[10px] font-bold ${getStatusBadge(selectedOrder.status).cls}`}>{getStatusBadge(selectedOrder.status).label}</span>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Pelanggan</div>
                  <div className="text-[13px] font-semibold text-gray-800">{getCustomerName(selectedOrder)}</div>
                  {selectedOrder.user?.email && <div className="text-[11px] text-gray-400">{selectedOrder.user.email}</div>}
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Tanggal</div>
                  <div className="text-[13px] text-gray-700">{FORMAT_DATE_TIME(selectedOrder.created_at)}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Pembayaran</div>
                  <div className="text-[13px] font-semibold text-gray-800">{(selectedOrder.payment_method || "cash").toUpperCase()}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Total</div>
                  <div className="text-[16px] font-extrabold text-gray-800">{FORMAT_RUPIAH(getTotal(selectedOrder))}</div>
                </div>
              </div>

              <h3 className="text-[12px] font-bold text-gray-400 uppercase mb-3 border-t pt-4 border-gray-100">Item Pesanan</h3>
              <div className="space-y-3">
                {getItems(selectedOrder).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <div>
                      <div className="text-[13px] font-bold text-gray-800">{item.product?.name || `Product #${item.product_id}`}</div>
                      <div className="text-[11px] text-gray-400">{FORMAT_RUPIAH(item.price || item.product?.price || 0)} × {item.quantity || item.qty || 1}</div>
                    </div>
                    <div className="text-[13px] font-extrabold text-gray-800">
                      {FORMAT_RUPIAH(Number(item.price || item.product?.price || 0) * (item.quantity || item.qty || 1))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Admin Actions */}
              {(() => {
                const s = (selectedOrder.status || "").toLowerCase();
                const showActions = canAcc(s) || canPay(s) || canReject(s);
                if (!showActions) return null;
                return (
                  <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                    {canAcc(s) && (
                      <button onClick={() => { setSelectedOrder(null); setConfirmAction({ orderId: String(selectedOrder.id), action: "acc" }); }} className="flex-1 py-2.5 rounded-lg font-bold text-white bg-blue-500 hover:bg-blue-600 text-xs transition-colors">
                        ACC & Tandai Lunas
                      </button>
                    )}
                    {canReject(s) && (
                      <button onClick={() => { setSelectedOrder(null); setConfirmAction({ orderId: String(selectedOrder.id), action: "reject" }); }} className="flex-1 py-2.5 rounded-lg font-bold text-white bg-red-500 hover:bg-red-600 text-xs transition-colors">
                        Tolak Pesanan
                      </button>
                    )}
                  </div>
                );
              })()}
              
              {/* Invoice Button */}
              <div className="mt-4 flex justify-center">
                <a href={`/invoice/${selectedOrder.id}`} target="_blank" className="text-xs font-bold text-[#3b63f6] hover:underline flex items-center gap-1">
                  Lihat / Download Invoice
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">
              {confirmAction.action === "acc" ? "ACC Pesanan?" : confirmAction.action === "paid" ? "Tandai Lunas?" : "Tolak Pesanan?"}
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              {confirmAction.action === "acc"
                ? "Pesanan akan diterima dan menunggu pembayaran."
                : confirmAction.action === "paid"
                ? "Pesanan akan ditandai sudah lunas/dibayar."
                : "Pesanan akan ditolak dan tidak bisa diubah kembali."}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmAction(null)} className="flex-1 py-2.5 rounded-lg font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors text-sm">
                Batal
              </button>
              <button
                onClick={() => handleStatusChange(confirmAction.orderId, confirmAction.action === "acc" || confirmAction.action === "paid" ? "paid" : "cancelled")}
                disabled={isUpdating}
                className={`flex-1 py-2.5 rounded-lg font-bold text-white text-sm transition-colors flex justify-center items-center gap-2 ${
                  confirmAction.action === "reject" ? "bg-red-500 hover:bg-red-600 disabled:bg-red-300" :
                  "bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300"
                }`}
              >
                {isUpdating ? (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                ) : "Ya, Lanjutkan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

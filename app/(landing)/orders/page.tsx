"use client";

import { useEffect, useState } from "react";
import { Package, XCircle, CheckCircle, Clock } from "lucide-react";
import { orderService } from "@/services/order.service";
import { toast } from "@/store/useToastStore";
import Link from "next/link";
import { ImageIcon } from "lucide-react";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await orderService.getAll();
      const data = res.data?.data || res.data || res || [];
      // Sort orders by newest first (assuming ID or created_at sorting from API, if not we reverse it)
      const sorted = Array.isArray(data) ? data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) : [];
      setOrders(sorted);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to load your orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (id: string) => {
    try {
      setCancellingId(id);
      await orderService.updateStatus(id, { status: "cancelled" });
      toast.success("Order cancelled successfully");
      setShowConfirmModal(null);
      fetchOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to cancel order");
      console.error(error);
    } finally {
      setCancellingId(null);
    }
  };

  const formatRupiah = (n: number | string) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(n) || 0);

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const dtStr = dateString.endsWith("Z") ? dateString : dateString.replace(" ", "T") + "Z";
    return new Date(dtStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Jakarta"
    });
  };

  const getStatusDisplay = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "cancelled" || s === "reject" || s === "rejected") return { icon: <XCircle className="w-4 h-4 text-red-500" />, text: s === "cancelled" ? "Cancelled" : "Rejected", color: "text-red-500" };
    if (s === "acc" || s === "accepted") return { icon: <CheckCircle className="w-4 h-4 text-blue-500" />, text: "Accepted", color: "text-blue-500" };
    if (s === "completed" || s === "paid") return { icon: <CheckCircle className="w-4 h-4 text-green-500" />, text: "Paid", color: "text-green-500" };
    if (s === "delivered") return { icon: <Package className="w-4 h-4 text-teal-500" />, text: "Delivered", color: "text-teal-500" };
    return { icon: <Clock className="w-4 h-4 text-amber-500" />, text: status || "Pending", color: "text-amber-500" }; // Pending / Unpaid
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 flex justify-center items-center min-h-[50vh]">
        <svg className="animate-spin w-8 h-8 text-[#f59e0b]" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 min-h-[70vh]">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Order History</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">No orders found</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't made any purchases yet.</p>
          <Link href="/" className="inline-flex bg-[#f59e0b] hover:bg-amber-600 text-white font-bold py-2.5 px-6 rounded-lg text-sm transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const items = order.items || order.order_details || [];
            const total = order.total_price || order.total || items.reduce((acc: number, i: any) => acc + (Number(i.price) * (i.quantity || i.qty || 1)), 0);
            const statusInfo = getStatusDisplay(order.status);
            
            // Define rules for cancellation (e.g. only 'pending' or 'unpaid' can be cancelled)
            const canCancel = !["cancelled", "reject", "rejected", "completed", "paid", "acc", "accepted", "delivered"].includes((order.status || "").toLowerCase());

            return (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:border-amber-200 transition-colors">
                <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center gap-6">
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase">Order Placed</div>
                      <div className="text-xs font-bold text-gray-700">{formatDate(order.created_at)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase">Total</div>
                      <div className="text-xs font-bold text-gray-700">{formatRupiah(total)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-gray-400 uppercase">Order #{order.order_no || order.id || `INV-${order.id.slice?.(0,8)}`}</div>
                    <Link href={`/invoice/${order.id}`} className="text-xs font-bold text-[#f59e0b] hover:underline">
                      View Invoice
                    </Link>
                  </div>
                </div>
                
                <div className="p-5 flex flex-col md:flex-row gap-6 items-start justify-between">
                  <div className="flex-1">
                    <h3 className={`text-sm font-bold mb-2 flex items-center gap-2 ${statusInfo.color} uppercase`}>
                      {statusInfo.icon} {statusInfo.text}
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">
                      {order.payment_method ? `Payment Method: ${order.payment_method.toUpperCase()}` : "Cash on Delivery"}
                    </p>
                    
                    <div className="flex flex-wrap gap-3">
                      {items.map((item: any, idx: number) => {
                        const img = item.product?.image || item.image;
                        return (
                          <div key={idx} className="bg-gray-50 border border-gray-100 w-16 h-16 rounded-lg flex items-center justify-center p-1 group relative" title={item.product?.name || item.name}>
                            {img && img.length > 0 && img !== 'null' ? (
                              <img src={img} alt="product" className="w-full h-full object-contain mix-blend-multiply" />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-gray-300" />
                            )}
                            <div className="absolute -top-2 -right-2 bg-gray-800 text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity">
                              {item.quantity || item.qty || 1}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 w-full md:w-48">
                    {canCancel && (
                      <button 
                        onClick={() => setShowConfirmModal(String(order.id))}
                        disabled={cancellingId === String(order.id)}
                        className="w-full bg-white border border-red-200 hover:bg-red-50 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed font-bold py-2.5 rounded-lg text-xs transition-colors shadow-sm"
                      >
                        {cancellingId === String(order.id) ? "Cancelling..." : "Cancel Order"}
                      </button>
                    )}
                    <Link href={`/invoice/${order.id}`} className="w-full text-center bg-[#f59e0b] hover:bg-amber-600 text-white font-bold py-2.5 rounded-lg text-xs transition-colors shadow-sm">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">Cancel Order?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(null)}
                className="flex-1 py-2.5 rounded-lg font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
              >
                No, Keep it
              </button>
              <button
                onClick={() => handleCancelOrder(showConfirmModal)}
                disabled={cancellingId === showConfirmModal}
                className="flex-1 py-2.5 rounded-lg font-bold text-white bg-red-500 hover:bg-red-600 disabled:bg-red-300 transition-colors text-sm flex justify-center items-center gap-2"
              >
                {cancellingId === showConfirmModal ? (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  "Yes, Cancel"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { FiCheckCircle, FiDownload, FiArrowLeft } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { orderService } from "@/services/order.service";

export default function InvoicePage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        const res = await orderService.getById(id as string);
        // Depending on API response structure, usually res.data or res
        setOrder(res.data || res);
      } catch (err) {
        console.error("Failed to fetch order", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handlePrint = () => {
    window.print();
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
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta"
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 flex flex-col items-center justify-center min-h-[50vh]">
        <svg className="animate-spin w-8 h-8 text-[#f59e0b] mb-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="text-gray-500 font-medium">Loading invoice data...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Invoice Not Found</h1>
        <p className="text-gray-500 mb-8">We couldn't find the order details you requested.</p>
        <Link href="/" className="inline-flex items-center gap-2 bg-[#f59e0b] text-white px-6 py-2.5 rounded-lg font-bold">
          <FiArrowLeft /> Back to Home
        </Link>
      </div>
    );
  }

  // Handle both array of items or order_details
  const items = order.items || order.order_details || [];
  // Calculate total from API or manual
  const totalPaid = order.total_price || order.total || items.reduce((acc: number, item: any) => acc + (Number(item.price) * (item.quantity || item.qty || 1)), 0);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 print:py-0 print:px-0">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden print:shadow-none print:border-none print:w-full">
        <div className="bg-green-50 p-8 text-center border-b border-green-100 print:bg-white print:border-b-2 print:border-gray-200">
          <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 print:hidden" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Successful!</h1>
          <p className="text-sm text-gray-600 print:hidden">Thank you for your purchase. Your order has been received.</p>
        </div>
        
        <div className="p-8">
          <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Invoice Number</div>
              <div className="text-lg font-bold text-gray-800">{order.order_no || order.id || `#INV-${id?.slice(0, 8)}`}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date</div>
              <div className="text-sm font-bold text-gray-800">{formatDate(order.created_at)}</div>
            </div>
          </div>
          
          <div className="mb-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-2">Item</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Price</th>
                  <th className="py-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {items.map((item: any, idx: number) => {
                  const qty = item.quantity || item.qty || 1;
                  const price = Number(item.price || item.product?.price || 0);
                  const name = item.product?.name || item.name || `Product ${item.product_id}`;
                  return (
                    <tr key={idx} className="border-b border-gray-50">
                      <td className="py-3 font-semibold">{name}</td>
                      <td className="py-3 text-center">{qty}</td>
                      <td className="py-3 text-right">{formatRupiah(price)}</td>
                      <td className="py-3 text-right font-bold">{formatRupiah(price * qty)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-end mb-8">
            <div className="w-72 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-bold text-gray-800">{formatRupiah(totalPaid)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="font-bold text-green-500">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment Method</span>
                <span className="font-bold text-gray-800 uppercase">{order.payment_method || "CASH"}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="text-base font-bold text-gray-800">Total Paid</span>
                <span className="text-xl font-extrabold text-[#f59e0b]">{formatRupiah(totalPaid)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 print:hidden">
            <Link href="/" className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-center font-bold py-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
              <FiArrowLeft /> Back to Home
            </Link>
            <button 
              onClick={handlePrint}
              className="flex-1 bg-[#3b63f6] hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-sm transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <FiDownload /> Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

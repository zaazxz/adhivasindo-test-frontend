"use client";

import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, getTotalPrice } = useCartStore();
  const router = useRouter();

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/invoice");
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Shipping Information</h2>
            <form id="checkout-form" onSubmit={handlePay} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">First Name</label>
                  <input required type="text" className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#f59e0b]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Last Name</label>
                  <input required type="text" className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#f59e0b]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Address</label>
                <textarea required rows={3} className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#f59e0b]"></textarea>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Payment Method</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border border-amber-200 bg-amber-50 rounded-xl cursor-pointer">
                <input type="radio" name="payment" defaultChecked className="text-[#f59e0b] focus:ring-[#f59e0b]" />
                <span className="font-bold text-sm text-gray-800">Bank Transfer (Virtual Account)</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50">
                <input type="radio" name="payment" className="text-[#f59e0b] focus:ring-[#f59e0b]" />
                <span className="font-bold text-sm text-gray-800">Credit / Debit Card</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50">
                <input type="radio" name="payment" className="text-[#f59e0b] focus:ring-[#f59e0b]" />
                <span className="font-bold text-sm text-gray-800">E-Wallet (OVO, GoPay)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="w-full md:w-[350px]">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-bold text-gray-700">{item.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</div>
                  </div>
                  <div className="text-sm font-bold text-gray-800">Rp. {(item.price * item.quantity).toLocaleString('id-ID')}</div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="text-sm text-gray-400 text-center py-4">No items in cart</div>
              )}
            </div>
            
            <div className="border-t border-gray-100 pt-4 space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-bold text-gray-800">Rp. {getTotalPrice().toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="font-bold text-green-500">Free</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-6 pt-4 border-t border-gray-100">
              <span className="text-base font-bold text-gray-800">Total</span>
              <span className="text-xl font-extrabold text-[#f59e0b]">Rp. {getTotalPrice().toLocaleString('id-ID')}</span>
            </div>
            
            <button 
              type="submit" 
              form="checkout-form"
              disabled={items.length === 0}
              className="w-full bg-[#fbbf24] hover:bg-[#f59e0b] disabled:bg-gray-200 text-white font-bold py-3.5 rounded-lg text-sm transition-all shadow-md active:scale-95"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

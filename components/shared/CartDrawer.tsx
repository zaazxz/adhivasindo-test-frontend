"use client";

import { useState, useRef } from "react";
import { X, Minus, Plus, Trash2, ImageIcon, LogIn } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CartDrawer() {
  const { isOpen, items, setCartOpen, getTotalPrice, getTotalItems, updateQuantity, removeItem } = useCartStore();
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = !!user;
  const [checkingOut, setCheckingOut] = useState(false);
  const router = useRouter();

  const handleCheckout = () => {
    setCheckingOut(true);
    setTimeout(() => {
      setCheckingOut(false);
      setCartOpen(false);
      router.push("/checkout");
    }, 800);
  };

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[380px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-[#f59e0b]">Your Cart</h2>
                {isLoggedIn && (
                  <div className="bg-[#fbbf24] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                    {getTotalItems()}
                  </div>
                )}
              </div>
              <button onClick={() => setCartOpen(false)} className="text-gray-400 hover:text-gray-800 transition-colors hover:rotate-90 duration-200 cursor-pointer">
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Not logged in state */}
            {!isLoggedIn ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">🔒</div>
                <div className="text-sm text-gray-500 font-medium mb-4">Please sign in to view your cart</div>
                <Link
                  href="/login"
                  onClick={() => setCartOpen(false)}
                  className="inline-flex items-center gap-2 bg-[#f59e0b] hover:bg-amber-600 text-white font-bold py-2.5 px-6 rounded-lg text-sm transition-all"
                >
                  <LogIn className="w-4 h-4" /> Sign In
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh] pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start border-b border-gray-50 pb-4 group">
                    <div className="flex gap-3 flex-1 min-w-0">
                      {/* Product thumbnail */}
                      <div className="w-12 h-12 bg-[#f8f9fa] rounded-lg flex items-center justify-center shrink-0">
                        {item.image && item.image.length > 0 && item.image !== "null" ? (
                          <img src={item.image.startsWith('http') ? item.image : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000'}/storage/${item.image}`} alt={item.name} className="w-10 h-10 object-contain" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-gray-300" strokeWidth={1} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-[13px] font-bold text-gray-800 truncate">{item.name}</h4>
                        <p className="text-[11px] font-medium text-gray-400 mt-1">
                          {formatRupiah(Number(item.price))} × {item.quantity}
                        </p>
                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => {
                              if (item.quantity <= 1) {
                                removeItem(item.id);
                              } else {
                                updateQuantity(item.id, item.quantity - 1);
                              }
                            }}
                            className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-300 transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === "") {
                                updateQuantity(item.id, 1);
                                return;
                              }
                              const num = parseInt(val, 10);
                              if (!isNaN(num)) {
                                const maxStock = item.stock ?? 99;
                                updateQuantity(item.id, Math.max(1, Math.min(maxStock, num)));
                              }
                            }}
                            className="text-xs font-bold text-gray-700 w-8 text-center bg-transparent outline-none border-b border-transparent focus:border-gray-300 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.stock !== undefined && item.quantity >= item.stock}
                            className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-green-500 hover:border-green-300 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-400 disabled:hover:border-gray-200"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 ml-3">
                      <span className="text-[13px] font-bold text-gray-700">
                        {formatRupiah(Number(item.price) * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {items.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-3">🛒</div>
                    <div className="text-sm text-gray-400 font-medium">Your cart is empty</div>
                    <button 
                      onClick={() => setCartOpen(false)}
                      className="text-xs text-[#f59e0b] font-bold mt-2 hover:underline cursor-pointer"
                    >
                      Continue Shopping
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {isLoggedIn && items.length > 0 && (
            <div className="mt-auto p-6 sm:p-8 border-t border-gray-100 bg-white">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] font-medium text-gray-400">Subtotal</span>
                <span className="text-[13px] font-semibold text-gray-500">
                  {formatRupiah(getTotalPrice())}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] font-medium text-gray-400">Shipping</span>
                <span className="text-[13px] font-semibold text-green-500">Free</span>
              </div>
              <div className="flex justify-between items-center mb-6 pt-3 border-t border-gray-100">
                <span className="text-[13px] font-bold text-gray-800">Total</span>
                <span className="text-[15px] font-extrabold text-gray-800">
                  {formatRupiah(getTotalPrice())}
                </span>
              </div>
              <button
                disabled={checkingOut}
                onClick={handleCheckout}
                className="w-full bg-[#fbbf24] hover:bg-[#f59e0b] disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg text-sm transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                {checkingOut ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Continue to Checkout"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

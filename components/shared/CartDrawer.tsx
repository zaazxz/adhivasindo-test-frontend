"use client";

import { useState } from "react";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const { isOpen, items, setCartOpen, getTotalPrice, getTotalItems, updateQuantity, removeItem } = useCartStore();
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
                <h2 className="text-xl font-bold text-[#f59e0b]">Your cart</h2>
                <div className="bg-[#fbbf24] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                  {getTotalItems()}
                </div>
              </div>
              <button onClick={() => setCartOpen(false)} className="text-gray-400 hover:text-gray-800 transition-colors hover:rotate-90 duration-200">
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh] pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-start border-b border-gray-50 pb-4 group">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-bold text-gray-800 truncate">{item.name}</h4>
                    <p className="text-[11px] font-medium text-gray-400 mt-1">
                      Rp. {item.price.toLocaleString("id-ID")} × {item.quantity}
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
                        className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-300 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-gray-700 w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-green-500 hover:border-green-300 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-3">
                    <span className="text-[13px] font-bold text-gray-700">
                      Rp. {(item.price * item.quantity).toLocaleString("id-ID")}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
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
                    className="text-xs text-[#f59e0b] font-bold mt-2 hover:underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-auto p-6 sm:p-8 border-t border-gray-100 bg-white">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] font-medium text-gray-400">Subtotal</span>
              <span className="text-[13px] font-semibold text-gray-500">
                Rp. {getTotalPrice().toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] font-medium text-gray-400">Shipping</span>
              <span className="text-[13px] font-semibold text-green-500">Free</span>
            </div>
            <div className="flex justify-between items-center mb-6 pt-3 border-t border-gray-100">
              <span className="text-[13px] font-bold text-gray-800">Total</span>
              <span className="text-[15px] font-extrabold text-gray-800">
                Rp. {getTotalPrice().toLocaleString("id-ID")}
              </span>
            </div>
            <button
              disabled={items.length === 0 || checkingOut}
              onClick={handleCheckout}
              className="w-full bg-[#fbbf24] hover:bg-[#f59e0b] disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg text-sm transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
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
                "Continue to checkout"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

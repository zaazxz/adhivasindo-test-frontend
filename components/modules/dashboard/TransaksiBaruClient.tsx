"use client";

import { useState, useEffect, useMemo } from "react";
import { productService } from "@/services/product.service";
import { orderService } from "@/services/order.service";
import { toast } from "@/store/useToastStore";
import { useAuthStore } from "@/store/useAuthStore";
import { FiPlus, FiMinus, FiTrash2, FiSearch, FiImage } from "react-icons/fi";
import { FORMAT_RUPIAH } from "@/constants";
import { Product, KasirCartItem } from "@/types";

export default function TransaksiBaruClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<KasirCartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await productService.getAll();
      setProducts(res.data || res);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Gagal memuat daftar produk.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    return products.filter((p) => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const addToCart = (product: Product) => {
    if ((product.stock ?? 0) <= 0) {
      toast.error("Stok barang habis!");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= Number(product.stock)) {
          toast.error("Tidak bisa melebihi stok yang tersedia!");
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 } as KasirCartItem];
    });
  };

    const updateQuantity = (productId: number | string, delta: number | string, isAbsolute: boolean = false) => {
    setCart((prev) => {
      return prev.map((item) => {
        if (item.product.id === productId) {
          let newQty: number;
          if (isAbsolute) {
            newQty = typeof delta === 'string' ? (delta === '' ? 0 : Number(delta)) : delta;
            if (isNaN(newQty)) newQty = 1;
          } else {
            newQty = item.quantity + Number(delta);
          }
          
          if (newQty <= 0) return item; // Will be handled by remove or blur
          const maxStock = Number(item.product.stock);
          if (newQty > maxStock) {
            toast.error("Tidak bisa melebihi stok yang tersedia!");
            return { ...item, quantity: maxStock };
          }
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  const removeFromCart = (productId: number | string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Keranjang belanja masih kosong!");
      return;
    }

    try {
      setIsSubmitting(true);
      const orderData = {
        payment_method: "cash",
        customer_name: user?.name || "Admin Kasir",
        items: cart.map(item => ({
          product_id: String(item.product.id),
          quantity: item.quantity
        }))
      };

      await orderService.checkout(orderData);
      toast.success("Transaksi berhasil!");
      setCart([]);
      fetchProducts(); // Refresh stock
    } catch (error: any) {
      console.error("Checkout failed:", error);
      toast.error(error.response?.data?.message || "Transaksi gagal, silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      <div className="flex-1 bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 flex flex-col h-full lg:h-[calc(100vh-140px)]">
        <h1 className="text-[18px] font-bold text-gray-800 mb-6 shrink-0">Kasir / Transaksi Baru</h1>
        <div className="mb-4 relative shrink-0">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari Nama Barang..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-[13px] outline-none focus:border-[#3b63f6] focus:ring-4 focus:ring-blue-50 transition-all" 
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <svg className="animate-spin h-6 w-6 text-[#3b63f6]" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : filteredProducts.length === 0 ? (
             <div className="text-center py-10 text-gray-500 text-sm">
               Barang tidak ditemukan.
             </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 pb-4">
              {filteredProducts.map((product) => (
                <button 
                  key={product.id} 
                  onClick={() => addToCart(product)}
                  className="border border-gray-100 rounded-xl p-3 text-left hover:border-[#3b63f6] hover:bg-blue-50 transition-all flex flex-col items-center cursor-pointer group bg-white shadow-sm hover:shadow-md h-full relative"
                >
                  <div className="w-16 h-16 rounded-lg bg-gray-100 mb-3 overflow-hidden flex items-center justify-center shrink-0">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    ) : (
                      <FiImage className="text-gray-400 text-xl" />
                    )}
                  </div>
                  <div className="text-[12px] font-bold text-gray-700 text-center w-full truncate leading-tight">{product.name}</div>
                  <div className="text-[11px] font-extrabold text-[#3b63f6] mt-1">{FORMAT_RUPIAH(product.price)}</div>
                  <div className="text-[9px] font-semibold text-gray-400 mt-1.5">Stok: {product.stock ?? 0}</div>
                  
                  {(product.stock ?? 0) <= 0 && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] rounded-xl flex items-center justify-center">
                      <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded-md transform -rotate-12">HABIS</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-full lg:w-[350px] xl:w-[400px] bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 flex flex-col h-[500px] lg:h-[calc(100vh-140px)] shrink-0">
        <h2 className="text-[14px] font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3 flex justify-between items-center shrink-0">
          <span>Order Items</span>
          <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full">{cart.length} item</span>
        </h2>
        
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
               <div className="text-4xl mb-3">🛒</div>
               <div className="text-[12px] font-medium">Keranjang masih kosong</div>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="flex flex-col mb-4 border-b border-gray-50 pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="pr-2">
                    <div className="text-[12px] font-bold text-gray-800 leading-tight">{item.product.name}</div>
                    <div className="text-[11px] font-medium text-[#3b63f6] mt-0.5">{FORMAT_RUPIAH(item.product.price)}</div>
                  </div>
                  <div className="text-[12px] font-extrabold text-gray-800 shrink-0">
                    {FORMAT_RUPIAH(item.product.price * item.quantity)}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-3 bg-[#f8f9fa] rounded-lg p-1">
                    <button 
                      onClick={() => item.quantity > 1 ? updateQuantity(item.product.id, -1) : removeFromCart(item.product.id)}
                      className="w-6 h-6 rounded-md bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors"
                    >
                      {item.quantity > 1 ? <FiMinus size={12} /> : <FiTrash2 size={12} />}
                    </button>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={item.quantity || ""}
                      onChange={(e) => updateQuantity(item.product.id, e.target.value, true)}
                      onBlur={() => { if (!item.quantity || item.quantity < 1) updateQuantity(item.product.id, 1, true); }}
                      className="text-[12px] font-bold w-8 text-center bg-transparent outline-none border-b border-transparent focus:border-gray-300 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button 
                      onClick={() => updateQuantity(item.product.id, 1)}
                      disabled={item.quantity >= Number(item.product.stock)}
                      className="w-6 h-6 rounded-md bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-[#3b63f6] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <FiPlus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-4 border-t border-gray-100 mt-auto shrink-0 bg-white">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[13px] font-bold text-gray-500">Total Pembayaran</span>
            <span className="text-[20px] font-extrabold text-[#3b63f6]">{FORMAT_RUPIAH(total)}</span>
          </div>
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || isSubmitting}
            className="w-full bg-[#3b63f6] hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-[13px] transition-all shadow-[0_4px_14px_rgba(59,99,246,0.2)] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isSubmitting ? "Memproses..." : "Bayar Sekarang"}
          </button>
        </div>
      </div>
    </div>
  );
}

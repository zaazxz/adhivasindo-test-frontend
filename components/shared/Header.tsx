"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, User, Menu, X, ShoppingCart, Heart, LogIn, LogOut } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { authService } from "@/services/auth.service";
import Cookies from "js-cookie";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "@/store/useToastStore";
import { productService } from "@/services/product.service";
import { useStoreSettingsStore } from "@/store/useStoreSettingsStore";
import { FORMAT_RUPIAH } from "@/constants";

export default function Header() {
  const router = useRouter();
  const { setCartOpen, getTotalPrice, getTotalItems } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const isLoggedIn = !!user;
  const storeSettings = useStoreSettingsStore();

  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    productService.getAll().then((res: any) => {
      const data = res.data?.data || res.data || res || [];
      if (Array.isArray(data)) setProducts(data);
    }).catch(() => { });
  }, []);

  const dummyResults = products.filter((item) =>
    searchQuery.length > 0 && item.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error(e);
    } finally {
      Cookies.remove("access_token");
      Cookies.remove("user_role");
      setUser(null);
      setUserDropdownOpen(false);
      toast.success("Signed out successfully.");
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }
  };

  const handleCartClick = () => {
    if (!isLoggedIn) {
      toast.error("Please sign in to access your cart.");
      return;
    }
    setCartOpen(true);
  };

  const handleWishlistClick = () => {
    toast.info("Wishlist coming soon!");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push(`/`);
    }
    setSearchFocused(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b border-gray-100 py-4 relative print:hidden">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4 md:gap-8">
        {/* Logo */}
        <Link href="/" className="flex flex-col shrink-0 cursor-pointer">
          <span className="text-3xl font-bold text-[#f59e0b] tracking-tighter" style={{ fontFamily: "cursive" }}>Kkomi</span>
          <span className="text-[10px] font-medium text-gray-400 -mt-1 ml-1">Korean Cafe - 1989</span>
        </Link>

        {/* Search - hidden on mobile, shown on md+ */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl items-center bg-[#f8f9fa] rounded-full px-5 py-2.5 border border-gray-100 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              const val = e.target.value;
              setSearchQuery(val);
              if (!val.trim()) {
                router.push("/");
              }
            }}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            placeholder="Search for products..."
            className="flex-1 bg-transparent text-xs outline-none placeholder-gray-400 font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                router.push("/");
              }}
              className="mr-2 cursor-pointer text-gray-400 hover:text-red-500"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button type="submit" className="cursor-pointer">
            <Search className="w-4 h-4 text-gray-400 hover:text-[#f59e0b] transition-colors" />
          </button>

          {/* Search dropdown */}
          {searchFocused && searchQuery.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
              {dummyResults.length > 0 ? (
                dummyResults.map((result, i) => (
                  <button
                    key={i}
                    type="button"
                    className="w-full text-left px-5 py-2.5 text-xs font-medium text-gray-600 hover:bg-[#fef9e7] hover:text-[#f59e0b] transition-colors flex items-center gap-3 cursor-pointer"
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent blur
                      setSearchQuery(result.name);
                      setSearchFocused(false);
                      router.push(`/?search=${encodeURIComponent(result.name)}`);
                    }}
                  >
                    <Search className="w-3 h-3 text-gray-300" />
                    {result.name}
                    <span className="ml-auto text-[10px] text-gray-300">{result.type?.type_name || "Product"}</span>
                  </button>
                ))
              ) : (
                <div className="px-5 py-4 text-xs text-gray-400 text-center">
                  No results for &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          )}
        </form>

        {/* Right Actions - hidden on mobile */}
        <div className="hidden md:flex items-center gap-6">
          <div className="text-right hidden lg:block">
            <div className="text-[10px] font-semibold text-gray-400">For Support?</div>
            <div className="text-[13px] font-bold">{storeSettings.phoneNumber}</div>
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlistClick}
            className="text-gray-600 hover:text-red-400 transition-colors relative cursor-pointer"
          >
            <Heart className="w-5 h-5" strokeWidth={1.5} />
          </button>

          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="text-gray-600 hover:text-[#f59e0b] transition-colors cursor-pointer"
            >
              <User className="w-5 h-5" strokeWidth={1.5} />
            </button>
            {userDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)} />
                <div className="absolute right-0 top-full mt-3 bg-white rounded-xl shadow-lg border border-gray-100 py-2 w-48 z-50">
                  <div className="px-4 py-3 border-b border-gray-50">
                    <div className="text-[12px] font-bold text-gray-800">{isLoggedIn ? (user?.name || "Customer") : "Guest User"}</div>
                    <div className="text-[10px] text-gray-400">{isLoggedIn ? (user?.email || "customer@kkomi.com") : "Not signed in"}</div>
                  </div>
                  {isLoggedIn && (
                    <>
                      {user?.role === "admin" && (
                        <Link href="/dashboard" onClick={() => setUserDropdownOpen(false)} className="block w-full text-left px-4 py-2.5 text-[11px] font-medium text-gray-600 hover:bg-[#fef9e7] hover:text-[#f59e0b] transition-colors">
                          🎛️ Dashboard Admin
                        </Link>
                      )}
                      <Link href="/profile" onClick={() => setUserDropdownOpen(false)} className="block w-full text-left px-4 py-2.5 text-[11px] font-medium text-gray-600 hover:bg-[#fef9e7] hover:text-[#f59e0b] transition-colors">
                        👤 My Profile
                      </Link>
                      <Link href="/orders" onClick={() => setUserDropdownOpen(false)} className="block w-full text-left px-4 py-2.5 text-[11px] font-medium text-gray-600 hover:bg-[#fef9e7] hover:text-[#f59e0b] transition-colors">
                        📦 Order History
                      </Link>
                    </>
                  )}
                  <div className="border-t border-gray-50 mt-1 pt-1">
                    {isLoggedIn ? (
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-[11px] font-bold text-red-400 hover:bg-red-50 transition-colors flex items-center gap-2 cursor-pointer">
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    ) : (
                      <Link href="/login" onClick={() => setUserDropdownOpen(false)} className="block w-full text-left px-4 py-2.5 text-[11px] font-bold text-[#f59e0b] hover:bg-amber-50 transition-colors flex items-center gap-2">
                        <LogIn className="w-3.5 h-3.5" /> Sign In / Register
                      </Link>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Cart button */}
          <button
            onClick={handleCartClick}
            className="flex items-center gap-3 group text-left cursor-pointer"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-[#f59e0b] transition-colors" strokeWidth={1.5} />
              {isLoggedIn && getTotalItems() > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#f59e0b] text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </div>
            <div>
              <div className="text-[10px] font-semibold text-gray-400">
                Your Cart
              </div>
              <div className="text-[13px] font-bold group-hover:text-[#f59e0b] transition-colors">
                {isLoggedIn ? FORMAT_RUPIAH(getTotalPrice()) : "Sign in"}
              </div>
            </div>
          </button>
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={handleCartClick}
            className="text-gray-600 hover:text-[#f59e0b] transition-colors relative cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5" strokeWidth={1.5} />
            {isLoggedIn && getTotalItems() > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#f59e0b] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-600 hover:text-[#f59e0b] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="border-t border-gray-100 mt-4 px-4 py-4 space-y-4">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="flex items-center bg-[#f8f9fa] rounded-full px-4 py-2.5 border border-gray-100">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                if (!val.trim()) {
                  router.push("/");
                }
              }}
              placeholder="Search products..."
              className="flex-1 bg-transparent text-xs outline-none placeholder-gray-400 font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  router.push("/");
                }}
                className="mr-2 cursor-pointer text-gray-400 hover:text-red-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button type="submit" className="cursor-pointer">
              <Search className="w-4 h-4 text-gray-400" />
            </button>
          </form>

          {/* Mobile Links */}
          <div className="flex flex-col gap-1 pt-2 border-t border-gray-50">
            <button
              onClick={handleWishlistClick}
              className="flex items-center gap-3 text-gray-600 hover:text-red-400 transition-colors text-sm font-medium py-2 cursor-pointer"
            >
              <Heart className="w-4 h-4" strokeWidth={1.5} />
              Wishlist
            </button>
            {isLoggedIn ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-3 text-red-500 hover:text-red-600 transition-colors text-sm font-bold py-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 text-[#f59e0b] hover:text-amber-600 transition-colors text-sm font-bold py-2"
              >
                <LogIn className="w-4 h-4" />
                Sign In / Register
              </Link>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            <div className="text-[10px] font-semibold text-gray-400">Support:</div>
            <div className="text-[12px] font-bold">{storeSettings.phoneNumber}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

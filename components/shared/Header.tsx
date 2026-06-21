"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, User, Menu, X, ShoppingCart, Heart, LogIn } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function Header() {
  const { setCartOpen, getTotalPrice, getTotalItems } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const categories = ["All Categories", "Fruits & Veges", "Breads & Sweets", "Dairy", "Beverages", "Meat"];

  const dummyResults = [
    "Sunstar Fresh Banana Juice",
    "Chocolate",
    "Sunstar Fresh Melon Juice",
    "Sunstar Fresh Fruit Juice",
  ].filter((item) =>
    searchQuery.length > 0 && item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="border-b border-gray-100 py-4 relative">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4 md:gap-8">
        {/* Logo */}
        <div className="flex flex-col shrink-0 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <span className="text-3xl font-bold text-[#f59e0b] tracking-tighter" style={{ fontFamily: "cursive" }}>Kkomi</span>
          <span className="text-[10px] font-medium text-gray-400 -mt-1 ml-1">Korean Cafe - 1989</span>
        </div>

        {/* Search - hidden on mobile, shown on md+ */}
        <div className="hidden md:flex flex-1 max-w-2xl items-center bg-[#f8f9fa] rounded-full px-5 py-2.5 border border-gray-100 relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-transparent text-xs font-semibold text-gray-500 outline-none border-r border-gray-200 pr-3 mr-3 cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            placeholder="Search for more than 20,000 products"
            className="flex-1 bg-transparent text-xs outline-none placeholder-gray-400 font-medium"
          />
          <Search className="w-4 h-4 text-gray-400 cursor-pointer hover:text-[#f59e0b] transition-colors" />

          {/* Search dropdown */}
          {searchFocused && searchQuery.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
              {dummyResults.length > 0 ? (
                dummyResults.map((result, i) => (
                  <button
                    key={i}
                    className="w-full text-left px-5 py-2.5 text-xs font-medium text-gray-600 hover:bg-[#fef9e7] hover:text-[#f59e0b] transition-colors flex items-center gap-3"
                    onClick={() => {
                      setSearchQuery(result);
                      setSearchFocused(false);
                    }}
                  >
                    <Search className="w-3 h-3 text-gray-300" />
                    {result}
                    <span className="ml-auto text-[10px] text-gray-300">{selectedCategory}</span>
                  </button>
                ))
              ) : (
                <div className="px-5 py-4 text-xs text-gray-400 text-center">
                  No results for &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Actions - hidden on mobile */}
        <div className="hidden md:flex items-center gap-6">
          <div className="text-right hidden lg:block">
            <div className="text-[10px] font-semibold text-gray-400">For Support?</div>
            <div className="text-[13px] font-bold">+080-34984089</div>
          </div>

          {/* Wishlist */}
          <button
            onClick={() => alert("Wishlist coming soon! (Dummy)")}
            className="text-gray-600 hover:text-red-400 transition-colors relative"
          >
            <Heart className="w-5 h-5" strokeWidth={1.5} />
            <span className="absolute -top-1 -right-1.5 bg-red-400 text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
              2
            </span>
          </button>

          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="text-gray-600 hover:text-[#f59e0b] transition-colors"
            >
              <User className="w-5 h-5" strokeWidth={1.5} />
            </button>
            {userDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)} />
                <div className="absolute right-0 top-full mt-3 bg-white rounded-xl shadow-lg border border-gray-100 py-2 w-48 z-50">
                  <div className="px-4 py-3 border-b border-gray-50">
                    <div className="text-[12px] font-bold text-gray-800">Guest User</div>
                    <div className="text-[10px] text-gray-400">guest@kkomi.com</div>
                  </div>
                  <Link href="/profile" onClick={() => setUserDropdownOpen(false)} className="block w-full text-left px-4 py-2.5 text-[11px] font-medium text-gray-600 hover:bg-[#fef9e7] hover:text-[#f59e0b] transition-colors">
                    👤 My Profile
                  </Link>
                  <Link href="/orders" onClick={() => setUserDropdownOpen(false)} className="block w-full text-left px-4 py-2.5 text-[11px] font-medium text-gray-600 hover:bg-[#fef9e7] hover:text-[#f59e0b] transition-colors">
                    📦 Order History
                  </Link>
                  <Link href="/settings" onClick={() => setUserDropdownOpen(false)} className="block w-full text-left px-4 py-2.5 text-[11px] font-medium text-gray-600 hover:bg-[#fef9e7] hover:text-[#f59e0b] transition-colors">
                    ⚙️ Settings
                  </Link>
                  <div className="border-t border-gray-50 mt-1 pt-1">
                    <Link href="/login" onClick={() => setUserDropdownOpen(false)} className="block w-full text-left px-4 py-2.5 text-[11px] font-bold text-red-400 hover:bg-red-50 transition-colors flex items-center gap-2">
                      <LogIn className="w-3.5 h-3.5" /> Sign In / Register
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Cart button */}
          <button
            onClick={() => setCartOpen(true)}
            className="flex items-center gap-3 group text-left cursor-pointer"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-[#f59e0b] transition-colors" strokeWidth={1.5} />
              {getTotalItems() > 0 && (
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
                Rp. {getTotalPrice().toLocaleString("id-ID")}
              </div>
            </div>
          </button>
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => setCartOpen(true)}
            className="text-gray-600 hover:text-[#f59e0b] transition-colors relative"
          >
            <ShoppingCart className="w-5 h-5" strokeWidth={1.5} />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#f59e0b] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-600 hover:text-[#f59e0b] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-gray-100 mt-4 px-4 py-4 space-y-4">
          {/* Mobile Search */}
          <div className="flex items-center bg-[#f8f9fa] rounded-full px-4 py-2.5 border border-gray-100">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 bg-transparent text-xs outline-none placeholder-gray-400 font-medium"
            />
            <Search className="w-4 h-4 text-gray-400 cursor-pointer" />
          </div>

          {/* Mobile category filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-[#f8f9fa] rounded-full px-4 py-2.5 text-xs font-semibold text-gray-500 outline-none border border-gray-100"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Mobile Links */}
          <div className="flex flex-col gap-1 pt-2 border-t border-gray-50">
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 text-gray-600 hover:text-[#f59e0b] transition-colors text-sm font-medium py-2"
            >
              <User className="w-4 h-4" strokeWidth={1.5} />
              My Account
            </Link>
            <button
              onClick={() => alert("Wishlist (Dummy)")}
              className="flex items-center gap-3 text-gray-600 hover:text-red-400 transition-colors text-sm font-medium py-2"
            >
              <Heart className="w-4 h-4" strokeWidth={1.5} />
              Wishlist
              <span className="bg-red-100 text-red-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-auto">2</span>
            </button>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 text-[#f59e0b] hover:text-amber-600 transition-colors text-sm font-bold py-2"
            >
              <LogIn className="w-4 h-4" />
              Sign In / Register
            </Link>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            <div className="text-[10px] font-semibold text-gray-400">Support:</div>
            <div className="text-[12px] font-bold">+080-34984089</div>
          </div>
        </div>
      </div>
    </header>
  );
}

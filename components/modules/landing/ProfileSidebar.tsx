"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Lock, Settings } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function ProfileSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Simple auth check - if client-side and no token/user, redirect
    const token = Cookies.get("access_token");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  if (!isClient) return null;
  if (!user) return null; // Will redirect via useEffect

  const initials = user.name ? user.name.substring(0, 2).toUpperCase() : "GU";

  return (
    <div className="w-full md:w-64 shrink-0">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#f59e0b] flex items-center justify-center text-white font-bold">
            {initials}
          </div>
          <div>
            <div className="text-sm font-bold text-gray-800">{user.name}</div>
            <div className="text-xs text-gray-500 capitalize">{user.role || "Customer"}</div>
          </div>
        </div>
        <div className="p-2 space-y-1">
          <Link 
            href="/profile" 
            className={`flex items-center gap-3 px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
              pathname === "/profile" 
                ? "text-[#f59e0b] bg-amber-50" 
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <User className="w-4 h-4" /> Personal Info
          </Link>
          <Link 
            href="/settings" 
            className={`flex items-center gap-3 px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
              pathname === "/settings" 
                ? "text-[#f59e0b] bg-amber-50" 
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Lock className="w-4 h-4" /> Security & Password
          </Link>
          <Link 
            href="/orders" 
            className={`flex items-center gap-3 px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
              pathname === "/orders" 
                ? "text-[#f59e0b] bg-amber-50" 
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Settings className="w-4 h-4" /> Order History
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiBell, FiUser, FiMenu, FiX, FiSettings, FiLogOut, FiCheck, FiShoppingBag } from "react-icons/fi";
import { useSidebarStore } from "@/store/useSidebarStore";
import { authService } from "@/services/auth.service";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "@/store/useToastStore";
import { orderService } from "@/services/order.service";
import { productService } from "@/services/product.service";
import Link from "next/link";
import { Notification } from "@/types";

const searchablePages = [
  { name: "Dashboard Overview", path: "/dashboard", icon: "FiHome" },
  { name: "Master Barang (Products)", path: "/dashboard/master-barang", icon: "FiBox" },
  { name: "Tipe Produk (Categories)", path: "/dashboard/tipe-produk", icon: "FiBox" },
  { name: "Transaksi Baru", path: "/dashboard/transaksi/baru", icon: "FiShoppingCart" },
  { name: "Riwayat Transaksi", path: "/dashboard/transaksi/riwayat", icon: "FiShoppingCart" },
  { name: "Settings", path: "/dashboard/settings", icon: "FiSettings" },
  { name: "Public Storefront", path: "/", icon: "FiShoppingBag" },
];

export default function Topbar() {
  const router = useRouter();
  const toggleSidebar = useSidebarStore((state) => state.toggle);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch real notifications from orders & products
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.allSettled([
          orderService.getAll(),
          productService.getAll(),
        ]);

        const notifs: Notification[] = [];
        let notifId = 1;

        // Order-based notifications
        if (ordersRes.status === "fulfilled") {
          const ordersData = ordersRes.value.data?.data || ordersRes.value.data || ordersRes.value || [];
          const pending = (Array.isArray(ordersData) ? ordersData : []).filter((o: any) => (o.status || "").toLowerCase() === "pending");
          pending.slice(0, 3).forEach((o: any) => {
            notifs.push({
              id: notifId++,
              title: "Pesanan menunggu ACC",
              desc: `${o.order_no || '#' + String(o.id).substring(0,6)} dari ${o.user?.name || 'Customer'}`,
              time: new Date(o.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
              read: false,
              link: "/dashboard/transaksi/riwayat",
            });
          });
        }

        // Low stock notifications
        if (productsRes.status === "fulfilled") {
          const productsData = productsRes.value.data || productsRes.value || [];
          const lowStock = (Array.isArray(productsData) ? productsData : []).filter((p: any) => (p.stock || 0) <= 5 && (p.stock || 0) > 0);
          lowStock.slice(0, 2).forEach((p: any) => {
            notifs.push({
              id: notifId++,
              title: "Stok hampir habis",
              desc: `${p.name} tinggal ${p.stock}`,
              time: "Cek sekarang",
              read: false,
              link: "/dashboard/master-barang",
            });
          });

          const outOfStock = (Array.isArray(productsData) ? productsData : []).filter((p: any) => (p.stock || 0) === 0);
          outOfStock.slice(0, 2).forEach((p: any) => {
            notifs.push({
              id: notifId++,
              title: "Stok habis!",
              desc: `${p.name} perlu restock`,
              time: "Segera",
              read: false,
              link: "/dashboard/master-barang",
            });
          });
        }

        if (notifs.length === 0) {
          notifs.push({ id: 1, title: "Semua aman 👍", desc: "Tidak ada notifikasi baru", time: "Just now", read: true });
        }

        setNotifications(notifs);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };
    fetchNotifications();
  }, []);

  const filteredPages = searchablePages.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const closeAll = () => {
    setNotifOpen(false);
    setUserOpen(false);
    setSearchOpen(false);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      Cookies.remove("access_token");
      Cookies.remove("user_role");
      setUser(null);
      toast.success("Signed out successfully.");
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }
  };

  return (
    <header className="flex items-center justify-between h-[60px] bg-[#3b63f6] px-4 md:px-6 text-white shrink-0 relative">
      <div className="flex items-center">
        {/* Hamburger Menu */}
        <button
          onClick={toggleSidebar}
          className="text-white text-xl hover:opacity-80 transition-opacity cursor-pointer mr-4"
        >
          <FiMenu />
        </button>

        {/* Logo Section */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1">
            <span className="text-[26px] font-bold tracking-tight leading-none">
              <span className="text-[#a3e635]">a</span>
              <span className="text-white">W</span>
              <span className="text-white">H</span>
            </span>
          </div>
          <span className="text-[7px] text-white/80 leading-none mt-1 hidden sm:block">Integrate your dream</span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 md:gap-5">
        <div className="hidden sm:flex items-center gap-2 bg-[#5176f7] rounded-md px-3 py-1.5 w-[180px] md:w-[280px] relative">
          <FiSearch className="text-white/80 text-sm shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            placeholder="Search pages..."
            className="border-none outline-none text-[13px] text-white bg-transparent w-full placeholder-white/80"
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(""); setSearchOpen(false); }} className="text-white/60 hover:text-white">
              <FiX size={14} />
            </button>
          )}

          {/* Command Palette Dropdown */}
          {searchOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setSearchOpen(false)} />
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
                  Pages
                </div>
                <div className="max-h-[250px] overflow-y-auto">
                  {filteredPages.length > 0 ? (
                    filteredPages.map((page, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                          router.push(page.path);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-blue-50 hover:text-[#3b63f6] text-gray-700 text-xs font-medium transition-colors flex justify-between items-center"
                      >
                        {page.name}
                        <FiCheck className="text-transparent" />
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-xs text-gray-400 text-center">No pages found</div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Mobile search icon */}
        <button
          onClick={() => { setSearchOpen(!searchOpen); setNotifOpen(false); setUserOpen(false); }}
          className="sm:hidden text-white hover:opacity-80"
        >
          <FiSearch size={18} />
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false); setSearchOpen(false); }}
            className="text-white hover:opacity-80 relative"
          >
            <FiBell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={closeAll} />
              <div className="absolute right-0 top-full mt-3 bg-white rounded-xl shadow-2xl border border-gray-100 w-[320px] z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <span className="text-[12px] font-bold text-gray-800">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[10px] font-semibold text-[#3b63f6] hover:underline flex items-center gap-1"
                    >
                      <FiCheck size={12} /> Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.map((notif) => (
                    <button
                      key={notif.id}
                      onClick={() => { markRead(notif.id); toast.info(`${notif.title}: ${notif.desc}`); }}
                      className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-blue-50 transition-colors ${
                        !notif.read ? "bg-blue-50/50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {!notif.read && (
                          <span className="w-2 h-2 bg-[#3b63f6] rounded-full mt-1.5 shrink-0" />
                        )}
                        <div className={!notif.read ? "" : "ml-5"}>
                          <div className="text-[11px] font-bold text-gray-800">{notif.title}</div>
                          <div className="text-[10px] text-gray-500 mt-0.5">{notif.desc}</div>
                          <div className="text-[9px] text-gray-400 mt-1">{notif.time}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => { closeAll(); toast.info("All notifications coming soon!"); }}
                  className="w-full text-center py-2.5 text-[10px] font-bold text-[#3b63f6] hover:bg-gray-50 transition-colors"
                >
                  View All Notifications
                </button>
              </div>
            </>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => { setUserOpen(!userOpen); setNotifOpen(false); setSearchOpen(false); }}
            className="text-white hover:opacity-80 flex items-center gap-2"
          >
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <FiUser size={14} />
            </div>
            <span className="text-[12px] font-medium hidden md:block">{user?.name || "Admin"}</span>
          </button>

          {userOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={closeAll} />
              <div className="absolute right-0 top-full mt-3 bg-white rounded-xl shadow-2xl border border-gray-100 w-52 z-50 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <div className="text-[12px] font-bold text-gray-800">{user?.name || "Admin User"}</div>
                  <div className="text-[10px] text-gray-400">{user?.email || "admin@adivashindo.com"}</div>
                </div>
                <button
                  onClick={() => { closeAll(); router.push("/dashboard/settings"); }}
                  className="w-full text-left px-4 py-2.5 text-[11px] font-medium text-gray-600 hover:bg-blue-50 hover:text-[#3b63f6] transition-colors flex items-center gap-3"
                >
                  <FiUser size={14} /> My Profile
                </button>
                <button
                  onClick={() => { closeAll(); router.push("/dashboard/settings"); }}
                  className="w-full text-left px-4 py-2.5 text-[11px] font-medium text-gray-600 hover:bg-blue-50 hover:text-[#3b63f6] transition-colors flex items-center gap-3"
                >
                  <FiSettings size={14} /> Settings
                </button>
                <button
                  onClick={() => { closeAll(); router.push("/"); }}
                  className="w-full text-left px-4 py-2.5 text-[11px] font-medium text-gray-600 hover:bg-blue-50 hover:text-[#3b63f6] transition-colors flex items-center gap-3"
                >
                  <FiShoppingBag size={14} /> Go to Store
                </button>
                <div className="border-t border-gray-100">
                  <button
                    onClick={() => {
                      closeAll();
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-red-500 hover:bg-red-50 transition-colors flex items-center gap-3"
                  >
                    <FiLogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Search Dropdown */}
      {searchOpen && (
        <div className="absolute left-0 right-0 top-full bg-[#3b63f6] px-4 py-3 sm:hidden z-50 shadow-lg">
          <div className="flex items-center gap-2 bg-[#5176f7] rounded-md px-3 py-2">
            <FiSearch className="text-white/80 text-sm shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="border-none outline-none text-[13px] text-white bg-transparent w-full placeholder-white/80"
              autoFocus
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-white/60 hover:text-white">
                <FiX size={14} />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

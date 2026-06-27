"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdKeyboardArrowDown,
} from "react-icons/md";
import { FiHome, FiBox, FiShoppingCart, FiSettings, FiShoppingBag } from "react-icons/fi";
import type { IconType } from "react-icons";
import { useSidebarStore } from "@/store/useSidebarStore";
import { NavSubItem, NavItem, NavGroup } from "@/types";

const navItems: NavGroup[] = [
  {
    section: "AWH",
    sectionSub: "Dashboard",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: FiHome,
      },
    ],
  },
  {
    section: "STOREFRONT",
    sectionSub: "Public Website",
    items: [
      {
        label: "Go to Store",
        href: "/",
        icon: FiShoppingBag,
      },
    ],
  },
  {
    section: "PAGES",
    sectionSub: "Management",
    items: [
      {
        label: "Katalog",
        icon: FiBox,
        hasArrow: true,
        subItems: [
          { label: "Master Barang", href: "/dashboard/master-barang" },
          { label: "Tipe Produk", href: "/dashboard/tipe-produk" },
        ],
      },
      {
        label: "Transaksi",
        icon: FiShoppingCart,
        hasArrow: true,
        subItems: [
          { label: "Transaksi Baru", href: "/dashboard/transaksi/baru" },
          { label: "Riwayat Transaksi", href: "/dashboard/transaksi/riwayat" },
        ],
      },
      {
        label: "Settings",
        href: "/dashboard/settings",
        icon: FiSettings,
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebarStore();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile && isOpen) {
      toggle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 transition-opacity duration-300"
          onClick={toggle}
        />
      )}

      <aside
        className={`bg-white flex flex-col shrink-0 overflow-y-auto overflow-x-hidden shadow-[0_4px_8px_rgba(0,0,0,0.03)] z-30 transition-all duration-300 ease-in-out ${
          isMobile
            ? `fixed top-[60px] left-0 bottom-0 ${isOpen ? "w-[250px] translate-x-0" : "w-[250px] -translate-x-full"}`
            : isOpen
              ? "w-[250px] border-r border-gray-100"
              : "w-[0px] border-none opacity-0"
        }`}
      >
        <nav className="flex-1 flex flex-col py-5 w-[250px]">
          {navItems.map((group, gi) => (
            <div key={gi} className="mb-4">
              {group.section && (
                <div className="px-6 mb-2">
                  <div className="text-[11px] font-bold text-[#34395e] tracking-[1.5px] uppercase">
                    {group.section}
                  </div>
                  {group.sectionSub && (
                    <div className="text-[10px] font-medium text-[#98a6ad] mt-0.5 tracking-wide">
                      {group.sectionSub}
                    </div>
                  )}
                </div>
              )}
              <ul className="flex flex-col m-0 p-0 list-none">
                {group.items.map((item) => {
                  const isItemActive =
                    (item.href && pathname === item.href) ||
                    (item.subItems && item.subItems.some((sub) => pathname === sub.href));
                  const isMenuOpen = openMenus[item.label] || false;

                  return (
                    <li key={item.label}>
                      {/* Item wrapper */}
                      {item.subItems ? (
                        <div
                          className={`flex items-center gap-4 px-6 py-[14px] text-[14px] transition-all duration-200 cursor-pointer select-none ${
                            isItemActive
                              ? "bg-[#f8fafc] text-[#4361ee] font-semibold"
                              : "text-[#6c757d] hover:bg-[#f8fafc] hover:text-[#4361ee] font-medium"
                          }`}
                          onClick={() => toggleMenu(item.label)}
                        >
                          <item.icon
                            className={`text-[20px] ${
                              isItemActive ? "text-[#4361ee]" : "text-[#868e96]"
                            }`}
                          />
                          <span>{item.label}</span>
                          <MdKeyboardArrowDown
                            className={`ml-auto text-lg transition-transform duration-300 ${
                              isMenuOpen ? "rotate-180" : ""
                            } ${isItemActive ? "text-[#4361ee]" : "text-[#868e96]"}`}
                          />
                        </div>
                      ) : (
                        <Link
                          href={item.href || "#"}
                          className={`flex items-center gap-4 px-6 py-[14px] text-[14px] transition-all duration-200 ${
                            isItemActive
                              ? "bg-[#f8fafc] text-[#4361ee] font-semibold"
                              : "text-[#6c757d] hover:bg-[#f8fafc] hover:text-[#4361ee] font-medium"
                          }`}
                        >
                          <item.icon
                            className={`text-[20px] ${
                              isItemActive ? "text-[#4361ee]" : "text-[#868e96]"
                            }`}
                          />
                          <span>{item.label}</span>
                        </Link>
                      )}

                      {/* Submenu Drawer */}
                      {item.subItems && (
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isMenuOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                          }`}
                        >
                          <ul className="py-2 flex flex-col list-none">
                            {item.subItems.map((subItem) => {
                              const isSubActive = pathname === subItem.href;
                              return (
                                <li key={subItem.label}>
                                  <Link
                                    href={subItem.href}
                                    className={`flex items-center gap-3 pl-[52px] pr-6 py-2 text-[13px] font-medium transition-colors ${
                                      isSubActive
                                        ? "text-[#4361ee]"
                                        : "text-[#6c757d] hover:text-[#4361ee]"
                                    }`}
                                  >
                                    {/* Submenu dot */}
                                    <span
                                      className={`w-[5px] h-[5px] rounded-full transition-colors ${
                                        isSubActive ? "bg-[#4361ee]" : "border border-[#6c757d]"
                                      }`}
                                    ></span>
                                    {subItem.label}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}

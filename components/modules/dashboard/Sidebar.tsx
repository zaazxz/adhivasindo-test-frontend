"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdOutlineInventory2,
  MdOutlineShield,
  MdKeyboardArrowDown,
} from "react-icons/md";
import { FiHome } from "react-icons/fi";
import type { IconType } from "react-icons";

interface NavItem {
  label: string;
  href: string;
  icon: IconType;
  hasArrow?: boolean;
}

interface NavGroup {
  section: string | null;
  sectionSub?: string;
  items: NavItem[];
}

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
    section: "PAGES",
    sectionSub: "Prebuild Pages",
    items: [
      {
        label: "Master Barang",
        href: "/dashboard/master-barang",
        icon: MdOutlineInventory2,
      },
      {
        label: "Transaksi",
        href: "/dashboard/transaksi",
        icon: MdOutlineShield,
        hasArrow: true,
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[250px] bg-white flex flex-col shrink-0 overflow-y-auto shadow-[0_4px_8px_rgba(0,0,0,0.03)] z-10 border-r border-gray-100">
      <nav className="flex-1 flex flex-col py-5">
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
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-4 px-6 py-[14px] text-[14px] transition-all duration-200 ${
                        isActive
                          ? "bg-[#f8fafc] text-[#4361ee] font-semibold"
                          : "text-[#6c757d] hover:bg-[#f8fafc] hover:text-[#4361ee] font-medium"
                      }`}
                    >
                      <item.icon
                        className={`text-[20px] ${
                          isActive ? "text-[#4361ee]" : "text-[#868e96]"
                        }`}
                      />
                      <span>{item.label}</span>
                      {item.hasArrow && (
                        <MdKeyboardArrowDown
                          className={`ml-auto text-lg ${
                            isActive ? "text-[#4361ee]" : "text-[#868e96]"
                          }`}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

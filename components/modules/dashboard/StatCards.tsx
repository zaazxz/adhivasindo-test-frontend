"use client";

import { useState, useEffect } from "react";
import { FiCalendar, FiFileText, FiThumbsUp, FiX } from "react-icons/fi";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { productService } from "@/services/product.service";
import { productTypeService } from "@/services/product-type.service";
import { orderService } from "@/services/order.service";
import { FORMAT_RUPIAH } from "@/constants";
import { StatCardProps } from "@/types";

function StatCard({ value, label, valueColor, bottomColor, bgColor, icon, detail, isLoading }: StatCardProps) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <div
        onClick={() => !isLoading && setShowDetail(true)}
        className={`bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col relative overflow-hidden h-[105px] cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] select-none`}
      >
        <div className="flex-1 flex justify-between items-center px-4 md:px-6">
          <div className="min-w-0">
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-6 w-28 bg-gray-100 rounded-md animate-pulse" />
                <div className="h-3 w-20 bg-gray-50 rounded-md animate-pulse" />
              </div>
            ) : (
              <>
                <div className={`text-[18px] md:text-[22px] font-bold tracking-tight ${valueColor} truncate`}>{value}</div>
                <div className="text-[10px] md:text-[11px] text-gray-500 mt-1 font-semibold truncate">{label}</div>
              </>
            )}
          </div>
          <div className="shrink-0 ml-2">{icon}</div>
        </div>
        {/* Bottom thick border */}
        <div className={`h-2.5 w-full ${bottomColor}`} />
      </div>

      {/* Detail Modal */}
      {showDetail && (
        <>
          <div className="fixed inset-0 bg-black/30 z-50" onClick={() => setShowDetail(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 w-[90vw] max-w-[380px] overflow-hidden animate-[scaleIn_0.2s_ease-out]">
            <div className={`${bgColor} px-6 py-4 flex items-center justify-between`}>
              <h3 className="text-white font-bold text-[14px]">{detail.title}</h3>
              <button onClick={() => setShowDetail(false)} className="text-white/80 hover:text-white">
                <FiX size={18} />
              </button>
            </div>
            <div className="p-6">
              <div className={`text-3xl font-extrabold ${valueColor} mb-4`}>{value}</div>
              <div className="flex flex-col gap-3">
                {detail.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                    <span className="text-[11px] font-medium text-gray-500">{item.label}</span>
                    <span className="text-[12px] font-bold text-gray-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default function StatCards() {
  const [isLoading, setIsLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  const [totalSold, setTotalSold] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Fetch all data in parallel
      const [productsRes, categoriesRes, ordersRes] = await Promise.allSettled([
        productService.getAll(),
        productTypeService.getAll(),
        orderService.getAll(),
      ]);

      // Process products data
      const productsData = productsRes.status === "fulfilled" ? (productsRes.value.data || productsRes.value || []) : [];
      setProducts(productsData);
      setTotalStock(productsData.reduce((sum: number, p: any) => sum + (p.stock || 0), 0));

      // Process categories data
      const categoriesData = categoriesRes.status === "fulfilled" ? (categoriesRes.value.data || categoriesRes.value || []) : [];
      setCategories(categoriesData);
      setTotalCategories(categoriesData.length);

      // Process orders data
      const ordersData = ordersRes.status === "fulfilled" ? (ordersRes.value.data || ordersRes.value || []) : [];
      setOrders(ordersData);
      
      const validOrders = ordersData.filter((o: any) => {
        const s = (o.status || "").toLowerCase();
        return ["paid", "completed"].includes(s);
      });

      setTotalRevenue(validOrders.reduce((sum: number, o: any) => {
        const total = o.total_price || o.total_amount || o.total || 0;
        return sum + Number(total);
      }, 0));
      
      setTotalSold(validOrders.reduce((sum: number, o: any) => {
        const items = o.items || o.order_details || [];
        const itemCount = items.reduce((s: number, item: any) => s + (item.quantity || item.qty || 1), 0) || 0;
        return sum + itemCount;
      }, 0));
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Compute low stock products
  const lowStockProducts = products.filter((p) => (p.stock || 0) < 10);
  const outOfStockProducts = products.filter((p) => (p.stock || 0) === 0);

  const cards: StatCardProps[] = [
    {
      value: FORMAT_RUPIAH(totalRevenue),
      label: "Total Semua Pendapatan",
      valueColor: "text-[#f59e0b]",
      bottomColor: "bg-[#f59e0b]",
      bgColor: "bg-[#f59e0b]",
      icon: (
        <div className="w-10 h-10 rounded-full border-2 border-[#f59e0b] flex items-center justify-center text-[#f59e0b]">
          <AiOutlineDollarCircle size={22} />
        </div>
      ),
      detail: {
        title: "Revenue Breakdown",
        items: [
          { label: "Valid Orders (Paid/Completed)", value: `${orders.filter((o:any) => ["paid", "completed"].includes((o.status || "").toLowerCase())).length} orders` },
          { label: "Total Revenue", value: FORMAT_RUPIAH(totalRevenue) },
        ],
      },
    },
    {
      value: `${totalStock}`,
      label: "Stok Barang",
      valueColor: "text-[#ef4444]",
      bottomColor: "bg-[#ef4444]",
      bgColor: "bg-[#ef4444]",
      icon: <FiCalendar className="text-[#ef4444]" size={32} />,
      detail: {
        title: "Stock Details",
        items: [
          { label: "Total Products", value: `${products.length} items` },
          { label: "Total Stock Units", value: `${totalStock} units` },
          { label: "Low Stock (<10)", value: `${lowStockProducts.length} items` },
          { label: "Out of Stock", value: `${outOfStockProducts.length} items` },
        ],
      },
    },
    {
      value: `${totalSold}`,
      label: "Barang Telah Terjual",
      valueColor: "text-[#10b981]",
      bottomColor: "bg-[#10b981]",
      bgColor: "bg-[#10b981]",
      icon: <FiFileText className="text-[#10b981]" size={32} />,
      detail: {
        title: "Sales Summary",
        items: [
          { label: "Total Items Sold", value: `${totalSold} items` },
          { label: "Products Catalog", value: `${products.length} products` },
        ],
      },
    },
    {
      value: `${totalCategories}`,
      label: "Kategori Barang",
      valueColor: "text-[#3b82f6]",
      bottomColor: "bg-[#3b82f6]",
      bgColor: "bg-[#3b82f6]",
      icon: <FiThumbsUp className="text-[#3b82f6]" size={32} />,
      detail: {
        title: "Category List",
        items: categories.length > 0
          ? categories.slice(0, 5).map((c: any) => ({
              label: c.type_name || c.name,
              value: `${products.filter((p: any) => (p.type_id || p.product_type_id) === c.id).length} items`,
            }))
          : [{ label: "No categories found", value: "-" }],
      },
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-5">
      {cards.map((card, i) => (
        <StatCard key={i} {...card} isLoading={isLoading} />
      ))}
    </div>
  );
}

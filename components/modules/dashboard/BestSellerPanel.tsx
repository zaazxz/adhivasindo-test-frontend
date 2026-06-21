"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { toast } from "@/store/useToastStore";
import { orderService } from "@/services/order.service";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

interface BestSellerItem {
  name: string;
  sold: number;
  color: string;
}

export default function BestSellerPanel() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [bestSellers, setBestSellers] = useState<BestSellerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBestSellers();
  }, []);

  const fetchBestSellers = async () => {
    try {
      setIsLoading(true);
      const res = await orderService.getAll();
      const rawOrders = res.data?.data || res.data || res || [];
      const orders = Array.isArray(rawOrders) ? rawOrders : [];

      // Aggregate sold quantities per product from order items
      const productSales: Record<string, { name: string; sold: number }> = {};

      // Filter only paid/completed orders
      const paidOrders = orders.filter((o: any) => {
        const s = (o.status || "").toLowerCase();
        return ["paid", "completed"].includes(s);
      });

      paidOrders.forEach((order: any) => {
        const orderItems = order.items || order.order_details || [];
        if (Array.isArray(orderItems)) {
          orderItems.forEach((item: any) => {
            const productName = item.product?.name || item.name || `Product #${item.product_id}`;
            const key = item.product_id || productName;
            if (!productSales[key]) {
              productSales[key] = { name: productName, sold: 0 };
            }
            productSales[key].sold += item.quantity || item.qty || 0;
          });
        }
      });

      // Sort by most sold and take top 3
      const sorted = Object.values(productSales)
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 3)
        .map((item, i) => ({
          ...item,
          color: COLORS[i % COLORS.length],
        }));

      setBestSellers(sorted);
    } catch (error) {
      console.error("Failed to fetch best sellers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Compute chart data from best sellers
  const totalSold = bestSellers.reduce((sum, item) => sum + item.sold, 0);
  const chartData = bestSellers.map((item) => ({
    name: item.name,
    value: totalSold > 0 ? Math.round((item.sold / totalSold) * 100) : 0,
    color: item.color,
  }));

  // Top 3 for the bottom section
  const topProducts = bestSellers.slice(0, 3);

  return (
    <div className="bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5 flex flex-col h-auto lg:h-[340px]">
      <div className="font-bold text-[13px] text-gray-800 mb-6">Best Seller</div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="w-[120px] h-[120px] rounded-full bg-gray-100 animate-pulse" />
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-400 text-[12px]">
          No sales data yet.
        </div>
      ) : (
        <>
          <div className="h-[130px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.color}
                      opacity={activeIndex !== null && activeIndex !== index ? 0.4 : 1}
                      style={{ transition: "opacity 0.2s", cursor: "pointer" }}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "11px" }}
                  formatter={(value: any, name: any) => [`${value}%`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            {activeIndex !== null && chartData[activeIndex] && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-[18px] font-extrabold text-gray-800">{chartData[activeIndex].value}%</div>
                  <div className="text-[9px] font-semibold text-gray-400 truncate max-w-[80px]">{chartData[activeIndex].name}</div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4 text-[10px] font-semibold text-gray-500 mt-4 mb-auto flex-wrap">
            {chartData.map((item, i) => (
              <button
                key={i}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`flex items-center gap-1.5 transition-opacity cursor-pointer ${activeIndex !== null && activeIndex !== i ? "opacity-40" : ""}`}
              >
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate max-w-[60px]">{item.name}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-100 text-center px-2">
            {topProducts.length > 0 ? topProducts.map((prod, i) => (
              <button
                key={i}
                onClick={() => toast.info(`${prod.name}: ${prod.sold} units sold`)}
                className="hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors cursor-pointer"
              >
                <div className="text-[11px] font-bold text-gray-800 truncate max-w-[80px]">{prod.name}</div>
                <div className={`text-[13px] font-bold mt-0.5`} style={{ color: prod.color }}>{prod.sold}</div>
              </button>
            )) : (
              <div className="text-[11px] text-gray-400 w-full text-center">No data</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

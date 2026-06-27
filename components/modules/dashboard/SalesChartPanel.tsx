"use client";

import { useState, useEffect, useMemo } from "react";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { FiTrendingDown, FiTrendingUp } from "react-icons/fi";
import { orderService } from "@/services/order.service";
import { productService } from "@/services/product.service";
import { FORMAT_RUPIAH } from "@/constants";

type Period = "monthly" | "weekly";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function SalesChartPanel() {
  const [period, setPeriod] = useState<Period>("monthly");
  const [orders, setOrders] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [outOfStock, setOutOfStock] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [ordersRes, productsRes] = await Promise.allSettled([
        orderService.getAll(),
        productService.getAll(),
      ]);

      if (ordersRes.status === "fulfilled") {
        const allOrders = ordersRes.value.data || ordersRes.value || [];
        const paidOrders = allOrders.filter((o: any) => {
          const s = (o.status || "").toLowerCase();
          return ["paid", "completed"].includes(s);
        });
        setOrders(paidOrders);
      }
      if (productsRes.status === "fulfilled") {
        const prods = productsRes.value.data || productsRes.value || [];
        setTotalProducts(prods.length);
        setOutOfStock(prods.filter((p: any) => (p.stock || 0) === 0).length);
      }
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Aggregate orders into chart data
  const chartData = useMemo(() => {
    if (orders.length === 0) return [];

    if (period === "monthly") {
      // Group by month of current year
      const monthlyMap: Record<number, number> = {};
      orders.forEach((order) => {
        const date = new Date(order.created_at);
        const month = date.getMonth();
        monthlyMap[month] = (monthlyMap[month] || 0) + Number(order.total_price || order.total_amount || order.total || 0);
      });

      return MONTH_NAMES.map((name, i) => ({
        name,
        value: monthlyMap[i] || 0,
      })).filter((_, i) => {
        // Only show months up to current month + any months with data
        const currentMonth = new Date().getMonth();
        return i <= currentMonth || (monthlyMap[i] || 0) > 0;
      });
    } else {
      // Group by day of week from last 7 days
      const weeklyMap: Record<number, number> = {};
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      orders.forEach((order) => {
        const date = new Date(order.created_at);
        if (date >= sevenDaysAgo) {
          const day = date.getDay();
          weeklyMap[day] = (weeklyMap[day] || 0) + Number(order.total_price || order.total_amount || order.total || 0);
        }
      });

      return DAY_NAMES.map((name, i) => ({
        name,
        value: weeklyMap[i] || 0,
      }));
    }
  }, [orders, period]);

  const total = chartData.reduce((s, d) => s + d.value, 0);
  const avg = chartData.length > 0 ? Math.round(total / chartData.length) : 0;
  const totalItemsSold = orders.reduce((sum, o) => {
    return sum + (o.items?.reduce((s: number, item: any) => s + (item.quantity || 0), 0) || 0);
  }, 0);

  // Compute trend percentage
  const trendPercent = useMemo(() => {
    if (chartData.length < 2) return 0;
    const lastTwo = chartData.slice(-2);
    if (lastTwo[0].value === 0) return lastTwo[1].value > 0 ? 100 : 0;
    return Math.round(((lastTwo[1].value - lastTwo[0].value) / lastTwo[0].value) * 100);
  }, [chartData]);

  return (
    <div className="bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col h-auto lg:h-[340px]">
      <div className="bg-[#3b63f6] p-5 pb-2 text-white">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-[13px]">Penjualan per {period === "monthly" ? "Bulan" : "Minggu"}</span>
          <div className="flex items-center gap-2">
            <div className="flex bg-white/10 rounded-md overflow-hidden">
              <button onClick={() => setPeriod("weekly")} className={`text-[9px] font-bold px-2.5 py-1 transition-colors cursor-pointer ${period === "weekly" ? "bg-white/20 text-white" : "text-white/60 hover:text-white/80"}`}>Week</button>
              <button onClick={() => setPeriod("monthly")} className={`text-[9px] font-bold px-2.5 py-1 transition-colors cursor-pointer ${period === "monthly" ? "bg-white/20 text-white" : "text-white/60 hover:text-white/80"}`}>Month</button>
            </div>
            <span className="text-xs flex items-center gap-1 opacity-90">
              {trendPercent >= 0 ? <FiTrendingUp /> : <FiTrendingDown />} {Math.abs(trendPercent)}%
            </span>
          </div>
        </div>
        <div className="h-[120px] w-[105%] ml-[-2.5%]">
          {isLoading ? (
            <div className="flex items-end justify-around h-full px-4 pb-2 gap-2">
              {[40, 60, 35, 80, 55, 70, 45].map((h, i) => (
                <div key={i} className="bg-white/10 rounded-t-sm animate-pulse" style={{ height: `${h}%`, width: "12%" }} />
              ))}
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-white/50 text-[12px]">
              No sales data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e3a8a", border: "none", borderRadius: "8px", fontSize: "11px", color: "#fff" }}
                  formatter={(value: any) => [FORMAT_RUPIAH(Number(value)), "Revenue"]}
                  labelStyle={{ color: "rgba(255,255,255,0.7)", fontSize: "10px" }}
                />
                <Line type="monotone" dataKey="value" stroke="#ffffff" strokeWidth={2} dot={{ fill: "#fff", r: 3, strokeWidth: 0 }} activeDot={{ fill: "#fbbf24", r: 5, strokeWidth: 2, stroke: "#fff" }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-center px-4">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-800">{isLoading ? "..." : FORMAT_RUPIAH(avg)}</div>
            <div className="text-[10px] font-semibold text-gray-400 mt-0.5">Rata-rata</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-800">{isLoading ? "..." : orders.length}</div>
            <div className="text-[10px] font-semibold text-gray-400 mt-0.5">Transaksi</div>
          </div>
        </div>
        <div className="flex justify-between items-center px-4 pt-4 mt-auto border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-gray-500">Stok Habis</span>
            <span className="font-bold text-[#ef4444]">{isLoading ? "..." : outOfStock}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-gray-500">Barang Terjual</span>
            <span className="font-bold text-[#10b981]">{isLoading ? "..." : totalItemsSold || orders.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

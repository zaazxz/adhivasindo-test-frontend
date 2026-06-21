import api from "@/lib/axios";

export const dashboardService = {
  // Get summary stats for the dashboard cards
  getSummary: async () => {
    const response = await api.get("/dashboard/summary");
    return response.data;
  },

  // Get sales chart data
  getSalesChart: async (period: "weekly" | "monthly") => {
    const response = await api.get("/dashboard/sales-chart", {
      params: { period },
    });
    return response.data;
  },

  // Get best seller data
  getBestSellers: async () => {
    const response = await api.get("/dashboard/best-sellers");
    return response.data;
  },

  // Get stock overview
  getStockOverview: async () => {
    const response = await api.get("/dashboard/stock-overview");
    return response.data;
  },
};

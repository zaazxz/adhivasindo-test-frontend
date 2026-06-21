import api from "@/lib/axios";

export const orderService = {
  checkout: async (data: { payment_method: string; customer_name?: string; address?: string; items: { product_id: string; quantity: number }[] }) => {
    const response = await api.post("/orders", data);
    return response.data;
  },

  getAll: async (params?: any) => {
    const response = await api.get("/orders", { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, data: { status: string }) => {
    const response = await api.patch(`/orders/${id}/status`, data);
    return response.data;
  },
};

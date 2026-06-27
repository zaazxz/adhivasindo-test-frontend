import api from "@/lib/axios";

export const productService = {
  getAll: async (params?: any) => {
    const defaultParams = { per_page: 1000 };
    const response = await api.get("/products", { params: { ...defaultParams, ...params } });
    return response.data;
  },

  getBestSellers: async (limit: number = 3) => {
    const response = await api.get("/products/best-sellers", { params: { limit } });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  create: async (formData: FormData) => {
    const response = await api.post("/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  update: async (id: string, formData: FormData) => {
    // Note: Laravel requires _method: PATCH for form-data updates
    formData.append("_method", "PATCH");
    
    const response = await api.post(`/products/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

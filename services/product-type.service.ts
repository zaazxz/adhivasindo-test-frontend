import api from "@/lib/axios";

export const productTypeService = {
  getAll: async (params?: any) => {
    const defaultParams = { per_page: 1000 };
    const response = await api.get("/product-types", { params: { ...defaultParams, ...params } });
    return response.data;
  },

  create: async (data: { name: string }) => {
    const response = await api.post("/product-types", data);
    return response.data;
  },

  update: async (id: string, data: { name: string }) => {
    const response = await api.patch(`/product-types/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/product-types/${id}`);
    return response.data;
  },
};

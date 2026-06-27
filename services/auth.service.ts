import api from "@/lib/axios";

export const authService = {
  register: async (data: any) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  login: async (data: any) => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  me: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  refreshToken: async () => {
    const response = await api.post("/auth/refresh");
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await api.patch("/auth/profile", data);
    return response.data;
  },

  changePassword: async (data: any) => {
    const response = await api.post("/auth/change-password", data);
    return response.data;
  },
};

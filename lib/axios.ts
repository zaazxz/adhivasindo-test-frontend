import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Request interceptor - Cookies
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = Cookies.get("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Response interceptor — handle token expired (401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== "undefined") {
                Cookies.remove("access_token");
                // redirect login if not on login page
                if (!window.location.pathname.startsWith("/login")) {
                    window.location.href = "/login";
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;

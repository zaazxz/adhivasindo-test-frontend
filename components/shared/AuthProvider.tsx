"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";
import Cookies from "js-cookie";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get("access_token");
      if (token) {
        try {
          const userData = await authService.me();
          const user = userData.user || userData;
          setUser(user);
        } catch (error) {
          console.error("Failed to fetch user in AuthProvider:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsInitialized(true);
    };

    initAuth();
  }, [setUser]);

  return <>{children}</>;
}

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import Cookies from "js-cookie";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "@/store/useToastStore";

export const useLogin = () => {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await authService.login({ email, password });
      if (res.access_token) {
        Cookies.set("access_token", res.access_token);
        
        try {
          const userData = await authService.me();
          const user = userData.user || userData;
          
          setUser(user);

          if (user?.role) {
             Cookies.set("user_role", user.role);
          }
          
          if (user?.role === "customer") {
             toast.success("Welcome back to Kkomi!");
             router.push("/");
          } else {
             toast.success("Welcome back, Admin!");
             router.push("/dashboard"); 
          }
        } catch (meError) {
           console.error("Failed to fetch user data:", meError);
           toast.success("Login successful!");
           router.push("/dashboard"); 
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    isLoading,
    handleSubmit
  };
};

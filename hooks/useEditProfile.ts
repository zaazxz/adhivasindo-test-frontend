import { useState, useEffect } from "react";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "@/store/useToastStore";
import { UpdateProfilePayload } from "@/types";

export const useEditProfile = () => {
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required.");
      return;
    }

    setIsLoading(true);
    try {
      const payload: UpdateProfilePayload = { name, email };
      const res = await authService.updateProfile(payload);
      
      // Update the global store with new user data if backend returns it, or merge locally
      if (res && user) {
        setUser({ ...user, name, email });
        toast.success("Profile updated successfully!");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    isLoading,
    handleSubmit
  };
};

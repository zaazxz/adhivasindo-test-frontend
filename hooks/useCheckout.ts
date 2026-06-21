import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { orderService } from "@/services/order.service";
import { toast } from "@/store/useToastStore";

export function useCheckout() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        payment_method: "cash",
        items: items.map((item) => ({
          product_id: String(item.id),
          quantity: item.quantity,
        })),
      };

      const res = await orderService.checkout(payload);
      clearCart();
      toast.success("Order placed successfully!");

      const orderId = res.data?.id || res.id;
      if (orderId) {
        router.push(`/invoice/${orderId}`);
      } else {
        // Fallback if structure is weird
        router.push(`/orders`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to process order.");
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return {
    items,
    getTotalPrice,
    isSubmitting,
    handlePay,
  };
}

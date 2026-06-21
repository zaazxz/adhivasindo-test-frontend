"use client";

import { useToastStore } from "@/store/useToastStore";
import { FiCheckCircle, FiXCircle, FiInfo, FiX } from "react-icons/fi";

export default function ToastProvider() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3">
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          className="flex items-start gap-3 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 rounded-2xl p-4 min-w-[320px] max-w-md animate-[slideInRight_0.3s_ease-out]"
        >
          <div className="mt-0.5">
            {toast.type === "success" && <FiCheckCircle className="text-green-500 shrink-0" size={22} />}
            {toast.type === "error" && <FiXCircle className="text-red-500 shrink-0" size={22} />}
            {toast.type === "info" && <FiInfo className="text-blue-500 shrink-0" size={22} />}
          </div>
          
          <div className="flex-1 text-[13px] font-semibold text-gray-800 leading-snug pr-2">
            {toast.message}
          </div>
          
          <button 
            onClick={() => removeToast(toast.id)} 
            className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-1.5 rounded-full transition-colors shrink-0"
          >
            <FiX size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

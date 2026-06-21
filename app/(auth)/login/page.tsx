"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/");
    }, 1000);
  };

  return (
    <div className="w-full max-w-sm mx-auto animate-[fadeIn_0.3s_ease-out]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back! 👋</h1>
        <p className="text-sm font-medium text-gray-500">Sign in to your Kkomi account.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wide mb-2">Email Address</label>
          <input 
            type="email" 
            placeholder="hello@example.com"
            required
            className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:border-[#f59e0b] focus:ring-4 focus:ring-amber-50 focus:bg-white transition-all"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wide">Password</label>
            <a href="#" className="text-[11px] font-bold text-[#f59e0b] hover:text-amber-600 transition-colors">Forgot password?</a>
          </div>
          <input 
            type="password" 
            placeholder="••••••••"
            required
            className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:border-[#f59e0b] focus:ring-4 focus:ring-amber-50 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="remember" className="rounded border-gray-300 text-[#f59e0b] focus:ring-[#f59e0b] cursor-pointer" />
          <label htmlFor="remember" className="text-xs font-medium text-gray-600 cursor-pointer select-none">Remember me for 30 days</label>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-[#f59e0b] hover:bg-amber-600 disabled:bg-amber-300 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md shadow-amber-200 hover:shadow-lg hover:shadow-amber-200 active:scale-[0.98] mt-6 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Signing in...
            </>
          ) : (
            <>
              Sign In <LogIn className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-8 border-t border-gray-100 text-center text-sm font-medium text-gray-500">
        Don&apos;t have an account? <Link href="/register" className="text-[#f59e0b] font-bold hover:text-amber-600 transition-colors">Create one now</Link>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import { useRegister } from "@/hooks/useRegister";

export default function RegisterPage() {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    passwordConfirmation,
    setPasswordConfirmation,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isLoading,
    handleSubmit
  } = useRegister();

  return (
    <div className="w-full max-w-sm mx-auto animate-[fadeIn_0.3s_ease-out]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Create Account ✨</h1>
        <p className="text-sm font-medium text-gray-500">Sign up to get exclusive cafe offers.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wide mb-1.5">Full Name</label>
          <input 
            type="text" 
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#f59e0b] focus:ring-4 focus:ring-amber-50 focus:bg-white transition-all"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wide mb-1.5">Email Address</label>
          <input 
            type="email" 
            placeholder="hello@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#f59e0b] focus:ring-4 focus:ring-amber-50 focus:bg-white transition-all"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wide mb-1.5">Password</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#f59e0b] focus:ring-4 focus:ring-amber-50 focus:bg-white transition-all pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wide mb-1.5">Confirm Password</label>
          <div className="relative">
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="••••••••"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#f59e0b] focus:ring-4 focus:ring-amber-50 focus:bg-white transition-all pr-12"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-[#f59e0b] hover:bg-amber-600 disabled:bg-amber-300 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md shadow-amber-200 hover:shadow-lg hover:shadow-amber-200 active:scale-[0.98] mt-8 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating account...
            </>
          ) : (
            <>
              Create Account <UserPlus className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-8 border-t border-gray-100 text-center text-sm font-medium text-gray-500">
        Already have an account? <Link href="/login" className="text-[#f59e0b] font-bold hover:text-amber-600 transition-colors">Sign in here</Link>
      </div>
    </div>
  );
}

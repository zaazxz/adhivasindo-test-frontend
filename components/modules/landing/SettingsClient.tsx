"use client";

import { useChangePassword } from "@/hooks/useChangePassword";
import { Eye, EyeOff, Shield } from "lucide-react";

export default function SettingsClient() {
  const {
    currentPassword, setCurrentPassword,
    newPassword, setNewPassword,
    confirmPassword, setConfirmPassword,
    showCurrentPassword, setShowCurrentPassword,
    showNewPassword, setShowNewPassword,
    showConfirmPassword, setShowConfirmPassword,
    isLoading,
    handleSubmit
  } = useChangePassword();

  return (
    <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-3">
        <Shield className="w-5 h-5 text-[#f59e0b]" />
        <h2 className="text-lg font-bold text-gray-800">Security & Password</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Current Password</label>
          <div className="relative">
            <input 
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              required
              className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-sm font-medium outline-none focus:border-[#f59e0b] transition-colors" 
            />
            <button 
              type="button" 
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">New Password</label>
          <div className="relative">
            <input 
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
              className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-sm font-medium outline-none focus:border-[#f59e0b] transition-colors" 
            />
            <button 
              type="button" 
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Confirm New Password</label>
          <div className="relative">
            <input 
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-sm font-medium outline-none focus:border-[#f59e0b] transition-colors" 
            />
            <button 
              type="button" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="pt-4 mt-2 border-t border-gray-100">
          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-[#f59e0b] hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 px-6 rounded-lg text-sm transition-all shadow-md active:scale-95"
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}

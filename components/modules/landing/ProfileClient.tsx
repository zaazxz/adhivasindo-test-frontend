"use client";

import { useEditProfile } from "@/hooks/useEditProfile";

export default function ProfileClient() {
  const { name, setName, email, setEmail, isLoading, handleSubmit } = useEditProfile();

  return (
    <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <h2 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-2">Personal Information</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Full Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            required
            className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-[#f59e0b] transition-colors" 
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Email Address</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-[#f59e0b] transition-colors" 
          />
        </div>

        <div className="pt-4 mt-2 border-t border-gray-100">
          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-[#f59e0b] hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 px-6 rounded-lg text-sm transition-all shadow-md active:scale-95"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

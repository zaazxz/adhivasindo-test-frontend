import { User, Settings, Lock } from "lucide-react";

export const metadata = {
  title: "My Profile - Adivashindo",
};

export default function ProfilePage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">My Profile</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f59e0b] flex items-center justify-center text-white font-bold">
                JD
              </div>
              <div>
                <div className="text-sm font-bold text-gray-800">John Doe</div>
                <div className="text-xs text-gray-500">Customer</div>
              </div>
            </div>
            <div className="p-2 space-y-1">
              <a href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-[#f59e0b] bg-amber-50 rounded-lg">
                <User className="w-4 h-4" /> Personal Info
              </a>
              <a href="/orders" className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <Lock className="w-4 h-4" /> Security
              </a>
              <a href="/settings" className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <Settings className="w-4 h-4" /> Preferences
              </a>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-2">Personal Information</h2>
          <form className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">First Name</label>
                <input type="text" defaultValue="John" className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-[#f59e0b]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Last Name</label>
                <input type="text" defaultValue="Doe" className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-[#f59e0b]" />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Email Address</label>
              <input type="email" defaultValue="johndoe@example.com" className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-[#f59e0b]" />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Phone Number</label>
              <input type="tel" defaultValue="+62 812 3456 7890" className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-[#f59e0b]" />
            </div>

            <div className="pt-4 mt-2 border-t border-gray-100">
              <button type="button" className="bg-[#f59e0b] hover:bg-amber-600 text-white font-bold py-2.5 px-6 rounded-lg text-sm transition-all shadow-md active:scale-95">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

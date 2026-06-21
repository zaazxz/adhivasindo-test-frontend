import { Bell, CreditCard, Shield } from "lucide-react";

export const metadata = {
  title: "Account Settings - Adivashindo",
};

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Account Settings</h1>
      
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-3">
            <Bell className="w-5 h-5 text-[#f59e0b]" />
            <h2 className="text-lg font-bold text-gray-800">Notifications</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-start gap-4 cursor-pointer">
              <input type="checkbox" defaultChecked className="mt-1 rounded border-gray-300 text-[#f59e0b] focus:ring-[#f59e0b]" />
              <div>
                <div className="text-sm font-bold text-gray-800">Order Updates</div>
                <div className="text-xs text-gray-500">Get notified when your order is processed or shipped.</div>
              </div>
            </label>
            <label className="flex items-start gap-4 cursor-pointer">
              <input type="checkbox" defaultChecked className="mt-1 rounded border-gray-300 text-[#f59e0b] focus:ring-[#f59e0b]" />
              <div>
                <div className="text-sm font-bold text-gray-800">Promotions & Offers</div>
                <div className="text-xs text-gray-500">Receive emails about new products and special sales.</div>
              </div>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-3">
            <CreditCard className="w-5 h-5 text-[#f59e0b]" />
            <h2 className="text-lg font-bold text-gray-800">Payment Methods</h2>
          </div>
          <div className="border border-gray-100 rounded-xl p-4 flex justify-between items-center bg-gray-50 mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded border border-gray-200 text-xs font-bold">VISA</div>
              <div>
                <div className="text-sm font-bold text-gray-800">•••• •••• •••• 4242</div>
                <div className="text-xs text-gray-500">Expires 12/28</div>
              </div>
            </div>
            <button className="text-xs font-bold text-red-500 hover:underline">Remove</button>
          </div>
          <button className="text-sm font-bold text-[#f59e0b] hover:underline">+ Add new payment method</button>
        </div>
      </div>
    </div>
  );
}

import { Package } from "lucide-react";

export const metadata = {
  title: "Order History - Adivashindo",
};

export default function OrderHistoryPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Order History</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="space-y-6">
            {[1, 2].map((order) => (
              <div key={order} className="border border-gray-100 rounded-xl overflow-hidden hover:border-amber-200 transition-colors">
                <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center gap-6">
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase">Order Placed</div>
                      <div className="text-xs font-bold text-gray-700">12 May 2026</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase">Total</div>
                      <div className="text-xs font-bold text-gray-700">Rp. 90.000</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase">Ship To</div>
                      <div className="text-xs font-bold text-[#f59e0b] hover:underline cursor-pointer">John Doe</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-gray-400 uppercase">Order #INV-2026-00{order}</div>
                    <a href="/invoice" className="text-xs font-bold text-[#f59e0b] hover:underline">View Invoice</a>
                  </div>
                </div>
                
                <div className="p-5 flex flex-col md:flex-row gap-6 items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <Package className="w-4 h-4 text-green-500" /> Delivered 15 May 2026
                    </h3>
                    <p className="text-xs text-gray-500 max-w-sm mb-4">Your package was delivered to the front porch.</p>
                    <div className="flex gap-4">
                      <div className="bg-gray-100 w-16 h-16 rounded-lg flex items-center justify-center text-xl">🍹</div>
                      <div className="bg-gray-100 w-16 h-16 rounded-lg flex items-center justify-center text-xl">🍫</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 w-full md:w-auto">
                    <button className="w-full md:w-40 bg-[#f59e0b] hover:bg-amber-600 text-white font-bold py-2 rounded-lg text-xs transition-colors shadow-sm">
                      Track Package
                    </button>
                    <button className="w-full md:w-40 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-2 rounded-lg text-xs transition-colors shadow-sm">
                      Buy it again
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

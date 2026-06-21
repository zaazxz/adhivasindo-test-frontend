import Link from "next/link";
import { FiCheckCircle } from "react-icons/fi";

export default function InvoicePage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-green-50 p-8 text-center border-b border-green-100">
          <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Successful!</h1>
          <p className="text-sm text-gray-600">Thank you for your purchase. Your order has been received.</p>
        </div>
        
        <div className="p-8">
          <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Invoice Number</div>
              <div className="text-lg font-bold text-gray-800">#INV-2026-00123</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date</div>
              <div className="text-sm font-bold text-gray-800">21 June 2026</div>
            </div>
          </div>
          
          <div className="mb-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-2">Item</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                <tr className="border-b border-gray-50">
                  <td className="py-3 font-semibold">Sunstar Fresh Melon Juice</td>
                  <td className="py-3 text-center">1</td>
                  <td className="py-3 text-right font-bold">Rp. 10.000</td>
                </tr>
                <tr className="border-b border-gray-50">
                  <td className="py-3 font-semibold">Chocolate</td>
                  <td className="py-3 text-center">2</td>
                  <td className="py-3 text-right font-bold">Rp. 80.000</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-end mb-8">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-bold text-gray-800">Rp. 90.000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="font-bold text-green-500">Free</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="text-base font-bold text-gray-800">Total Paid</span>
                <span className="text-xl font-extrabold text-[#f59e0b]">Rp. 90.000</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Link href="/" className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-center font-bold py-3 rounded-lg text-sm transition-colors">
              Back to Home
            </Link>
            <button className="flex-1 bg-[#3b63f6] hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-sm transition-colors shadow-md">
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

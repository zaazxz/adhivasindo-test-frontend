export const metadata = {
  title: "Riwayat Transaksi - Adivashindo",
};

export default function RiwayatTransaksiPage() {
  return (
    <div className="bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[18px] font-bold text-gray-800">Riwayat Transaksi</h1>
          <p className="text-[12px] text-gray-500 mt-1">Daftar semua transaksi yang telah selesai.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Tanggal</th>
              <th className="py-3 px-4">Pelanggan</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-[13px] text-gray-700">
            {[1, 2, 3, 4, 5].map((item) => (
              <tr key={item} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="py-3 px-4 font-bold text-[#3b63f6]">#INV-00{item}</td>
                <td className="py-3 px-4 text-gray-500">20 Mei 2025</td>
                <td className="py-3 px-4 font-medium">Customer {item}</td>
                <td className="py-3 px-4 font-bold text-gray-900">Rp. {(item * 50000).toLocaleString('id-ID')}</td>
                <td className="py-3 px-4">
                  <span className="bg-green-100 text-green-700 py-1 px-2 rounded-md text-[10px] font-bold">Lunas</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="text-gray-500 hover:text-[#3b63f6] hover:underline text-[12px] font-bold">Detail</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

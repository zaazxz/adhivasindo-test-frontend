export const metadata = {
  title: "Master Barang - Adivashindo",
};

export default function MasterBarangPage() {
  return (
    <div className="bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[18px] font-bold text-gray-800">Master Barang</h1>
          <p className="text-[12px] text-gray-500 mt-1">Kelola data semua produk di toko Anda.</p>
        </div>
        <button className="bg-[#3b63f6] hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-[12px] transition-colors shadow-sm">
          + Tambah Barang
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <th className="py-3 px-4">Nama Barang</th>
              <th className="py-3 px-4">Kategori</th>
              <th className="py-3 px-4">Harga</th>
              <th className="py-3 px-4">Stok</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-[13px] text-gray-700">
            {[1, 2, 3, 4, 5].map((item) => (
              <tr key={item} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="py-3 px-4 font-semibold">Sunstar Fresh Melon Juice {item}</td>
                <td className="py-3 px-4 text-gray-500">Juices</td>
                <td className="py-3 px-4 font-medium text-gray-900">Rp. 10.000</td>
                <td className="py-3 px-4">
                  <span className="bg-green-100 text-green-700 py-1 px-2 rounded-md text-[10px] font-bold">145 Tersedia</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="text-[#3b63f6] hover:underline text-[12px] font-bold mr-3">Edit</button>
                  <button className="text-red-500 hover:underline text-[12px] font-bold">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

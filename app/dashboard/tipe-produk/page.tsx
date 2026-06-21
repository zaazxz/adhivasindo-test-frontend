export const metadata = {
  title: "Tipe Produk - Adivashindo",
};

export default function TipeProdukPage() {
  return (
    <div className="bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[18px] font-bold text-gray-800">Tipe Produk / Kategori</h1>
          <p className="text-[12px] text-gray-500 mt-1">Kelola jenis kategori barang yang tersedia.</p>
        </div>
        <button className="bg-[#3b63f6] hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-[12px] transition-colors shadow-sm">
          + Tambah Kategori
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["Fruits & Veges", "Breads & Sweets", "Juices", "Meat", "Dairy"].map((cat, i) => (
          <div key={i} className="border border-gray-100 rounded-xl p-4 flex justify-between items-center hover:border-blue-200 transition-colors group">
            <div>
              <div className="font-bold text-gray-800 text-[14px]">{cat}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">24 Produk</div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-[#3b63f6] text-[12px] font-bold hover:underline">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

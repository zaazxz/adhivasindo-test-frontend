export const metadata = {
  title: "Settings - Adivashindo",
};

export default function SettingsPage() {
  return (
    <div className="max-w-3xl">
      <div className="bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 mb-6">
        <div>
          <h1 className="text-[18px] font-bold text-gray-800">General Settings</h1>
          <p className="text-[12px] text-gray-500 mt-1 mb-6">Atur informasi dasar toko Anda.</p>
        </div>

        <form className="space-y-5">
          <div>
            <label className="block text-[12px] font-bold text-gray-700 mb-2">Nama Toko</label>
            <input type="text" defaultValue="Kkomi Korean Cafe" className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#3b63f6]" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-gray-700 mb-2">Email Kontak</label>
            <input type="email" defaultValue="support@kkomi.com" className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#3b63f6]" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-gray-700 mb-2">Mata Uang</label>
            <select className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#3b63f6]">
              <option>IDR (Rupiah)</option>
              <option>USD (US Dollar)</option>
            </select>
          </div>
          <div className="pt-4 border-t border-gray-100">
            <button type="button" className="bg-[#3b63f6] hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg text-sm transition-colors shadow-sm">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

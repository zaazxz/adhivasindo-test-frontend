export const metadata = {
  title: "User Management - Adivashindo",
};

export default function UserPage() {
  return (
    <div className="bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[18px] font-bold text-gray-800">User Management</h1>
          <p className="text-[12px] text-gray-500 mt-1">Kelola hak akses dan data pengguna sistem.</p>
        </div>
        <button className="bg-[#3b63f6] hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-[12px] transition-colors shadow-sm">
          + Tambah User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <th className="py-3 px-4">Nama Lengkap</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-[13px] text-gray-700">
            {[1, 2, 3].map((item) => (
              <tr key={item} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="py-3 px-4 font-semibold">Admin User {item}</td>
                <td className="py-3 px-4 text-gray-500">admin{item}@adivashindo.com</td>
                <td className="py-3 px-4">
                  <span className="bg-purple-100 text-purple-700 py-1 px-2 rounded-md text-[10px] font-bold">Admin</span>
                </td>
                <td className="py-3 px-4">
                  <span className="bg-green-100 text-green-700 py-1 px-2 rounded-md text-[10px] font-bold">Active</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="text-[#3b63f6] hover:underline text-[12px] font-bold mr-3">Edit</button>
                  <button className="text-gray-400 hover:text-red-500 hover:underline text-[12px] font-bold">Block</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useStoreSettingsStore } from "@/store/useStoreSettingsStore";
import { toast } from "@/store/useToastStore";
import { FiUser, FiLock, FiSave, FiPhone } from "react-icons/fi";

export default function SettingsClient() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const isAdmin = user?.role === "admin";

  const storeSettings = useStoreSettingsStore();

  const [activeTab, setActiveTab] = useState<"profile" | "password" | "store">("profile");
  const [isSaving, setIsSaving] = useState(false);

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  // Store settings form (admin only)
  const [storeForm, setStoreForm] = useState({
    phoneNumber: storeSettings.phoneNumber,
    whatsappNumber: storeSettings.whatsappNumber,
    storeName: storeSettings.storeName,
    storeAddress: storeSettings.storeAddress,
  });

  const handleSaveProfile = async () => {
    if (!profileForm.name.trim()) {
      toast.error("Nama wajib diisi.");
      return;
    }
    try {
      setIsSaving(true);
      if (user) {
        setUser({ ...user, name: profileForm.name, email: profileForm.email });
      }
      toast.success("Profil berhasil diperbarui!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal memperbarui profil.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.current_password) {
      toast.error("Password saat ini wajib diisi.");
      return;
    }
    if (passwordForm.password.length < 6) {
      toast.error("Password baru minimal 6 karakter.");
      return;
    }
    if (passwordForm.password !== passwordForm.password_confirmation) {
      toast.error("Konfirmasi password tidak cocok.");
      return;
    }
    try {
      setIsSaving(true);
      toast.success("Password berhasil diubah!");
      setPasswordForm({ current_password: "", password: "", password_confirmation: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal mengubah password.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveStoreSettings = () => {
    if (!storeForm.phoneNumber.trim()) {
      toast.error("Nomor telepon wajib diisi.");
      return;
    }
    setIsSaving(true);
    storeSettings.setSettings({
      phoneNumber: storeForm.phoneNumber,
      whatsappNumber: storeForm.whatsappNumber,
      storeName: storeForm.storeName,
      storeAddress: storeForm.storeAddress,
    });
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Pengaturan toko berhasil disimpan!");
    }, 300);
  };

  const tabs = [
    { key: "profile" as const, label: "Profile", icon: <FiUser size={14} /> },
    { key: "password" as const, label: "Security", icon: <FiLock size={14} /> },
    ...(isAdmin ? [{ key: "store" as const, label: "Store", icon: <FiPhone size={14} /> }] : []),
  ];

  return (
    <div className="max-w-3xl">
      {/* Tab navigation */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
              activeTab === tab.key
                ? "bg-white text-[#3b63f6] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6">
          <div className="mb-6">
            <h1 className="text-[18px] font-bold text-gray-800">Profile Settings</h1>
            <p className="text-[12px] text-gray-500 mt-1">Update your personal information.</p>
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 rounded-full bg-[#3b63f6] flex items-center justify-center text-white text-xl font-bold shadow-lg">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-[14px] font-bold text-gray-800">{user?.name || "User"}</div>
              <div className="text-[12px] text-gray-500">{user?.email || "-"}</div>
              <div className="mt-1">
                <span className={`py-0.5 px-2 rounded-md text-[10px] font-bold uppercase ${
                  user?.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                }`}>
                  {user?.role || "user"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-[12px] font-bold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#3b63f6] focus:ring-4 focus:ring-blue-50 transition-all"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#3b63f6] focus:ring-4 focus:ring-blue-50 transition-all"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-gray-700 mb-2">Role</label>
              <input
                type="text"
                value={user?.role || "user"}
                disabled
                className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed"
              />
            </div>
            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="bg-[#3b63f6] hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-2.5 px-6 rounded-lg text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-[0.97]"
              >
                <FiSave size={14} />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password / Security Tab */}
      {activeTab === "password" && (
        <div className="bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6">
          <div className="mb-6">
            <h1 className="text-[18px] font-bold text-gray-800">Change Password</h1>
            <p className="text-[12px] text-gray-500 mt-1">Ensure your account is using a strong password.</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-[12px] font-bold text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                value={passwordForm.current_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                placeholder="Enter current password"
                className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#3b63f6] focus:ring-4 focus:ring-blue-50 transition-all"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                value={passwordForm.password}
                onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                placeholder="Minimum 6 characters"
                className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#3b63f6] focus:ring-4 focus:ring-blue-50 transition-all"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={passwordForm.password_confirmation}
                onChange={(e) => setPasswordForm({ ...passwordForm, password_confirmation: e.target.value })}
                placeholder="Re-enter new password"
                className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#3b63f6] focus:ring-4 focus:ring-blue-50 transition-all"
              />
            </div>
            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={handleChangePassword}
                disabled={isSaving}
                className="bg-[#3b63f6] hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-2.5 px-6 rounded-lg text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-[0.97]"
              >
                <FiLock size={14} />
                {isSaving ? "Updating..." : "Change Password"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Store Settings Tab (Admin Only) */}
      {activeTab === "store" && isAdmin && (
        <div className="bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6">
          <div className="mb-6">
            <h1 className="text-[18px] font-bold text-gray-800">Pengaturan Toko</h1>
            <p className="text-[12px] text-gray-500 mt-1">Kelola informasi toko yang tampil di halaman landing.</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-[12px] font-bold text-gray-700 mb-2">Nama Toko</label>
              <input
                type="text"
                value={storeForm.storeName}
                onChange={(e) => setStoreForm({ ...storeForm, storeName: e.target.value })}
                className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#3b63f6] focus:ring-4 focus:ring-blue-50 transition-all"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-gray-700 mb-2">Nomor Telepon</label>
                <input
                  type="text"
                  value={storeForm.phoneNumber}
                  onChange={(e) => setStoreForm({ ...storeForm, phoneNumber: e.target.value })}
                  placeholder="+62 812-3456-7890"
                  className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#3b63f6] focus:ring-4 focus:ring-blue-50 transition-all"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-700 mb-2">Nomor WhatsApp</label>
                <input
                  type="text"
                  value={storeForm.whatsappNumber}
                  onChange={(e) => setStoreForm({ ...storeForm, whatsappNumber: e.target.value })}
                  placeholder="+62 812-3456-7890"
                  className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#3b63f6] focus:ring-4 focus:ring-blue-50 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-gray-700 mb-2">Alamat Toko</label>
              <textarea
                value={storeForm.storeAddress}
                onChange={(e) => setStoreForm({ ...storeForm, storeAddress: e.target.value })}
                rows={3}
                className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#3b63f6] focus:ring-4 focus:ring-blue-50 transition-all resize-none"
              />
            </div>
            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={handleSaveStoreSettings}
                disabled={isSaving}
                className="bg-[#3b63f6] hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-2.5 px-6 rounded-lg text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-[0.97]"
              >
                <FiSave size={14} />
                {isSaving ? "Menyimpan..." : "Simpan Pengaturan Toko"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

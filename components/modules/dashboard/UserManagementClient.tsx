"use client";

import { useState, useEffect } from "react";
import { userService } from "@/services/user.service";
import { toast } from "@/store/useToastStore";
import { FiEdit2, FiTrash2, FiPlus, FiX, FiSearch, FiShield, FiUser } from "react-icons/fi";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at?: string;
  [key: string]: any;
}

export default function UserManagementClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "user",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await userService.getAll();
      setUsers(res.data || res || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", password: "", password_confirmation: "", role: "user" });
    setShowModal(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      password_confirmation: "",
      role: user.role || "user",
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Name and email are required.");
      return;
    }

    if (!editingUser && (!formData.password || formData.password.length < 6)) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (formData.password && formData.password !== formData.password_confirmation) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const payload: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };

      if (formData.password) {
        payload.password = formData.password;
        payload.password_confirmation = formData.password_confirmation;
      }

      if (editingUser) {
        await userService.update(editingUser.id, payload);
        toast.success("User updated successfully!");
      } else {
        await userService.create(payload);
        toast.success("User created successfully!");
      }

      setShowModal(false);
      fetchUsers();
    } catch (error: any) {
      console.error("Failed to save user:", error);
      toast.error(error.response?.data?.message || "Failed to save user.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await userService.delete(id);
      toast.success("User deleted successfully!");
      setDeleteConfirmId(null);
      fetchUsers();
    } catch (error: any) {
      console.error("Failed to delete user:", error);
      toast.error(error.response?.data?.message || "Failed to delete user.");
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-700";
      case "staff":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <div className="bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-[18px] font-bold text-gray-800">User Management</h1>
            <p className="text-[12px] text-gray-500 mt-1">Manage system users and access permissions.</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="bg-[#3b63f6] hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg text-[12px] transition-all shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer active:scale-[0.97]"
          >
            <FiPlus size={14} /> Add User
          </button>
        </div>

        {/* Search */}
        <div className="mb-5 relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-[13px] outline-none focus:border-[#3b63f6] focus:ring-4 focus:ring-blue-50 transition-all"
          />
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex justify-center py-10">
            <svg className="animate-spin h-6 w-6 text-[#3b63f6]" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-sm">
            {searchQuery ? "No users match your search." : "No users found."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-[13px] text-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold ${
                          user.role === "admin" ? "bg-purple-500" : "bg-blue-500"
                        }`}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`py-1 px-2.5 rounded-md text-[10px] font-bold uppercase ${getRoleBadge(user.role)}`}>
                        {user.role || "user"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-[12px]">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(user)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-[#3b63f6] transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <FiEdit2 size={14} />
                        </button>

                        {deleteConfirmId === user.id ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md hover:bg-red-100 transition-colors cursor-pointer"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(user.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setShowModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 w-[90vw] max-w-[480px] overflow-hidden animate-[scaleIn_0.2s_ease-out]">
            {/* Modal Header */}
            <div className="bg-[#3b63f6] px-6 py-4 flex items-center justify-between">
              <h3 className="text-white font-bold text-[14px] flex items-center gap-2">
                {editingUser ? <FiEdit2 size={16} /> : <FiPlus size={16} />}
                {editingUser ? "Edit User" : "Add New User"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white cursor-pointer">
                <FiX size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#3b63f6] focus:ring-4 focus:ring-blue-50 transition-all"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                  className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#3b63f6] focus:ring-4 focus:ring-blue-50 transition-all"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Role</label>
                <div className="flex gap-3">
                  {["admin", "staff", "user"].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setFormData({ ...formData, role })}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-bold border transition-all cursor-pointer ${
                        formData.role === role
                          ? "border-[#3b63f6] bg-blue-50 text-[#3b63f6]"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {role === "admin" ? <FiShield size={13} /> : <FiUser size={13} />}
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-gray-700 mb-1.5">
                  Password {editingUser && <span className="text-gray-400 font-normal">(leave blank to keep current)</span>}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editingUser ? "••••••••" : "Minimum 6 characters"}
                  className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#3b63f6] focus:ring-4 focus:ring-blue-50 transition-all"
                />
              </div>

              {(formData.password || !editingUser) && (
                <div>
                  <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Confirm Password</label>
                  <input
                    type="password"
                    value={formData.password_confirmation}
                    onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                    placeholder="Re-enter password"
                    className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#3b63f6] focus:ring-4 focus:ring-blue-50 transition-all"
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 pb-6 flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-[12px] font-bold hover:bg-gray-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-lg bg-[#3b63f6] hover:bg-blue-700 text-white text-[12px] font-bold transition-all shadow-sm cursor-pointer active:scale-[0.97]"
              >
                {editingUser ? "Save Changes" : "Create User"}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import { productTypeService } from "@/services/product-type.service";
import { FiEdit2, FiTrash2, FiPlus, FiX, FiSearch, FiChevronLeft, FiChevronRight, FiArrowDown, FiArrowUp } from "react-icons/fi";
import { toast } from "@/store/useToastStore";
import { ProductType } from "@/types";
import { ITEMS_PER_PAGE_DEFAULT } from "@/constants";

export default function TipeProdukClient() {
  const [types, setTypes] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "" });
  const [isSaving, setIsSaving] = useState(false);

  // DataTable states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = ITEMS_PER_PAGE_DEFAULT;

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      setIsLoading(true);
      const res = await productTypeService.getAll();
      const rawTypes = res.data?.data || res.data || res || [];
      setTypes(Array.isArray(rawTypes) ? rawTypes : []);
    } catch (error) {
      console.error("Failed to fetch product types", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (type?: ProductType) => {
    if (type) {
      setEditingId(type.id);
      setFormData({ name: type.type_name || type.name || "" });
    } else {
      setEditingId(null);
      setFormData({ name: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const payload = { name: formData.name, type_name: formData.name }; // Send both to be safe
      if (editingId) {
        await productTypeService.update(editingId, payload as any);
        toast.success("Kategori berhasil diperbarui!");
      } else {
        await productTypeService.create(payload as any);
        toast.success("Kategori berhasil ditambahkan!");
      }
      handleCloseModal();
      fetchTypes();
    } catch (error) {
      console.error("Failed to save product type", error);
      toast.error("Gagal menyimpan tipe produk. Silakan coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kategori ini?")) return;
    try {
      await productTypeService.delete(id);
      toast.success("Kategori berhasil dihapus!");
      fetchTypes();
    } catch (error) {
      console.error("Failed to delete product type", error);
      toast.error("Gagal menghapus tipe produk. Pastikan tidak ada produk yang menggunakan tipe ini.");
    }
  };

  // DataTable Logic
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const processedTypes = [...types]
    .filter((t) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      const name = t.type_name || t.name || "";
      return name.toLowerCase().includes(q) || t.id.toString().includes(q);
    })
    .sort((a: any, b: any) => {
      if (!sortConfig) return 0;
      const { key, direction } = sortConfig;
      let aValue = key === "name" ? (a.type_name || a.name || "") : a[key];
      let bValue = key === "name" ? (b.type_name || b.name || "") : b[key];
      
      if (typeof aValue === "string") aValue = aValue.toLowerCase();
      if (typeof bValue === "string") bValue = bValue.toLowerCase();

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(processedTypes.length / itemsPerPage);
  const currentData = processedTypes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[18px] font-bold text-gray-800">Tipe Produk / Kategori</h1>
          <p className="text-[12px] text-gray-500 mt-1">Kelola jenis kategori barang yang tersedia.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari kategori..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#3b63f6] focus:ring-2 focus:ring-blue-50 w-full sm:w-64"
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-[#3b63f6] hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-[12px] transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <FiPlus /> Tambah Kategori
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <svg className="animate-spin h-6 w-6 text-[#3b63f6]" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : types.length === 0 ? (
        <div className="text-center py-10 text-gray-500 text-sm">
          Belum ada tipe produk.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4 cursor-pointer hover:text-gray-700" onClick={() => handleSort("id")}>
                  <div className="flex items-center gap-1">ID {sortConfig?.key === "id" && (sortConfig.direction === "asc" ? <FiArrowUp/> : <FiArrowDown/>)}</div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-gray-700" onClick={() => handleSort("name")}>
                  <div className="flex items-center gap-1">Nama Kategori {sortConfig?.key === "name" && (sortConfig.direction === "asc" ? <FiArrowUp/> : <FiArrowDown/>)}</div>
                </th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-gray-700">
              {currentData.length > 0 ? currentData.map((type) => (
                <tr key={type.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4 text-gray-400 font-mono text-[11px]">{type.id}</td>
                  <td className="py-3 px-4 font-semibold text-gray-800">{type.type_name || type.name}</td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => handleOpenModal(type)} className="text-[#3b63f6] hover:bg-blue-50 p-1.5 rounded-md transition-colors mr-1">
                      <FiEdit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(type.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors">
                      <FiTrash2 size={14} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="py-10 text-center text-gray-400 text-sm">Data tidak ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 px-4 py-3 bg-gray-50/50 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-500">
                Menampilkan <span className="font-bold text-gray-800">{((currentPage - 1) * itemsPerPage) + 1}</span> - <span className="font-bold text-gray-800">{Math.min(currentPage * itemsPerPage, processedTypes.length)}</span> dari <span className="font-bold text-gray-800">{processedTypes.length}</span> kategori
              </span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-50 transition-colors"
                >
                  <FiChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-7 h-7 rounded-md text-xs font-bold transition-colors ${
                      currentPage === i + 1 ? "bg-[#3b63f6] text-white" : "border border-gray-200 text-gray-600 hover:bg-white"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-50 transition-colors"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="bg-white rounded-2xl w-full max-w-md relative z-10 shadow-2xl animate-[fadeIn_0.2s_ease-out]">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h2 className="text-[16px] font-bold text-gray-800">{editingId ? "Edit Kategori" : "Tambah Kategori Baru"}</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5">
              <div className="mb-5">
                <label className="block text-[12px] font-bold text-gray-700 mb-2">Nama Kategori</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Misal: Fruits & Veges"
                  required
                  className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-medium outline-none focus:border-[#3b63f6] focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 rounded-xl text-[13px] font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="bg-[#3b63f6] hover:bg-blue-700 disabled:bg-blue-300 text-white px-5 py-2.5 rounded-xl text-[13px] font-bold transition-colors shadow-md shadow-blue-200 flex items-center gap-2"
                >
                  {isSaving ? "Menyimpan..." : "Simpan Kategori"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

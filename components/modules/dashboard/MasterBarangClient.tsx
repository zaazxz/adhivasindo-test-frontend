"use client";

import { FiEdit2, FiTrash2, FiPlus, FiX, FiImage, FiSearch, FiChevronLeft, FiChevronRight, FiArrowDown, FiArrowUp } from "react-icons/fi";
import { useMasterBarang } from "@/hooks/useMasterBarang";
import { FORMAT_RUPIAH, ITEMS_PER_PAGE_DEFAULT } from "@/constants";
import { useEffect } from "react";

export default function MasterBarangClient() {
  const {
    products,
    productTypes,
    isLoading,
    isModalOpen,
    isSaving,
    editingId,
    searchQuery,
    setSearchQuery,
    sortConfig,
    currentPage,
    setCurrentPage,
    name,
    setName,
    price,
    setPrice,
    stock,
    setStock,
    description,
    setDescription,
    productTypeId,
    setProductTypeId,
    imagePreview,
    fileInputRef,
    handleOpenModal,
    handleCloseModal,
    handleImageChange,
    handleSubmit,
    handleDelete,
    handleSort
  } = useMasterBarang();

  const itemsPerPage = ITEMS_PER_PAGE_DEFAULT;

  const processedProducts = [...products]
    .filter((p) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || (p.type?.type_name || p.product_type?.name || "").toLowerCase().includes(q);
    })
    .sort((a: any, b: any) => {
      if (!sortConfig) return 0;
      const { key, direction } = sortConfig;
      let aValue = key === "category" ? (a.type?.type_name || a.product_type?.name || "") : a[key];
      let bValue = key === "category" ? (b.type?.type_name || b.product_type?.name || "") : b[key];

      if (typeof aValue === "string") aValue = aValue.toLowerCase();
      if (typeof bValue === "string") bValue = bValue.toLowerCase();

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
  const currentData = processedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 relative min-h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[18px] font-bold text-gray-800">Master Barang</h1>
          <p className="text-[12px] text-gray-500 mt-1">Kelola data semua produk di toko Anda.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari barang..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#3b63f6] focus:ring-2 focus:ring-blue-50 w-full sm:w-64"
            />
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-[#3b63f6] hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-[12px] transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <FiPlus /> Tambah Barang
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
      ) : products.length === 0 ? (
        <div className="text-center py-10 text-gray-500 text-sm">
          Belum ada produk.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4 cursor-pointer hover:text-gray-700" onClick={() => handleSort("name")}>
                  <div className="flex items-center gap-1">Nama Barang {sortConfig?.key === "name" && (sortConfig.direction === "asc" ? <FiArrowUp /> : <FiArrowDown />)}</div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-gray-700" onClick={() => handleSort("category")}>
                  <div className="flex items-center gap-1">Kategori {sortConfig?.key === "category" && (sortConfig.direction === "asc" ? <FiArrowUp /> : <FiArrowDown />)}</div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-gray-700" onClick={() => handleSort("price")}>
                  <div className="flex items-center gap-1">Harga {sortConfig?.key === "price" && (sortConfig.direction === "asc" ? <FiArrowUp /> : <FiArrowDown />)}</div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-gray-700" onClick={() => handleSort("stock")}>
                  <div className="flex items-center gap-1">Stok {sortConfig?.key === "stock" && (sortConfig.direction === "asc" ? <FiArrowUp /> : <FiArrowDown />)}</div>
                </th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-gray-700">
              {currentData.length > 0 ? currentData.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4 font-semibold flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                      {(item.image_url || item.image) && (item.image_url || item.image) !== 'null' ? (
                        <img src={(item.image_url || item.image)!} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <FiImage className="text-gray-400" />
                      )}
                    </div>
                    {item.name}
                  </td>
                  <td className="py-3 px-4 text-gray-500">
                    {item.type?.type_name || item.product_type?.name || "Uncategorized"}
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">{FORMAT_RUPIAH(item.price)}</td>
                  <td className="py-3 px-4">
                    <span className={`py-1 px-2 rounded-md text-[10px] font-bold ${(item.stock ?? 0) > 10 ? "bg-green-100 text-green-700" :
                        (item.stock ?? 0) > 0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                      }`}>
                      {item.stock ?? 0} Tersedia
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => handleOpenModal(item)} className="text-[#3b63f6] hover:bg-blue-50 p-1.5 rounded-md transition-colors mr-1">
                      <FiEdit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors">
                      <FiTrash2 size={14} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400 text-sm">Data tidak ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 px-4 py-3 bg-gray-50/50 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-500">
                Menampilkan <span className="font-bold text-gray-800">{((currentPage - 1) * itemsPerPage) + 1}</span> - <span className="font-bold text-gray-800">{Math.min(currentPage * itemsPerPage, processedProducts.length)}</span> dari <span className="font-bold text-gray-800">{processedProducts.length}</span> produk
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
                    className={`w-7 h-7 rounded-md text-xs font-bold transition-colors ${currentPage === i + 1 ? "bg-[#3b63f6] text-white" : "border border-gray-200 text-gray-600 hover:bg-white"
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
          <div className="bg-white rounded-2xl w-full max-w-lg relative z-10 shadow-2xl animate-[fadeIn_0.2s_ease-out] max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 shrink-0">
              <h2 className="text-[16px] font-bold text-gray-800">{editingId ? "Edit Barang" : "Tambah Barang Baru"}</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto">

              <div className="flex flex-col items-center mb-6">
                <div
                  className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#3b63f6] hover:bg-blue-50 transition-colors relative overflow-hidden group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <FiImage className="mx-auto text-gray-400 mb-1" size={24} />
                      <span className="text-[10px] text-gray-500 font-medium">Upload</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white text-[10px] font-bold">
                    Ganti
                  </div>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="col-span-2">
                  <label className="block text-[12px] font-bold text-gray-700 mb-2">Nama Barang</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Fresh Melon Juice"
                    required
                    className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-medium outline-none focus:border-[#3b63f6] focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-gray-700 mb-2">Harga (Rp)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="10000"
                    required min="0"
                    className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-medium outline-none focus:border-[#3b63f6] focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-gray-700 mb-2">Stok</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="100"
                    required min="0"
                    className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-medium outline-none focus:border-[#3b63f6] focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[12px] font-bold text-gray-700 mb-2">Kategori</label>
                  <select
                    value={productTypeId}
                    onChange={(e) => setProductTypeId(e.target.value)}
                    required
                    className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-medium outline-none focus:border-[#3b63f6] focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="" disabled>-- Pilih Kategori --</option>
                    {productTypes.map((t) => (
                      <option key={t.id} value={t.id}>{(t as any).type_name || t.name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-[12px] font-bold text-gray-700 mb-2">Deskripsi</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detail tentang produk ini..."
                    rows={3}
                    className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-medium outline-none focus:border-[#3b63f6] focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-2">
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
                  {isSaving ? "Menyimpan..." : "Simpan Barang"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

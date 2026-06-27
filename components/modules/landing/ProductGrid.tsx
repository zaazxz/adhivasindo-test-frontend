"use client";

import { ImageIcon, X, ShoppingCart, Package, ChevronRight, AlertTriangle, Sparkles, Crown } from "lucide-react";
import ImageWithSkeleton from "@/components/ui/ImageWithSkeleton";
import { useBestSellerStore } from "@/store/useBestSellerStore";
import { useEffect } from "react";

import { Category, Product, ProductGridProps } from "@/types";
import { useProductGrid } from "@/hooks/useProductGrid";
import { FORMAT_RUPIAH } from "@/constants";

export default function ProductGrid({ products, categories = [], selectedCategoryId, onCategoryChange, searchQuery = "" }: ProductGridProps) {
  const { bestSellerIds, fetchBestSellers } = useBestSellerStore();

  const {
    addedIds,
    selectedProduct,
    setSelectedProduct,
    getQty,
    setQty,
    handleAddToCart,
    activeFilter,
    filtered,
    paginated,
    sortMethod,
    setSortMethod,
    currentPage,
    setCurrentPage,
    totalPages,
    relatedProducts,
    hasImage,
    getImageUrl
  } = useProductGrid(products, selectedCategoryId, searchQuery, bestSellerIds);

  useEffect(() => {
    fetchBestSellers();
  }, [fetchBestSellers]);

  return (
    <>
      <section>
        <div className="flex justify-between items-end mb-8 flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Products</h2>
            {searchQuery && (
              <p className="text-sm text-gray-500 mt-1">Showing results for "{searchQuery}"</p>
            )}
          </div>
          <div className="flex gap-4 md:gap-6 text-[10px] font-bold tracking-[1px] text-gray-400 uppercase flex-wrap">
            <button
              onClick={() => onCategoryChange?.(null)}
              className={`transition-colors pb-2 px-1 cursor-pointer ${!activeFilter
                  ? "text-[#f59e0b] border-b-[3px] border-[#f59e0b]"
                  : "hover:text-gray-600 border-b-[3px] border-transparent"
                }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id || cat.name}
                onClick={() => onCategoryChange?.(cat.id || null)}
                className={`transition-colors pb-2 px-1 cursor-pointer ${activeFilter === cat.id
                    ? "text-[#f59e0b] border-b-[3px] border-[#f59e0b]"
                    : "hover:text-gray-600 border-b-[3px] border-transparent"
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end mb-6">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Sort by:</span>
            <select
              value={sortMethod}
              onChange={(e) => {
                setSortMethod(e.target.value);
                setCurrentPage(1); // reset to page 1 on sort
              }}
              className="bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg px-3 py-1.5 outline-none focus:border-[#f59e0b] focus:ring-2 focus:ring-amber-50 cursor-pointer"
            >
              <option value="new">Terbaru</option>
              <option value="old">Terlama</option>
              <option value="best-seller">Best Seller</option>
              <option value="price-asc">Harga Termurah</option>
              <option value="price-desc">Harga Termahal</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-5 gap-y-8">
          {paginated.map((prod) => {
            const isAdded = addedIds.has(String(prod.id));
            const outOfStock = (prod.stock ?? 0) <= 0;
            const isLowStock = (prod.stock ?? 0) > 0 && (prod.stock ?? 0) <= 5;
            const isNew = prod.created_at ? (Date.now() - new Date(prod.created_at).getTime()) < 7 * 24 * 60 * 60 * 1000 : false;
            const isNotActive = prod.status !== "active";
            const isDisabled = isAdded || outOfStock || isNotActive;
            const isBestSeller = bestSellerIds.includes(String(prod.id));

            return (
              <div key={prod.id} className="flex flex-col group">
                <div
                  onClick={() => setSelectedProduct(prod)}
                  className="bg-[#f8f9fa] rounded-2xl p-6 mb-4 aspect-square flex items-center justify-center relative overflow-hidden cursor-pointer"
                >
                  {hasImage(prod.image) ? (
                    <ImageWithSkeleton
                      src={getImageUrl(prod.image || prod.image_url)}
                      alt={prod.name}
                      className="w-[130px] h-[130px] object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-300 group-hover:text-gray-400 transition-colors">
                      <ImageIcon className="w-12 h-12" strokeWidth={1} />
                      <span className="text-[9px] font-medium">No image</span>
                    </div>
                  )}
                  {isAdded && (
                    <div className="absolute inset-0 bg-green-500/90 flex items-center justify-center animate-[fadeIn_0.2s_ease-out]">
                      <div className="text-white text-center">
                        <div className="text-2xl mb-1">✓</div>
                        <div className="text-[11px] font-bold">Added!</div>
                      </div>
                    </div>
                  )}
                  {/* Product Badges */}
                  {!isAdded && (isNew || isLowStock || isBestSeller) && (
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {isBestSeller && (
                        <div className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-[8px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm w-fit">
                          <Crown className="w-2.5 h-2.5" /> Best Seller
                        </div>
                      )}
                      {isNew && (
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-[8px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm w-fit">
                          <Sparkles className="w-2.5 h-2.5" /> New
                        </div>
                      )}
                      {isLowStock && (
                        <div className="bg-gradient-to-r from-red-500 to-rose-400 text-white text-[8px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm w-fit">
                          <AlertTriangle className="w-2.5 h-2.5" /> Sisa Sedikit
                        </div>
                      )}
                    </div>
                  )}
                  {/* Out of Stock Badge */}
                  {!isAdded && outOfStock && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                      Out of Stock
                    </div>
                  )}
                </div>
                <h3 className="text-[12px] font-bold text-gray-500 mb-1 line-clamp-1">{prod.name}</h3>
                <p className="text-[15px] font-extrabold text-gray-900 mb-3">
                  {FORMAT_RUPIAH(Number(prod.price))}
                </p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-xs font-semibold text-gray-400">
                    <button
                      onClick={() => setQty(prod.id, Number(getQty(prod.id)) - 1, prod.stock ?? 99)}
                      disabled={Number(getQty(prod.id)) <= 1 || isNotActive}
                      className="hover:text-black active:scale-90 transition-all w-5 h-5 flex items-center justify-center rounded-full border border-gray-200 hover:border-gray-400 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-gray-400"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={getQty(prod.id)}
                      onChange={(e) => setQty(prod.id, e.target.value, prod.stock ?? 99)}
                      onBlur={() => { if (getQty(prod.id) === "" || Number(getQty(prod.id)) < 1) setQty(prod.id, 1, prod.stock ?? 99); }}
                      disabled={isNotActive}
                      className="text-black w-8 text-center bg-transparent outline-none border-b border-transparent focus:border-gray-300 transition-colors disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      onClick={() => setQty(prod.id, Number(getQty(prod.id)) + 1, prod.stock ?? 99)}
                      disabled={Number(getQty(prod.id)) >= (prod.stock ?? 99) || isNotActive}
                      className="hover:text-black active:scale-90 transition-all w-5 h-5 flex items-center justify-center rounded-full border border-gray-200 hover:border-gray-400 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-gray-400"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleAddToCart(prod)}
                    disabled={isDisabled}
                    className={`text-[11px] font-bold transition-all ${isAdded
                        ? "text-green-500"
                        : isDisabled
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-400 hover:text-[#f59e0b] cursor-pointer active:scale-95"
                      }`}
                  >
                    {isAdded ? "Added ✓" : isNotActive ? "Unavailable" : outOfStock ? "Out of Stock" : "Add to Cart"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {paginated.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm">
            No products found in this category.
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-12 px-4 py-3 bg-gray-50/50 rounded-xl border border-gray-100">
            <span className="text-xs text-gray-500">
              Menampilkan <span className="font-bold text-gray-800">{((currentPage - 1) * 10) + 1}</span> - <span className="font-bold text-gray-800">{Math.min(currentPage * 10, filtered.length)}</span> dari <span className="font-bold text-gray-800">{filtered.length}</span> produk
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-50 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-7 h-7 rounded-md text-xs font-bold transition-colors cursor-pointer ${currentPage === i + 1 ? "bg-[#f59e0b] text-white border-transparent" : "border border-gray-200 text-gray-600 hover:bg-white"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-50 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setSelectedProduct(null)} />
          <div className="fixed inset-4 md:inset-8 lg:inset-12 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col animate-[fadeIn_0.2s_ease-out]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <h3 className="text-[16px] font-bold text-gray-800">Product Details</h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-gray-400 hover:text-gray-800 transition-colors hover:rotate-90 duration-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
                {/* Product Image */}
                <div className="bg-[#f8f9fa] rounded-2xl aspect-square flex items-center justify-center p-8 relative overflow-hidden">
                  {hasImage(selectedProduct.image) ? (
                    <ImageWithSkeleton
                      src={getImageUrl(selectedProduct.image || selectedProduct.image_url)}
                      alt={selectedProduct.name}
                      className="w-[320px] h-[320px] object-contain drop-shadow-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-gray-300">
                      <ImageIcon className="w-24 h-24" strokeWidth={0.8} />
                      <span className="text-sm font-medium">No image available</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex flex-col">
                  {/* Category Badge */}
                  {selectedProduct.type_name && (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full w-fit mb-3 uppercase tracking-wider">
                      {selectedProduct.type_name}
                    </span>
                  )}

                  <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
                    {selectedProduct.name}
                  </h2>

                  <p className="text-2xl font-extrabold text-[#f59e0b] mb-4">
                    {FORMAT_RUPIAH(Number(selectedProduct.price))}
                  </p>

                  {/* Description */}
                  <div className="mb-6">
                    <h4 className="text-[12px] font-bold text-gray-600 mb-2 uppercase tracking-wider">Description</h4>
                    <p className="text-[14px] text-gray-500 leading-relaxed">
                      {selectedProduct.desc || "No description available for this product."}
                    </p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#f8f9fa] rounded-xl p-4">
                      <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Stock</div>
                      <div className={`text-[16px] font-extrabold ${(selectedProduct.stock ?? 0) > 0 ? "text-green-600" : "text-red-500"}`}>
                        {(selectedProduct.stock ?? 0) > 0 ? `${selectedProduct.stock} units` : "Out of Stock"}
                      </div>
                    </div>
                    <div className="bg-[#f8f9fa] rounded-xl p-4">
                      <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Status</div>
                      <div className={`text-[16px] font-extrabold capitalize ${selectedProduct.status === "active" ? "text-green-600" : "text-gray-400"}`}>
                        {selectedProduct.status || "Active"}
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart */}
                  <div className="flex items-center gap-4 mb-6">
                    {(() => {
                      const outOfStock = (selectedProduct.stock ?? 0) <= 0;
                      const isNotActive = selectedProduct.status !== "active";
                      const isDisabled = addedIds.has(String(selectedProduct.id)) || outOfStock || isNotActive;

                      return (
                        <>
                          <div className="flex items-center gap-4 text-sm font-semibold text-gray-500 bg-gray-50 px-4 py-2 rounded-xl">
                            <button
                              onClick={() => setQty(selectedProduct.id, Number(getQty(selectedProduct.id)) - 1, selectedProduct.stock ?? 99)}
                              disabled={Number(getQty(selectedProduct.id)) <= 1 || isNotActive}
                              className="hover:text-black transition-colors w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              -
                            </button>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={getQty(selectedProduct.id)}
                              onChange={(e) => setQty(selectedProduct.id, e.target.value, selectedProduct.stock ?? 99)}
                              onBlur={() => { if (getQty(selectedProduct.id) === "" || Number(getQty(selectedProduct.id)) < 1) setQty(selectedProduct.id, 1, selectedProduct.stock ?? 99); }}
                              disabled={isNotActive}
                              className="text-black w-10 text-center text-lg font-bold bg-transparent outline-none disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button
                              onClick={() => setQty(selectedProduct.id, Number(getQty(selectedProduct.id)) + 1, selectedProduct.stock ?? 99)}
                              disabled={Number(getQty(selectedProduct.id)) >= (selectedProduct.stock ?? 99) || isNotActive}
                              className="hover:text-black transition-colors w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => handleAddToCart(selectedProduct)}
                            disabled={isDisabled}
                            className={`flex-1 font-bold py-3.5 px-6 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 ${addedIds.has(String(selectedProduct.id))
                                ? "bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                                : isDisabled
                                  ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                                  : "bg-[#f59e0b] hover:bg-amber-600 text-white cursor-pointer"
                              }`}
                          >
                            {addedIds.has(String(selectedProduct.id)) ? "Added to Cart ✓" : isNotActive ? "Unavailable" : outOfStock ? "Out of Stock" : "Add to Cart"}
                          </button>
                        </>
                      );
                    })()}
                  </div>

                  {/* Product ID */}
                  <div className="text-[10px] text-gray-300 font-mono">
                    SKU: {selectedProduct.id}
                  </div>
                </div>
              </div>

              {/* Related Products */}
              {relatedProducts.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[16px] font-bold text-gray-800 flex items-center gap-2">
                      <Package className="w-4 h-4 text-amber-500" />
                      Related Products
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {relatedProducts.map((rp) => (
                      <div
                        key={rp.id}
                        onClick={() => setSelectedProduct(rp)}
                        className="cursor-pointer group/related"
                      >
                        <div className="bg-[#f8f9fa] rounded-xl p-4 aspect-square flex items-center justify-center mb-3 relative overflow-hidden">
                          {hasImage(rp.image) ? (
                            <ImageWithSkeleton
                              src={getImageUrl(rp.image || rp.image_url)}
                              alt={rp.name}
                              className="w-[100px] h-[100px] object-contain group-hover/related:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <ImageIcon className="w-10 h-10 text-gray-300" strokeWidth={1} />
                          )}
                        </div>
                        <h4 className="text-[12px] font-bold text-gray-600 line-clamp-1 group-hover/related:text-[#f59e0b] transition-colors">
                          {rp.name}
                        </h4>
                        <p className="text-[13px] font-extrabold text-gray-800 flex items-center gap-1">
                          {FORMAT_RUPIAH(Number(rp.price))}
                          <ChevronRight className="w-3 h-3 text-gray-300" />
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

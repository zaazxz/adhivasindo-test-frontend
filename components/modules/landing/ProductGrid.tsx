"use client";

import { ImageIcon, X, ShoppingCart, Package, ChevronRight } from "lucide-react";
import { Category, Product } from "@/types";
import { useProductGrid } from "@/hooks/useProductGrid";
import { FORMAT_RUPIAH } from "@/constants";

interface ProductGridProps {
  products: Product[];
  categories?: Category[];
  selectedCategoryId?: string | null;
  onCategoryChange?: (id: string | null) => void;
  searchQuery?: string;
}

export default function ProductGrid({ products, categories = [], selectedCategoryId, onCategoryChange, searchQuery = "" }: ProductGridProps) {
  const {
    addedIds,
    selectedProduct,
    setSelectedProduct,
    getQty,
    setQty,
    handleAddToCart,
    activeFilter,
    filtered,
    relatedProducts,
    hasImage,
    getImageUrl
  } = useProductGrid(products, selectedCategoryId, searchQuery);

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
              className={`transition-colors pb-2 px-1 cursor-pointer ${
                !activeFilter
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
                className={`transition-colors pb-2 px-1 cursor-pointer ${
                  activeFilter === cat.id
                    ? "text-[#f59e0b] border-b-[3px] border-[#f59e0b]"
                    : "hover:text-gray-600 border-b-[3px] border-transparent"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-5 gap-y-8">
          {filtered.map((prod) => {
            const isAdded = addedIds.has(String(prod.id));
            const outOfStock = (prod.stock ?? 0) <= 0;

            return (
              <div key={prod.id} className="flex flex-col group">
                <div
                  onClick={() => setSelectedProduct(prod)}
                  className="bg-[#f8f9fa] rounded-2xl p-6 mb-4 aspect-square flex items-center justify-center relative overflow-hidden cursor-pointer"
                >
                  {hasImage(prod.image) ? (
                    <img
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
                  {outOfStock && !isAdded && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full">
                      Out of Stock
                    </div>
                  )}
                </div>
                <h3 className="text-[12px] font-bold text-gray-500 mb-1 line-clamp-1">{prod.name}</h3>
                <p className="text-[15px] font-extrabold text-gray-900 mb-3">
                  {formatRupiah(Number(prod.price))}
                </p>
                <div className="flex items-center justify-between mt-auto pt-1">
                  <div className="flex items-center gap-3 text-xs font-semibold text-gray-400">
                    <button
                      onClick={() => setQty(prod.id, getQty(prod.id) - 1)}
                      className="hover:text-black active:scale-90 transition-all w-5 h-5 flex items-center justify-center rounded-full border border-gray-200 hover:border-gray-400 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-black w-4 text-center">{getQty(prod.id)}</span>
                    <button
                      onClick={() => setQty(prod.id, getQty(prod.id) + 1)}
                      className="hover:text-black active:scale-90 transition-all w-5 h-5 flex items-center justify-center rounded-full border border-gray-200 hover:border-gray-400 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleAddToCart(prod)}
                    disabled={isAdded || outOfStock}
                    className={`text-[11px] font-bold transition-all cursor-pointer ${
                      isAdded
                        ? "text-green-500"
                        : outOfStock
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-400 hover:text-[#f59e0b] active:scale-95"
                    }`}
                  >
                    {isAdded ? "Added ✓" : outOfStock ? "Unavailable" : "Add to Cart"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm">
            No products found in this category.
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
                <div className="bg-[#f8f9fa] rounded-2xl aspect-square flex items-center justify-center p-8">
                  {hasImage(selectedProduct.image) ? (
                    <img
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
                    <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-3 py-2">
                      <button
                        onClick={() => setQty(selectedProduct.id, getQty(selectedProduct.id) - 1)}
                        className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:border-gray-400 transition-colors cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-sm font-bold text-gray-800 w-6 text-center">
                        {getQty(selectedProduct.id)}
                      </span>
                      <button
                        onClick={() => setQty(selectedProduct.id, getQty(selectedProduct.id) + 1)}
                        className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:border-gray-400 transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        handleAddToCart(selectedProduct);
                      }}
                      disabled={(selectedProduct.stock ?? 0) <= 0}
                      className="flex-1 bg-[#f59e0b] hover:bg-amber-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg text-sm transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {(selectedProduct.stock ?? 0) <= 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
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
                        <div className="bg-[#f8f9fa] rounded-xl p-4 aspect-square flex items-center justify-center mb-3">
                          {hasImage(rp.image) ? (
                            <img
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

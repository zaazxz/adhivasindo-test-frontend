import { useState, useEffect, useRef } from "react";
import { productService } from "@/services/product.service";
import { productTypeService } from "@/services/product-type.service";
import { Product, ProductType } from "@/types";
import { toast } from "@/store/useToastStore";

export function useMasterBarang() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // DataTable states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Form states
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [productTypeId, setProductTypeId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [productsRes, typesRes] = await Promise.all([
        productService.getAll(),
        productTypeService.getAll()
      ]);
      const rawProducts = productsRes.data?.data || productsRes.data || productsRes || [];
      setProducts(Array.isArray(rawProducts) ? rawProducts : []);
      const rawTypes = typesRes.data?.data || typesRes.data || typesRes || [];
      setProductTypes(Array.isArray(rawTypes) ? rawTypes : []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingId(String(product.id));
      setName(product.name);
      setPrice(product.price?.toString() || "0");
      setStock(product.stock?.toString() || "0");
      setDescription(product.desc || product.description || "");
      setProductTypeId(product.type_id ? product.type_id.toString() : (product.product_type_id ? product.product_type_id.toString() : ""));
      setImagePreview(product.image || product.image_url || null);
      setImageFile(null);
    } else {
      setEditingId(null);
      setName("");
      setPrice("");
      setStock("");
      setDescription("");
      setProductTypeId("");
      setImagePreview(null);
      setImageFile(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productTypeId) {
      toast.error("Pilih tipe produk!");
      return;
    }

    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("desc", description);
      formData.append("type_id", productTypeId);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editingId) {
        await productService.update(editingId, formData);
        toast.success("Barang berhasil diperbarui!");
      } else {
        await productService.create(formData);
        toast.success("Barang berhasil ditambahkan!");
      }

      handleCloseModal();
      fetchData();
    } catch (error: any) {
      console.error("Failed to save product:", error);
      toast.error(error.response?.data?.message || "Gagal menyimpan barang. Periksa kembali form Anda.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus barang ini?")) return;
    try {
      await productService.delete(String(id));
      toast.success("Barang berhasil dihapus!");
      fetchData();
    } catch (error) {
      console.error("Failed to delete product", error);
      toast.error("Gagal menghapus barang.");
    }
  };

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return {
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
  };
}

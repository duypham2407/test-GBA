import { useEffect, useState, useCallback } from "react";

import API from "../lib/api";
import { toast } from "sonner";
import { Plus, Search, Pencil, Trash2, Tag, Loader2, Package, Eye } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../components/ui/dialog";

type CategoryType = { 
  _id: string; 
  name: string; 
  slug?: string;
  desc?: string;
  img?: string;
  isActive?: boolean;
  parentId?: string;
  children?: CategoryType[];
};
type ProductType = {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: string;
  category: CategoryType | null;
  image: string;
  createdAt: string;
};

export default function ProductList() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchBox, setSearchBox] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Create/Edit Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState("");

  // View Dialog State
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    status: "active",
    category: "",
    image: "",
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let query = `?page=${page}&limit=10`;
      if (search) query += `&search=${encodeURIComponent(search)}`;
      if (statusFilter !== "all") query += `&status=${statusFilter}`;
      if (categoryFilter !== "all") query += `&category=${categoryFilter}`;

      const res = await API.get(`/products${query}`);
      setProducts(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err: unknown) {
      console.error(err);
      toast.error("Lỗi khi tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, categoryFilter]);

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchBox);
  };

  const handleOpenCreate = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      status: "active",
      category: categories.length ? categories[0]._id : "",
      image: "",
    });
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (p: ProductType) => {
    setFormData({
      name: p.name,
      description: p.description || "",
      price: p.price.toString(),
      stock: p.stock.toString(),
      status: p.status,
      category: p.category?._id || "",
      image: p.image || "",
    });
    setCurrentId(p._id);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleOpenView = (p: ProductType) => {
    setSelectedProduct(p);
    setIsViewDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success("Xóa sản phẩm thành công");
      fetchProducts();
    } catch (err: unknown) {
      console.error(err);
      toast.error("Lỗi khi xóa sản phẩm");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };

      if (isEditMode) {
        await API.put(`/products/${currentId}`, payload);
        toast.success("Cập nhật thành công");
      } else {
        await API.post("/products", payload);
        toast.success("Tạo sản phẩm thành công");
      }
      setIsDialogOpen(false);
      fetchProducts();
    } catch (err: unknown) {
      console.error(err);
      toast.error("Vui lòng kiểm tra lại thông tin");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sản phẩm</h2>
          <p className="text-gray-500 mt-1">Quản lý danh mục các sản phẩm POD của cửa hàng.</p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="mr-2 h-4 w-4" /> Thêm sản phẩm
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-lg border shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-1 max-w-sm items-center space-x-2">
          <Input 
            placeholder="Tìm theo tên..." 
            value={searchBox} 
            onChange={e => setSearchBox(e.target.value)} 
          />
          <Button type="submit" variant="secondary">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        <div className="flex gap-4">
          <Select value={categoryFilter} onValueChange={val => { setCategoryFilter(val || "all"); setPage(1); }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Danh mục">
                {categoryFilter === "all" ? "Tất cả danh mục" : categories.find(c => c._id === categoryFilter)?.name || "Danh mục"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {categories.map(c => (
                <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={val => { setStatusFilter(val || "all"); setPage(1); }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Trạng thái">
                {statusFilter === "all" ? "Tất cả trạng thái" : 
                 statusFilter === "active" ? "Đang bán" : 
                 statusFilter === "inactive" ? "Ngừng bán" : 
                 statusFilter === "out_of_stock" ? "Hết hàng" : "Trạng thái"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Đang bán</SelectItem>
              <SelectItem value="inactive">Ngừng bán</SelectItem>
              <SelectItem value="out_of_stock">Hết hàng</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden text-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ảnh</TableHead>
              <TableHead>Tên sản phẩm</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead className="text-right">Giá ($)</TableHead>
              <TableHead className="text-right">Tồn kho</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                  Không tìm thấy sản phẩm nào
                </TableCell>
              </TableRow>
            ) : (
              products.map((p) => (
                <TableRow key={p._id}>
                  <TableCell>
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-md bg-gray-100" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                        <Package className="w-5 h-5" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">{p.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Tag className="w-3 h-3" /> {p.category?.name || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold">${p.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{p.stock}</TableCell>
                  <TableCell>
                    {p.status === "active" && <Badge variant="default" className="bg-emerald-500">Đang bán</Badge>}
                    {p.status === "inactive" && <Badge variant="secondary">Ngừng bán</Badge>}
                    {p.status === "out_of_stock" && <Badge variant="destructive">Hết hàng</Badge>}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenView(p)}>
                      <Eye className="h-4 w-4 text-emerald-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(p)}>
                      <Pencil className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p._id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        {/* Pagination Controls */}
        <div className="flex items-center justify-between border-t p-4">
          <p className="text-sm text-gray-500">Trang {page} / {totalPages}</p>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Trang trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
            >
              Trang sau
            </Button>
          </div>
        </div>
      </div>

      {/* Product Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}</DialogTitle>
            <DialogDescription>
              Điền thông tin chi tiết của sản phẩm bên dưới.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tên sản phẩm *</label>
              <Input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Giá bán ($) *</label>
                <Input type="number" step="0.01" min="0" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tồn kho *</label>
                <Input type="number" min="0" required value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Danh mục *</label>
                <Select required value={formData.category} onValueChange={val => setFormData({ ...formData, category: val || "" })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục">
                      {categories.find(c => c._id === formData.category)?.name || "Chọn danh mục"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(c => (
                      <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Trạng thái *</label>
                <Select required value={formData.status} onValueChange={val => setFormData({ ...formData, status: val || "" })}>
                  <SelectTrigger>
                    <SelectValue>
                      {formData.status === "active" ? "Đang bán" : 
                       formData.status === "inactive" ? "Ngừng bán" : 
                       formData.status === "out_of_stock" ? "Hết hàng" : ""}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Đang bán</SelectItem>
                    <SelectItem value="inactive">Ngừng bán</SelectItem>
                    <SelectItem value="out_of_stock">Hết hàng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Hình ảnh URL</label>
              <Input placeholder="https://..." value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mô tả</label>
              <Input value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
              <Button type="submit">Lưu lại</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Product View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Chi tiết sản phẩm</DialogTitle>
            <DialogDescription>
              Xem cấu hình chi tiết của sản phẩm.
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
              <div className="flex justify-center items-start">
                {selectedProduct.image ? (
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full aspect-square object-cover rounded-xl border border-gray-100 shadow-sm" />
                ) : (
                  <div className="w-full aspect-square bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 shadow-sm text-gray-300">
                    <Package className="w-20 h-20" />
                  </div>
                )}
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-gray-900 leading-tight">{selectedProduct.name}</h3>
                  <div className="flex items-center gap-2 mt-3">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600 mr-2">{selectedProduct.category?.name || "N/A"}</span>
                    {selectedProduct.status === "active" && <Badge variant="default" className="bg-emerald-500">Đang bán</Badge>}
                    {selectedProduct.status === "inactive" && <Badge variant="secondary">Ngừng bán</Badge>}
                    {selectedProduct.status === "out_of_stock" && <Badge variant="destructive">Hết hàng</Badge>}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Giá bán</p>
                  <p className="text-3xl font-bold text-blue-600">${selectedProduct.price.toFixed(2)}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Tồn kho</p>
                  <p className="font-semibold text-gray-900 text-lg">{selectedProduct.stock} sản phẩm</p>
                </div>
                
                {selectedProduct.description && (
                  <div className="pt-2">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Mô tả</p>
                    <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl shadow-inner break-words">
                      {selectedProduct.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="mt-2 text-right">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Đóng
            </Button>
            <Button onClick={() => {
              setIsViewDialogOpen(false);
              if (selectedProduct) handleOpenEdit(selectedProduct);
            }} className="ml-2">
              <Pencil className="w-4 h-4 mr-2" />
              Sửa sản phẩm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

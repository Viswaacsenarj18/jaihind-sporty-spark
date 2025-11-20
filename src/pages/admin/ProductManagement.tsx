import { useState, useEffect } from "react";
import { productsAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, ArrowLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, CATEGORY_ROUTES } from "@/config/api";
import { AdminLayout } from "@/components/admin/AdminLayout";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

interface Product {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  hasSizes?: boolean;
  sizes?: Array<{ size: string; quantity: number }>;
}

export default function ProductManagement() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [hasSizes, setHasSizes] = useState(false);
  const [sizes, setSizes] = useState<Array<{ size: string; quantity: number }>>(
    SIZES.map(s => ({ size: s, quantity: 0 }))
  );

  // ✅ Fetch categories from database
  useEffect(() => {
    const loadCategories = async () => {
      try {
        console.log("📂 Fetching categories...");
        const res = await fetch(CATEGORY_ROUTES.GET_ALL);
        const data = await res.json();
        if (data.success && data.categories) {
          const categoryNames = data.categories.map((c: any) => c.name);
          setCategories(categoryNames);
          console.log("✅ Categories loaded:", categoryNames);
        }
      } catch (err) {
        console.error("❌ Error fetching categories:", err);
      }
    };
    loadCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts((response.data as any).products || []);
    } catch {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const resolveImage = (img: string) =>
    img?.startsWith("http") ? img : `${API_BASE_URL}${img}`;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // ✅ Always use imageFile if provided, otherwise use imageUrl
    if (imageFile) {
      console.log("📤 Adding image file:", imageFile.name);
      formData.set("imageFile", imageFile);
      formData.delete("image"); // Remove any existing image field
    } else if (imageUrl) {
      console.log("📤 Using image URL:", imageUrl);
      formData.set("imageUrl", imageUrl);
    }

    // Add size data
    formData.set("hasSizes", hasSizes.toString());
    if (hasSizes) {
      formData.set("sizes", JSON.stringify(sizes));
    }

    // Log FormData contents for debugging
    console.log("📋 FormData entries:");
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File(${value.name}, ${value.size} bytes)`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }

    try {
      if (editingProduct) {
        console.log("✏️ Updating product:", editingProduct._id);
        await productsAPI.update(editingProduct._id, formData);
        toast.success("✅ Product Updated");
      } else {
        console.log("➕ Creating new product");
        await productsAPI.create(formData);
        toast.success("✅ Product Added");
      }
      setDialogOpen(false);
      setEditingProduct(null);
      setImageFile(null);
      setImageUrl("");
      fetchProducts();
    } catch (error: any) {
      console.error("❌ Error saving product:", error);
      const errorMsg = error?.response?.data?.message || error?.message || "Error Saving Product";
      toast.error(`❌ ${errorMsg}`);
    }
  };

  const openEditDialog = (p: Product) => {
    setEditingProduct(p);
    setImageUrl(p.image);
    setImageFile(null);
    setHasSizes(p.hasSizes || false);
    setSizes(p.sizes && p.sizes.length > 0 ? p.sizes : SIZES.map(s => ({ size: s, quantity: 0 })));
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingProduct(null);
    setImageUrl("");
    setImageFile(null);
    setHasSizes(false);
    setSizes(SIZES.map(s => ({ size: s, quantity: 0 })));
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await productsAPI.delete(id);
      toast.success("🗑️ Deleted");
      fetchProducts();
    } catch {
      toast.error("❌ Delete failed");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <AdminLayout>
      <div className="p-4 md:p-8 space-y-5">

      {/* ✅ Back Button */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => navigate("/admin/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-xl md:text-3xl font-bold">Product Management</h1>
      </div>

      {/* Add Button */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </DialogTrigger>

        {/* ✅ Form Dialog */}
        <DialogContent className="w-full max-w-lg max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">

            <Input name="name" placeholder="Product Name" defaultValue={editingProduct?.name} required />

            <select name="category" aria-label="Category" className="border rounded-md p-2 w-full"
              defaultValue={editingProduct?.category || ""} required>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>

            <Textarea name="description" placeholder="Description" defaultValue={editingProduct?.description} />

            <Input name="price" type="number" placeholder="Price" defaultValue={editingProduct?.price} required />

            <Input name="stock" type="number" placeholder="Stock" defaultValue={editingProduct?.stock} required />

            {/* Size Toggle */}
            <div className="flex items-center gap-3 border rounded-md p-3 bg-gray-50">
              <Checkbox
                id="hasSizes"
                checked={hasSizes}
                onCheckedChange={(checked) => setHasSizes(checked as boolean)}
              />
              <Label htmlFor="hasSizes" className="cursor-pointer font-medium">This product has size variants</Label>
            </div>

            {/* Size Inventory */}
            {hasSizes && (
              <div className="space-y-3 border rounded-md p-3 bg-blue-50">
                <Label className="font-semibold">Size Inventory (XS - XXXL)</Label>
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map((item) => (
                    <div key={item.size} className="flex flex-col gap-1">
                      <Label className="text-xs font-medium">{item.size}</Label>
                      <Input
                        type="number"
                        min="0"
                        value={item.quantity}
                        onChange={(e) => {
                          setSizes(sizes.map(s => s.size === item.size ? { ...s, quantity: parseInt(e.target.value) || 0 } : s));
                        }}
                        className="text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Image Input */}
            <div className="space-y-2">
              <Label>Image</Label>
              <Input type="file" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
              <div className="text-center text-xs text-muted-foreground">OR</div>
              <Input
                placeholder="Paste Image URL"
                value={imageUrl}
                onChange={(e) => { setImageUrl(e.target.value); setImageFile(null); }}
              />

              {(imageFile || imageUrl) && (
                <img
                  src={imageFile ? URL.createObjectURL(imageFile) : resolveImage(imageUrl)}
                  alt={editingProduct?.name || "product image"}
                  className="h-32 w-full object-contain rounded border"
                />
              )}
            </div>

            <Button type="submit" className="w-full">Save</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ✅ Product Table / Mobile Cards */}
      <Card>
        <CardHeader><CardTitle>All Products</CardTitle></CardHeader>
        <CardContent>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Sizes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map(p => (
                  <TableRow key={p._id}>
                    <TableCell><img src={resolveImage(p.image)} alt={p.name || "product image"} className="h-14 w-14 rounded object-contain border" /></TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell>₹{p.price}</TableCell>
                    <TableCell>{p.stock}</TableCell>
                    <TableCell>{p.hasSizes ? "✅ Yes" : "❌ No"}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(p)}><Pencil className="h-4" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(p._id)}><Trash2 className="h-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile view */}
          <div className="md:hidden grid gap-3 mt-3">
            {products.map(p => (
              <div key={p._id} className="border rounded-lg p-3 flex gap-3 items-center">
                <img src={resolveImage(p.image)} alt={p.name || "product image"} className="h-16 w-16 rounded border object-contain" />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{p.name}</h4>
                  <p className="text-xs text-gray-500">{p.category}</p>
                  <p className="text-sm font-bold text-primary">₹{p.price}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <Button size="icon" onClick={() => openEditDialog(p)}><Pencil className="h-4" /></Button>
                  <Button size="icon" variant="destructive" onClick={() => handleDelete(p._id)}><Trash2 className="h-4" /></Button>
                </div>
              </div>
            ))}
          </div>

        </CardContent>
      </Card>
      </div>
    </AdminLayout>
  );
}

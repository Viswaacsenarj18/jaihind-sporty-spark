import { useState, useEffect } from "react";
import { productsAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, ArrowLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/config/api";
import { AdminLayout } from "@/components/admin/AdminLayout";

const CATEGORY_OPTIONS = [
  "T-Shirts & Apparel", "Cricket", "Badminton", "Kabaddi", "Football",
  "Volleyball", "Basketball", "Indoor Games", "Gym & Fitness",
  "Trophies", "Other Sports"
];

interface Product {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  image: string;
}

export default function ProductManagement() {
  const navigate = useNavigate(); // ✅ for back button
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");

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

    if (imageFile) {
      formData.set("imageFile", imageFile);
      formData.delete("image");
    } else {
      formData.set("imageUrl", imageUrl);
    }

    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct._id, formData);
        toast.success("✅ Product Updated");
      } else {
        await productsAPI.create(formData);
        toast.success("✅ Product Added");
      }
      setDialogOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch {
      toast.error("❌ Error Saving Product");
    }
  };

  const openEditDialog = (p: Product) => {
    setEditingProduct(p);
    setImageUrl(p.image);
    setImageFile(null);
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingProduct(null);
    setImageUrl("");
    setImageFile(null);
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
              {CATEGORY_OPTIONS.map(c => <option key={c}>{c}</option>)}
            </select>

            <Textarea name="description" placeholder="Description" defaultValue={editingProduct?.description} />

            <Input name="price" type="number" placeholder="Price" defaultValue={editingProduct?.price} required />

            <Input name="stock" type="number" placeholder="Stock" defaultValue={editingProduct?.stock} required />

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
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map(p => (
                  <TableRow key={p._id}>
                    <TableCell><img src={resolveImage(p.image)} alt={p.name || "product image"} className="h-14 w-14 rounded object-contain border" /></TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell>₹{p.price}</TableCell>
                    <TableCell>{p.stock}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(p)}><Pencil /></Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(p._id)}><Trash2 /></Button>
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

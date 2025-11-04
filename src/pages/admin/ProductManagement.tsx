import { useState, useEffect } from "react";
import { productsAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";

const API_BASE = "http://localhost:5000"; 

const CATEGORY_OPTIONS = [
  "T-Shirts & Apparel",
  "Cricket",
  "Badminton",
  "Kabaddi",
  "Football",
  "Volleyball",
  "Basketball",
  "Indoor Games",
  "Gym & Fitness",
  "Trophies",
  "Other Sports"
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
    img?.startsWith("http") ? img : `${API_BASE}${img}`;

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
        toast.success("✅ Product updated");
      } else {
        await productsAPI.create(formData);
        toast.success("✅ Product created");
      }

      setDialogOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch {
      toast.error("❌ Failed to save product");
    }
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setDialogOpen(true);
    setImageUrl(product.image);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await productsAPI.delete(id);
      toast.success("🗑️ Product deleted");
      fetchProducts();
    } catch {
      toast.error("❌ Delete failed");
    }
  };

  const openCreateDialog = () => {
    setEditingProduct(null);
    setImageFile(null);
    setImageUrl("");
    setDialogOpen(true);
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Management</h1>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle></DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">

              <Input name="name" placeholder="Product Name" defaultValue={editingProduct?.name} required />

              {/* ✅ Category dropdown */}
              <select name="category" required className="border rounded-md p-2 w-full"
                defaultValue={editingProduct?.category || ""}>
                <option value="">Select Category</option>
                {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <Textarea name="description" placeholder="Description" defaultValue={editingProduct?.description} />

              <Input name="price" type="number" placeholder="Price" defaultValue={editingProduct?.price} required />
              <Input name="stock" type="number" placeholder="Stock" defaultValue={editingProduct?.stock} required />

              {/* ✅ Upload or URL */}
              <div className="space-y-2">
                <Label>Image</Label>
                <Input type="file" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                <div className="text-center text-xs">OR</div>
                <Input placeholder="Paste Image URL"
                  value={imageUrl}
                  onChange={(e) => { setImageUrl(e.target.value); setImageFile(null); }}
                />

                {(imageFile || imageUrl) && (
                  <img
                    src={imageFile ? URL.createObjectURL(imageFile) : resolveImage(imageUrl)}
                    className="h-32 w-full mt-2 rounded border object-contain bg-white"
                  />
                )}
              </div>

              <Button type="submit" className="w-full">
                {editingProduct ? "Update Product" : "Create Product"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* ✅ Product Table */}
      <Card>
        <CardHeader><CardTitle>All Products</CardTitle></CardHeader>
        <CardContent>
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
              {products.map((p) => (
                <TableRow key={p._id}>
                  <TableCell>
                    <img src={resolveImage(p.image)} className="h-14 w-14 object-contain rounded bg-white border" />
                  </TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell>₹{p.price}</TableCell>
                  <TableCell>{p.stock}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(p)}><Pencil /></Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(p._id)}><Trash2 /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

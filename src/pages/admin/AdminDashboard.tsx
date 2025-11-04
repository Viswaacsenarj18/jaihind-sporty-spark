import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit3, Trash2, Search, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const API_BASE = "http://localhost:5000";

const CATEGORIES = [
  "Cricket",
  "Badminton",
  "Tennis",
  "Kabaddi",
  "Football",
  "Volleyball",
  "Basketball",
  "Other Sports",
  "Indoor Games",
  "Gym & Fitness",
  "Trophies"
] as const;

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    imageFile: null as File | null,
    imageUrl: ""
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    imageFile: null as File | null,
    imageUrl: ""
  });

  const resolveImageSrc = (image?: string) => {
    if (!image) return "";
    return image.startsWith("http") ? image : `${API_BASE}${image}`;
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/products`);
      const data = await res.json();
      if (data.success) setProducts(data.products);
      setLoading(false);
    }
    load();
  }, []);

  const handleAddProduct = async (e: any) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.category || !newProduct.price) return alert("Fill all fields");

    const fd = new FormData();
    Object.entries(newProduct).forEach(([k, v]) => {
      if (v) fd.append(k, v as any);
    });

    const res = await fetch(`${API_BASE}/api/products`, { method: "POST", body: fd });
    const data = await res.json();
    if (data.success) {
      setProducts([data.product, ...products]);
      setIsAddProductOpen(false);
      setNewProduct({ name: "", category: "", description: "", price: "", stock: "", imageFile: null, imageUrl: "" });
    }
  };

  const openEdit = (p: any) => {
    setEditingProduct(p);
    setEditForm({
      name: p.name,
      category: p.category,
      description: p.description,
      price: p.price,
      stock: p.stock,
      imageFile: null,
      imageUrl: p.image?.startsWith("http") ? p.image : ""
    });
    setIsEditOpen(true);
  };

  const handleUpdateProduct = async (e: any) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(editForm).forEach(([k, v]) => {
      if (v) fd.append(k, v as any);
    });

    const res = await fetch(`${API_BASE}/api/products/${editingProduct._id}`, { method: "PUT", body: fd });
    const data = await res.json();

    if (data.success) {
      setProducts(p => p.map(x => x._id === editingProduct._id ? data.product : x));
      setIsEditOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`${API_BASE}/api/products/${id}`, { method: "DELETE" });
    setProducts(p => p.filter(x => x._id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>

          <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 w-4 h-4" /> Add Product</Button>
            </DialogTrigger>

            <DialogContent className="max-w-xl">
              <DialogHeader><DialogTitle>Add Product</DialogTitle></DialogHeader>
              <form onSubmit={handleAddProduct} className="space-y-4">

                <Input placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />

                <Select value={newProduct.category}
                  onValueChange={(v) => setNewProduct({ ...newProduct, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>

                <Textarea placeholder="Description"
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />

                <Input type="number" placeholder="Price"
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />

                <Input type="number" placeholder="Stock"
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} />

                <Input type="file"
                  onChange={(e) => setNewProduct({ ...newProduct, imageFile: e.target.files?.[0] || null })} />

                <Button type="submit" className="w-full">Save</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Product List */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Products</CardTitle>
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5" />
              <Input placeholder="Search..." className="pl-9"
                onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {loading ? "Loading..." : products
              .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((p) => (
                <div key={p._id} className="flex justify-between items-center p-3 border rounded-md">

                  {/* ✅ FIXED IMAGE STYLING */}
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center p-1">
                      <img src={resolveImageSrc(p.image)}
                        className="w-full h-full object-contain" />
                    </div>

                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.category}</p>
                      <p>₹{p.price}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => openEdit(p)}>
                      <Edit3 className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(p._id)}>
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </main>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsEditOpen(false)}>
              <X />
            </Button>
          </DialogHeader>

          <form onSubmit={handleUpdateProduct} className="space-y-4">

            <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />

            <Select value={editForm.category} onValueChange={(v) => setEditForm({ ...editForm, category: v })}>
              <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>

            <Textarea value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />

            <Input type="number" value={editForm.price}
              onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} />

            <Input type="number" value={editForm.stock}
              onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })} />

            <Input type="file"
              onChange={(e) => setEditForm({ ...editForm, imageFile: e.target.files?.[0] || null })} />

            <Button type="submit" className="w-full">Save Changes</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default AdminDashboard;

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit3, Trash2, Search } from "lucide-react";
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

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    imageFile: null as File | null,
    imageUrl: ""
  });

  // ✅ Load products from DB
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:5000/api/products");
    const data = await res.json();
    if (data.success) setProducts(data.products);
  };

  // ✅ Add product
  const handleAddProduct = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(newProduct).forEach(([key, value]) => {
      if (value) formData.append(key, value as string | Blob);
    });

    const res = await fetch("http://localhost:5000/api/products", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    if (data.success) {
      fetchProducts();
      setIsAddProductOpen(false);
      resetForm();
    } else alert(data.message);
  };

  // ✅ Delete product from DB
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    const res = await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE"
    });

    if (res.ok) {
      setProducts(products.filter((p) => p._id !== id));
    }
  };

  // ✅ Open Edit Modal
  const openEditModal = (product: any) => {
    setEditProductId(product._id);
    setNewProduct({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imageFile: null,
      imageUrl: product.image
    });
    setIsEditProductOpen(true);
  };

  // ✅ Save Edit
  const handleEditProduct = async (e: any) => {
    e.preventDefault();
    
    const formData = new FormData();
    Object.entries(newProduct).forEach(([key, value]) => {
      if (value) formData.append(key, value as string | Blob);
    });

    const res = await fetch(`http://localhost:5000/api/products/${editProductId}`, {
      method: "PUT",
      body: formData
    });

    const data = await res.json();

    if (data.success) {
      fetchProducts();
      setIsEditProductOpen(false);
      resetForm();
    } else {
      alert(data.message);
    }
  };

  const resetForm = () => {
    setNewProduct({ name: "", category: "", description: "", price: "", stock: "", imageFile: null, imageUrl: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            </div>

            <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="w-4 h-4 mr-2" /> Add Product</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader><DialogTitle>Add Product</DialogTitle></DialogHeader>

                {/* ✅ ADD FORM */}
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <Input placeholder="Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}/>
                  <Select value={newProduct.category} onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cricket">Cricket</SelectItem>
                      <SelectItem value="football">Football</SelectItem>
                      <SelectItem value="badminton">Badminton</SelectItem>
                      <SelectItem value="fitness">Fitness</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                      <SelectItem value="shoes">Shoes</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}/>
                  <Input type="number" placeholder="Price" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}/>
                  <Input type="number" placeholder="Stock" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}/>
                  <Input type="file" onChange={(e) => setNewProduct({ ...newProduct, imageFile: e.target.files?.[0] || null })}/>
                  <Input placeholder="Or Image URL" value={newProduct.imageUrl} onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}/>

                  <Button type="submit">Save</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* ✅ List Products */}
          <Tabs defaultValue="products">
            <TabsContent value="products">
              <Card>
                <CardHeader><CardTitle>Products</CardTitle></CardHeader>
                <CardContent>
                  {products.map((product) => (
                    <div key={product._id} className="flex items-center justify-between border p-3 rounded-lg mb-2">
                      <div className="flex gap-4 items-center">
                        <img src={`http://localhost:5000${product.image}`} className="w-16 h-16 rounded" />
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.category} | Stock: {product.stock}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEditModal(product)}>
                          <Edit3 size={16} />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(product._id)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      <Footer />

      {/* ✅ EDIT PRODUCT MODAL */}
      <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Edit Product</DialogTitle></DialogHeader>

          <form onSubmit={handleEditProduct} className="space-y-4">
            <Input placeholder="Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}/>
            <Select value={newProduct.category} onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cricket">Cricket</SelectItem>
                <SelectItem value="football">Football</SelectItem>
                <SelectItem value="badminton">Badminton</SelectItem>
                <SelectItem value="fitness">Fitness</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
                <SelectItem value="shoes">Shoes</SelectItem>
              </SelectContent>
            </Select>
            <Textarea placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}/>
            <Input type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}/>
            <Input type="number" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}/>
            <Input type="file" onChange={(e) => setNewProduct({ ...newProduct, imageFile: e.target.files?.[0] || null })}/>
            <Input placeholder="Or Image URL" value={newProduct.imageUrl} onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}/>

            <Button type="submit">Update</Button>
          </form>

        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;

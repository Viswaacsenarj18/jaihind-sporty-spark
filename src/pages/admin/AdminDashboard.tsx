import { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, Search } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { API_BASE_URL, CATEGORY_ROUTES } from "@/config/api";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

const resolveImg = (img?: string) =>
  !img ? "" : img.startsWith("http") ? img : `${API_BASE_URL}${img}`;

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdd, setIsAdd] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [imgMode, setImgMode] = useState("file");
  const [editImgMode, setEditImgMode] = useState("file");
  const [editing, setEditing] = useState<any>(null);

  const [form, setForm] = useState<any>({
    name: "", category: "", description: "", price: "", stock: "",
    imageFile: null, imageUrl: "", hasSizes: false, sizes: []
  });

  const resetForm = () => setForm({
    name: "", category: "", description: "", price: "", stock: "",
    imageFile: null, imageUrl: "", hasSizes: false, sizes: []
  });

  // ✅ Fetch products
  useEffect(() => {
    (async () => {
      const res = await fetch(`${API_BASE_URL}/api/products`);
      const data = await res.json();
      if (data.success) setProducts(data.products);
    })();
  }, []);

  // ✅ Fetch categories
  useEffect(() => {
    (async () => {
      try {
        console.log("📂 Admin fetching categories from:", CATEGORY_ROUTES.GET_ALL);
        const res = await fetch(CATEGORY_ROUTES.GET_ALL);
        const data = await res.json();
        console.log("📂 Admin categories response:", data);
        if (data.success && data.categories) {
          setCategories(data.categories);
          console.log("✅ Admin categories loaded:", data.categories.length);
        }
      } catch (err) {
        console.error("❌ Categories fetch error:", err);
      }
    })();
  }, []);

  // ✅ Add Product
  const submitAdd = async (e: any) => {
    e.preventDefault();
    const fd = new FormData();
    
    Object.entries(form).forEach(([k, v]: [string, any]) => {
      if (k === "sizes") {
        fd.append(k, JSON.stringify(v));
      } else if (v && k !== "imageFile") {
        fd.append(k, v as string);
      }
    });

    if (form.imageFile) fd.append("imageFile", form.imageFile);

    const res = await fetch(`${API_BASE_URL}/api/products`, { method: "POST", body: fd });
    const data = await res.json();

    if (data.success) {
      setProducts(prev => [data.product, ...prev]);
      setIsAdd(false);
      resetForm();
    }
  };

  // ✅ Open Edit Product
  const openEdit = (p: any) => {
    setEditing(p);
    setForm({
      name: p.name,
      category: p.category,
      description: p.description,
      price: p.price,
      stock: p.stock,
      imageFile: null,
      imageUrl: p.image?.startsWith("http") ? p.image : "",
      hasSizes: p.hasSizes || false,
      sizes: p.sizes || []
    });

    setEditImgMode(p.image?.startsWith("http") ? "url" : "file");
    setIsEdit(true);
  };

  // ✅ Edit Submit Product
  const submitEdit = async (e: any) => {
    e.preventDefault();
    const fd = new FormData();
    
    Object.entries(form).forEach(([k, v]: [string, any]) => {
      if (k === "sizes") {
        fd.append(k, JSON.stringify(v));
      } else if (v && k !== "imageFile") {
        fd.append(k, v as string);
      }
    });

    if (form.imageFile) fd.append("imageFile", form.imageFile);

    const res = await fetch(`${API_BASE_URL}/api/products/${editing._id}`, {
      method: "PUT",
      body: fd
    });

    const data = await res.json();

    if (data.success) {
      setProducts(prev =>
        prev.map(x => (x._id === editing._id ? data.product : x))
      );
      setIsEdit(false);
    }
  };

  // ✅ Delete Product
  const del = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`${API_BASE_URL}/api/products/${id}`, { method: "DELETE" });
    setProducts(prev => prev.filter(p => p._id !== id));
  };

  // ✅ Update size quantity
  const updateSizeQty = (index: number, qty: number) => {
    const newSizes = [...form.sizes];
    newSizes[index].quantity = qty;
    setForm({ ...form, sizes: newSizes });
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-6">Products Management</h1>

        {/* Header */}
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold">Products</h2>

              <Dialog open={isAdd} onOpenChange={setIsAdd}>
                <DialogTrigger asChild>
                  <Button><Plus /> Add Product</Button>
                </DialogTrigger>

                <DialogContent className="max-h-[90vh] overflow-y-auto">
                  <DialogHeader><DialogTitle>Add Product</DialogTitle></DialogHeader>

                  <form onSubmit={submitAdd} className="space-y-3">
                    <Input placeholder="Product Name"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                    />

                    <Select onValueChange={(v) => setForm({ ...form, category: v })}>
                      <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                      <SelectContent>
                        {categories.map(c => (
                          <SelectItem key={c._id} value={c.name}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Textarea placeholder="Description"
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                    />

                    <Input type="number" placeholder="Price"
                      value={form.price}
                      onChange={e => setForm({ ...form, price: e.target.value })}
                    />

                    <Input type="number" placeholder="Stock"
                      value={form.stock}
                      onChange={e => setForm({ ...form, stock: e.target.value })}
                    />

                    {/* ✅ Size Toggle */}
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={form.hasSizes}
                        onCheckedChange={(checked) => {
                          setForm({ 
                            ...form, 
                            hasSizes: checked,
                            sizes: checked ? SIZES.map(s => ({ size: s, quantity: 0 })) : []
                          });
                        }}
                      />
                      <label>Add Size Variants (For T-Shirts & Apparel)</label>
                    </div>

                    {/* ✅ Sizes */}
                    {form.hasSizes && (
                      <div className="border-2 border-blue-200 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50">
                        <div className="flex items-center gap-2 mb-3">
                          <h4 className="font-bold text-foreground">Size Inventory</h4>
                          <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">XS - XXXL</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {form.sizes.map((s: any, idx: number) => (
                            <div key={s.size} className="bg-white p-2 rounded border border-gray-200 shadow-sm">
                              <label className="text-xs font-bold text-gray-600 mb-1 block">{s.size}</label>
                              <Input
                                type="number"
                                placeholder="0"
                                value={s.quantity}
                                onChange={e => updateSizeQty(idx, parseInt(e.target.value) || 0)}
                                className="text-sm h-8"
                              />
                              <p className="text-xs text-gray-500 mt-1">{s.quantity} units</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ✅ Image Options */}
                    <div className="flex gap-4">
                      <label><input type="radio" checked={imgMode === "file"} onChange={() => setImgMode("file")} /> Upload</label>
                      <label><input type="radio" checked={imgMode === "url"} onChange={() => setImgMode("url")} /> URL</label>
                    </div>

                    {imgMode === "file" ? (
                      <Input type="file"
                        onChange={e => setForm({ ...form, imageFile: e.target.files?.[0] })}
                      />
                    ) : (
                      <>
                        <Input placeholder="Paste image URL"
                          value={form.imageUrl}
                          onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                        />
                        {form.imageUrl && <img src={form.imageUrl} className="h-20 rounded border" alt="Product preview" />}
                      </>
                    )}

                    <Button className="w-full" type="submit">Save Product</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Search */}
            <div className="mb-4 relative w-64">
              <Search className="absolute left-3 top-2 text-gray-500" />
              <Input
                className="pl-9"
                placeholder="Search..."
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Product List */}
            <Card>
              <CardContent className="space-y-3 pt-4">
                {products
                  .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(p => (
                    <div key={p._id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
                      <div className="flex gap-3">
                        <img src={resolveImg(p.image)} className="w-16 h-16 object-cover rounded" alt={p.name} />
                        <div>
                          <p className="font-bold">{p.name}</p>
                          <p className="text-xs text-gray-500">{p.category}</p>
                          <p>₹{p.price}</p>
                          {p.hasSizes && (
                            <p className="text-xs text-green-600">✓ Has Sizes</p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => openEdit(p)}>
                          <Edit3 size={14} />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => del(p._id)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* ✅ Edit Dialog */}
            <Dialog open={isEdit} onOpenChange={setIsEdit}>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Edit Product</DialogTitle></DialogHeader>

                <form onSubmit={submitEdit} className="space-y-3">

                  <Input
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />

                  <Select
                    value={form.category}
                    onValueChange={v => setForm({ ...form, category: v })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map(c => (
                        <SelectItem key={c._id} value={c.name}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Textarea
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                  />

                  <Input
                    type="number"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                  />

                  <Input
                    type="number"
                    value={form.stock}
                    onChange={e => setForm({ ...form, stock: e.target.value })}
                  />

                  {/* ✅ Size Toggle */}
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={form.hasSizes}
                      onCheckedChange={(checked) => {
                        setForm({ 
                          ...form, 
                          hasSizes: checked,
                          sizes: checked ? SIZES.map(s => ({ size: s, quantity: 0 })) : []
                        });
                      }}
                    />
                    <label>Add Size Variants (For T-Shirts & Apparel)</label>
                  </div>

                  {/* ✅ Sizes */}
                  {form.hasSizes && (
                    <div className="border-2 border-blue-200 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50">
                      <div className="flex items-center gap-2 mb-3">
                        <h4 className="font-bold text-foreground">Size Inventory</h4>
                        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">XS - XXXL</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {form.sizes.map((s: any, idx: number) => (
                          <div key={s.size} className="bg-white p-2 rounded border border-gray-200 shadow-sm">
                            <label className="text-xs font-bold text-gray-600 mb-1 block">{s.size}</label>
                            <Input
                              type="number"
                              placeholder="0"
                              value={s.quantity}
                              onChange={e => updateSizeQty(idx, parseInt(e.target.value) || 0)}
                              className="text-sm h-8"
                            />
                            <p className="text-xs text-gray-500 mt-1">{s.quantity} units</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <label><input type="radio" checked={editImgMode === "file"} onChange={() => setEditImgMode("file")} /> Upload</label>
                    <label><input type="radio" checked={editImgMode === "url"} onChange={() => setEditImgMode("url")} /> URL</label>
                  </div>

                  {editImgMode === "file" ? (
                    <Input
                      type="file"
                      onChange={e => setForm({ ...form, imageFile: e.target.files?.[0] })}
                    />
                  ) : (
                    <>
                      <Input
                        value={form.imageUrl}
                        onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                      />
                      {form.imageUrl && <img src={form.imageUrl} className="h-20 rounded border" alt="Product preview" />}
                    </>
                  )}

                  <Button className="w-full" type="submit">Save Changes</Button>
                </form>
              </DialogContent>
            </Dialog>
      </div>
    </AdminLayout>
  );
}


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
import { API_BASE_URL } from "@/config/api";

const CATEGORIES = [
  "Cricket","Badminton","Tennis","Kabaddi","Football","Volleyball",
  "Basketball","Other Sports","Indoor Games","Gym & Fitness",
  "Trophies","T-Shirts & Apparel"
];

const resolveImg = (img?: string) =>
  !img ? "" : img.startsWith("http") ? img : `${API_BASE_URL}${img}`;

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdd, setIsAdd] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [imgMode, setImgMode] = useState("file");
  const [editImgMode, setEditImgMode] = useState("file");
  const [editing, setEditing] = useState<any>(null);

  const [form, setForm] = useState<any>({
    name: "", category: "", description: "", price: "", stock: "",
    imageFile: null, imageUrl: ""
  });

  const resetForm = () => setForm({
    name: "", category: "", description: "", price: "", stock: "",
    imageFile: null, imageUrl: ""
  });

  // ✅ Fetch products
  useEffect(() => {
    (async () => {
      const res = await fetch(`${API_BASE_URL}/api/products`);
      const data = await res.json();
      if (data.success) setProducts(data.products);
    })();
  }, []);

  // ✅ Add Product
  const submitAdd = async (e: any) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));

    const res = await fetch(`${API_BASE_URL}/api/products`, { method: "POST", body: fd });
    const data = await res.json();

    if (data.success) {
      setProducts(prev => [data.product, ...prev]);
      setIsAdd(false);
      resetForm();
    }
  };

  // ✅ Open Edit
  const openEdit = (p: any) => {
    setEditing(p);
    setForm({
      name: p.name,
      category: p.category,
      description: p.description,
      price: p.price,
      stock: p.stock,
      imageFile: null,
      imageUrl: p.image?.startsWith("http") ? p.image : ""
    });

    setEditImgMode(p.image?.startsWith("http") ? "url" : "file");
    setIsEdit(true);
  };

  // ✅ Edit Submit
  const submitEdit = async (e: any) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));

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

  return (
    <AdminLayout>
      <div className="p-4">

        {/* ✅ Header */}
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold">Products</h2>

          <Dialog open={isAdd} onOpenChange={setIsAdd}>
            <DialogTrigger asChild>
              <Button><Plus /> Add Product</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader><DialogTitle>Add Product</DialogTitle></DialogHeader>

              <form onSubmit={submitAdd} className="space-y-3">
                <Input placeholder="Name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />

                <Select onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
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
                    {form.imageUrl && <img src={form.imageUrl} className="h-20 rounded border" />}
                  </>
                )}

                <Button className="w-full" type="submit">Save</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* ✅ Search */}
        <div className="mb-4 relative w-64">
          <Search className="absolute left-3 top-2 text-gray-500" />
          <Input
            className="pl-9"
            placeholder="Search..."
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* ✅ Product List */}
        <Card>
          <CardContent className="space-y-3 pt-4">
            {products
              .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(p => (
                <div key={p._id} className="flex justify-between items-center p-3 border rounded">
                  <div className="flex gap-3">
                    <img src={resolveImg(p.image)} className="w-16 h-16 object-cover rounded" />
                    <div>
                      <p className="font-bold">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.category}</p>
                      <p>₹{p.price}</p>
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
          <DialogContent>
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
                  {CATEGORIES.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
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
                  {form.imageUrl && <img src={form.imageUrl} className="h-20 rounded border" />}
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

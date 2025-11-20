// src/pages/admin/CategoryManagement.tsx

import { useState, useEffect } from "react";
import { Plus, Edit3, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { API_BASE_URL, CATEGORY_ROUTES } from "@/config/api";

const resolveImg = (img?: string) =>
  !img ? "" : img.startsWith("http") ? img : `${API_BASE_URL}${img}`;

export default function CategoryManagement() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isAddCategory, setIsAddCategory] = useState(false);
  const [isEditCategory, setIsEditCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryImgMode, setCategoryImgMode] = useState("file");

  const [categoryForm, setCategoryForm] = useState<any>({
    name: "",
    slug: "",
    description: "",
    icon: "Shirt",
    gradient: "",
    hasSizes: false,
    imageFile: null,
    imageUrl: "",
  });

  const resetCategoryForm = () =>
    setCategoryForm({
      name: "",
      slug: "",
      description: "",
      icon: "Shirt",
      gradient: "",
      hasSizes: false,
      imageFile: null,
      imageUrl: "",
    });

  /* ------------------------------------------------------------------
     FETCH CATEGORIES
  ------------------------------------------------------------------ */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(CATEGORY_ROUTES.GET_ALL);
        const data = await res.json();
        if (data.success && data.categories) {
          setCategories(data.categories);
        }
      } catch {
        setCategories([]);
      }
    })();
  }, []);

  /* ------------------------------------------------------------------
     ADD CATEGORY
  ------------------------------------------------------------------ */
  const submitAddCategory = async (e: any) => {
    e.preventDefault();
    const fd = new FormData();

    Object.entries(categoryForm).forEach(([k, v]: [string, any]) => {
      if (v && k !== "imageFile" && k !== "imageUrl") fd.append(k, v);
    });

    if (categoryImgMode === "url" && categoryForm.imageUrl)
      fd.append("imageUrl", categoryForm.imageUrl);

    if (categoryImgMode === "file" && categoryForm.imageFile)
      fd.append("imageFile", categoryForm.imageFile);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(CATEGORY_ROUTES.ADD, {
        method: "POST",
        body: fd,
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.success) {
        setCategories((prev) => [data.category, ...prev]);
        setIsAddCategory(false);
        resetCategoryForm();
        alert("Category added successfully!");
      } else {
        alert(data.message);
      }
    } catch (err: any) {
      alert("Error adding category: " + err.message);
    }
  };

  /* ------------------------------------------------------------------
     OPEN EDIT MODAL
  ------------------------------------------------------------------ */
  const openEditCategory = (cat: any) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon,
      gradient: cat.gradient,
      hasSizes: cat.hasSizes || false,
      imageFile: null,
      imageUrl: cat.image?.startsWith("http") ? cat.image : "",
    });
    setCategoryImgMode(cat.image?.startsWith("http") ? "url" : "file");
    setIsEditCategory(true);
  };

  /* ------------------------------------------------------------------
     SUBMIT EDIT CATEGORY
  ------------------------------------------------------------------ */
  const submitEditCategory = async (e: any) => {
    e.preventDefault();
    const fd = new FormData();

    Object.entries(categoryForm).forEach(([k, v]: [string, any]) => {
      if (v && k !== "imageFile" && k !== "imageUrl") fd.append(k, v);
    });

    if (categoryImgMode === "url" && categoryForm.imageUrl)
      fd.append("imageUrl", categoryForm.imageUrl);

    if (categoryImgMode === "file" && categoryForm.imageFile)
      fd.append("imageFile", categoryForm.imageFile);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(CATEGORY_ROUTES.UPDATE(editingCategory._id), {
        method: "PUT",
        body: fd,
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.success) {
        setCategories((prev) =>
          prev.map((x) => (x._id === editingCategory._id ? data.category : x))
        );
        setIsEditCategory(false);
        resetCategoryForm();
        alert("Category updated!");
      } else {
        alert(data.message);
      }
    } catch (err: any) {
      alert("Error updating: " + err.message);
    }
  };

  /* ------------------------------------------------------------------
     DELETE CATEGORY
  ------------------------------------------------------------------ */
  const delCategory = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(CATEGORY_ROUTES.DELETE(id), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        setCategories((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      alert("Delete failed");
    }
  };

  /* ------------------------------------------------------------------
     UI
  ------------------------------------------------------------------ */
  return (
    <AdminLayout>
      <div className="p-4">
        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">Categories Management</h1>

          <Dialog open={isAddCategory} onOpenChange={setIsAddCategory}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={16} className="mr-2" /> Add Category
              </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Category</DialogTitle>
              </DialogHeader>

              <form onSubmit={submitAddCategory} className="space-y-3">
                <Input
                  placeholder="Category Name"
                  required
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, name: e.target.value })
                  }
                />

                <Input
                  placeholder="Slug"
                  required
                  value={categoryForm.slug}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, slug: e.target.value })
                  }
                />

                <Textarea
                  placeholder="Description"
                  value={categoryForm.description}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      description: e.target.value,
                    })
                  }
                />

                {/* IMAGE MODE */}
                <div className="flex gap-4">
                  <label>
                    <input
                      type="radio"
                      checked={categoryImgMode === "file"}
                      onChange={() => setCategoryImgMode("file")}
                    />{" "}
                    Upload
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={categoryImgMode === "url"}
                      onChange={() => setCategoryImgMode("url")}
                    />{" "}
                    URL
                  </label>
                </div>

                {categoryImgMode === "file" ? (
                  <Input
                    type="file"
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        imageFile: e.target.files?.[0],
                      })
                    }
                  />
                ) : (
                  <Input
                    placeholder="Image URL"
                    value={categoryForm.imageUrl}
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        imageUrl: e.target.value,
                      })
                    }
                  />
                )}

                <Button type="submit" className="w-full">
                  Save Category
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* CATEGORY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <Card key={cat._id} className="rounded-xl shadow-md">
              <CardContent className="p-4">
                {/* FIXED CLEAN IMAGE */}
                <div className="mb-4">
                  <img
                    src={resolveImg(cat.image)}
                    alt={cat.name}
                    className="w-full h-44 rounded-lg object-cover"
                  />
                </div>

                {/* TEXT */}
                <h3 className="text-lg font-bold">{cat.name}</h3>
                <p className="text-sm text-gray-500">Slug: {cat.slug}</p>

                {cat.description && (
                  <p className="text-sm text-gray-600">{cat.description}</p>
                )}

                {cat.hasSizes && (
                  <p className="text-xs text-green-600">✓ Has Sizes</p>
                )}

                {/* ACTION BUTTONS */}
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => openEditCategory(cat)}
                  >
                    <Edit3 size={14} className="mr-1" />
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => delCategory(cat._id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

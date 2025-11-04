import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Filter, SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const API_BASE = "http://localhost:5000";

// ✅ Category options (same as Admin)
const categoryData = [
  "All", "Cricket", "Badminton", "Tennis", "Kabaddi", "Football",
  "Volleyball", "Basketball", "Other Sports", "Indoor Games",
  "Gym & Fitness", "Trophies"
];

const ProductListing = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [wishlist, setWishlist] = useState<string[]>([]);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [appliedRange, setAppliedRange] = useState<{ min?: number; max?: number }>({});

  // ✅ Fetch products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products`);
        const data = await res.json();
        if (data.success) setProducts(data.products);
      } catch (err) {
        console.error("Product Fetch Error:", err);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
  }, [categoryParam]);

  const applyPriceRange = () => {
    setAppliedRange({
      min: minPrice ? parseInt(minPrice) : undefined,
      max: maxPrice ? parseInt(maxPrice) : undefined,
    });
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // ✅ Filter products
  const filteredProducts = products
    .filter((p) => selectedCategory === "All" || p.category?.toLowerCase() === selectedCategory.toLowerCase())
    .filter((p) => {
      if (appliedRange.min && p.price < appliedRange.min) return false;
      if (appliedRange.max && p.price > appliedRange.max) return false;
      return true;
    });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ✅ Banner */}
      <section className="py-10 text-center bg-primary text-white">
        <h1 className="text-2xl sm:text-4xl font-bold">Jaihind Sportify</h1>
        <p className="text-white/90 mt-2 text-sm sm:text-base">Premium Sports Gear For Champions</p>
      </section>

      <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">

        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-64 bg-card rounded-lg p-4 shadow border"
        >
          <h3 className="font-semibold flex items-center mb-3">
            <Filter className="w-5 h-5 mr-2" /> Categories
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
            {categoryData.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`py-2 px-2 rounded text-sm border hover:bg-primary hover:text-white transition ${
                  selectedCategory === cat ? "bg-primary text-white" : "bg-muted"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <h3 className="mt-6 mb-2 font-semibold flex items-center">
            <SlidersHorizontal className="w-5 h-5 mr-2" /> Price Range
          </h3>

          <input
            type="number"
            placeholder="Min"
            className="mb-2 p-2 border rounded w-full text-sm"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />

          <input
            type="number"
            placeholder="Max"
            className="mb-2 p-2 border rounded w-full text-sm"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />

          <Button className="w-full" onClick={applyPriceRange}>Apply</Button>
        </motion.aside>

        {/* Products */}
        <div className="flex-1">
          {/* ✅ Only product count - sorting removed */}
          <div className="mb-4 text-sm text-muted-foreground">
            {filteredProducts.length} products found
          </div>

          {/* ✅ Always Grid View */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
          >
            {filteredProducts.map((p, index) => (
              <ProductCard
                key={p._id}
                product={{
                  id: p._id,
                  name: p.name,
                  price: p.price,
                  image: p.image?.startsWith("http") ? p.image : `${API_BASE}${p.image}`,
                  category: p.category
                }}
                wishlist={wishlist.includes(p._id)}
                onWishlistToggle={() => toggleWishlist(p._id)}
                index={index}
              />
            ))}
          </motion.div>
        </div>
      </div>

    </div>
  );
};

export default ProductListing;

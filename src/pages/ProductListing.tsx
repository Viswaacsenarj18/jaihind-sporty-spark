import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Filter, SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { PRODUCT_ROUTES, CATEGORY_ROUTES, API_BASE_URL } from "@/config/api";

// ✅ Default category list
const DEFAULT_CATEGORIES = [
  { _id: "all", slug: "all", name: "All" },
  { _id: "cricket", slug: "cricket", name: "Cricket" },
  { _id: "badminton", slug: "badminton", name: "Badminton" },
  { _id: "tennis", slug: "tennis", name: "Tennis" },
  { _id: "kabaddi", slug: "kabaddi", name: "Kabaddi" },
  { _id: "football", slug: "football", name: "Football" },
  { _id: "volleyball", slug: "volleyball", name: "Volleyball" },
  { _id: "basketball", slug: "basketball", name: "Basketball" },
  { _id: "other-sports", slug: "other-sports", name: "Other Sports" },
  { _id: "indoor-games", slug: "indoor-games", name: "Indoor Games" },
  { _id: "gym-fitness", slug: "gym-fitness", name: "Gym & Fitness" },
  { _id: "trophies", slug: "trophies", name: "Trophies" },
  { _id: "t-shirts-apparel", slug: "t-shirts-apparel", name: "T-Shirts & Apparel" },
];

const ProductListing = () => {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get("category") || "all";
  const searchQuery = searchParams.get("search") || "";

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState(categorySlug);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [appliedRange, setAppliedRange] = useState<{ min?: number; max?: number }>({});

  // ✅ Fetch categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        console.log("📂 Fetching categories from:", CATEGORY_ROUTES.GET_ALL);
        const res = await fetch(CATEGORY_ROUTES.GET_ALL);
        const data = await res.json();
        console.log("📂 Categories response:", data);
        
        if (data.success && data.categories?.length > 0) {
          // Add "All" at the beginning
          const categoriesWithAll = [
            { _id: "all", slug: "all", name: "All" },
            ...data.categories
          ];
          setCategories(categoriesWithAll);
          console.log("✅ Categories loaded:", categoriesWithAll.length);
        }
      } catch (err) {
        console.error("❌ Categories Fetch Error:", err);
        setCategories(DEFAULT_CATEGORIES);
      }
    };

    loadCategories();
  }, []);

  // ✅ Fetch products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch(PRODUCT_ROUTES.GET_ALL);
        const data = await res.json();
        if (data.success) setProducts(data.products);
      } catch (err) {
        console.error("Product Fetch Error:", err);
      }
    };
    loadProducts();
  }, []);

  // ✅ Update selected tab from URL
  useEffect(() => {
    setSelectedCategory(categorySlug);
  }, [categorySlug]);

  const applyPriceRange = () => {
    setAppliedRange({
      min: minPrice ? parseInt(minPrice) : undefined,
      max: maxPrice ? parseInt(maxPrice) : undefined,
    });
  };

  // ✅ Final product filter - works with category, search, and price
  const filteredProducts = products
    .filter((p) => {
      // 🔍 Search filter - match product name
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          p.name?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // 📂 Category filter
      if (selectedCategory !== "all") {
        const matchedCategory = categories.find(c => c.slug === selectedCategory || c._id === selectedCategory);
        if (!matchedCategory) return false;
        if (p.category?.toLowerCase() !== matchedCategory.name?.toLowerCase()) return false;
      }

      // 💰 Price filter
      if (appliedRange.min && p.price < appliedRange.min) return false;
      if (appliedRange.max && p.price > appliedRange.max) return false;
      
      return true;
    });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Banner */}
      <section className="py-10 text-center bg-primary text-white">
        <h1 className="text-2xl sm:text-4xl font-bold">Jaihind Sportify</h1>
        <p className="text-white/90 mt-2 text-sm sm:text-base">
          {searchQuery ? `Search Results for "${searchQuery}"` : "Premium Sports Gear For Champions"}
        </p>
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
            {categories.map((cat) => (
              <button
                key={cat._id || cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`py-2 px-2 rounded text-sm border transition ${
                  selectedCategory === cat.slug
                    ? "bg-primary text-white"
                    : "bg-muted hover:bg-primary hover:text-white"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Price Filter */}
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

          <Button className="w-full" onClick={applyPriceRange}>
            Apply
          </Button>
        </motion.aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="mb-4 text-sm text-muted-foreground">
            {filteredProducts.length} products found
          </div>

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
                  image: p.image?.startsWith("http") ? p.image : `${API_BASE_URL}${p.image}`,
                  category: p.category,
                }}
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

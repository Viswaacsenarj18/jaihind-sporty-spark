import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Filter, Grid, List, SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const allProducts = [
  // T-Shirts & Apparel
  { id: "1", name: "Plain T-shirts", price: 499, rating: 4.5, reviews: 45, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop", category: "T-Shirts & Apparel" },
  { id: "2", name: "Sublimation T-shirts", price: 799, originalPrice: 999, rating: 4.7, reviews: 62, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=400&fit=crop", category: "T-Shirts & Apparel", isSale: true },
  { id: "3", name: "Football Jersey", price: 1299, rating: 4.8, reviews: 88, image: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=400&h=400&fit=crop", category: "T-Shirts & Apparel", isNew: true },
  { id: "4", name: "Shorts", price: 599, rating: 4.4, reviews: 54, image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop", category: "T-Shirts & Apparel" },
  { id: "5", name: "Lowers", price: 699, rating: 4.6, reviews: 41, image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=400&fit=crop", category: "T-Shirts & Apparel" },
  { id: "6", name: "Tights", price: 799, rating: 4.5, reviews: 38, image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop", category: "T-Shirts & Apparel" },
  { id: "7", name: "Swimming Suit", price: 1499, originalPrice: 1899, rating: 4.7, reviews: 29, image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=400&fit=crop", category: "T-Shirts & Apparel", isSale: true },

  // Cricket
  { id: "8", name: "Cricket Bat", price: 8999, originalPrice: 12999, rating: 4.8, reviews: 124, image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop", category: "Cricket", isSale: true },
  { id: "9", name: "Cricket Ball", price: 599, rating: 4.6, reviews: 89, image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=400&fit=crop", category: "Cricket" },
  { id: "10", name: "Cricket Batting Pad", price: 2499, rating: 4.7, reviews: 56, image: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=400&h=400&fit=crop", category: "Cricket", isNew: true },
  { id: "11", name: "Keeping Pad", price: 3499, rating: 4.8, reviews: 42, image: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=400&h=400&fit=crop", category: "Cricket" },
  { id: "12", name: "All Cricket Equipment", price: 15999, originalPrice: 19999, rating: 4.9, reviews: 67, image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&h=400&fit=crop", category: "Cricket", isSale: true },

  // Badminton
  { id: "13", name: "Badminton Racquet", price: 2999, rating: 4.7, reviews: 76, image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&h=400&fit=crop", category: "Badminton" },
  { id: "14", name: "Badminton Cock", price: 399, rating: 4.5, reviews: 92, image: "https://images.unsplash.com/photo-1596131397351-bdd8a1e6137b?w=400&h=400&fit=crop", category: "Badminton" },

  // Kabaddi
  { id: "15", name: "Kabaddi Set", price: 3999, rating: 4.6, reviews: 34, image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400&h=400&fit=crop", category: "Kabaddi", isNew: true },
  { id: "16", name: "Kabaddi Shoes", price: 1999, rating: 4.7, reviews: 28, image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop", category: "Kabaddi" },

  // Football
  { id: "17", name: "Football Shoes", price: 4999, originalPrice: 6999, rating: 4.8, reviews: 112, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", category: "Football", isSale: true },
  { id: "18", name: "Football", price: 1499, rating: 4.6, reviews: 89, image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop", category: "Football" },

  // Volleyball & Basketball
  { id: "19", name: "Volleyball", price: 1299, rating: 4.5, reviews: 64, image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=400&fit=crop", category: "Volleyball & Basketball" },
  { id: "20", name: "Basketball", price: 1899, rating: 4.7, reviews: 78, image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=400&fit=crop", category: "Volleyball & Basketball" },

  // Other Sports
  { id: "21", name: "Tennikoit", price: 899, rating: 4.4, reviews: 31, image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop", category: "Other Sports", isNew: true },
  { id: "22", name: "Skipping Rope", price: 299, rating: 4.6, reviews: 126, image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&h=400&fit=crop", category: "Other Sports" },

  // Indoor Games
  { id: "23", name: "Carrom Board", price: 2499, rating: 4.7, reviews: 53, image: "https://images.unsplash.com/photo-1611891487183-17d959f29e4e?w=400&h=400&fit=crop", category: "Indoor Games" },
  { id: "24", name: "Carrom Coins", price: 399, rating: 4.5, reviews: 67, image: "https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=400&h=400&fit=crop", category: "Indoor Games" },
  { id: "25", name: "Carrom Powder", price: 149, rating: 4.4, reviews: 84, image: "https://images.unsplash.com/photo-1604357209793-fca5dca89f97?w=400&h=400&fit=crop", category: "Indoor Games" },
  { id: "26", name: "Chess Board", price: 1999, originalPrice: 2499, rating: 4.8, reviews: 91, image: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=400&h=400&fit=crop", category: "Indoor Games", isSale: true },
  { id: "27", name: "Chess Pieces", price: 799, rating: 4.6, reviews: 48, image: "https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=400&h=400&fit=crop", category: "Indoor Games" },

  // Gym & Fitness
  { id: "28", name: "Gym Equipment", price: 12999, originalPrice: 16999, rating: 4.9, reviews: 143, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop", category: "Gym & Fitness", isSale: true },
  { id: "29", name: "Athletes Shoes", price: 5999, rating: 4.7, reviews: 167, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", category: "Gym & Fitness", isNew: true },
  { id: "30", name: "Skates", price: 3999, rating: 4.6, reviews: 58, image: "https://images.unsplash.com/photo-1564632439127-c7d5b4e66b38?w=400&h=400&fit=crop", category: "Gym & Fitness" },
];
// Category data (unchanged)
const categoryData = [
  { name: "All", description: "Browse all products from Jaihind Sportify" },
  { name: "T-Shirts & Apparel", description: "Premium sportswear including jerseys, tees, and athletic wear for peak performance" },
  { name: "Cricket", description: "Complete cricket gear from bats to pads for professional and amateur players" },
  { name: "Badminton", description: "Quality racquets and shuttlecocks for badminton enthusiasts" },
  { name: "Kabaddi", description: "Specialized kabaddi equipment and footwear for traditional sports lovers" },
  { name: "Football", description: "Top-grade footballs and boots for the beautiful game" },
  { name: "Volleyball & Basketball", description: "Premium balls for court sports and team play" },
  { name: "Other Sports", description: "Unique sports equipment including tennikoit and skipping ropes" },
  { name: "Indoor Games", description: "Classic board games and accessories for indoor entertainment" },
  { name: "Gym & Fitness", description: "Professional fitness equipment, athletic shoes, and skates for your training needs" },
];

// Sorting options (unchanged)
const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Customer Rating" },
  { value: "newest", label: "Newest First" },
];

const ProductListing = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [cart, setCart] = useState<any[]>([]);

  // ✅ New Price Range states
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [appliedRange, setAppliedRange] = useState<{ min?: number; max?: number }>({});

  // ✅ Update category when URL param changes
  useEffect(() => {
    if (categoryParam) {
      // Map URL category to display category
      const categoryMap: Record<string, string> = {
        "apparel": "T-Shirts & Apparel",
        "cricket": "Cricket",
        "badminton": "Badminton",
        "kabaddi": "Kabaddi",
        "football": "Football",
        "ball-sports": "Volleyball & Basketball",
        "other-sports": "Other Sports",
        "indoor-games": "Indoor Games",
        "gym-fitness": "Gym & Fitness",
      };
      
      const mappedCategory = categoryMap[categoryParam.toLowerCase()] || "All";
      setSelectedCategory(mappedCategory);
    }
  }, [categoryParam]);

  // ✅ Handle Add to Cart
  const handleAddToCart = (product: any) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) return prev;
      return [...prev, product];
    });
  };

  // ✅ Filter products
  const filteredProducts = allProducts
    .filter((product) => selectedCategory === "All" || product.category === selectedCategory)
    .filter((product) => {
      if (appliedRange.min && product.price < appliedRange.min) return false;
      if (appliedRange.max && product.price > appliedRange.max) return false;
      return true;
    });

  // ✅ Apply price filter
  const applyPriceRange = () => {
    const min = minPrice ? parseInt(minPrice) : undefined;
    const max = maxPrice ? parseInt(maxPrice) : undefined;
    setAppliedRange({ min, max });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="relative py-12 text-center overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-90"></div>
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Jaihind Sportify Products
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Discover premium quality sports gear across all categories—built for champions like you!
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-64 space-y-6"
          >
            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <h3 className="font-semibold text-foreground mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" /> Categories
              </h3>
              <div className="space-y-2">
                {categoryData.map((category) => (
                  <motion.div key={category.name} whileHover={{ x: 4 }}>
                    <button
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full text-left py-3 px-4 rounded-lg transition-all ${
                        selectedCategory === category.name
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div className="font-medium mb-1">{category.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {category.description}
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ✅ Price Range Filter */}
            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <h3 className="font-semibold text-foreground mb-4 flex items-center">
                <SlidersHorizontal className="w-5 h-5 mr-2" /> Price Range
              </h3>
              <div className="flex flex-col space-y-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white/5 border border-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white/5 border border-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button onClick={applyPriceRange} className="w-full">
                  Apply
                </Button>
              </div>
            </div>
          </motion.aside>

          {/* Main Section */}
          <div className="flex-1">
            {/* Toolbar */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
            >
              <div className="text-muted-foreground">
                {filteredProducts.length} products found
              </div>

              <div className="flex items-center space-x-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Product Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {filteredProducts.map((product, index) => (
  <ProductCard key={product.id} product={product} index={index} />
))}

            </motion.div>

            {/* Load More */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Button size="lg" className="btn-hero px-8 py-3 rounded-full">
                Load More Products
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default ProductListing;

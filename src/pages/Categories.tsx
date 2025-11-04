import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";

const API_BASE = "http://localhost:5000";

const Categories = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products`);
        const data = await res.json();
        if (data.success) setProducts(data.products);
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Extract categories dynamically & remove duplicates
  const categories = Array.from(new Set(products.map((p) => p.category))).map((cat) => {
    const catProduct = products.find((p) => p.category === cat);
    const img = catProduct?.image
      ? catProduct.image.startsWith("http")
        ? catProduct.image
        : `${API_BASE}${catProduct.image}`
      : "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600";

    return {
      name: cat,
      slug: cat.toLowerCase().replace(/ /g, "-"),
      products: products.filter((p) => p.category === cat).length,
      image: img,
    };
  });

  // ✅ Recently added products
  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  if (loading)
    return <div className="text-center p-10 text-xl font-bold">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">Shop by Category</h1>
          <p className="text-muted-foreground">
            Explore our wide range of sports equipment and apparel
          </p>
        </div>

        {/* ✅ Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-14">
          {categories.map((cat) => (
            <Link key={cat.name} to={`/products?category=${cat.slug}`}>
              <Card className="overflow-hidden hover:shadow-lg transition hover:scale-105 cursor-pointer">

                <div className="relative w-full h-48 bg-white flex items-center justify-center p-3">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-105"
                  />
                </div>

                <div className="p-3 text-center">
                  <h3 className="text-lg font-bold">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground">{cat.products} products</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* ✅ Recently Added Products */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Recently Added</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {recentProducts.map((product) => (
              <Link key={product._id} to={`/product/${product._id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition hover:scale-105 cursor-pointer">

                  <div className="relative w-full h-40 bg-white flex items-center justify-center p-2">
                    <img
                      src={
                        product.image?.startsWith("http")
                          ? product.image
                          : `${API_BASE}${product.image}`
                      }
                      alt={product.name}
                      className="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-105"
                    />
                  </div>

                  <div className="p-3">
                    <h4 className="font-medium text-sm line-clamp-1">{product.name}</h4>
                    <p className="text-primary font-bold text-sm">₹{product.price}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};

export default Categories;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";

const API_BASE = "http://localhost:5000";

const Categories = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  if (loading)
    return <div className="text-center p-10 text-xl font-bold">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">

        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Shop by <span className="text-primary">Category</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Explore premium sports gear & categories
          </p>
        </div>

        {/* ✅ Categories Grid with better mobile size */}
        <div
          className="
            grid 
            grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 
            gap-4 sm:gap-6 mb-14
          "
        >
          {categories.map((cat) => (
            <Link key={cat.name} to={`/products?category=${cat.slug}`}>
              <Card
                className="
                  overflow-hidden rounded-xl shadow-sm 
                  hover:shadow-lg hover:scale-[1.03] 
                  transition-all cursor-pointer 
                  flex flex-col
                  h-[260px] sm:h-[260px] md:h-[260px] lg:h-[270px]
                "
              >
                <div className="w-full h-[65%] sm:h-[60%] bg-white flex items-center justify-center overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>

                <div className="p-3 text-center flex flex-col justify-center h-[35%]">
                  <h3 className="text-[13px] sm:text-sm md:text-base font-semibold line-clamp-1">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs md:text-sm text-muted-foreground line-clamp-1">
                    {cat.products} products
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* ✅ Recently Added */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-6">Recently Added</h2>

          <div
            className="
              grid 
              grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 
              gap-4 sm:gap-6
            "
          >
            {recentProducts.map((product) => (
              <Link key={product._id} to={`/product/${product._id}`}>
                <Card
                  className="
                    overflow-hidden h-[230px] sm:h-[250px] 
                    rounded-xl hover:shadow-lg hover:scale-[1.03] 
                    transition-all cursor-pointer flex flex-col
                  "
                >
                  <div className="w-full h-[65%] bg-white flex items-center justify-center overflow-hidden">
                    <img
                      src={
                        product.image?.startsWith("http")
                          ? product.image
                          : `${API_BASE}${product.image}`
                      }
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>

                  <div className="p-3 flex flex-col justify-between h-[35%]">
                    <h4 className="font-medium text-xs sm:text-sm line-clamp-1">{product.name}</h4>
                    <p className="text-primary font-bold text-xs sm:text-sm">
                      ₹{product.price}
                    </p>
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

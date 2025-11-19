import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { PRODUCT_ROUTES, API_BASE_URL } from "@/config/api";

const Categories = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch(PRODUCT_ROUTES.GET_ALL);
        const d = await r.json();
        if (d.success) setProducts(d.products);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const categories = Array.from(new Set(products.map(p => p.category))).map(cat => {
    const item = products.find(p => p.category === cat);

    const img = item?.image?.startsWith("http")
      ? item.image
      : `${API_BASE_URL}${item?.image || ""}`;

    return {
      name: cat,
      slug: cat.toLowerCase().replace(/ /g, "-"),
      count: products.filter(p => p.category === cat).length,
      image: img,
    };
  });

  const recent = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  if (loading) return <div className="text-center py-10 text-xl font-bold">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ✅ Fast & Full-Width Blue Banner */}
      <div className="w-full bg-blue-600 py-12 text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          Shop by Category
        </h2>
        <p className="text-white/90 text-sm sm:text-base mt-2">
          Explore premium sports wear across categories
        </p>
      </div>

      <main className="container mx-auto px-4">

        {/* ✅ Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-14">
          {categories.map(cat => (
            <Link key={cat.name} to={`/products?category=${cat.slug}`}>
              <Card className="overflow-hidden rounded-xl shadow-sm hover:shadow-lg hover:scale-[1.03] transition-all cursor-pointer">
                <div className="w-full h-[160px] bg-white overflow-hidden flex items-center justify-center">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <div className="p-3 text-center">
                  <h3 className="text-sm font-semibold">{cat.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {cat.count} products
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* ✅ Recently Added */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-6">Recently Added</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recent.map(product => (
              <Link key={product._id} to={`/product/${product._id}`}>
                <Card className="overflow-hidden rounded-xl hover:shadow-lg hover:scale-[1.03] transition-all cursor-pointer">
                  <div className="w-full h-[160px] bg-white overflow-hidden">
                    <img
                      src={
                        product.image?.startsWith("http")
                          ? product.image
                          : `${API_BASE_URL}${product.image}`
                      }
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm font-medium line-clamp-1">{product.name}</h4>
                    <p className="text-primary font-bold">₹{product.price}</p>
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

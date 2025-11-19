import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { PRODUCT_ROUTES, API_BASE_URL } from "@/config/api";

const ProductGrid = () => {
  const [latestProducts, setLatestProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const res = await fetch(PRODUCT_ROUTES.GET_ALL);
        const data = await res.json();

        if (data.success) {
          // ✅ Sort by latest & take 10
          const latest = data.products
            .sort((a: any, b: any) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 10);

          setLatestProducts(latest);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchLatestProducts();
  }, []);

  return (
    <section className="py-10 bg-background">
      <div className="container mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold">
            Recently Added Products
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Explore our newly added items
          </p>
        </motion.div>

        {/* ✅ 5 per row grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {latestProducts.map((p, index) => (
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
        </div>

        {/* View All */}
        <div className="text-center mt-8">
          <Link to="/products">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-2 rounded-full text-sm bg-primary text-white hover:bg-primary/90"
            >
              View All Products
            </motion.button>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default ProductGrid;

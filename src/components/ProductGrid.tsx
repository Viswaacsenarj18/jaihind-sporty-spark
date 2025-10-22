import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { useProducts } from "@/hooks/useProducts";

const ProductGrid = () => {
  const { products, loading } = useProducts();
  const displayProducts = products.slice(0, 8);

  if (loading) {
    return (
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Featured Products
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
            Discover our handpicked selection of premium sports equipment designed to elevate your game
          </p>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayProducts.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                originalPrice: product.original_price || undefined,
                rating: 4.5,
                reviews: 120,
                image: product.image,
                category: product.category,
                isNew: index < 2,
                isSale: product.original_price !== null
              }} 
              index={index} 
            />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Link to="/shop">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-2 rounded-full font-medium text-sm md:text-base bg-primary text-white hover:bg-primary/90 transition"
            >
              View All Products
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductGrid;

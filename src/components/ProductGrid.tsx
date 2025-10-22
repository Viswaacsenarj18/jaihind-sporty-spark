import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

// Mock product data
const products = [
  {
    id: "1",
    name: "Professional Cricket Bat - English Willow",
    price: 8999,
    originalPrice: 12999,
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    category: "Cricket",
    isNew: true,
    isSale: true,
  },
  {
    id: "2",
    name: "Nike Premier League Football",
    price: 2499,
    rating: 4.7,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop",
    category: "Football",
    isNew: false,
  },
  {
    id: "3",
    name: "YONEX Arcsaber 11 Badminton Racket",
    price: 15999,
    originalPrice: 18999,
    rating: 4.9,
    reviews: 76,
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&h=400&fit=crop",
    category: "Badminton",
    isSale: true,
  },
  {
    id: "4",
    name: "Adjustable Dumbbells Set - 20kg",
    price: 6999,
    rating: 4.6,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    category: "Fitness",
  },
  {
    id: "5",
    name: "Adidas Running Shoes - UltraBoost 22",
    price: 12999,
    originalPrice: 15999,
    rating: 4.8,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    category: "Shoes",
    isSale: true,
  },
  {
    id: "6",
    name: "Premium Sports Water Bottle",
    price: 899,
    rating: 4.5,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
    category: "Accessories",
    isNew: true,
  },
  {
    id: "7",
    name: "Table Tennis Paddle Professional",
    price: 4999,
    rating: 4.7,
    reviews: 45,
    image: "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=400&h=400&fit=crop",
    category: "Accessories",
  },
  {
    id: "8",
    name: "Yoga Mat Anti-Slip Premium",
    price: 1999,
    originalPrice: 2999,
    rating: 4.6,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1506629905607-45eea2e87103?w=400&h=400&fit=crop",
    category: "Fitness",
    isSale: true,
  },
];

const ProductGrid = () => {
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
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
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
          <Link to="/products">
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

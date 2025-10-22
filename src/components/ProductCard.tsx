import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    image: string;
    category: string;
    isNew?: boolean;
    isSale?: boolean;
  };
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      quantity: 1,
      category: product.category,
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      viewport={{ once: true }}
      className="group"
    >
      <Card className="overflow-hidden rounded-md shadow-sm flex flex-col h-full">
        {/* Product Image */}
        <div className="relative w-full aspect-square bg-muted overflow-hidden">
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            whileHover={{ scale: 1.05 }}
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {product.isNew && (
              <span className="bg-success text-success-foreground text-[0.6rem] font-semibold px-1.5 py-0.5 rounded">
                NEW
              </span>
            )}
            {product.isSale && (
              <span className="bg-secondary text-secondary-foreground text-[0.6rem] font-semibold px-1.5 py-0.5 rounded">
                -{discount}%
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-2 right-2 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-200 space-y-1">
            <Button size="sm" variant="secondary" className="w-7 h-7 p-0 rounded-full">
              <Heart className="w-3 h-3" />
            </Button>
            <Link to={`/product/${product.id}`}>
              <Button size="sm" variant="secondary" className="w-7 h-7 p-0 rounded-full">
                <Eye className="w-3 h-3" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Card Content */}
        <CardContent className="p-2 flex-1 flex flex-col justify-between">
          <div>
            {/* Category */}
            <p className="text-[0.55rem] text-muted-foreground uppercase tracking-wide mb-0.5">
              {product.category}
            </p>

            {/* Product Name */}
            <h3 className="text-[0.75rem] font-semibold mb-1 line-clamp-2">{product.name}</h3>

            {/* Rating */}
            <div className="flex items-center space-x-1 mb-1">
              <div className="flex space-x-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < Math.floor(product.rating) ? "fill-secondary text-secondary" : "text-muted-foreground"}`}
                  />
                ))}
              </div>
              <span className="text-[0.6rem] text-muted-foreground">({product.reviews})</span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-1">
              <span className="text-[0.75rem] font-bold text-primary">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-[0.6rem] text-muted-foreground line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-2 flex flex-col gap-1">
            <Button 
              size="sm" 
              className="w-full py-1 text-[0.65rem] flex items-center justify-center"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-3 h-3 mr-1" />
              Add
            </Button>
            <Link to={`/product/${product.id}`}>
              <Button size="sm" variant="outline" className="w-full py-1 text-[0.65rem]">
                View
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;

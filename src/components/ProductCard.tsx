import { motion } from "framer-motion";
import { ShoppingCart, Eye, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";  // ✅ Wishlist Context
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    stock?: number;
  };
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist(); // ✅
  const { toast } = useToast();

  const isInWishlist = wishlist.some(item => item.id === product.id); // ✅ check

  const handleWishlist = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast({ title: "Removed from Wishlist", description: product.name });
    } else {
      addToWishlist(product);
      toast({ title: "Added to Wishlist", description: product.name });
    }
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      category: product.category,
    });

    toast({
      title: "Added to cart",
      description: `${product.name} added successfully.`,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Navigate to checkout page
    navigate("/checkout");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      viewport={{ once: true }}
      className="group"
    >
      <Card className="overflow-hidden rounded-lg shadow-md flex flex-col h-full border bg-white relative">

        {/* ✅ Wishlist Button */}
        <button
          onClick={handleWishlist}
          title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          className="absolute top-2 right-2 bg-white shadow-md rounded-full p-2 z-10 hover:scale-110 transition"
        >
          <Heart
            className={`w-5 h-5 ${
              isInWishlist ? "text-red-500 fill-red-500" : "text-gray-500"
            }`}
          />
        </button>

        {/* ✅ Product Image */}
        <div className="w-full h-44 bg-white flex items-center justify-center overflow-hidden p-2">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* ✅ Content */}
        <CardContent className="p-3 flex flex-col justify-between flex-1">
          <div>
            <p className="text-[0.65rem] text-muted-foreground uppercase">
              {product.category}
            </p>

            <h3 className="text-sm font-semibold line-clamp-2 mb-1">
              {product.name}
            </h3>

            <span className="text-base font-bold text-primary">
              ₹{product.price}
            </span>
          </div>

          {/* ✅ Buttons */}
          <div className="mt-3 flex flex-col gap-1">
            <Button
              size="sm"
              className="py-2 text-xs bg-green-600 hover:bg-green-700"
              onClick={handleBuyNow}
            >
              <ShoppingCart className="w-4 h-4 mr-1" /> Buy Now
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="py-2 text-xs"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4 mr-1" /> Add to Cart
            </Button>

            <Link to={`/product/${product.id}`}>
              <Button size="sm" variant="outline" className="w-full py-2 text-xs">
                <Eye className="w-4 h-4 mr-1" /> View
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;

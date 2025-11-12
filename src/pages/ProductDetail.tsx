import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, ShoppingCart, Plus, Minus } from "lucide-react";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";   // ✅ ADDED
import { useToast } from "@/hooks/use-toast";
import { PRODUCT_ROUTES, API_BASE_URL } from "@/config/api";

const ProductDetail = () => {
  const { id } = useParams();

  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist(); // ✅ ADDED
  const { toast } = useToast();

  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  const isWishlisted = wishlist.some((item) => item.id === id || item._id === id); // ✅ FIX

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await fetch(PRODUCT_ROUTES.GET_ALL);
        const data = await res.json();

        if (data.success) {
          const found = data.products.find((p: any) => p._id === id);
          setProduct(found);
        }
      } catch (err) {
        console.error("Error loading product", err);
      }
    };

    getProduct();
  }, [id]);

  if (!product)
    return <div className="p-10 text-center text-lg">Loading product...</div>;

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image?.startsWith("http")
        ? product.image
        : `${API_BASE_URL}${product.image}`,
      quantity,
      category: product.category,
    });

    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} added.`,
    });

    setQuantity(1);
  };

  const handleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product._id);
      toast({ title: "Removed from Wishlist", description: product.name });
    } else {
      addToWishlist({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      });
      toast({ title: "Added to Wishlist", description: product.name });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-6">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-4 text-sm"
        >
          <Link
            to="/products"
            className="flex items-center gap-1 text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* ✅ Product Image */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="rounded-lg border bg-white flex items-center justify-center aspect-square p-4">
              <img
                src={
                  product.image?.startsWith("http")
                    ? product.image
                    : `${API_BASE_URL}${product.image}`
                }
                alt={product.name}
                className="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>
          </motion.div>

          {/* ✅ Product Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Badge className="mb-1 text-xs">{product.category}</Badge>

            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

            <div className="flex items-center gap-2 mb-3 text-lg">
              <span className="font-bold text-primary">₹{product.price}</span>
            </div>

            <p className="text-sm text-muted-foreground mb-3">
              {product.description}
            </p>

            <Separator />

            {/* ✅ Quantity */}
            <div className="mt-3 flex items-center gap-3 text-sm">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center gap-1 border rounded p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(-1)}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* ✅ Buttons */}
            <div className="flex gap-2 mt-4">
              <Button className="flex-1 text-sm" onClick={handleAddToCart}>
                <ShoppingCart className="w-4 h-4 mr-1" /> Add to Cart
              </Button>

              <Button
                variant="outline"
                onClick={handleWishlist}
                className={
                  isWishlisted ? "text-red-500 border-red-500" : ""
                }
              >
                <Heart
                  className={`w-4 h-4 ${
                    isWishlisted ? "fill-current text-red-500" : ""
                  }`}
                />
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;

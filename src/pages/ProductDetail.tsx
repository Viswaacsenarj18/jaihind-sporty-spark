import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, ShoppingCart, Plus, Minus } from "lucide-react";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import { PRODUCT_ROUTES, API_BASE_URL } from "@/config/api";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const buyNow = searchParams.get("buyNow") === "true";

  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { toast } = useToast();

  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const isWishlisted = wishlist.some((item) => item.id === id);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await fetch(PRODUCT_ROUTES.GET_ALL);
        const data = await res.json();

        if (data.success) {
          const found = data.products.find((p: any) => p._id === id);
          setProduct(found);
          
          // Set default size if product has sizes
          if (found?.hasSizes && found?.sizes?.length > 0) {
            setSelectedSize(found.sizes[0].size);
          }
        }
      } catch (err) {
        console.error("Error loading product", err);
      }
    };

    getProduct();
  }, [id]);

  if (!product)
    return <div className="p-10 text-center text-lg">Loading product...</div>;

  // ✅ Check if product is out of stock
  const isOutOfStock = product.stock <= 0;

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(prev + delta, product.stock || 1)));
  };

  const handleAddToCart = () => {
    // ✅ Check stock before adding to cart
    if (isOutOfStock) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock. Please check back later.",
        variant: "destructive"
      });
      return;
    }

    // Check if quantity exceeds stock
    if (quantity > product.stock) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${product.stock} items available in stock.`,
        variant: "destructive"
      });
      return;
    }

    // Validate size selection if product has sizes
    if (product.hasSizes && !selectedSize) {
      toast({
        title: "Please select a size",
        description: "You must select a size before adding to cart.",
        variant: "destructive"
      });
      return;
    }

    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image?.startsWith("http")
        ? product.image
        : `${API_BASE_URL}${product.image}`,
      quantity,
      category: product.category,
      size: selectedSize || undefined,
      stock: product.stock, // ✅ Include stock
    };

    // ✅ NEW: If buyNow was clicked, navigate directly to checkout with this item
    if (buyNow) {
      // Store the item in sessionStorage to pass to checkout
      sessionStorage.setItem("buyNowItem", JSON.stringify(cartItem));
      
      toast({
        title: "Proceeding to checkout",
        description: `${quantity} × ${product.name} ready for checkout.`,
      });
      
      // Navigate to checkout
      navigate("/checkout?buyNow=true");
    } else {
      // Regular add to cart flow
      addToCart(cartItem);

      toast({
        title: "Added to cart",
        description: `${quantity} × ${product.name}${selectedSize ? ` (${selectedSize})` : ""} added.`,
      });

      setQuantity(1);
    }
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

            {/* ✅ Stock Status Badge */}
            <div className="mt-4">
              {isOutOfStock ? (
                <Badge variant="destructive" className="text-base py-1 px-3">
                  Out of Stock
                </Badge>
              ) : product.stock < 5 ? (
                <Badge variant="secondary" className="text-base py-1 px-3 bg-amber-100 text-amber-800 border border-amber-300">
                  ⚠️ Only {product.stock} left in stock
                </Badge>
              ) : (
                <Badge className="text-base py-1 px-3 bg-green-100 text-green-800 border border-green-300">
                  ✓ {product.stock} in stock
                </Badge>
              )}
            </div>

            <Separator />

            {/* ✅ Size Selection (Like Flipkart) */}
            {product.hasSizes && product.sizes && product.sizes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg border border-blue-200"
              >
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-sm font-bold text-foreground">
                    SELECT SIZE
                  </h3>
                  <Badge variant="outline" className="text-xs">Guide</Badge>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((s: any) => {
                    const isSelected = selectedSize === s.size;
                    const isOutOfStock = s.quantity === 0;
                    
                    return (
                      <motion.button
                        key={s.size}
                        whileHover={!isOutOfStock ? { scale: 1.05 } : {}}
                        whileTap={!isOutOfStock ? { scale: 0.95 } : {}}
                        onClick={() => !isOutOfStock && setSelectedSize(s.size)}
                        disabled={isOutOfStock}
                        className={`
                          px-4 py-2 rounded-lg font-semibold text-sm border-2 transition-all
                          ${isSelected
                            ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                            : isOutOfStock
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                            : "bg-white text-foreground border-gray-300 hover:border-blue-600"
                          }
                        `}
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-base font-bold">{s.size}</span>
                          {s.quantity > 0 ? (
                            <span className="text-xs opacity-70">In Stock</span>
                          ) : (
                            <span className="text-xs">Out of Stock</span>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {selectedSize && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-2 bg-white rounded border border-green-300 bg-green-50 flex items-center gap-2"
                  >
                    <span className="text-green-700 font-semibold text-sm">
                      ✓ Size {selectedSize} selected
                    </span>
                    <span className="text-green-600 text-xs">
                      ({product.sizes.find((s: any) => s.size === selectedSize)?.quantity} available)
                    </span>
                  </motion.div>
                )}
              </motion.div>
            )}

            <Separator className="my-3" />

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


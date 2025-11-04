import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = cartItems.reduce((sum, item) => {
    const itemDiscount = item.originalPrice ? (item.originalPrice - item.price) * item.quantity : 0;
    return sum + itemDiscount;
  }, 0);
  const shipping = subtotal > 5000 ? 0 : 200;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-sm mx-auto flex flex-col items-center"
          >
            <ShoppingBag className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 text-muted-foreground" />
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Your cart is empty
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6">
              Looks like you haven't added any items yet.
            </p>
            <Link to="/products" className="w-full">
              <Button size="lg" className="w-full rounded-full">Continue Shopping</Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-8 sm:py-12">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-4xl font-bold mb-2"
          >
            Shopping Cart
          </motion.h1>
          <p className="text-sm sm:text-lg text-muted-foreground">
            Review your selected items
          </p>
        </div>
      </section>

      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-10">
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-8">

          {/* ✅ Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Cart Items ({cartItems.length})
            </h2>

            {cartItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">

                      {/* ✅ Image */}
                      <div className="w-28 h-28 sm:w-24 sm:h-24 rounded-lg overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* ✅ Product Info */}
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="font-semibold text-sm sm:text-base line-clamp-2">
                          {item.name}
                        </h3>

                        <div className="flex justify-center sm:justify-start items-center gap-2 mt-1">
                          <span className="font-bold text-primary text-base sm:text-lg">
                            ₹{item.price.toLocaleString()}
                          </span>
                          
                          {item.originalPrice && (
                            <span className="text-xs sm:text-sm line-through text-muted-foreground">
                              ₹{item.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* ✅ Quantity */}
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex items-center border rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 sm:p-3"
                          >
                            <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                          <span className="px-3 sm:px-4 py-1 font-semibold text-sm sm:text-base">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 sm:p-3"
                          >
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-red-500 hover:bg-red-100 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>

                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* ✅ Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-5"
          >
            <Card>
              <CardContent className="p-5 sm:p-6 space-y-3 sm:space-y-5">
                <h3 className="text-lg font-semibold">Order Summary</h3>

                <div className="space-y-2 text-sm sm:text-base">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className={`${shipping === 0 && "text-green-600 font-semibold"}`}>
                      {shipping === 0 ? "Free" : `₹${shipping}`}
                    </span>
                  </div>

                  <div className="border-t pt-2 text-base sm:text-lg font-bold flex justify-between">
                    <span>Total</span>
                    <span className="text-primary">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <Link to="/checkout">
                  <Button size="lg" className="w-full rounded-full mt-2">
                    Proceed to Checkout <ArrowRight className="ml-2" />
                  </Button>
                </Link>

                <Link to="/products">
                  <Button variant="outline" size="lg" className="w-full rounded-full mt-2">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

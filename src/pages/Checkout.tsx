import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Truck, ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India"
  });

  const [loading, setLoading] = useState(false);

  // ✅ Only COD
  const paymentMethod = "cod";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  // ✅ PRICE CALCULATION (No GST / No extra charges)
  const subtotal = cartItems.reduce((s, item) => s + item.price * item.quantity, 0);
  const shipping = subtotal > 5000 ? 0 : 99;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!shippingInfo.firstName || !shippingInfo.email || !shippingInfo.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/orders/create", {
        customer: shippingInfo,
        items: cartItems,
        paymentMethod: "Cash on Delivery",
        summary: { subtotal, shipping, total }
      });

      if (res.data.success) {
        clearCart();

        toast({
          title: "Order Placed Successfully",
          description: `Thank you ${shippingInfo.firstName}!`
        });

        navigate("/");
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Order Failed",
        description: "Please try again.",
        variant: "destructive"
      });
    }

    setLoading(false);
  };

  // ✅ Empty cart screen
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto"
          >
            <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-muted-foreground" />
            <h2 className="text-2xl font-bold">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add some items before checking out.
            </p>
            <Link to="/products">
              <Button className="rounded-full">Browse Products</Button>
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <Link to="/cart" className="flex items-center gap-2 text-muted-foreground mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-8">

            {/* ✅ Shipping Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" /> Shipping Information
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Name */}
                <div className="grid md:grid-cols-2 gap-4">
                  {["firstName", "lastName"].map((field) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field}>{field === "firstName" ? "First Name" : "Last Name"}</Label>
                      <Input id={field} name={field} value={shippingInfo[field]} onChange={handleInputChange} required />
                    </div>
                  ))}
                </div>

                {/* Email + Phone */}
                <div className="grid md:grid-cols-2 gap-4">
                  {["email", "phone"].map((field) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field}>{field === "email" ? "Email" : "Phone"}</Label>
                      <Input id={field} name={field} value={shippingInfo[field]} onChange={handleInputChange} required />
                    </div>
                  ))}
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" name="address" value={shippingInfo.address} onChange={handleInputChange} required />
                </div>

                {/* City, State, Pincode */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label>City</Label>
                    <Input name="city" value={shippingInfo.city} onChange={handleInputChange} required />
                  </div>

                  <div>
                    <Label>State</Label>
                    <Input name="state" value={shippingInfo.state} onChange={handleInputChange} required />
                  </div>

                  <div>
                    <Label>Pincode</Label>
                    <Input name="pincode" value={shippingInfo.pincode} onChange={handleInputChange} required />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ✅ Payment (Only COD) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" /> Payment Method
                </CardTitle>
              </CardHeader>

              <CardContent>
                <RadioGroup value="cod">
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <RadioGroupItem id="cod" value="cod" checked />
                    <Label htmlFor="cod" className="flex-1">
                      Cash on Delivery (COD)
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

          </div>

          {/* ✅ RIGHT SIDE SUMMARY */}
          <Card className="h-fit sticky top-5">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

              {/* Items */}
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img src={item.image} className="w-16 h-16 rounded object-cover" />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="font-semibold">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Price Calculation */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">₹{total}</span>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </Button>

            </CardContent>
          </Card>

        </div>

      </main>

      <Footer />
    </div>
  );
};

export default Checkout;

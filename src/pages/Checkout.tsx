import { useState, useMemo } from "react";
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
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api"; // Axios instance with baseURL=http://localhost:5000/api

type ShippingInfo = {
  firstName: string; lastName: string; email: string; phone: string;
  address: string; city: string; state: string; pincode: string; country: string;
};

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "", pincode: "", country: "India",
  });
  const [loading, setLoading] = useState(false);

  // COD only
  const paymentMethod = "Cash on Delivery";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  // prices (no GST)
  const subtotal = useMemo(
    () => cartItems.reduce((s, it) => s + it.price * it.quantity, 0),
    [cartItems]
  );
  const shipping = subtotal > 5000 ? 0 : 99;
  const total = subtotal + shipping;

  const placeOrder = async () => {
    // map cart items to the shape backend expects
    const items = cartItems.map((it) => ({
      productId: it.id ?? it._id,       // ensure an id is sent
      name: it.name,
      image: it.image,
      price: it.price,
      quantity: it.quantity,
    }));

    return api.post("/orders/create", {
      customer: shippingInfo,
      items,
      paymentMethod,
      summary: { subtotal, shipping, total },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!shippingInfo.firstName || !shippingInfo.email || !shippingInfo.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    if (cartItems.length === 0) {
      toast({ title: "Cart is empty", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const res = await placeOrder();
      if (res.data?.success) {
        clearCart();
        toast({
          title: "Order Placed Successfully",
          description: `Thank you ${shippingInfo.firstName}!`,
        });
        navigate("/"); // or navigate(`/order/${res.data.order._id}`)
      } else {
        throw new Error(res.data?.message || "Unknown error");
      }
    } catch (err: any) {
      console.error(err?.response?.data || err);
      toast({
        title: "Order Failed",
        description: err?.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
          {/* Left: Shipping + Payment */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" /> Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {(["firstName", "lastName"] as const).map((field) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field}>{field === "firstName" ? "First Name" : "Last Name"}</Label>
                      <Input id={field} name={field} value={shippingInfo[field]} onChange={handleInputChange} required />
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {(["email", "phone"] as const).map((field) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field}>{field === "email" ? "Email" : "Phone"}</Label>
                      <Input id={field} name={field} value={shippingInfo[field]} onChange={handleInputChange} required />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" name="address" value={shippingInfo.address} onChange={handleInputChange} required />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" value={shippingInfo.city} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input id="state" name="state" value={shippingInfo.state} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input id="pincode" name="pincode" value={shippingInfo.pincode} onChange={handleInputChange} required />
                  </div>
                </div>
              </CardContent>
            </Card>

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
                    <Label htmlFor="cod" className="flex-1">Cash on Delivery (COD)</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Right: Summary */}
          <Card className="h-fit sticky top-5">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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

              <Button className="w-full" onClick={handleSubmit} disabled={loading}>
                {loading ? "Placing Order..." : "Place Order"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Checkout;

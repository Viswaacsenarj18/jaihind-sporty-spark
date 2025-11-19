import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Truck, ShoppingBag, AlertCircle } from "lucide-react";
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
import api from "@/lib/api";

type ShippingInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
};

type FieldErrors = Partial<Record<keyof ShippingInfo, string>>;

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  // ✅ Validation Functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ''));
  };

  const validatePincode = (pincode: string): boolean => {
    const pincodeRegex = /^[0-9]{6}$/;
    return pincodeRegex.test(pincode);
  };

  const validateForm = (): boolean => {
    const newErrors: FieldErrors = {};

    // Required fields
    if (!shippingInfo.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!shippingInfo.email.trim()) {
      newErrors.email = "Email is required";
    }
    if (!shippingInfo.phone.trim()) {
      newErrors.phone = "Phone is required";
    }
    if (!shippingInfo.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!shippingInfo.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!shippingInfo.state.trim()) {
      newErrors.state = "State is required";
    }
    if (!shippingInfo.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    }

    // Format validation
    if (shippingInfo.email && !validateEmail(shippingInfo.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (shippingInfo.phone && !validatePhone(shippingInfo.phone)) {
      newErrors.phone = "Phone must be 10 digits (India format)";
    }
    if (shippingInfo.pincode && !validatePincode(shippingInfo.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setShippingInfo((prev) => ({
          ...prev,
          firstName: u.name?.split(" ")[0] || prev.firstName || "",
          lastName: u.name?.split(" ").slice(1).join(" ") || prev.lastName || "",
          email: u.email || prev.email || "",
        }));
      } catch (err) {
        console.error("Failed to parse user data:", err);
      }
    }
  }, []);

  // ✅ COD only
  const paymentMethod = "Cash on Delivery";

  // ✅ Real-time validation on input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((s) => ({ ...s, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof FieldErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ✅ Price calculations
  const subtotal = useMemo(
    () => cartItems.reduce((s, it) => s + it.price * it.quantity, 0),
    [cartItems]
  );

  const shipping = subtotal > 5000 ? 0 : 99;
  const total = subtotal + shipping;

  // ✅ Backend Payload
  const placeOrder = async () => {
    const items = cartItems.map((it) => ({
      productId: it.id ?? it._id,
      name: it.name,
      image: it.image,
      price: it.price,
      quantity: it.quantity,
    }));

    return api.post("/orders/create", {
      items,
      shippingInfo,
      summary: { subtotal, shipping, total },
    });
  };

  // ✅ Handle Place Order
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    console.log("🔍 Checkout Debug:", {
      hasToken: !!token,
      tokenLength: token?.length,
      hasUser: !!user,
      token: token ? token.substring(0, 30) + "..." : null,
      cartItems: cartItems.length,
    });

    // ✅ Block checkout if user is not logged in
    if (!token || !user) {
      toast({
        title: "Login Required",
        description: "Please log in to place your order.",
        variant: "destructive",
      });
      return navigate("/login?redirect=checkout");
    }

    // ✅ Validate all fields
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below before placing order.",
        variant: "destructive",
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Cart Empty",
        description: "Add some items before placing an order.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log("📦 Placing order with:", {
        itemsCount: cartItems.length,
        total: subtotal + shipping,
        shippingInfo: shippingInfo,
      });

      const res = await placeOrder();

      console.log("✅ Order response:", res.data);

      // ✅ Check for success indicators
      if (res.status === 201 || (res.data as any)?.order || (res.data as any)?.message) {
        clearCart();

        toast({
          title: "Order Placed Successfully! 🎉",
          description: `Thank you ${shippingInfo.firstName}! Your order has been created.`,
        });

        // Navigate after a brief delay to let user see the success message
        setTimeout(() => {
          navigate("/my-orders");
        }, 1500);
      } else {
        throw new Error((res.data as any)?.error || "Unknown error");
      }
    } catch (err: any) {
      console.error("❌ Order Error:", {
        status: err?.response?.status,
        statusText: err?.response?.statusText,
        data: err?.response?.data,
        message: err?.message,
        fullError: err,
      });

      // More specific error messages
      let errorMsg = "Failed to place order. Please try again.";
      if (err?.response?.status === 401) {
        errorMsg = "Authentication failed. Please log in again.";
      } else if (err?.response?.status === 400) {
        errorMsg = err?.response?.data?.error || "Invalid order details. Please check and try again.";
      } else if (err?.response?.status === 404) {
        errorMsg = "One or more products not found. Please refresh and try again.";
      } else if (err?.message === "Network Error") {
        errorMsg = "Network error. Please check your connection and try again.";
      }

      toast({
        title: "Order Failed",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Empty Cart Screen
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

  // ✅ Main Checkout UI
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <Link to="/cart" className="flex items-center gap-2 text-muted-foreground mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2 space-y-8">
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
                      <Label htmlFor={field}>
                        {field === "firstName" ? "First Name *" : "Last Name"}
                      </Label>
                      <Input 
                        id={field} 
                        name={field} 
                        value={shippingInfo[field as keyof ShippingInfo]} 
                        onChange={handleInputChange}
                        className={errors[field as keyof FieldErrors] ? "border-red-500" : ""}
                        placeholder={field === "firstName" ? "Enter first name" : "Enter last name"}
                      />
                      {errors[field as keyof FieldErrors] && (
                        <div className="flex items-center gap-1 text-red-500 text-xs">
                          <AlertCircle className="w-3 h-3" />
                          {errors[field as keyof FieldErrors]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Email + Phone */}
                <div className="grid md:grid-cols-2 gap-4">
                  {["email", "phone"].map((field) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field}>
                        {field === "email" ? "Email *" : "Phone *"}
                      </Label>
                      <Input 
                        id={field} 
                        name={field} 
                        type={field === "email" ? "email" : "tel"}
                        value={shippingInfo[field as keyof ShippingInfo]} 
                        onChange={handleInputChange}
                        className={errors[field as keyof FieldErrors] ? "border-red-500" : ""}
                        placeholder={field === "email" ? "Enter email address" : "Enter 10-digit phone number"}
                      />
                      {errors[field as keyof FieldErrors] && (
                        <div className="flex items-center gap-1 text-red-500 text-xs">
                          <AlertCircle className="w-3 h-3" />
                          {errors[field as keyof FieldErrors]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input 
                    id="address" 
                    name="address" 
                    value={shippingInfo.address} 
                    onChange={handleInputChange}
                    className={errors.address ? "border-red-500" : ""}
                    placeholder="Enter street address"
                  />
                  {errors.address && (
                    <div className="flex items-center gap-1 text-red-500 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      {errors.address}
                    </div>
                  )}
                </div>

                {/* City, State, Pincode */}
                <div className="grid md:grid-cols-3 gap-4">
                  {["city", "state", "pincode"].map((field) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field}>
                        {field.charAt(0).toUpperCase() + field.slice(1)} *
                      </Label>
                      <Input 
                        id={field} 
                        name={field} 
                        value={shippingInfo[field as keyof ShippingInfo]} 
                        onChange={handleInputChange}
                        className={errors[field as keyof FieldErrors] ? "border-red-500" : ""}
                        placeholder={field === "pincode" ? "6 digits" : "Enter " + field}
                        maxLength={field === "pincode" ? 6 : undefined}
                      />
                      {errors[field as keyof FieldErrors] && (
                        <div className="flex items-center gap-1 text-red-500 text-xs">
                          <AlertCircle className="w-3 h-3" />
                          {errors[field as keyof FieldErrors]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment */}
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

          {/* Right Summary */}
          <Card className="h-fit sticky top-5">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover" />
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

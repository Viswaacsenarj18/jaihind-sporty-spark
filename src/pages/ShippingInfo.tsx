import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Truck, Clock, MapPin, Package } from "lucide-react";

const ShippingInfo = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <h1 className="text-4xl font-bold text-foreground mb-8 text-center">Shipping Information</h1>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Truck className="h-6 w-6 text-primary mr-2" />
                      Delivery Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Standard Delivery</h4>
                      <p className="text-muted-foreground text-sm">5-7 business days - Free on orders over ₹1,000</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Express Delivery</h4>
                      <p className="text-muted-foreground text-sm">2-3 business days - ₹150</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Next Day Delivery</h4>
                      <p className="text-muted-foreground text-sm">Next business day - ₹300</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Same Day Delivery</h4>
                      <p className="text-muted-foreground text-sm">Within 6 hours - ₹500 (Mumbai only)</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="h-6 w-6 text-primary mr-2" />
                      Processing Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold">In Stock Items</h4>
                      <p className="text-muted-foreground text-sm">1-2 business days processing</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Custom Orders</h4>
                      <p className="text-muted-foreground text-sm">3-5 business days processing</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Bulk Orders</h4>
                      <p className="text-muted-foreground text-sm">5-7 business days processing</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Weekend Orders</h4>
                      <p className="text-muted-foreground text-sm">Processed on next business day</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-6 w-6 text-primary mr-2" />
                    Delivery Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Major Cities</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>Mumbai</li>
                        <li>Delhi</li>
                        <li>Bangalore</li>
                        <li>Chennai</li>
                        <li>Kolkata</li>
                        <li>Pune</li>
                        <li>Hyderabad</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Tier 2 Cities</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>Ahmedabad</li>
                        <li>Jaipur</li>
                        <li>Lucknow</li>
                        <li>Kanpur</li>
                        <li>Nagpur</li>
                        <li>Indore</li>
                        <li>Thane</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Other Areas</h4>
                      <p className="text-sm text-muted-foreground">
                        We deliver to 25,000+ pin codes across India. 
                        Enter your pin code at checkout to check availability.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="h-6 w-6 text-primary mr-2" />
                    Packaging & Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Secure Packaging</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Bubble wrap protection for fragile items</li>
                        <li>• Waterproof packaging for outdoor gear</li>
                        <li>• Eco-friendly packaging materials</li>
                        <li>• Tamper-proof sealing</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Order Tracking</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Real-time tracking updates</li>
                        <li>• SMS and email notifications</li>
                        <li>• Delivery confirmation</li>
                        <li>• Photo proof of delivery</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShippingInfo;
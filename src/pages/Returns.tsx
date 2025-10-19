import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { RotateCcw, Shield, Clock, CheckCircle } from "lucide-react";

const Returns = () => {
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
            <h1 className="text-4xl font-bold text-foreground mb-8 text-center">Returns & Exchanges</h1>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <RotateCcw className="h-6 w-6 text-primary mr-2" />
                      Return Policy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold">30-Day Return Window</h4>
                      <p className="text-muted-foreground text-sm">
                        Return items within 30 days of delivery for a full refund
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Original Condition</h4>
                      <p className="text-muted-foreground text-sm">
                        Items must be unused, with tags attached and in original packaging
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Free Returns</h4>
                      <p className="text-muted-foreground text-sm">
                        Free return shipping on orders over ₹2,000
                      </p>
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
                      <Shield className="h-6 w-6 text-primary mr-2" />
                      Exchange Policy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Size Exchanges</h4>
                      <p className="text-muted-foreground text-sm">
                        Free size exchanges within 15 days of delivery
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Color Exchanges</h4>
                      <p className="text-muted-foreground text-sm">
                        Exchange for different color within 7 days (subject to availability)
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Defective Items</h4>
                      <p className="text-muted-foreground text-sm">
                        Immediate exchange or refund for manufacturing defects
                      </p>
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
                    <Clock className="h-6 w-6 text-primary mr-2" />
                    Return Process
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-primary font-bold">1</span>
                      </div>
                      <h4 className="font-semibold mb-2">Initiate Return</h4>
                      <p className="text-sm text-muted-foreground">
                        Log into your account and select items to return
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-primary font-bold">2</span>
                      </div>
                      <h4 className="font-semibold mb-2">Print Label</h4>
                      <p className="text-sm text-muted-foreground">
                        Download and print the prepaid return label
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-primary font-bold">3</span>
                      </div>
                      <h4 className="font-semibold mb-2">Pack & Ship</h4>
                      <p className="text-sm text-muted-foreground">
                        Pack items securely and drop off at any courier location
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-primary font-bold">4</span>
                      </div>
                      <h4 className="font-semibold mb-2">Get Refund</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive refund within 5-7 business days
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="h-6 w-6 text-primary mr-2" />
                      Eligible Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Clothing and footwear</li>
                      <li>• Sports equipment</li>
                      <li>• Accessories</li>
                      <li>• Fitness gear</li>
                      <li>• Team jerseys (if unworn)</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Non-Returnable Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                      <li>• Personalized/customized items</li>
                      <li>• Undergarments and swimwear</li>
                      <li>• Used protective gear</li>
                      <li>• Gift cards</li>
                      <li>• Final sale items</li>
                    </ul>
                    <Button className="w-full">Start Return Process</Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
      
    </div>
  );
};

export default Returns;
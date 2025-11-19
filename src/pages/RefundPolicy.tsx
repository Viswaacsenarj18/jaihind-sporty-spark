import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CreditCard, Calendar, AlertCircle, CheckCircle } from "lucide-react";

const RefundPolicy = () => {
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
            <h1 className="text-4xl font-bold text-foreground mb-8 text-center">Refund Policy</h1>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-6 w-6 text-primary mr-2" />
                      Refund Methods
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Original Payment Method</h4>
                      <p className="text-muted-foreground text-sm">
                        Refunds are processed to your original payment method
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Credit/Debit Cards</h4>
                      <p className="text-muted-foreground text-sm">
                        5-7 business days to appear on your statement
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Digital Wallets</h4>
                      <p className="text-muted-foreground text-sm">
                        2-3 business days for PayTM, PhonePe, Google Pay
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Bank Transfer</h4>
                      <p className="text-muted-foreground text-sm">
                        3-5 business days for direct bank transfers
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
                      <Calendar className="h-6 w-6 text-primary mr-2" />
                      Refund Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Immediate Refunds</h4>
                      <p className="text-muted-foreground text-sm">
                        Order cancellation within 1 hour of placing
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Standard Refunds</h4>
                      <p className="text-muted-foreground text-sm">
                        Processed within 2-3 business days after return approval
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Bulk Orders</h4>
                      <p className="text-muted-foreground text-sm">
                        5-7 business days for orders over ₹50,000
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">International Orders</h4>
                      <p className="text-muted-foreground text-sm">
                        7-10 business days for international payments
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
                    <CheckCircle className="h-6 w-6 text-primary mr-2" />
                    Refund Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-green-600">Eligible for Full Refund</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Items returned within 30 days</li>
                        <li>• Products in original condition with tags</li>
                        <li>• Defective or damaged items</li>
                        <li>• Wrong items delivered</li>
                        <li>• Order cancellation before shipping</li>
                        <li>• Delayed delivery beyond promised date</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-orange-600">Partial or No Refund</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Items returned after 30 days (store credit only)</li>
                        <li>• Used or worn items</li>
                        <li>• Personalized/custom products</li>
                        <li>• Items without original packaging</li>
                        <li>• Hygiene products (undergarments, swimwear)</li>
                        <li>• Final sale items</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="h-6 w-6 text-primary mr-2" />
                    Important Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      <strong>Shipping Charges:</strong> Original shipping charges are non-refundable 
                      unless the return is due to our error or a defective product.
                    </p>
                    <p>
                      <strong>Gift Cards:</strong> Refunds for gift card purchases will be issued as 
                      store credit only.
                    </p>
                    <p>
                      <strong>Promotional Discounts:</strong> If you used a promotional code, the 
                      discount amount will be deducted from your refund.
                    </p>
                    <p>
                      <strong>Processing Delays:</strong> During peak seasons (festivals, sales), 
                      refund processing may take additional 2-3 business days.
                    </p>
                    <p>
                      <strong>Dispute Resolution:</strong> If you disagree with our refund decision, 
                      you can escalate the matter to our customer service manager within 7 days.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Have questions about your refund? Our customer service team is here to help.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <strong>Email:</strong> refunds@jaihindsports.com
                    </div>
                    <div>
                      <strong>Phone:</strong> +91 98765 43210
                    </div>
                    <div>
                      <strong>Hours:</strong> Mon-Sat 9AM-8PM
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
    </div>
  );
};

export default RefundPolicy;
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const ContactUs = () => {
  const phoneNumber = "9659059697"; // WhatsApp format: country code + number

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
            <h1 className="text-4xl font-bold text-foreground mb-8 text-center">
              Contact Us
            </h1>
            
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Send us a Message</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="First Name" />
                      <Input placeholder="Last Name" />
                    </div>
                    <Input placeholder="Email Address" type="email" />
                    <Input placeholder="Subject" />
                    <Textarea placeholder="Your Message" className="min-h-32" />
                    <Button className="w-full">Send Message</Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-6"
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Phone className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="font-semibold">Phone</h3>
                        <p className="text-muted-foreground">
                          86374 50696 / 80568 91366
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mb-4">
                      <Mail className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="font-semibold">Email</h3>
                        <p className="text-muted-foreground">
                          sethupathi51469@gmail.com
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mb-4">
                      <MapPin className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="font-semibold">Address</h3>
                        <p className="text-muted-foreground">
                          Near Bus Stand, Thuraiyur Rd,<br />
                          Mettuppalayam - 621210
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <Clock className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="font-semibold">Business Hours</h3>
                        <p className="text-muted-foreground">
                          Mon - Sat: 9:00 AM - 8:00 PM<br />
                          Sunday: 10:00 AM - 6:00 PM
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Live Chat Support */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Customer Support</h3>
                    <p className="text-muted-foreground mb-4">
                      Need help with your order or have questions about our products? 
                      Chat directly with us via WhatsApp!
                    </p>
                    <a
                      href={`https://wa.me/${8637450696}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" className="w-full">
                        Live Chat Support
                      </Button>
                    </a>
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

export default ContactUs;

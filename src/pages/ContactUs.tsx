import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ContactUs = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Send email via mailto
      const mailtoLink = `mailto:sethupathi51469@gmail.com?subject=${encodeURIComponent(
        `New Contact Form: ${formData.subject}`
      )}&body=${encodeURIComponent(
        `From: ${formData.firstName} ${formData.lastName}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      )}`;

      window.location.href = mailtoLink;

      // Also show success toast
      toast({
        title: "Message Sent! 📧",
        description:
          "Thank you for contacting Jaihind Sports. We'll get back to you soon!",
      });

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          placeholder="First Name"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                        />
                        <Input
                          placeholder="Last Name"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                        />
                      </div>
                      <Input
                        placeholder="Email Address"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                      />
                      <Input
                        placeholder="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                      />
                      <Textarea
                        placeholder="Your Message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className="min-h-32"
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
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
                      Need help with your order or have questions about our
                      products? Chat directly with us!
                    </p>
                    <div className="space-y-2">
                      <a
                        href={`https://wa.me/${8637450696}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" className="w-full">
                          💬 WhatsApp Support
                        </Button>
                      </a>
                      <p className="text-xs text-muted-foreground text-center">
                        Available 9 AM - 8 PM (Mon-Sat)
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactUs;

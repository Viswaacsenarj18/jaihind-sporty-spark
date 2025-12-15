import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl font-bold text-foreground mb-8">About Jaihind Sports</h1>
            
            <div className="prose prose-lg max-w-none">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-semibold text-foreground mb-4">Our Mission</h2>
                <p className="text-muted-foreground mb-6">
                  At Jaihind Sports, we're passionate about bringing you the finest sports equipment and gear. 
                  Our mission is to empower athletes of all levels with high-quality products that enhance 
                  performance and inspire greatness.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-semibold text-foreground mb-4">Our Values</h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="font-semibold text-primary mr-2">Quality:</span>
                    We source only the best sports equipment from trusted brands.
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold text-primary mr-2">Innovation:</span>
                    We stay ahead of the latest trends and technologies in sports.
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold text-primary mr-2">Community:</span>
                    We support athletes and sports enthusiasts at every level.
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold text-primary mr-2">Service:</span>
                    We provide exceptional customer service and support.
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h2 className="text-2xl font-semibold text-foreground mb-4">Why Choose Us?</h2>
                <p className="text-muted-foreground">
                  With years of experience in the sports industry, we understand what athletes need. 
                  Our team consists of sports enthusiasts who are dedicated to helping you find the 
                  perfect equipment for your sport. From professional athletes to weekend warriors, 
                  we have something for everyone.
                </p>
              </motion.div>
              {/* UDYAM CERTIFICATE SECTION */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.8 }}
  className="mt-12"
>
  <h2 className="text-2xl font-semibold text-foreground mb-4">
    Our Business Registration
  </h2>

  <p className="text-muted-foreground mb-6">
    Jaihind Sports is a registered Micro Enterprise under the Government of India.
    You can view our official UDYAM Registration Certificate below.
  </p>

  {/* Desktop View */}
  <div className="hidden md:block rounded-xl overflow-hidden border shadow-sm">
    <iframe
      src="/documents/jaihind-udyam-certificate.pdf"
      className="w-full h-[600px]"
      title="Jaihind Sports UDYAM Certificate"
    />
  </div>

  {/* Mobile View */}
  <div className="md:hidden text-center border rounded-xl p-6">
    <p className="text-muted-foreground mb-4">
      View our UDYAM Registration Certificate
    </p>
    <a
      href="/documents/jaihind-udyam-certificate.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg font-medium"
    >
      Open PDF
    </a>
  </div>

  <div className="mt-4 text-center">
    <a
      href="/documents/jaihind-udyam-certificate.pdf"
      download
      className="text-primary font-medium underline"
    >
      Download Certificate (PDF)
    </a>
  </div>
</motion.div>

            </div>
          </motion.div>
        </div>
      </main>
      
    </div>
  );
};

export default AboutUs;
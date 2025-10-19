import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const CookiePolicy = () => {
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
            <h1 className="text-4xl font-bold text-foreground mb-8">Cookie Policy</h1>
            
            <div className="prose prose-lg max-w-none space-y-8">
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-2xl font-semibold text-foreground mb-4">What are Cookies?</h2>
                <p className="text-muted-foreground">
                  Cookies are small text files that are stored on your device when you visit our website. 
                  They help us provide you with a better experience by remembering your preferences and 
                  how you use our site.
                </p>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-2xl font-semibold text-foreground mb-4">Types of Cookies We Use</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Essential Cookies</h3>
                    <p className="text-muted-foreground">
                      These cookies are necessary for the website to function properly. They enable 
                      basic features like page navigation and access to secure areas.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Performance Cookies</h3>
                    <p className="text-muted-foreground">
                      These cookies collect information about how visitors use our website, such as 
                      which pages are visited most often and if users get error messages.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Functionality Cookies</h3>
                    <p className="text-muted-foreground">
                      These cookies allow the website to remember choices you make and provide 
                      enhanced, more personal features.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Marketing Cookies</h3>
                    <p className="text-muted-foreground">
                      These cookies are used to deliver adverts more relevant to you and your interests. 
                      They may also be used to limit the number of times you see an advertisement.
                    </p>
                  </div>
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h2 className="text-2xl font-semibold text-foreground mb-4">Managing Cookies</h2>
                <p className="text-muted-foreground mb-4">
                  You can control and/or delete cookies as you wish. You can delete all cookies 
                  that are already on your computer and you can set most browsers to prevent them 
                  from being placed.
                </p>
                <p className="text-muted-foreground">
                  However, if you do this, you may have to manually adjust some preferences every 
                  time you visit a site and some services and functionalities may not work.
                </p>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <h2 className="text-2xl font-semibold text-foreground mb-4">Third-Party Cookies</h2>
                <p className="text-muted-foreground">
                  Some cookies on our site are set by third-party services that appear on our pages. 
                  These include social media plugins, analytics services, and advertising networks. 
                  We do not control these cookies.
                </p>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have any questions about our Cookie Policy, please contact us at 
                  cookies@jaihindsports.com
                </p>
              </motion.section>
            </div>
          </motion.div>
        </div>
      </main>
      
    </div>
  );
};

export default CookiePolicy;
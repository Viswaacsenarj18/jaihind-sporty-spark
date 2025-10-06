import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const footerSections = [
    {
      title: "About Us",
      links: [
        { name: "Our Story", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Press", href: "/press" },
        { name: "Blog", href: "/blog" },
      ],
    },
    {
      title: "Customer Service",
      links: [
        { name: "Contact Us", href: "/contact" },
        { name: "Size Guide", href: "/size-guide" },
        { name: "Shipping Info", href: "/shipping" },
        { name: "Returns", href: "/returns" },
      ],
    },
    {
      title: "Policies",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Cookie Policy", href: "/cookies" },
        { name: "Refund Policy", href: "/refunds" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", name: "Facebook" },
    { icon: Instagram, href: "#", name: "Instagram" },
    { icon: Twitter, href: "#", name: "Twitter" },
    { icon: Youtube, href: "#", name: "YouTube" },
  ];

  return (
    <footer className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
      <div className="container mx-auto px-4 py-10">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
            <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
  <img
    src="/logore.png"
    alt="Jaihind Sports"
    className="w-25 h-25 object-contain"
  />
</div>

              <span className="text-2xl font-bold">Jaihind Sports</span>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed text-sm">
              Your trusted partner for premium sports equipment. Empowering athletes to achieve their best performance with quality gear and exceptional service.
            </p>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span className="text-sm">86374 50696</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span className="text-sm">80568 91366</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span className="text-sm">sethupathi51469@gmail.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <div className="text-sm space-y-0.5">
                  <div>Near Bus stand,</div>
                  <div>Thuraiyur Road,</div>
                  <div>Mettuppalayam - 621 210.</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="space-y-2"
            >
              <h3 className="text-lg font-semibold text-primary-foreground">{section.title}</h3>
              <ul className="space-y-1">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <motion.a
                      href={link.href}
                      whileHover={{ x: 4 }}
                      className="text-primary-foreground/80 hover:text-secondary transition-colors duration-300 text-sm"
                    >
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Social & Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-primary-foreground/20 pt-6 mb-6"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            {/* Newsletter */}
            <div className="text-center lg:text-left">
              <h3 className="text-lg font-semibold mb-1">Stay Updated</h3>
              <p className="text-primary-foreground/80 text-sm mb-2">
                Subscribe to get special offers, updates and insider news.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 max-w-md">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-primary-foreground placeholder-primary-foreground/60 focus:outline-none focus:border-secondary"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-1.5 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/90 transition-colors"
                >
                  Subscribe
                </motion.button>
              </div>
            </div>

            {/* Social Media */}
            <div className="text-center lg:text-right">
              <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
              <div className="flex space-x-3 justify-center lg:justify-end">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      whileHover={{ scale: 1.2, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all duration-300"
                      aria-label={social.name}
                    >
                      <Icon className="w-4 h-4" />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-primary-foreground/20 pt-4 text-center"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
            <p className="text-primary-foreground/80 text-sm">
              © 2025 Jaihind Sports. All rights reserved.
            </p>
            <div className="flex space-x-4 text-sm">
              <motion.a href="/privacy" whileHover={{ y: -1 }} className="text-primary-foreground/80 hover:text-secondary transition-colors">
                Privacy
              </motion.a>
              <motion.a href="/terms" whileHover={{ y: -1 }} className="text-primary-foreground/80 hover:text-secondary transition-colors">
                Terms
              </motion.a>
              <motion.a href="/cookies" whileHover={{ y: -1 }} className="text-primary-foreground/80 hover:text-secondary transition-colors">
                Cookies
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

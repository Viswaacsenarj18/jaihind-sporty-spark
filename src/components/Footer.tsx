import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const footerSections = [
    {
      title: "About",
      links: [{ name: "Our Story", href: "/about" }],
    },
    {
      title: "Support",
      links: [
        { name: "Contact Us", href: "/contact" },
        { name: "Shipping Info", href: "/shipping" },
        { name: "Returns", href: "/returns" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Terms of Service", href: "/terms-of-service" },
        { name: "Refund Policy", href: "/refund-policy" },
        { name: "Cookie Policy", href: "/cookie-policy" },
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
    <footer className="bg-primary text-primary-foreground text-sm">
      <div className="container mx-auto px-4 py-4 md:py-6">
        {/* Top Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <img
                src="/logo1.png"
                alt="Jaihind Sports"
                className="w-8 h-8 object-contain"
              />
              <span className="text-base font-semibold">JAIHIND SPORTS</span>
            </div>
            <p className="text-xs text-primary-foreground/80 leading-snug">
              Premium sports gear — built for champions.
            </p>
            <div className="text-xs space-y-0.5">
              <div className="flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>86374 50696 / 80568 91366</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>sethupathi51469@gmail.com</span>
              </div>
              <div className="flex items-start space-x-1.5">
                <MapPin className="w-3.5 h-3.5 mt-0.5" />
                <span>Near Bus Stand, Thuraiyur Rd, Mettuppalayam - 621210</span>
              </div>
            </div>
          </motion.div>

          {/* Footer Links Sections */}
          {footerSections.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="space-y-1"
            >
              <h3 className="text-xs font-semibold uppercase">{section.title}</h3>
              <ul className="space-y-0.5">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-primary-foreground/80 hover:text-secondary transition-colors text-xs"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/20 my-2"></div>

        {/* Bottom Section: Social + Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex space-x-2">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all"
                >
                  <Icon className="w-3.5 h-3.5" />
                </motion.a>
              );
            })}
          </div>
          <p className="text-[10px] text-primary-foreground/70 text-center sm:text-right">
            © 2025 Jaihind Sports. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  const footerSections = [
    {
      title: "About",
      links: [
        { name: "Our Story", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Blog", href: "/blog" },
      ],
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
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
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
    <footer className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground text-sm">
      <div className="container mx-auto px-4 py-4 md:py-6">
        {/* --- Top Section --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* --- Brand Section --- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <img
                src="/logo1.png"
                alt="Jaihind Sports"
                className="w-8 h-8 object-contain"
              />
              <span className="text-lg font-semibold">JAIHIND SPORTS</span>
            </div>

            <p className="text-xs text-primary-foreground/80">
              Your trusted partner for premium sports gear — built for champions.
            </p>

            <div className="text-xs space-y-1">
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
                <span className="leading-snug">
                  Near Bus Stand, Thuraiyur Rd, Mettuppalayam - 621210
                </span>
              </div>
            </div>
          </motion.div>

          {/* --- Footer Links --- */}
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="space-y-1"
            >
              <h3 className="text-xs font-semibold uppercase tracking-wide mb-1">
                {section.title}
              </h3>
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

        {/* --- Divider --- */}
        <div className="border-t border-primary-foreground/20 my-3"></div>

        {/* --- Bottom Section --- */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex space-x-2">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all"
                >
                  <Icon className="w-3 h-3" />
                </motion.a>
              );
            })}
          </div>

          <p className="text-primary-foreground/70 text-center sm:text-right text-[11px]">
            © 2025 Jaihind Sports. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { useState } from "react";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const categories = [
  "Cricket",
  "Football",
  "Badminton",
  "Fitness",
  "Accessories",
  "Shoes"
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b shadow-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* --- LEFT SECTION: Logo --- */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/logo.png"
              alt="Jaihind Sports Logo"
              className="w-12 h-12 object-contain rounded-md"
            />
            <span className="text-xl lg:text-2xl font-bold text-primary tracking-wide">
              Jaihind Sports
            </span>
          </Link>

          {/* --- CENTER SECTION: Nav Links (Desktop) --- */}
          <div className="hidden lg:flex items-center space-x-8 mx-auto">
            <Link to="/" className="hover:text-primary font-medium">
              Home
            </Link>
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
                className="hover:text-primary font-medium"
                onClick={() => (window.location.href = "/products")}
              >
                {category}
              </motion.button>
            ))}
            {/* ✅ Added Virtual Room Link */}
            <Link
              to="/virtual-room"
              className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
            >
              Trial Room
            </Link>
          </div>

          {/* --- RIGHT SECTION: Icons --- */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-4 flex-1 max-w-xs">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search sports equipment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full rounded-full border-2 focus:border-primary"
                />
              </div>
            </div>

            {/* Cart Icon */}
            <Link to="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </Button>
            </Link>

            {/* User Icon */}
            <Link to="/login">
              <Button variant="ghost" size="sm">
                <User className="w-5 h-5" />
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search sports equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-full"
            />
          </div>
        </div>
      </div>

      {/* --- Mobile Menu --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-t"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                {categories.map((category, index) => (
                  <button
                    key={category}
                    className="text-foreground hover:text-primary font-medium py-2 text-left"
                    onClick={() => {
                      setIsMenuOpen(false);
                      window.location.href = "/products";
                    }}
                  >
                    {category}
                  </button>
                ))}
                {/* ✅ Added Virtual Room in mobile */}
                <Link
                  to="/virtual-room"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-foreground hover:text-primary font-medium py-2 text-left"
                >
                  Virtual Trial Room
                </Link>
              </div>

              <div className="flex space-x-4 mt-4 pt-4 border-t">
                <Link to="/login" className="flex-1">
                  <Button className="w-full">Login</Button>
                </Link>
                <Link to="/signup" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;

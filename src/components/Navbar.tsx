import { useState } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  Settings,
  Heart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/context/CartContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true); // toggle for testing
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", href: "/", icon: "🏠" },
    { name: "Shop", href: "/products", icon: "🏅" },
    { name: "Categories", href: "/categories", icon: "🧢" },
    { name: "Offers", href: "/offers", icon: "💥" },
    { name: "About", href: "/about", icon: "ℹ️" },
    { name: "Contact", href: "/contact", icon: "📞" },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b shadow-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* --- LOGO --- */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/logo1.png"
              alt="Jaihind Sports Logo"
              className="w-12 h-12 object-contain"
            />
            <span className="text-xl lg:text-2xl font-bold text-primary tracking-wide">
              JAIHIND SPORTS
            </span>
          </Link>

          {/* --- NAV LINKS (Desktop) --- */}
          <div className="hidden lg:flex items-center space-x-8 font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* --- RIGHT SECTION --- */}
          <div className="flex items-center space-x-3">
            {/* Desktop Search */}
            <div className="hidden lg:flex relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 rounded-full border-2 focus:border-primary transition-all"
              />
            </div>

            {/* Wishlist */}
            <Link to="/wishlist">
              <Button variant="ghost" size="sm">
                <Heart className="w-5 h-5" />
              </Button>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="sm">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="w-4 h-4 mr-2" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="w-4 h-4 mr-2" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-700"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            )}

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

        {/* --- MOBILE SEARCH --- */}
        <div className="lg:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-full"
            />
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-background border-t shadow-md"
          >
            <div className="container mx-auto px-4 py-4">
              {/* Mobile Links */}
              <div className="flex flex-col space-y-3 text-sm">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="hover:text-primary transition-colors"
                  >
                    {link.icon} {link.name}
                  </Link>
                ))}
              </div>

              {/* Mobile User Section */}
              <div className="mt-5 pt-4 border-t">
                {isLoggedIn ? (
                  <div className="flex flex-col gap-2">
                    <Button onClick={() => { navigate("/profile"); setIsMenuOpen(false); }} className="w-full">
                      Profile
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => { navigate("/settings"); setIsMenuOpen(false); }}
                      className="w-full"
                    >
                      Settings
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleLogout}
                      className="w-full"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex space-x-4">
                    <Link to="/login" className="flex-1">
                      <Button className="w-full" onClick={() => setIsMenuOpen(false)}>
                        Login
                      </Button>
                    </Link>
                    <Link to="/signup" className="flex-1">
                      <Button variant="outline" className="w-full" onClick={() => setIsMenuOpen(false)}>
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;

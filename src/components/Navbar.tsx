import { useState, useEffect } from "react";
import {
  Search, ShoppingCart, User, Menu, X, LogOut, Heart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { NotificationBell } from "@/components/NotificationBell";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { cartCount } = useCart();
  const { wishlist } = useWishlist();

  const wishlistCount = wishlist.length;

  // ✅ Check login status on every page load & route change
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location.pathname]);

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  // ✅ Handle search
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "Offers", href: "/offers" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b shadow-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* ✅ Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img src="/logo1.png" alt="logo" className="w-12 h-12" />
            <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              JAIHIND SPORTS
            </span>
          </Link>

          {/* ✅ Desktop Navigation */}
          <div className="hidden lg:flex gap-8 font-medium">
            {navLinks.map(link => (
              <Link key={link.href} to={link.href} className="hover:text-primary">
                {link.name}
              </Link>
            ))}
          </div>

          {/* ✅ Right Section */}
          <div className="flex items-center gap-2">

            {/* ✅ Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>

            {/* ✅ Search Bar (Desktop) */}
            <div className="hidden lg:flex relative">
              <Search className="absolute left-3 top-2 w-4 h-4 text-muted-foreground cursor-pointer" onClick={handleSearchClick} />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="pl-10 w-64 rounded-full"
              />
            </div>

            {/* ✅ Wishlist */}
            <Link to="/wishlist" className="relative">
              <Button variant="ghost" size="sm"><Heart /></Button>
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex justify-center items-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* ✅ Notifications */}
            {isLoggedIn && <NotificationBell />}

            {/* ✅ Cart */}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="sm"><ShoppingCart /></Button>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex justify-center items-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* ✅ Login / User Dropdown */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm"><User /></Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>

                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2" /> Profile
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" onClick={() => navigate("/login")}>
                Login
              </Button>
            )}

          </div>
        </div>
      </div>

      {/* ✅ Mobile Collapsible Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="lg:hidden bg-white border-t shadow"
          >
            <div className="p-4 space-y-3">
              {/* Mobile Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground cursor-pointer" onClick={handleSearchClick} />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  className="pl-10 w-full rounded-lg"
                />
              </div>

              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2"
                >
                  {link.name}
                </Link>
              ))}

              {!isLoggedIn ? (
                <div className="space-y-2">
                  <Button className="w-full" onClick={() => { navigate("/login"); setIsMenuOpen(false); }}>
                    Login
                  </Button>

                  <Button variant="outline" className="w-full"
                    onClick={() => { navigate("/signup"); setIsMenuOpen(false); }}>
                    Sign Up
                  </Button>
                </div>
              ) : (
                <Button variant="destructive" className="w-full" onClick={handleLogout}>
                  Logout
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.nav>
  );
};

export default Navbar;

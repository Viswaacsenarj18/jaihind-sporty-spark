import { useState, useEffect } from "react";
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
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const location = useLocation(); // ✅ detects route change
  const { cartCount } = useCart();

  // ✅ Check login whenever route changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location.pathname]); // refresh login status on every route change

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
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
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b shadow-sm"
    >
      <div className="container mx-auto px-4">

        {/* Main Navbar */}
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center space-x-3">
            <img src="/logo1.png" className="w-12 h-12" alt="logo" />
            <span className="text-xl lg:text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              JAIHIND SPORTS
            </span>
          </Link>

          {/* LINKS */}
          <div className="hidden lg:flex space-x-8 font-medium">
            {navLinks.map((l) => (
              <Link key={l.name} to={l.href} className="hover:text-primary">
                {l.name}
              </Link>
            ))}
          </div>

          {/* RIGHT ICONS */}
          <div className="flex items-center space-x-3">

            {/* SEARCH (Desktop) */}
            <div className="hidden lg:flex relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 rounded-full border-2"
              />
            </div>

            {/* Wishlist */}
            <Link to="/wishlist">
              <Button variant="ghost">
                <Heart className="w-5 h-5" />
              </Button>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative">
              <Button variant="ghost">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* USER MENU */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="w-4 h-4 mr-2" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="w-4 h-4 mr-2" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
            )}

            {/* MOBILE MENU BTN */}
            <Button variant="ghost" className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {/* ✅ Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
            className="lg:hidden bg-background border-t px-4 pb-4"
          >
            {navLinks.map((link) => (
              <Link key={link.name} onClick={() => setIsMenuOpen(false)} to={link.href} className="block py-2">
                {link.name}
              </Link>
            ))}

            {isLoggedIn ? (
              <>
                <Button onClick={() => navigate("/profile")} className="w-full mt-3">Profile</Button>
                <Button variant="destructive" onClick={handleLogout} className="w-full mt-2">Logout</Button>
              </>
            ) : (
              <>
                <Link to="/login"><Button className="w-full mt-3">Login</Button></Link>
                <Link to="/signup"><Button variant="outline" className="w-full mt-2">Sign Up</Button></Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;

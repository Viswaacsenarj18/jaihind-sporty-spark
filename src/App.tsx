import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// User Pages
import Index from "./pages/Index";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Offers from "./pages/Offers";
import Categories from "./pages/Categories";

// Footer / Informational Pages
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Shipping from "./pages/Shipping";
import Returns from "./pages/Returns";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import RefundPolicy from "./pages/RefundPolicy";
import CookiePolicy from "./pages/CookiePolicy";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import AdminSettings from "./pages/admin/Settings";

// Misc
import NotFound from "./pages/NotFound";
import Footer from "@/components/Footer";

// Cart Context & Auth
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import Auth from "./pages/Auth";
import Wishlist from "./pages/Wishlist";
import AdminProducts from "./pages/admin/Products";
import SizeGuide from "./pages/SizeGuide";

const queryClient = new QueryClient();

const AppWrapper = () => {
  const location = useLocation();

  // Footer hidden only on these paths
  const hideFooterPaths = [
    "/login",
    "/signup",
    "/admin",
    "/admin/users",
    "/admin/products",
    "/admin/settings",
  ];

  return (
    <>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/shop" element={<ProductListing />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/size-guide" element={<SizeGuide />} />

        {/* Footer / Informational Pages */}
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/settings" element={<AdminSettings />} />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Show footer on all pages except auth/admin pages */}
      {!hideFooterPaths.some(path => location.pathname.startsWith(path)) && <Footer />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <AppWrapper />
          </CartProvider>
        </AuthProvider>
        <Toaster />
        <Sonner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

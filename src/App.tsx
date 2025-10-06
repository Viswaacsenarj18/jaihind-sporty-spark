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
import VirtualRoom from "./pages/VirtualRoom";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import Settings from "./pages/admin/Settings";

// Misc
import NotFound from "./pages/NotFound";
import Footer from "@/components/Footer"; // Footer includes "Our Story", "Customer Service", "Policies"

const queryClient = new QueryClient();

const AppWrapper = () => {
  const location = useLocation();
  const hideFooterPaths = ["/login", "/signup", "/admin", "/admin/users", "/admin/products", "/admin/settings"];

  return (
    <>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/virtual-room" element={<VirtualRoom />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/products" element={<ProductListing />} />
        <Route path="/admin/settings" element={<Settings />} />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Footer visible only if not on login/signup/admin pages */}
      {!hideFooterPaths.includes(location.pathname) && <Footer />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppWrapper />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

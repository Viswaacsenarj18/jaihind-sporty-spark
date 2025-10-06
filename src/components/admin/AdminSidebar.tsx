import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, Package, ShoppingCart, Settings, BarChart3, FileText, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: Package, label: "Products", path: "/admin/products" },
  { icon: ShoppingCart, label: "Orders", path: "/admin/orders" },
  { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
  { icon: FileText, label: "Content", path: "/admin/content" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

export function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  const location = useLocation();

  return (
    <>
      {isOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onToggle} />}

      <motion.aside initial={{ x: -280 }} animate={{ x: isOpen ? 0 : -280 }} className={cn("fixed left-0 top-0 h-full w-64 bg-card border-r z-50 lg:sticky lg:translate-x-0", !isOpen && "lg:w-20")}>
        <div className="flex items-center justify-between p-4 border-b">
          {isOpen && <h2 className="font-bold text-lg">Admin Panel</h2>}
          <Button variant="ghost" size="sm" onClick={onToggle} className="ml-auto">
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={cn("flex items-center gap-3 px-4 py-3 rounded-lg transition-colors", isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted")}>
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {isOpen && <span className="font-medium">{item.label}</span>}
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </motion.aside>
    </>
  );
}

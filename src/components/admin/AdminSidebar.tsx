import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Settings,
  Menu,
  X,
  FolderOpen,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { ORDER_ROUTES } from "@/config/api";

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  const location = useLocation();
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    const fetchOrderCount = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(ORDER_ROUTES.GET_ALL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if ((response.data as any).success && (response.data as any).orders) {
          setOrderCount((response.data as any).orders.length);
        }
      } catch (err) {
        console.error("Error fetching order count:", err);
        setOrderCount(0);
      }
    };

    fetchOrderCount();
    
    // Polling: refresh order count every 30 seconds
    const interval = setInterval(fetchOrderCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: Package, label: "Products", path: "/admin/products" },
    { icon: FolderOpen, label: "Categories", path: "/admin/categories" },
    {
      icon: ShoppingCart,
      label: `Orders (${orderCount})`,
      path: "/admin/orders",
    },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <motion.aside
        initial={{ x: -260 }}
        animate={{ x: isOpen ? 0 : -260 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-white shadow-xl border-r z-50",
          "lg:translate-x-0 lg:sticky"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {isOpen && (
            <div className="flex items-center gap-3">
              <img
                src="/logo1.png"
                alt="Logo"
                className="w-10 h-10 object-contain"
              />
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  Jaihind Sports
                </h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="ml-auto text-gray-700 hover:bg-gray-200 lg:hidden"
          >
            {isOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-3">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link key={item.path} to={item.path}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {isOpen && <span className="font-medium">{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>
      </motion.aside>
    </>
  );
}

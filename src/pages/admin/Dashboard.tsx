import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";

import {
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Menu,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { productsAPI } from "@/lib/api";
import api from "@/lib/api";
import { API_BASE_URL } from "@/config/api";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    activeSessions: 0,
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [prodRes, usersRes, ordersRes] = await Promise.all([
          productsAPI.getAll(),           // ✅ Fetch products
          api.get("/auth/users"),         // ✅ Fetch users
          api.get("/orders"),             // ✅ Fetch orders (correct endpoint)
        ]);

        const productData = prodRes.data?.products || [];
        const usersData = usersRes.data?.users || [];
        const ordersData = ordersRes.data?.orders || [];

        console.log("📊 Dashboard stats - Products:", productData.length, "Users:", usersData.length, "Orders:", ordersData.length);

        setStats({
          products: productData.length,
          users: usersData.length,
          orders: ordersData.length,      // ✅ SET ORDER COUNT FROM DB
          activeSessions: Math.floor(Math.random() * 200),
        });
      } catch (error) {
        console.error("❌ Dashboard data fetch failed", error);
      }
    };

    fetchDashboardData();
  }, []);

  const cards = [
    {
      title: "Total Users",
      value: stats.users,
      icon: Users,
      change: "+8.2%",
      trend: "up",
      description: "vs last month",
    },
    {
      title: "Active Sessions",
      value: stats.activeSessions,
      icon: TrendingUp,
      change: "+12.5%",
      trend: "up",
      description: "currently online",
    },
    {
      title: "Total Products",
      value: stats.products,
      icon: Package,
      change: "+2.1%",
      trend: "up",
      description: "in inventory",
    },
    {
      title: "Total Orders",
      value: stats.orders,   // ✅ SHOW ORDER COUNT HERE
      icon: ShoppingCart,
      change: "+23.1%",
      trend: "up",
      description: "this month",
    },
  ];

  return (
    <AdminLayout sidebarOpen={sidebarOpen}>
      <div className="space-y-6">

        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="icon"
            className="lg:flex hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Live stats based on database
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="shadow-sm hover:shadow-md transition">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <stat.icon className="w-8 h-8 text-muted-foreground" />
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-600" />
                    )}
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>

                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-sm font-medium ${
                          stat.trend === "up"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {stat.description}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </AdminLayout>
  );
}

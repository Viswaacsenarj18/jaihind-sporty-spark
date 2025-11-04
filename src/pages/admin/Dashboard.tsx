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
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const API = "http://localhost:5000";

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    activeSessions: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productRes, userRes, orderRes] = await Promise.all([
          fetch(`${API}/api/products`),
          fetch(`${API}/api/users`), // Create endpoint if not exists
          fetch(`${API}/api/orders`), // Create endpoint if not exists
        ]);

        const productData = await productRes.json();
        const userData = await userRes.json();
        const orderData = await orderRes.json();

        setStats({
          users: userData?.users?.length || 0,
          products: productData?.products?.length || 0,
          orders: orderData?.orders?.length || 0,
          activeSessions: Math.floor(Math.random() * 200), // temporary random online users
        });
      } catch (error) {
        console.error("Dashboard data fetch failed", error);
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
      change: stats.products === 0 ? "0%" : "+2.1%",
      trend: stats.products > 0 ? "up" : "down",
      description: "in inventory",
    },
    {
      title: "Total Orders",
      value: stats.orders,
      icon: ShoppingCart,
      change: "+23.1%",
      trend: "up",
      description: "this month",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Live stats based on database
          </p>
        </div>

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
                          stat.trend === "up" ? "text-green-600" : "text-red-600"
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

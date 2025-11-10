import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";

const API = "http://localhost:5000/api/orders";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  // ✅ Fetch orders from backend
  useEffect(() => {
    axios
      .get(API)
      .then((res) => {
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      })
      .catch((err) => {
        console.error("Cannot fetch orders:", err);
      });
  }, []);

  // ✅ Search by customer name or email
  const filtered = orders.filter((order) => {
    return (
      order.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Orders</h1>

        {/* ✅ Search box */}
        <div className="relative w-72 mb-6">
          <Search className="absolute left-3 top-2 text-gray-400 h-5" />
          <input
            type="text"
            placeholder="Search orders..."
            className="pl-10 border rounded-lg w-full p-2"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ✅ Order List */}
        <Card>
          <CardContent className="space-y-4 pt-4">
            {filtered.length === 0 ? (
              <p className="text-center text-gray-500 py-10">
                No orders found.
              </p>
            ) : (
              filtered.map((order) => (
                <div
                  key={order._id}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  {/* Left Side */}
                  <div>
                    <p className="font-semibold text-lg">
                      {order.customer.firstName} {order.customer.lastName}
                    </p>

                    <p className="text-sm text-gray-600">
                      📧 {order.customer.email}
                    </p>

                    <p className="text-sm text-gray-600">
                      📦 {order.items.length} Items
                    </p>

                    <p className="text-primary font-bold text-lg mt-1">
                      ₹{order.summary.total}
                    </p>
                  </div>

                  {/* Right Side */}
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>

                    <span className="px-3 py-1 text-sm rounded bg-yellow-100">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

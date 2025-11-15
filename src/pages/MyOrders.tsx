import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  shippingInfo: ShippingInfo;
  summary: {
    subtotal: number;
    shipping: number;
    total: number;
  };
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
}

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [cancelingOrderId, setCancelingOrderId] = useState<string | null>(null);
  const [cancelingLoading, setCancelingLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await api.get("/orders/user/my-orders");
      setOrders(res.data.orders || []);
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Pending: "bg-yellow-100 text-yellow-800",
      Processing: "bg-blue-100 text-blue-800",
      Shipped: "bg-purple-100 text-purple-800",
      Delivered: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const canCancelOrder = (status: string) => {
    return ["Pending", "Processing"].includes(status);
  };

  const handleCancelOrder = async () => {
    if (!cancelingOrderId) return;

    setCancelingLoading(true);
    try {
      await api.patch(`/orders/cancel/${cancelingOrderId}`);

      toast({
        title: "Success",
        description: "Order cancelled successfully",
      });

      setCancelDialog(false);
      setCancelingOrderId(null);
      fetchOrders();
    } catch (err: any) {
      console.error("Error cancelling order:", err);
      toast({
        title: "Error",
        description: err?.response?.data?.error || "Failed to cancel order",
        variant: "destructive",
      });
    } finally {
      setCancelingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground mb-8">
            Track and manage your orders
          </p>

          {orders.length === 0 ? (
            <Card className="bg-muted/50">
              <CardContent className="pt-8 text-center">
                <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-lg font-semibold mb-2">No Orders Yet</h2>
                <p className="text-muted-foreground mb-6">
                  You haven't placed any orders yet. Start shopping!
                </p>
                <Button onClick={() => navigate("/products")}>
                  Browse Products
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:gap-6">
              {orders.map((order) => (
                <Card key={order._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-muted/50 pb-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Order ID</p>
                        <p className="font-mono text-sm">{order._id.slice(-8)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Order Date</p>
                        <p className="text-sm">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-xl font-bold text-green-600">
                          ₹{order.summary.total.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-6">
                    {/* Items */}
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">Items</h4>
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex gap-4 p-3 bg-muted/30 rounded-lg"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 rounded object-cover"
                            />
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">
                                ₹{item.price.toLocaleString()} × {item.quantity}
                              </p>
                            </div>
                            <p className="font-semibold">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-muted/30 p-4 rounded-lg mb-6 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>₹{order.summary.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span>
                          {order.summary.shipping === 0
                            ? "FREE"
                            : `₹${order.summary.shipping}`}
                        </span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-green-600">
                          ₹{order.summary.total.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="bg-muted/30 p-4 rounded-lg mb-6">
                      <h4 className="font-semibold mb-3">Shipping Address</h4>
                      <div className="text-sm space-y-1">
                        <p>
                          {order.shippingInfo.firstName}{" "}
                          {order.shippingInfo.lastName}
                        </p>
                        <p>{order.shippingInfo.address}</p>
                        <p>
                          {order.shippingInfo.city}, {order.shippingInfo.state}{" "}
                          {order.shippingInfo.pincode}
                        </p>
                        <p>{order.shippingInfo.email}</p>
                        <p>{order.shippingInfo.phone}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View Details
                      </Button>
                      {canCancelOrder(order.status) && (
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setCancelingOrderId(order._id);
                            setCancelDialog(true);
                          }}
                        >
                          Cancel Order
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Order Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Order Details</DialogTitle>
                <DialogDescription>
                  Order ID: {selectedOrder._id.slice(-8)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Items */}
                <div>
                  <h4 className="font-semibold mb-3">Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span>
                          ₹{item.price} × {item.quantity} = ₹
                          {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{selectedOrder.summary.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>
                      {selectedOrder.summary.shipping === 0
                        ? "FREE"
                        : `₹${selectedOrder.summary.shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>₹{selectedOrder.summary.total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Shipping */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Shipping Address</h4>
                  <div className="text-sm space-y-1">
                    <p>
                      {selectedOrder.shippingInfo.firstName}{" "}
                      {selectedOrder.shippingInfo.lastName}
                    </p>
                    <p>{selectedOrder.shippingInfo.address}</p>
                    <p>
                      {selectedOrder.shippingInfo.city},{" "}
                      {selectedOrder.shippingInfo.state}{" "}
                      {selectedOrder.shippingInfo.pincode}
                    </p>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Order Confirmation */}
      <Dialog open={cancelDialog} onOpenChange={setCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order?</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialog(false)}
              disabled={cancelingLoading}
            >
              No, Keep It
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelOrder}
              loading={cancelingLoading}
            >
              Yes, Cancel Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      
    </div>
  );
};

export default MyOrders;

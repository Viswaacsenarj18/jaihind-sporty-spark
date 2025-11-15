import { useEffect, useState } from "react";
import { Search, Trash2, Eye, Download } from "lucide-react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "@/pdf-fonts";

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
  user: {
    _id: string;
    name: string;
    email: string;
  };
  customer?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: OrderItem[];
  shippingInfo?: ShippingInfo;
  summary: {
    subtotal: number;
    shipping: number;
    total: number;
  };
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders((res.data as any).orders || []);
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

  const filteredOrders = orders.filter((o) => {
    const q = search.toLowerCase();
    // Handle both old (customer) and new (user + shippingInfo) data structures
    const customerName = (o.user?.name || o.customer?.firstName || "").toLowerCase();
    const customerEmail = (o.user?.email || o.customer?.email || "").toLowerCase();
    const customerPhone = o.shippingInfo?.phone || o.customer?.phone || "";
    
    return (
      customerName.includes(q) ||
      customerEmail.includes(q) ||
      customerPhone.includes(search)
    );
  });

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Delete this order? This cannot be undone.")) return;

    try {
      await api.delete(`/orders/${orderId}`);
      setOrders(orders.filter((o) => o._id !== orderId));
      if (selectedOrder?._id === orderId) setModalOpen(false);
      toast({
        title: "Success",
        description: "Order deleted successfully",
      });
    } catch (err: any) {
      console.error("Error deleting order:", err);
      toast({
        title: "Error",
        description: err?.response?.data?.error || "Failed to delete order",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;

    setStatusUpdating(true);
    try {
      const res = await api.patch(`/orders/status/${selectedOrder._id}`, {
        status: newStatus,
      });

      setOrders(
        orders.map((o) =>
          o._id === selectedOrder._id
            ? { ...o, status: newStatus as any }
            : o
        )
      );

      setSelectedOrder({
        ...selectedOrder,
        status: newStatus as any,
      });

      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
    } catch (err: any) {
      console.error("Error updating status:", err);
      toast({
        title: "Error",
        description: err?.response?.data?.error || "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setStatusUpdating(false);
    }
  };

  const downloadInvoice = async (order: Order) => {
    try {
      const pdf = new jsPDF({ unit: "mm", format: "a4" });

      pdf.setFont("NotoSans", "normal");

      // Logo
      const logo = new Image();
      logo.src = "/logo.png";

      await new Promise((resolve) => {
        logo.onload = resolve;
        logo.onerror = resolve;
      });

      pdf.addImage(logo, "PNG", 90, 10, 30, 25);

      pdf.setFont("NotoSans", "bold");
      pdf.setFontSize(18);
      pdf.text("JAIHIND SPORTS", 105, 45, { align: "center" });

      pdf.setFont("NotoSans", "normal");
      pdf.setFontSize(11);
      pdf.text("Premium sports gear — built for champions.", 105, 52, {
        align: "center",
      });

      pdf.line(10, 60, 200, 60);

      // Contact
      pdf.setFontSize(10);
      pdf.text("Phone: 86374 50696 / 80568 91366", 15, 70);
      pdf.text("Email: sethupathi51469@gmail.com", 15, 75);
      pdf.text(
        "Address: Near Bus Stand, Thuraiyur Rd, Mettupalayam – 621210",
        15,
        80
      );

      pdf.line(10, 88, 200, 88);

      // Invoice Header
      pdf.setFont("NotoSans", "bold");
      pdf.setFontSize(16);
      pdf.text("INVOICE", 15, 100);

      pdf.setFont("NotoSans", "normal");
      pdf.setFontSize(12);
      pdf.text(`Invoice ID: ${order._id.slice(-8)}`, 15, 110);
      pdf.text(
        `Date: ${new Date(order.createdAt).toLocaleDateString()}`,
        15,
        116
      );

      // Customer
      pdf.setFont("NotoSans", "bold");
      pdf.setFontSize(14);
      pdf.text("Customer Details", 15, 132);

      pdf.setFont("NotoSans", "normal");
      pdf.setFontSize(12);
      const firstName = order.shippingInfo?.firstName || order.customer?.firstName || "";
      const lastName = order.shippingInfo?.lastName || order.customer?.lastName || "";
      const email = order.shippingInfo?.email || order.customer?.email || "";
      const phone = order.shippingInfo?.phone || order.customer?.phone || "";
      const address = order.shippingInfo?.address || order.customer?.address || "";
      const city = order.shippingInfo?.city || order.customer?.city || "";
      const state = order.shippingInfo?.state || order.customer?.state || "";
      const pincode = order.shippingInfo?.pincode || order.customer?.pincode || "";

      pdf.text(`Name: ${firstName} ${lastName}`, 15, 142);
      pdf.text(`Email: ${email}`, 15, 148);
      pdf.text(`Phone: ${phone}`, 15, 154);
      pdf.text(`Address: ${address}, ${city}`, 15, 160);
      pdf.text(`${state} - ${pincode}`, 15, 166);

      // Items Table
      const rows = order.items.map((item) => [
        item.name,
        `₹${item.price}`,
        `${item.quantity}`,
        `₹${(item.price * item.quantity).toLocaleString()}`,
      ]);

      autoTable(pdf, {
        startY: 180,
        head: [["Product", "Price", "Qty", "Total"]],
        body: rows,
        theme: "grid",
        styles: {
          font: "NotoSans",
          fontSize: 11,
          halign: "center",
        },
        headStyles: {
          font: "NotoSans",
          fontStyle: "bold",
          fillColor: [0, 80, 200],
          textColor: 255,
        },
      });

      const endY = (pdf as any).lastAutoTable.finalY + 12;

      // Summary
      pdf.setFont("NotoSans", "bold");
      pdf.setFontSize(14);
      pdf.text("Order Summary", 15, endY);

      pdf.setFont("NotoSans", "normal");
      pdf.setFontSize(12);
      pdf.text(`Subtotal: ₹${order.summary.subtotal.toLocaleString()}`, 15, endY + 10);
      pdf.text(
        `Shipping: ${order.summary.shipping === 0 ? "FREE" : `₹${order.summary.shipping}`}`,
        15,
        endY + 17
      );

      pdf.setFont("NotoSans", "bold");
      pdf.text(`Total: ₹${order.summary.total.toLocaleString()}`, 15, endY + 32);

      // Footer
      pdf.setFont("NotoSans", "normal");
      pdf.setFontSize(10);
      pdf.text("Thank you for shopping with JAIHIND SPORTS!", 105, 285, {
        align: "center",
      });
      pdf.text("No return/refund without original bill.", 105, 292, {
        align: "center",
      });

      pdf.save(`INVOICE_${order._id.slice(-8)}.pdf`);

      toast({
        title: "Success",
        description: "Invoice downloaded successfully",
      });
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      toast({
        title: "Error",
        description: "Failed to generate PDF invoice",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Orders</h1>
              <p className="text-muted-foreground">
                {filteredOrders.length} orders found
              </p>
            </div>
          </div>

          <div className="relative mb-6 max-w-md">
            <Search className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              className="pl-10 border rounded-lg w-full p-2 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="pt-8 text-center py-12">
                <p className="text-muted-foreground">No orders found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 hidden md:block">
              {/* Desktop Table View */}
              <Card>
                <CardContent className="pt-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b">
                        <tr className="text-left text-muted-foreground">
                          <th className="py-3 px-4">Customer</th>
                          <th className="py-3 px-4">Items</th>
                          <th className="py-3 px-4">Total</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => (
                          <tr key={order._id} className="border-b hover:bg-muted/50">
                            <td className="py-4 px-4">
                              <p className="font-medium">{order.user?.name || order.customer?.firstName}</p>
                              <p className="text-xs text-muted-foreground">
                                {order.user?.email || order.customer?.email}
                              </p>
                            </td>
                            <td className="py-4 px-4">{order.items.length}</td>
                            <td className="py-4 px-4 font-bold text-green-600">
                              ₹{order.summary.total.toLocaleString()}
                            </td>
                            <td className="py-4 px-4">
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </td>
                            <td className="py-4 px-4 text-xs">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setNewStatus(order.status);
                                    setModalOpen(true);
                                  }}
                                >
                                  <Eye className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => downloadInvoice(order)}
                                >
                                  <Download className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteOrder(order._id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Mobile Card View */}
          <div className="grid gap-4 md:hidden">
            {filteredOrders.map((order) => (
              <Card key={order._id}>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{order.user?.name || order.customer?.firstName}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.user?.email || order.customer?.email}
                        </p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="border-t pt-3">
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} items • ₹{order.summary.total.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2 pt-3 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setSelectedOrder(order);
                          setNewStatus(order.status);
                          setModalOpen(true);
                        }}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadInvoice(order)}
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteOrder(order._id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Order Details Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Order Details</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Customer Info */}
                <div>
                  <h4 className="font-semibold mb-3">Customer Information</h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Name:</strong> {selectedOrder.shippingInfo?.firstName || selectedOrder.customer?.firstName}{" "}
                      {selectedOrder.shippingInfo?.lastName || selectedOrder.customer?.lastName || ""}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedOrder.shippingInfo?.email || selectedOrder.customer?.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {selectedOrder.shippingInfo?.phone || selectedOrder.customer?.phone}
                    </p>
                    <p>
                      <strong>Address:</strong> {selectedOrder.shippingInfo?.address || selectedOrder.customer?.address}
                    </p>
                    <p>
                      <strong>City:</strong> {selectedOrder.shippingInfo?.city || selectedOrder.customer?.city},{" "}
                      {selectedOrder.shippingInfo?.state || selectedOrder.customer?.state}{" "}
                      {selectedOrder.shippingInfo?.pincode || selectedOrder.customer?.pincode}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex gap-2 text-sm">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            ₹{item.price} × {item.quantity} = ₹
                            {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
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
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Total:</span>
                    <span className="text-green-600">
                      ₹{selectedOrder.summary.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Status Update */}
                <div className="border-t pt-4 space-y-3">
                  <label className="text-sm font-semibold">Update Status</label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  disabled={statusUpdating}
                >
                  Close
                </Button>
                <Button
                  onClick={() => downloadInvoice(selectedOrder)}
                  variant="secondary"
                  disabled={statusUpdating}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
                <Button
                  onClick={handleStatusUpdate}
                  disabled={statusUpdating || newStatus === selectedOrder.status}
                >
                  {statusUpdating ? "Updating..." : "Update Status"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

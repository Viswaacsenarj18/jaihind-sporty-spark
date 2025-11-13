import { useEffect, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { ORDER_ROUTES } from "@/config/api";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "@/pdf-fonts"; // ✅ Unicode font loaded

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    axios
      .get(ORDER_ROUTES.GET_ALL)
      .then((res) => {
        if (res.data.success) setOrders(res.data.orders);
      })
      .catch((err) => console.error("❌ Failed to fetch orders:", err));
  }, []);

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    return (
      o.customer.firstName.toLowerCase().includes(q) ||
      o.customer.email.toLowerCase().includes(q)
    );
  });

  const viewDetails = (order: any) => {
    setSelectedOrder(order);
    setOpenModal(true);
  };

  const handleDeleteOrder = async (orderId: string, customerName: string) => {
    if (!confirm(`Delete order from ${customerName}? This cannot be undone.`)) return;
    try {
      await axios.delete(`${ORDER_ROUTES.GET_ALL}/${orderId}`);
      setOrders(orders.filter(o => o._id !== orderId));
      if (orderId === selectedOrder?._id) setOpenModal(false);
      toast.success(`✅ Order deleted successfully`);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to delete order";
      toast.error(`❌ ${errorMsg}`);
      console.error("Delete error:", err);
    }
  };

  const handleShareOrder = () => {
    const link = `${window.location.origin}/admin/order/${selectedOrder._id}`;
    navigator.clipboard.writeText(link);
    alert("✅ Link Copied:\n" + link);
  };

  // ✅ PROFESSIONAL PDF GENERATOR
  const downloadInvoice = async () => {
    try {
      if (!selectedOrder) {
        alert("No order selected to download.");
        return;
      }

      const o = selectedOrder;
      const pdf = new jsPDF({ unit: "mm", format: "a4" });

    pdf.setFont("NotoSans", "normal");

    // ✅ Logo
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

    // ✅ Contact
    pdf.setFontSize(10);
    pdf.text("Phone: 86374 50696 / 80568 91366", 15, 70);
    pdf.text("Email: sethupathi51469@gmail.com", 15, 75);
    pdf.text(
      "Address: Near Bus Stand, Thuraiyur Rd, Mettupalayam – 621210",
      15,
      80
    );

    pdf.line(10, 88, 200, 88);

    // ✅ Invoice Top
    pdf.setFont("NotoSans", "bold");
    pdf.setFontSize(16);
    pdf.text("INVOICE", 15, 100);

    pdf.setFont("NotoSans", "normal");
    pdf.setFontSize(12);
    pdf.text(`Invoice ID: ${o._id}`, 15, 110);
    pdf.text(`Date: ${new Date(o.createdAt).toLocaleString()}`, 15, 116);

    // ✅ Customer
    pdf.setFont("NotoSans", "bold");
    pdf.setFontSize(14);
    pdf.text("Customer Details", 15, 132);

    pdf.setFont("NotoSans", "normal");
    pdf.setFontSize(12);
    pdf.text(`Name: ${o.customer.firstName} ${o.customer.lastName}`, 15, 142);
    pdf.text(`Email: ${o.customer.email}`, 15, 148);
    pdf.text(`Phone: ${o.customer.phone}`, 15, 154);
    pdf.text(`Address: ${o.customer.address}, ${o.customer.city}`, 15, 160);
    pdf.text(`${o.customer.state} - ${o.customer.pincode}`, 15, 166);

    // ✅ Table
    const rows = o.items.map((item) => [
      item.name,
      `\u20B9${item.price}`,
      `${item.quantity}`,
      `\u20B9${item.price * item.quantity}`,
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

    // ✅ Summary
    pdf.setFont("NotoSans", "bold");
    pdf.setFontSize(14);
    pdf.text("Order Summary", 15, endY);

    pdf.setFont("NotoSans", "normal");
    pdf.setFontSize(12);
  pdf.text(`Subtotal: \u20B9${o.summary.subtotal}`, 15, endY + 10);
  pdf.text(`Shipping: \u20B9${o.summary.shipping}`, 15, endY + 17);

    pdf.setFont("NotoSans", "bold");
  pdf.text(`Total: \u20B9${o.summary.total}`, 15, endY + 32);

    // ✅ Footer
    pdf.setFont("NotoSans", "normal");
    pdf.setFontSize(10);
    pdf.text(
      "Thank you for shopping with JAIHIND SPORTS!",
      105,
      285,
      { align: "center" }
    );
    pdf.text("No return/refund without original bill.", 105, 292, {
      align: "center",
    });

    
    pdf.save(`JAIHIND_SPORTS_INVOICE_${o._id}.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF invoice:", err);
      alert("Failed to generate PDF. Check console for details.");
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Orders</h1>

        <div className="relative w-72 mb-6">
          <Search className="absolute left-3 top-2 text-gray-400 h-5" />
          <input
            type="text"
            placeholder="Search orders..."
            className="pl-10 border rounded-lg w-full p-2"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Card>
          <CardContent className="space-y-4 pt-4">
            {filtered.length === 0 ? (
              <p className="text-center text-gray-500 py-10">No orders found.</p>
            ) : (
              filtered.map((order) => (
                <div
                  key={order._id}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-lg">
                      {order.customer.firstName} {order.customer.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.customer.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.items.length} Items
                    </p>
                    <p className="text-primary font-bold text-lg mt-1">
                      {'\u20B9'}{order.summary.total}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>

                    <span className="px-3 py-1 text-sm rounded bg-yellow-100 block mb-2">
                      {order.status}
                    </span>

                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => viewDetails(order)}>
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteOrder(order._id, `${order.customer.firstName} ${order.customer.lastName}`)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-6">
                <h2 className="font-bold text-lg">Customer Info</h2>
                <p>
                  {selectedOrder.customer.firstName}{" "}
                  {selectedOrder.customer.lastName}
                </p>
                <p>{selectedOrder.customer.email}</p>
                <p>{selectedOrder.customer.phone}</p>

                <h2 className="font-bold text-lg">Items</h2>

                {selectedOrder.items.map((item: any, i: number) => (
                  <div key={i} className="border p-2 flex gap-3">
                    <img src={item.image} alt={item.name || 'product image'} className="w-16 h-16 rounded" />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p>Price: {'\u20B9'}{item.price}</p>
                      <p>Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}

                <h2 className="font-bold text-lg">Summary</h2>
                <p>Subtotal: {'\u20B9'}{selectedOrder.summary.subtotal}</p>
                <p>Shipping: {'\u20B9'}{selectedOrder.summary.shipping}</p>
                <p>Total: {'\u20B9'}{selectedOrder.summary.total}</p>

                <Button
                  className="w-full bg-blue-600 text-white"
                  onClick={handleShareOrder}
                >
                  Share Order Link
                </Button>

                <Button
                  className="w-full bg-green-600 text-white"
                  onClick={downloadInvoice}
                >
                  Download PDF Invoice
                </Button>

                <Button
                  className="w-full bg-red-600 text-white"
                  variant="destructive"
                  onClick={() => handleDeleteOrder(selectedOrder._id, `${selectedOrder.customer.firstName} ${selectedOrder.customer.lastName}`)}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete Order
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

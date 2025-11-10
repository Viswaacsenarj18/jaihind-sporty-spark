import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

// PDF
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const API = "http://localhost:5000/api/orders";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);

  // ✅ Fetch all orders
  useEffect(() => {
    axios
      .get(API)
      .then((res) => {
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      })
      .catch((err) => {
        console.error("❌ Cannot fetch orders:", err);
      });
  }, []);

  // ✅ Search filter
  const filtered = orders.filter((order) => {
    const query = search.toLowerCase();
    return (
      order.customer.firstName.toLowerCase().includes(query) ||
      order.customer.email.toLowerCase().includes(query)
    );
  });

  const viewDetails = (order: any) => {
    setSelectedOrder(order);
    setOpenModal(true);
  };

  // ✅ SHARE ORDER LINK FUNCTION
  const handleShareOrder = () => {
    const link = `${window.location.origin}/admin/order/${selectedOrder._id}`;
    navigator.clipboard.writeText(link);
    alert("✅ Link copied to clipboard:\n" + link);
  };

  // ✅ DOWNLOAD INVOICE PDF
  const downloadPDF = async () => {
    const element = document.getElementById("invoice-content");
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`invoice_${selectedOrder._id}.pdf`);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Orders</h1>

        {/* ✅ Search */}
        <div className="relative w-72 mb-6">
          <Search className="absolute left-3 top-2 text-gray-400 h-5" />
          <input
            type="text"
            placeholder="Search orders..."
            className="pl-10 border rounded-lg w-full p-2"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ✅ Orders List */}
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
                  {/* LEFT SIDE */}
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

                  {/* RIGHT SIDE */}
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>

                    <span className="px-3 py-1 text-sm rounded bg-yellow-100 block mb-2">
                      {order.status}
                    </span>

                    <Button size="sm" onClick={() => viewDetails(order)}>
                      View Details
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* ✅ ORDER DETAILS MODAL */}
        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-6" id="invoice-content">
                {/* CUSTOMER INFO */}
                <div>
                  <h2 className="font-bold text-lg mb-2">Customer Info</h2>
                  <p>
                    <strong>Name:</strong>{" "}
                    {selectedOrder.customer.firstName}{" "}
                    {selectedOrder.customer.lastName}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedOrder.customer.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedOrder.customer.phone}
                  </p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {selectedOrder.customer.address},{" "}
                    {selectedOrder.customer.city},{" "}
                    {selectedOrder.customer.state} -{" "}
                    {selectedOrder.customer.pincode}
                  </p>
                </div>

                {/* ITEMS */}
                <div>
                  <h2 className="font-bold text-lg mb-2">Items</h2>

                  {selectedOrder.items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex gap-4 mb-3 border rounded p-2"
                    >
                      <img
                        src={item.image}
                        className="w-16 h-16 rounded object-cover"
                      />
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p>Price: ₹{item.price}</p>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* SUMMARY */}
                <div>
                  <h2 className="font-bold text-lg mb-2">Order Summary</h2>
                  <p>
                    <strong>Subtotal:</strong> ₹
                    {selectedOrder.summary.subtotal}
                  </p>
                  <p>
                    <strong>Shipping:</strong> ₹
                    {selectedOrder.summary.shipping}
                  </p>
                  <p>
                    <strong>Total:</strong> ₹{selectedOrder.summary.total}
                  </p>
                </div>

                {/* ✅ SHARE BUTTON */}
                <Button
                  className="w-full mt-4 bg-blue-600 text-white"
                  onClick={handleShareOrder}
                >
                  Share Order Link
                </Button>

                {/* ✅ DOWNLOAD PDF BUTTON */}
                <Button
                  className="w-full bg-green-600 text-white"
                  onClick={downloadPDF}
                >
                  Download PDF Invoice
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Package,
  Heart,
  Edit2,
  Save,
  Upload,
  X,
  Eye,
  Trash2,
  Download,
  Share2,
} from "lucide-react";

import api from "@/utils/api"; // ✅ axios instance
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

const Profile = () => {
  const { toast } = useToast();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [deletePassword, setDeletePassword] = useState("");
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    profilePicture: "",
    _id: "",
  });

  const [editedInfo, setEditedInfo] = useState({ ...userInfo });

  //----------------------------------------------------
  // ✅ LOAD PROFILE FROM DATABASE
  //----------------------------------------------------
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await api.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.user) {
          setUserInfo(res.data.user);
          setEditedInfo(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        // Fallback to localStorage if API fails
        const saved = localStorage.getItem("user");
        if (saved) {
          const parsed = JSON.parse(saved);
          setUserInfo(parsed);
          setEditedInfo(parsed);
        }
      }
    };

    loadProfile();
  }, []);

  //----------------------------------------------------
  // ✅ SAVE UPDATED PROFILE
  //----------------------------------------------------
  useEffect(() => {
    if (userInfo.name) {
      localStorage.setItem("user", JSON.stringify(userInfo));
    }
  }, [userInfo]);

  //----------------------------------------------------
  // ✅ LOAD ORDERS FOR USER
  //----------------------------------------------------
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found");
          return;
        }

        console.log("Fetching orders with token:", token.substring(0, 20) + "...");
        const res = await api.get("/orders/user/my-orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        console.log("Orders response:", res.data);
        if (res.data.success || res.data.orders) {
          setOrders(res.data.orders || []);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  //----------------------------------------------------
  // ✅ SAVE PROFILE TO DATABASE
  //----------------------------------------------------
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.patch(
        "/auth/profile/update",
        {
          name: editedInfo.name,
          email: editedInfo.email,
          phone: editedInfo.phone,
          gender: editedInfo.gender,
          profilePicture: editedInfo.profilePicture,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setUserInfo({ ...editedInfo });
        localStorage.setItem("user", JSON.stringify(editedInfo));

        toast({
          title: "Profile Updated",
          description: "Your profile was updated successfully.",
        });
        setIsEditing(false);
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setEditedInfo({ ...userInfo });
    setIsEditing(false);
  };

  //----------------------------------------------------
  // ✅ Upload Photo (Backend Endpoint to Cloudinary)
  //----------------------------------------------------
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      console.log("📤 Starting file upload to backend...");
      console.log("📁 File:", file.name, file.size, file.type);

      const token = localStorage.getItem("token");
      const res = await api.post("/auth/profile/upload-photo", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type, axios will set it to multipart/form-data
        },
      });

      console.log("📡 Upload response status:", res.status);
      console.log("✅ Backend response:", res.data);

      if (res.data.success && res.data.photoUrl) {
        setEditedInfo((prev) => ({ ...prev, profilePicture: res.data.photoUrl }));
        console.log("✅ Profile picture updated:", res.data.photoUrl);
        toast({
          title: "Photo Uploaded",
          description: "Profile picture updated successfully",
        });
      } else {
        throw new Error("Upload failed - no photo URL returned");
      }
    } catch (err: any) {
      console.error("❌ Upload error:", err);
      const errorMsg = 
        err.response?.data?.error || 
        err.response?.data?.message || 
        err.message || 
        "Failed to upload photo";
      
      toast({
        title: "Upload Failed",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = () => {
    setEditedInfo((prev) => ({ ...prev, profilePicture: "" }));
    toast({
      title: "Photo Removed",
      description: "Profile picture has been removed",
    });
  };

  //----------------------------------------------------
  // ✅ VIEW ORDER DETAILS
  //----------------------------------------------------
  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  //----------------------------------------------------
  // ✅ CANCEL ORDER
  //----------------------------------------------------
  const handleCancelOrder = async (orderId: string) => {
    try {
      setLoadingOrderId(orderId);
      const token = localStorage.getItem("token");
      
      const res = await api.patch(`/orders/cancel/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.message) {
        toast({
          title: "Order Cancelled",
          description: "Your order has been cancelled successfully.",
        });
        
        // Remove from local state
        setOrders(orders.filter(o => o._id !== orderId));
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to cancel order",
        variant: "destructive",
      });
    } finally {
      setLoadingOrderId(null);
    }
  };

  //----------------------------------------------------
  // ✅ DOWNLOAD BILL (PDF)
  //----------------------------------------------------
  const handleDownloadBill = async (order: any) => {
    try {
      // Using jsPDF and jspdf-autotable
      const { jsPDF } = await import("jspdf");
      const { autoTable } = await import("jspdf-autotable");

      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(16);
      doc.text("Jaihind Sports", 20, 20);
      doc.setFontSize(10);
      doc.text("Invoice", 20, 30);
      
      // Order Info
      doc.setFontSize(9);
      doc.text(`Order ID: ${order._id?.slice(-8) || "N/A"}`, 20, 45);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 52);
      doc.text(`Status: ${order.status}`, 20, 59);

      // Shipping Info
      doc.text("Shipping Address:", 20, 75);
      doc.text(`${order.shippingInfo?.firstName} ${order.shippingInfo?.lastName}`, 20, 82);
      doc.text(order.shippingInfo?.address, 20, 89);
      doc.text(`${order.shippingInfo?.city}, ${order.shippingInfo?.state} ${order.shippingInfo?.pincode}`, 20, 96);

      // Items Table
      const tableData = (order.items || []).map((item: any) => [
        item.name,
        item.quantity.toString(),
        `₹${item.price}`,
        `₹${item.price * item.quantity}`,
      ]);

      autoTable(doc, {
        head: [["Product", "Qty", "Price", "Total"]],
        body: tableData,
        startY: 110,
        theme: "grid",
      });

      // Summary
      const finalY = (doc as any).lastAutoTable?.finalY || 150;
      doc.text(`Subtotal: ₹${order.summary?.subtotal || 0}`, 120, finalY + 10);
      doc.text(`Tax: ₹${order.summary?.tax || 0}`, 120, finalY + 17);
      doc.setFont(undefined, "bold");
      doc.text(`Total: ₹${order.summary?.total || 0}`, 120, finalY + 24);

      doc.save(`Order-${order._id?.slice(-8)}.pdf`);
      toast({
        title: "Downloaded",
        description: "Bill downloaded successfully",
      });
    } catch (err) {
      console.error("Error generating PDF:", err);
      toast({
        title: "Error",
        description: "Failed to download bill",
        variant: "destructive",
      });
    }
  };

  //----------------------------------------------------
  // ✅ SHARE BILL
  //----------------------------------------------------
  const handleShareBill = (order: any) => {
    const text = `
Order Details - Jaihind Sports
Order ID: ${order._id?.slice(-8)}
Status: ${order.status}
Total: ₹${order.summary?.total}

Items:
${order.items?.map((item: any) => `${item.name} x${item.quantity}`).join("\n")}

Check your order in My Account.
    `;
    
    if (navigator.share) {
      navigator.share({
        title: "Order Details",
        text: text,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: "Order details copied to clipboard",
      });
    }
  };

  //----------------------------------------------------
  // ✅ CHANGE PASSWORD
  //----------------------------------------------------
  const handleChangePassword = async () => {
    try {
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        toast({
          title: "Error",
          description: "All password fields are required",
          variant: "destructive",
        });
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast({
          title: "Error",
          description: "New passwords don't match",
          variant: "destructive",
        });
        return;
      }

      if (passwordData.newPassword.length < 6) {
        toast({
          title: "Error",
          description: "Password must be at least 6 characters",
          variant: "destructive",
        });
        return;
      }

      setLoadingPassword(true);
      const token = localStorage.getItem("token");

      const res = await api.patch(
        "/auth/change-password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast({
          title: "Success",
          description: "Password changed successfully",
        });
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowChangePassword(false);
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setLoadingPassword(false);
    }
  };

  //----------------------------------------------------
  // ✅ DELETE ACCOUNT
  //----------------------------------------------------
  const handleDeleteAccount = async () => {
    try {
      if (!deletePassword) {
        toast({
          title: "Error",
          description: "Password is required to delete account",
          variant: "destructive",
        });
        return;
      }

      setDeletingAccount(true);
      const token = localStorage.getItem("token");

      const res = await api.delete(
        "/auth/delete-account",
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { password: deletePassword },
        }
      );

      if (res.data.success) {
        toast({
          title: "Account Deleted",
          description: "Your account has been deleted successfully",
        });
        
        // Clear local storage and redirect to home
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        // Redirect to home after 2 seconds
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to delete account",
        variant: "destructive",
      });
    } finally {
      setDeletingAccount(false);
      setDeletePassword("");
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-2">My Account</h1>
        <p className="text-muted-foreground mb-8">
          Manage your profile and activity
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ✅ Left Profile Card */}
          <Card>
            <CardHeader className="text-center">
              <div className="flex flex-col items-center mb-4">
                <Avatar className="w-24 h-24">
                  {editedInfo.profilePicture ? (
                    <AvatarImage src={editedInfo.profilePicture} />
                  ) : (
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-bold text-lg">
                      {userInfo.name
                        ?.split(" ")
                        ?.map((n) => n[0])
                        ?.join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>

                <div className="flex gap-2 mt-4">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    disabled={uploadingPhoto}
                    asChild
                  >
                    <label className="cursor-pointer flex items-center gap-1">
                      <Upload className="w-4 h-4" /> 
                      {uploadingPhoto ? "Uploading..." : "Upload"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                        disabled={uploadingPhoto}
                      />
                    </label>
                  </Button>

                  {editedInfo.profilePicture && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleRemovePhoto}
                      disabled={uploadingPhoto}
                    >
                      <X className="w-4 h-4" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>

              <CardTitle>{userInfo.name}</CardTitle>
              <CardDescription>{userInfo.email}</CardDescription>
            </CardHeader>
          </Card>

          {/* ✅ Right Side Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="info">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="info">Profile</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              {/* ✅ Personal Info */}
              <TabsContent value="info">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Personal Information</CardTitle>

                      {!isEditing ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsEditing(true)}
                        >
                          <Edit2 className="w-4 h-4 mr-1" /> Edit
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={handleCancel}>
                            Cancel
                          </Button>
                          <Button size="sm" onClick={handleSave}>
                            <Save className="w-4 h-4 mr-1" /> Save
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Name */}
                    <div>
                      <Label>Name</Label>
                      <Input
                        disabled={!isEditing}
                        value={isEditing ? editedInfo.name : userInfo.name}
                        onChange={(e) =>
                          setEditedInfo({ ...editedInfo, name: e.target.value })
                        }
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <Label>Email</Label>
                      <Input
                        disabled={!isEditing}
                        type="email"
                        value={isEditing ? editedInfo.email : userInfo.email}
                        onChange={(e) =>
                          setEditedInfo({ ...editedInfo, email: e.target.value })
                        }
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <Label>Phone</Label>
                      <Input
                        disabled={!isEditing}
                        type="tel"
                        value={isEditing ? editedInfo.phone : userInfo.phone}
                        onChange={(e) =>
                          setEditedInfo({ ...editedInfo, phone: e.target.value })
                        }
                        placeholder="10-digit number"
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <Label htmlFor="gender-select">Gender</Label>
                      <select
                        id="gender-select"
                        disabled={!isEditing}
                        value={isEditing ? editedInfo.gender : userInfo.gender}
                        onChange={(e) =>
                          setEditedInfo({ ...editedInfo, gender: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-md bg-background"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ✅ Orders Tab */}
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Orders</CardTitle>
                  </CardHeader>

                  <CardContent>
                    {orders.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        No orders found.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div
                            key={order._id}
                            className="border p-4 rounded-lg hover:shadow transition"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <p className="font-semibold">
                                  Order ID: {order._id?.slice(-8) || "N/A"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                                </p>
                              </div>
                              <p className="text-primary font-bold text-lg">
                                ₹{order.summary?.total || 0}
                              </p>
                            </div>

                            <Separator className="my-2" />

                            <div className="text-sm text-muted-foreground mb-3">
                              <p>{order.items?.length || 0} items</p>
                              <p className="capitalize">
                                Status: <span className="text-primary font-semibold">{order.status || "Unknown"}</span>
                              </p>
                            </div>

                            {order.items && order.items.length > 0 && (
                              <div className="mt-2 pt-2 border-t mb-4">
                                {order.items.slice(0, 2).map((item, idx) => (
                                  <p key={idx} className="text-xs text-muted-foreground">
                                    {item.name} × {item.quantity}
                                  </p>
                                ))}
                                {order.items.length > 2 && (
                                  <p className="text-xs text-muted-foreground">
                                    +{order.items.length - 2} more items
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2 flex-wrap">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewOrder(order)}
                              >
                                <Eye className="w-4 h-4 mr-1" /> View
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDownloadBill(order)}
                              >
                                <Download className="w-4 h-4 mr-1" /> Bill
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleShareBill(order)}
                              >
                                <Share2 className="w-4 h-4 mr-1" /> Share
                              </Button>

                              {["Pending", "Processing"].includes(order.status) && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  disabled={loadingOrderId === order._id}
                                  onClick={() => handleCancelOrder(order._id)}
                                >
                                  <Trash2 className="w-4 h-4 mr-1" /> 
                                  {loadingOrderId === order._id ? "Cancelling..." : "Cancel"}
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Order Detail Modal */}
                <Dialog open={showOrderDetail} onOpenChange={setShowOrderDetail}>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Order Details</DialogTitle>
                      <DialogDescription>
                        Order ID: {selectedOrder?._id?.slice(-8)}
                      </DialogDescription>
                    </DialogHeader>

                    {selectedOrder && (
                      <div className="space-y-4">
                        {/* Order Status */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <p className="font-semibold">{selectedOrder.status}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Order Date</p>
                            <p className="font-semibold">
                              {new Date(selectedOrder.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <Separator />

                        {/* Shipping Info */}
                        <div>
                          <p className="font-semibold mb-2">Shipping Address</p>
                          <p className="text-sm">
                            {selectedOrder.shippingInfo?.firstName} {selectedOrder.shippingInfo?.lastName}
                          </p>
                          <p className="text-sm">{selectedOrder.shippingInfo?.address}</p>
                          <p className="text-sm">
                            {selectedOrder.shippingInfo?.city}, {selectedOrder.shippingInfo?.state} {selectedOrder.shippingInfo?.pincode}
                          </p>
                          <p className="text-sm">{selectedOrder.shippingInfo?.phone}</p>
                        </div>

                        <Separator />

                        {/* Items */}
                        <div>
                          <p className="font-semibold mb-2">Items</p>
                          <div className="space-y-2">
                            {(selectedOrder.items || []).map((item: any, idx: number) => (
                              <div key={idx} className="flex justify-between text-sm">
                                <span>{item.name}</span>
                                <span>{item.quantity}x ₹{item.price}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        {/* Summary */}
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>₹{selectedOrder.summary?.subtotal || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tax:</span>
                            <span>₹{selectedOrder.summary?.tax || 0}</span>
                          </div>
                          <div className="flex justify-between font-bold text-base border-t pt-2">
                            <span>Total:</span>
                            <span>₹{selectedOrder.summary?.total || 0}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-4">
                          <Button
                            className="flex-1"
                            onClick={() => {
                              handleDownloadBill(selectedOrder);
                              setShowOrderDetail(false);
                            }}
                          >
                            <Download className="w-4 h-4 mr-1" /> Download Bill
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                              handleShareBill(selectedOrder);
                              setShowOrderDetail(false);
                            }}
                          >
                            <Share2 className="w-4 h-4 mr-1" /> Share
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </TabsContent>

              {/* ✅ Wishlist */}
              <TabsContent value="wishlist">
                <Card>
                  <CardHeader>
                    <CardTitle>My Wishlist</CardTitle>
                    <CardDescription>Saved products</CardDescription>
                  </CardHeader>

                  <CardContent>
                    {wishlist.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No items in wishlist.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {wishlist.map((item) => (
                          <div key={item.id} className="border rounded-lg p-4">
                            <div className="flex gap-4">
                              <img
                                src={item.image}
                                alt={item.name}
                                title={item.name}
                                className="w-20 h-20 rounded-lg object-cover"
                              />

                              <div className="flex-1">
                                <h3 className="font-semibold">{item.name}</h3>
                                <p className="text-primary font-bold">
                                  ₹{item.price}
                                </p>

                                <div className="flex gap-2 mt-2">
                                  <Button
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => {
                                      addToCart({
                                        id: item.id,
                                        name: item.name,
                                        price: item.price,
                                        image: item.image,
                                        quantity: 1,
                                        category: item.category,
                                      });
                                      toast({
                                        title: "Added to Cart",
                                        description: item.name,
                                      });
                                    }}
                                  >
                                    Add to Cart
                                  </Button>

                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => removeFromWishlist(item.id)}
                                  >
                                    <Heart className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ✅ Settings Tab */}
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your security and account</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Change Password Section */}
                    <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Change Password</DialogTitle>
                          <DialogDescription>
                            Enter your current password and a new password
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="current-pwd">Current Password</Label>
                            <Input
                              id="current-pwd"
                              type="password"
                              placeholder="Current password"
                              value={passwordData.currentPassword}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  currentPassword: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div>
                            <Label htmlFor="new-pwd">New Password</Label>
                            <Input
                              id="new-pwd"
                              type="password"
                              placeholder="New password (min 6 chars)"
                              value={passwordData.newPassword}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  newPassword: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div>
                            <Label htmlFor="confirm-pwd">Confirm New Password</Label>
                            <Input
                              id="confirm-pwd"
                              type="password"
                              placeholder="Confirm new password"
                              value={passwordData.confirmPassword}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  confirmPassword: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="flex gap-2 pt-4">
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => {
                                setShowChangePassword(false);
                                setPasswordData({
                                  currentPassword: "",
                                  newPassword: "",
                                  confirmPassword: "",
                                });
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              className="flex-1"
                              onClick={handleChangePassword}
                              disabled={loadingPassword}
                            >
                              {loadingPassword ? "Saving..." : "Change Password"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                      <div>
                        <p className="font-semibold">Change Password</p>
                        <p className="text-sm text-muted-foreground">
                          Update your password regularly for security
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setShowChangePassword(true)}
                      >
                        Change
                      </Button>
                    </div>

                    <Separator />

                    {/* Delete Account Section */}
                    <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-destructive">Delete Account</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. Please enter your password to confirm.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                            <p className="text-sm text-destructive font-semibold">
                              ⚠️ Warning: Deleting your account will:
                            </p>
                            <ul className="text-sm text-destructive mt-2 ml-4 space-y-1">
                              <li>• Permanently delete your profile</li>
                              <li>• Remove all your orders history</li>
                              <li>• Clear your wishlist</li>
                              <li>• Cannot be recovered</li>
                            </ul>
                          </div>

                          <div>
                            <Label htmlFor="delete-pwd">
                              Enter your password to confirm deletion
                            </Label>
                            <Input
                              id="delete-pwd"
                              type="password"
                              placeholder="Your password"
                              value={deletePassword}
                              onChange={(e) => setDeletePassword(e.target.value)}
                            />
                          </div>

                          <div className="flex gap-2 pt-4">
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => {
                                setShowDeleteConfirm(false);
                                setDeletePassword("");
                              }}
                              disabled={deletingAccount}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              className="flex-1"
                              onClick={handleDeleteAccount}
                              disabled={deletingAccount || !deletePassword}
                            >
                              {deletingAccount ? "Deleting..." : "Delete Account"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <div className="flex items-center justify-between p-4 border border-destructive/50 rounded-lg bg-destructive/5">
                      <div>
                        <p className="font-semibold text-destructive">Delete Account</p>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete your account and all data
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        onClick={() => setShowDeleteConfirm(true)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Profile;

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

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    photo: "",
    _id: "",
  });

  const [editedInfo, setEditedInfo] = useState({ ...userInfo });

  //----------------------------------------------------
  // ✅ LOAD PROFILE FROM LOCALSTORAGE
  //----------------------------------------------------
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      const parsed = JSON.parse(saved);
      setUserInfo(parsed);
      setEditedInfo(parsed);
    }
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
    const saved = localStorage.getItem("user");
    if (!saved) return;

    const user = JSON.parse(saved);

    if (!user?._id) return;

    api.get(`/orders/user/${user._id}`).then((res) => {
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    });
  }, []);

  //----------------------------------------------------
  // ✅ SAVE PROFILE
  //----------------------------------------------------
  const handleSave = () => {
    setUserInfo({ ...editedInfo });

    toast({
      title: "Profile Updated",
      description: "Your profile was updated successfully.",
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedInfo({ ...userInfo });
    setIsEditing(false);
  };

  //----------------------------------------------------
  // ✅ Upload Photo
  //----------------------------------------------------
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setEditedInfo((prev) => ({ ...prev, photo: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setEditedInfo((prev) => ({ ...prev, photo: "" }));
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
                  {editedInfo.photo ? (
                    <AvatarImage src={editedInfo.photo} />
                  ) : (
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userInfo.name}`}
                    />
                  )}
                  <AvatarFallback>
                    {userInfo.name
                      ?.split(" ")
                      ?.map((n) => n[0])
                      ?.join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" asChild>
                    <label className="cursor-pointer flex items-center gap-1">
                      <Upload className="w-4 h-4" /> Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                    </label>
                  </Button>

                  {editedInfo.photo && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleRemovePhoto}
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
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="info">Profile</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
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
                    {["name", "email", "phone", "address"].map((field) => (
                      <div key={field}>
                        <Label className="capitalize">{field}</Label>
                        <Input
                          disabled={!isEditing}
                          value={
                            isEditing
                              ? editedInfo[field as keyof typeof editedInfo]
                              : userInfo[field as keyof typeof userInfo]
                          }
                          onChange={(e) =>
                            setEditedInfo({ ...editedInfo, [field]: e.target.value })
                          }
                        />
                      </div>
                    ))}
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
                            <div className="flex justify-between">
                              <p className="font-semibold">
                                Order ID: {order._id}
                              </p>
                              <p className="text-primary font-bold">
                                ₹{order.summary.total}
                              </p>
                            </div>

                            <Separator className="my-2" />

                            <p className="text-sm text-muted-foreground">
                              {order.cartItems.length} items
                            </p>
                            <p className="text-sm">Status: {order.status}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
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
            </Tabs>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Profile;

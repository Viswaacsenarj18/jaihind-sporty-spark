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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Package,
  Heart,
  Clock,
  Edit2,
  Save,
  Upload,
  X,
} from "lucide-react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    address: "123 Sports Street, Mumbai, Maharashtra 400001",
    photo: "", // Added profile photo field
  });

  const [editedInfo, setEditedInfo] = useState({ ...userInfo });

  // Load saved data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("profileData");
    if (saved) {
      const parsed = JSON.parse(saved);
      setUserInfo(parsed);
      setEditedInfo(parsed);
    }
  }, []);

  // Save to localStorage whenever userInfo updates
  useEffect(() => {
    localStorage.setItem("profileData", JSON.stringify(userInfo));
  }, [userInfo]);

  const handleSave = () => {
    setUserInfo({ ...editedInfo });
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleCancel = () => {
    setEditedInfo({ ...userInfo });
    setIsEditing(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const newPhoto = reader.result as string;
        setEditedInfo((prev) => ({ ...prev, photo: newPhoto }));
        if (!isEditing) {
          setUserInfo((prev) => ({ ...prev, photo: newPhoto }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    if (isEditing) {
      setEditedInfo((prev) => ({ ...prev, photo: "" }));
    } else {
      setUserInfo((prev) => ({ ...prev, photo: "" }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-500";
      case "shipped":
        return "bg-blue-500";
      case "processing":
        return "bg-yellow-500";
      default:
        return "bg-muted";
    }
  };

  const orders = [
    {
      id: "ORD-001",
      date: "2025-01-15",
      status: "Delivered",
      total: 2999,
      items: 2,
    },
    {
      id: "ORD-002",
      date: "2025-01-10",
      status: "Shipped",
      total: 4599,
      items: 1,
    },
    {
      id: "ORD-003",
      date: "2025-01-05",
      status: "Processing",
      total: 1799,
      items: 3,
    },
  ];

  const wishlist = [
    {
      id: "1",
      name: "Nike Air Max",
      price: 8999,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300",
    },
    {
      id: "2",
      name: "Adidas Ultraboost",
      price: 12999,
      image:
        "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=300",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            My Account
          </h1>
          <p className="text-muted-foreground">
            Manage your profile and view your orders
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <div className="flex flex-col items-center mb-4 relative">
                <Avatar className="w-24 h-24">
                  {userInfo.photo ? (
                    <AvatarImage src={userInfo.photo} alt="Profile" />
                  ) : (
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                        userInfo.name
                      )}`}
                    />
                  )}
                  <AvatarFallback>
                    {userInfo.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Upload & Remove Buttons */}
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" asChild>
                    <label className="cursor-pointer flex items-center gap-1">
                      <Upload className="w-4 h-4" />
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                    </label>
                  </Button>
                  {userInfo.photo && (
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

            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/settings">
                  <User className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/offers">
                  <Package className="w-4 h-4 mr-2" />
                  Special Offers
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Tabs Section */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Personal Info</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
              </TabsList>

              {/* Personal Info */}
              <TabsContent value="info">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Personal Information</CardTitle>
                      {!isEditing ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(true)}
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancel}
                          >
                            Cancel
                          </Button>
                          <Button size="sm" onClick={handleSave}>
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      {["name", "email", "phone", "address"].map((field) => (
                        <div key={field}>
                          <Label
                            htmlFor={field}
                            className="flex items-center gap-2 mb-2 capitalize"
                          >
                            {field === "name" && <User className="w-4 h-4" />}
                            {field === "email" && <Mail className="w-4 h-4" />}
                            {field === "phone" && <Phone className="w-4 h-4" />}
                            {field === "address" && <MapPin className="w-4 h-4" />}
                            {field}
                          </Label>
                          <Input
                            id={field}
                            type={field === "email" ? "email" : "text"}
                            value={
                              isEditing
                                ? editedInfo[field as keyof typeof editedInfo]
                                : userInfo[field as keyof typeof userInfo]
                            }
                            onChange={(e) =>
                              setEditedInfo({
                                ...editedInfo,
                                [field]: e.target.value,
                              })
                            }
                            disabled={!isEditing}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Orders */}
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>View and track your orders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-semibold">{order.id}</h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {order.date}
                              </p>
                            </div>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </div>
                          <Separator className="my-3" />
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                              {order.items} item(s) • ₹
                              {order.total.toLocaleString()}
                            </div>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Wishlist */}
              <TabsContent value="wishlist">
                <Card>
                  <CardHeader>
                    <CardTitle>My Wishlist</CardTitle>
                    <CardDescription>
                      Products you've saved for later
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {wishlist.map((item) => (
                        <div
                          key={item.id}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex gap-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold mb-1">{item.name}</h3>
                              <p className="text-lg font-bold text-primary mb-2">
                                ₹{item.price.toLocaleString()}
                              </p>
                              <div className="flex gap-2">
                                <Button size="sm" className="flex-1">
                                  Add to Cart
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Heart className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
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

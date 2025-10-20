import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { User, MapPin, Phone, Mail, Package, Heart, Clock, Edit2, Save } from "lucide-react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    address: "123 Sports Street, Mumbai, Maharashtra 400001",
  });

  const [editedInfo, setEditedInfo] = useState({ ...userInfo });

  const orders = [
    { id: "ORD-001", date: "2025-01-15", status: "Delivered", total: 2999, items: 2 },
    { id: "ORD-002", date: "2025-01-10", status: "Shipped", total: 4599, items: 1 },
    { id: "ORD-003", date: "2025-01-05", status: "Processing", total: 1799, items: 3 },
  ];

  const wishlist = [
    { id: "1", name: "Nike Air Max", price: 8999, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300" },
    { id: "2", name: "Adidas Ultraboost", price: 12999, image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=300" },
  ];

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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered": return "bg-green-500";
      case "shipped": return "bg-blue-500";
      case "processing": return "bg-yellow-500";
      default: return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Account</h1>
          <p className="text-muted-foreground">Manage your profile and view your orders</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
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

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Personal Info</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
              </TabsList>

              {/* Personal Information Tab */}
              <TabsContent value="info">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Personal Information</CardTitle>
                      {!isEditing ? (
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={handleCancel}>
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
                      <div>
                        <Label htmlFor="name" className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4" />
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          value={isEditing ? editedInfo.name : userInfo.name}
                          onChange={(e) => setEditedInfo({ ...editedInfo, name: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>

                      <div>
                        <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                          <Mail className="w-4 h-4" />
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={isEditing ? editedInfo.email : userInfo.email}
                          onChange={(e) => setEditedInfo({ ...editedInfo, email: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                          <Phone className="w-4 h-4" />
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          value={isEditing ? editedInfo.phone : userInfo.phone}
                          onChange={(e) => setEditedInfo({ ...editedInfo, phone: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>

                      <div>
                        <Label htmlFor="address" className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4" />
                          Address
                        </Label>
                        <Input
                          id="address"
                          value={isEditing ? editedInfo.address : userInfo.address}
                          onChange={(e) => setEditedInfo({ ...editedInfo, address: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>View and track your orders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-foreground">{order.id}</h3>
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
                              {order.items} item(s) • ₹{order.total.toLocaleString()}
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

              {/* Wishlist Tab */}
              <TabsContent value="wishlist">
                <Card>
                  <CardHeader>
                    <CardTitle>My Wishlist</CardTitle>
                    <CardDescription>Products you've saved for later</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {wishlist.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex gap-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
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

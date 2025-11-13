import { useState, useEffect } from "react";
import { Plus, Search, Shield, Mail, Calendar, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  // ✅ Load users FROM DB
  useEffect(() => {
    api.get("/auth/users")
      .then((res) => setUsers(res.data.users || []))
      .catch((err) => console.error("Failed to fetch users", err));
  }, []);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800";
      case "moderator": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadgeColor = (status: string) =>
    status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";

  const formatDate = (date: string | undefined) => {
    if (!date) return "Not Available"; // ✅ fallback

    try {
      return new Date(date).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short"
      });
    } catch {
      return "Invalid Date";
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Delete user ${userName}? This cannot be undone.`)) return;
    try {
      await api.delete(`/auth/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
      toast.success(`✅ User ${userName} deleted successfully`);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to delete user";
      toast.error(`❌ ${errorMsg}`);
      console.error("Delete error:", err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-2 sm:p-4 md:p-6 lg:p-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">User Management</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Manage users from database</p>
          </div>

          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Add User
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm sm:text-base"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader><CardTitle className="text-lg sm:text-xl">Users</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            {/* Desktop Table */}
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Name</TableHead>
                    <TableHead className="text-xs sm:text-sm">Email</TableHead>
                    <TableHead className="text-xs sm:text-sm">Role</TableHead>
                    <TableHead className="text-xs sm:text-sm">Joined</TableHead>
                    <TableHead className="text-xs sm:text-sm">Status</TableHead>
                    <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u._id}>
                      <TableCell className="font-medium text-xs sm:text-sm">{u.name}</TableCell>

                      <TableCell className="flex items-center gap-1 text-xs sm:text-sm">
                        <Mail className="w-3 h-3 hidden sm:inline" /> {u.email}
                      </TableCell>

                      <TableCell>
                        <Badge className={`${getRoleBadgeColor(u.role || "user")} text-xs`}>
                          <Shield className="w-3 h-3 mr-1" /> {u.role || "user"}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-1 text-xs sm:text-sm">
                          <Calendar className="w-3 h-3 hidden sm:inline" />
                          {formatDate(u.createdAt)}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge className={`${getStatusBadgeColor("active")} text-xs`}>
                          Active
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="text-xs"
                          onClick={() => handleDeleteUser(u._id, u.name)}
                        >
                          <Trash2 className="w-3 h-3 mr-1" /> Delete
                        </Button>
                      </TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden space-y-3">
              {users.map((u) => (
                <div key={u._id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{u.name}</p>
                      <p className="text-xs text-gray-600">{u.email}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="text-xs px-2"
                      onClick={() => handleDeleteUser(u._id, u.name)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Badge className={`${getRoleBadgeColor(u.role || "user")} text-xs`}>
                      {u.role || "user"}
                    </Badge>
                    <Badge className={`${getStatusBadgeColor("active")} text-xs`}>
                      Active
                    </Badge>
                  </div>

                  <p className="text-xs text-gray-500">
                    Joined: {formatDate(u.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </AdminLayout>
  );
}

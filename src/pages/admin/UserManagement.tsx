import { useState, useEffect } from "react";
import { Plus, Search, Shield, Mail, Calendar } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

  return (
    <AdminLayout>
      <div className="space-y-6 p-2 sm:p-4">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-sm text-muted-foreground">Manage users from database</p>
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
          <CardContent className="p-3 sm:p-6">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader><CardTitle>Users</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users.map((u) => (
                  <TableRow key={u._id}>
                    <TableCell className="font-medium">{u.name}</TableCell>

                    <TableCell className="flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {u.email}
                    </TableCell>

                    <TableCell>
                      <Badge className={getRoleBadgeColor(u.role || "user")}>
                        <Shield className="w-3 h-3 mr-1" /> {u.role || "user"}
                      </Badge>
                    </TableCell>

                    {/* ✅ Safe date */}
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-3 h-3" />
                        {formatDate(u.createdAt)}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge className={getStatusBadgeColor("active")}>
                        Active
                      </Badge>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </AdminLayout>
  );
}

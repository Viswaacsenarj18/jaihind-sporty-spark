import { useEffect, useState } from "react";
import { Bell, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ORDER_ROUTES } from "@/config/api";

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

export function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);

  // ✅ Fetch notifications
  useEffect(() => {
    const loadOrders = async () => {
      const res = await axios.get(ORDER_ROUTES.GET_ALL);

      if (res.data.success) {
        const pending = res.data.orders.filter(
          (o) => o.status === "Pending"
        );

        setNotifications(pending);
        setCount(pending.length);
      }
    };

    loadOrders();
  }, []);

  // ✅ Delete notification
  const deleteNotification = async (id: string) => {
    try {
      await axios.patch(
        ORDER_ROUTES.UPDATE_STATUS(id),
        { status: "Seen" }
      );

      const updated = notifications.filter((n: any) => n._id !== id);
      setNotifications(updated);
      setCount(updated.length);
    } catch (err) {
      console.error("Delete notification error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b bg-card/95">
      <div className="flex h-16 items-center gap-4 px-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuToggle}
          className="lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <div className="flex-1" />

        {/* ✅ Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              {count > 0 && (
                <Badge className="absolute -top-1 -right-1">
                  {count}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {notifications.length === 0 ? (
              <DropdownMenuItem disabled>No new orders</DropdownMenuItem>
            ) : (
              notifications.map((order: any) => (
                <DropdownMenuItem
                  key={order._id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-sm">
                      New Order: {order.customer.firstName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Total ₹{order.summary.total}
                    </p>
                  </div>

                  {/* ❌ Delete Button */}
                  <button
                    className="text-red-500 text-xl"
                    onClick={() => deleteNotification(order._id)}
                  >
                    ×
                  </button>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* ✅ User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <User className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

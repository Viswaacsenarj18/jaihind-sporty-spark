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
import { API_BASE_URL } from "@/config/api";

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

export function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);

  // Fetch admin notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${API_BASE_URL}/api/notifications/admin/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setNotifications(res.data.notifications || []);
          setCount(res.data.unreadCount || 0);
        }
      } catch (err) {
        console.error("❌ Admin notifications error:", err);
        setNotifications([]);
        setCount(0);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  // Mark notification as read
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `${API_BASE_URL}/api/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updated = notifications.filter((n: any) => n._id !== notificationId);
      setNotifications(updated);
      setCount(Math.max(0, count - 1));
    } catch (err) {
      console.error("❌ Mark read error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b bg-card/95">
      <div className="flex h-16 items-center gap-4 px-6">
        <Button variant="ghost" size="sm" onClick={onMenuToggle} className="lg:hidden">
          <Menu className="w-5 h-5" />
        </Button>

        <div className="flex-1" />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              {count > 0 && (
                <Badge className="absolute -top-1 -right-1">{count}</Badge>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {notifications.length === 0 ? (
              <DropdownMenuItem disabled>No new notifications</DropdownMenuItem>
            ) : (
              notifications.map((notification: any) => (
                <DropdownMenuItem
                  key={notification._id}
                  className="flex justify-between items-center gap-2 p-2"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>

                    {/* ⭐ FIXED: Correct sender */}
                    <p className="text-xs text-gray-400 mt-1">
                      From: {notification.sender?.name || "Unknown"}
                    </p>
                  </div>

                  <button
                    className="text-blue-500 text-lg hover:text-blue-700"
                    onClick={() => handleMarkAsRead(notification._id)}
                  >
                    ✓
                  </button>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Admin Menu */}
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

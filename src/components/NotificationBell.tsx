import { useState, useEffect } from "react";
import { Bell, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import api from "@/lib/api";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("⚠️ No auth token found for notifications");
        return;
      }

      const res = await api.get("/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((u) => Math.max(0, u - 1));
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.patch("/notifications/mark-all-as-read");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Mark all error:", err);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>Notifications</DialogTitle>
              {unreadCount > 0 && (
                <Button variant="link" size="sm" onClick={handleMarkAllAsRead}>
                  Mark all as read
                </Button>
              )}
            </div>
          </DialogHeader>

          <div className="max-h-96 overflow-y-auto space-y-3">
            {notifications.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No notifications
              </p>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`p-4 rounded-lg border transition ${
                    notif.read
                      ? "bg-muted/30 border-muted"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{notif.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notif.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex gap-1">
                      {!notif.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notif._id)}
                        >
                          <Check className="w-4 h-4 text-blue-600" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(notif._id)}
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

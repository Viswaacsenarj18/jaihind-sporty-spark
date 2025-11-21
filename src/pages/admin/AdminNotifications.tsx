import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadAdminNotifications();
  }, []);

  async function loadAdminNotifications() {
    try {
      const res = await api.get("/notifications/admin");
      setNotifications(res.data.notifications || []);
    } catch (error) {
      console.error("Error fetching admin notifications:", error);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Notifications</h1>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No new notifications.</p>
      ) : (
        notifications.map((n: any) => (
          <div
            key={n._id}
            className="p-4 border rounded-lg mb-3 shadow-sm bg-white"
          >
            <p className="font-semibold text-lg">{n.title}</p>
            <p className="text-gray-600">{n.message}</p>
            <p className="text-xs text-gray-400 mt-2">
              {new Date(n.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

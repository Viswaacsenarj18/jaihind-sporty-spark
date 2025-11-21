/**
 * 🧪 NOTIFICATION SYSTEM - BROWSER CONSOLE TESTING
 * 
 * Use this to test notifications directly from browser console
 * 
 * Steps:
 * 1. Login to app at http://localhost:5173
 * 2. Open Developer Tools: F12
 * 3. Go to Console tab
 * 4. Paste and run commands below
 * 
 * Commands:
 *   testNotificationAPI() - Test API connection
 *   getNotifications() - Fetch user notifications
 *   getAdminNotifications() - Fetch admin notifications
 *   markNotificationAsRead(id) - Mark specific notification as read
 *   markAllAsRead() - Mark all as read
 *   deleteNotification(id) - Delete notification
 *   watchNotifications() - Auto-refresh every 5 seconds
 *   clearNotifications() - Delete all notifications
 *   viewTokenInfo() - See token details
 */

// ============================================
// CONFIGURATION
// ============================================

const BASE_URL = window.location.hostname === "localhost" 
  ? "http://localhost:5000"
  : "https://jaihind-sporty-spark-backend.onrender.com";

const getToken = () => localStorage.getItem("token");

console.log("🧪 Notification Testing Suite Loaded");
console.log(`📍 Base URL: ${BASE_URL}`);

// ============================================
// HELPER: API Request
// ============================================

async function apiRequest(method, path, body = null) {
  const token = getToken();
  
  if (!token) {
    console.error("❌ No token found! Please login first.");
    return null;
  }

  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${path}`, options);
    const data = await response.json();

    if (!response.ok) {
      console.error(`❌ API Error: ${response.status}`, data);
      return null;
    }

    return data;
  } catch (error) {
    console.error("❌ Request Error:", error.message);
    return null;
  }
}

// ============================================
// TEST: Connection
// ============================================

async function testNotificationAPI() {
  console.log("\n🧪 Testing Notification API Connection...");
  
  try {
    const response = await fetch(`${BASE_URL}/`);
    const data = await response.json();
    
    if (response.ok) {
      console.log("✅ Backend Connected Successfully");
      console.log("📝 Message:", data.message);
    } else {
      console.error("❌ Backend Error:", data);
    }
  } catch (error) {
    console.error("❌ Cannot reach backend:", error.message);
    console.log(`Try: http://localhost:5000 (if localhost)`);
  }
}

// ============================================
// TEST: Get Notifications
// ============================================

async function getNotifications() {
  console.log("\n📬 Fetching User Notifications...");
  
  const data = await apiRequest("GET", "/api/notifications");
  
  if (data && data.success) {
    console.log("✅ Notifications Retrieved");
    console.log(`📊 Total: ${data.notifications.length}`);
    console.log(`📕 Unread: ${data.unreadCount}`);
    console.table(data.notifications.map(n => ({
      ID: n._id.substring(0, 8),
      Type: n.type,
      Title: n.title,
      Read: n.read ? "✅" : "❌",
      Date: new Date(n.createdAt).toLocaleString()
    })));
    return data.notifications;
  } else {
    console.log("❌ Failed to fetch notifications");
    return [];
  }
}

// ============================================
// TEST: Get Admin Notifications
// ============================================

async function getAdminNotifications() {
  console.log("\n📬 Fetching Admin Notifications...");
  
  const data = await apiRequest("GET", "/api/notifications/admin/all");
  
  if (data && data.success) {
    console.log("✅ Admin Notifications Retrieved");
    console.log(`📊 Total: ${data.notifications.length}`);
    console.log(`📕 Unread: ${data.unreadCount}`);
    console.table(data.notifications.map(n => ({
      ID: n._id.substring(0, 8),
      Type: n.type,
      Title: n.title,
      Sender: n.sender?.name || "System",
      Read: n.read ? "✅" : "❌"
    })));
    return data.notifications;
  } else {
    console.log("❌ Failed to fetch admin notifications");
    return [];
  }
}

// ============================================
// TEST: Mark as Read
// ============================================

async function markNotificationAsRead(notificationId) {
  console.log(`\n✏️  Marking notification as read: ${notificationId}`);
  
  const data = await apiRequest(
    "PATCH",
    `/api/notifications/${notificationId}/read`
  );
  
  if (data && data.success) {
    console.log("✅ Marked as read successfully");
  } else {
    console.log("❌ Failed to mark as read");
  }
}

// ============================================
// TEST: Mark All as Read
// ============================================

async function markAllAsRead() {
  console.log("\n✏️  Marking ALL notifications as read...");
  
  const data = await apiRequest(
    "PATCH",
    "/api/notifications/mark-all-as-read"
  );
  
  if (data && data.success) {
    console.log("✅ All marked as read successfully");
  } else {
    console.log("❌ Failed to mark all as read");
  }
}

// ============================================
// TEST: Delete Notification
// ============================================

async function deleteNotification(notificationId) {
  console.log(`\n🗑️  Deleting notification: ${notificationId}`);
  
  const data = await apiRequest(
    "DELETE",
    `/api/notifications/${notificationId}`
  );
  
  if (data && data.success) {
    console.log("✅ Deleted successfully");
  } else {
    console.log("❌ Failed to delete");
  }
}

// ============================================
// TEST: Watch Notifications (Auto-Refresh)
// ============================================

let watchInterval = null;

async function watchNotifications(intervalSeconds = 5) {
  console.log(`\n👁️  Watching notifications (refresh every ${intervalSeconds}s)`);
  console.log("Type: stopWatching() to stop\n");
  
  // Initial fetch
  await getNotifications();
  
  // Set up interval
  watchInterval = setInterval(async () => {
    console.clear();
    console.log(`👁️  [${new Date().toLocaleTimeString()}] Refreshing...\n`);
    await getNotifications();
  }, intervalSeconds * 1000);
}

function stopWatching() {
  if (watchInterval) {
    clearInterval(watchInterval);
    console.log("\n⏹️  Stopped watching notifications");
  }
}

// ============================================
// TEST: Delete All Notifications
// ============================================

async function clearNotifications() {
  console.log("\n🗑️  Clearing ALL notifications...");
  
  const notifications = await getNotifications();
  
  if (notifications.length === 0) {
    console.log("ℹ️  No notifications to delete");
    return;
  }
  
  let deletedCount = 0;
  for (const notif of notifications) {
    await apiRequest("DELETE", `/api/notifications/${notif._id}`);
    deletedCount++;
  }
  
  console.log(`✅ Deleted ${deletedCount} notifications`);
}

// ============================================
// TEST: View Token Info
// ============================================

function viewTokenInfo() {
  const token = getToken();
  
  if (!token) {
    console.log("❌ No token found. Please login first.");
    return;
  }
  
  console.log("\n🔐 Token Information:");
  console.log("Token:", token.substring(0, 30) + "...");
  
  // Decode JWT (without verification)
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.log("Invalid JWT format");
      return;
    }
    
    const payload = JSON.parse(atob(parts[1]));
    
    console.table({
      "User ID": payload.id || payload._id,
      "Email": payload.email || "N/A",
      "Role": payload.role || "user",
      "Issued At": new Date(payload.iat * 1000).toLocaleString(),
      "Expires At": new Date(payload.exp * 1000).toLocaleString(),
      "Valid For": Math.round((payload.exp - Date.now() / 1000) / 3600) + " hours"
    });
  } catch (error) {
    console.error("Error decoding token:", error.message);
  }
}

// ============================================
// QUICK TEST SEQUENCES
// ============================================

async function quickTest() {
  console.log("\n" + "=".repeat(60));
  console.log("🧪 QUICK TEST SEQUENCE");
  console.log("=".repeat(60) + "\n");
  
  console.log("1️⃣  Testing API connection...");
  await testNotificationAPI();
  
  console.log("\n2️⃣  Fetching notifications...");
  await getNotifications();
  
  console.log("\n3️⃣  Token information...");
  viewTokenInfo();
  
  console.log("\n" + "=".repeat(60));
  console.log("✅ Quick test complete!");
  console.log("=".repeat(60));
}

async function adminQuickTest() {
  console.log("\n" + "=".repeat(60));
  console.log("👨‍💼 ADMIN QUICK TEST SEQUENCE");
  console.log("=".repeat(60) + "\n");
  
  console.log("1️⃣  Testing API connection...");
  await testNotificationAPI();
  
  console.log("\n2️⃣  Fetching admin notifications...");
  await getAdminNotifications();
  
  console.log("\n3️⃣  Token information...");
  viewTokenInfo();
  
  console.log("\n" + "=".repeat(60));
  console.log("✅ Admin test complete!");
  console.log("=".repeat(60));
}

// ============================================
// HELP
// ============================================

function showHelp() {
  console.log("\n" + "=".repeat(60));
  console.log("📖 NOTIFICATION TESTING - HELP");
  console.log("=".repeat(60) + "\n");
  
  console.log("🚀 Quick Tests:");
  console.log("  quickTest()              - Run full user test");
  console.log("  adminQuickTest()         - Run full admin test\n");
  
  console.log("📬 Fetch Notifications:");
  console.log("  getNotifications()       - Get user notifications");
  console.log("  getAdminNotifications()  - Get admin notifications\n");
  
  console.log("✏️  Manage Notifications:");
  console.log("  markNotificationAsRead(id)   - Mark specific as read");
  console.log("  markAllAsRead()              - Mark all as read");
  console.log("  deleteNotification(id)       - Delete notification");
  console.log("  clearNotifications()         - Delete all\n");
  
  console.log("👁️  Monitor:");
  console.log("  watchNotifications(5)    - Auto-refresh every 5s");
  console.log("  stopWatching()           - Stop watching\n");
  
  console.log("🔐 Info:");
  console.log("  viewTokenInfo()          - View JWT details");
  console.log("  testNotificationAPI()    - Test backend connection\n");
  
  console.log("=" .repeat(60) + "\n");
}

// Show help on load
console.log("\n📖 Type showHelp() to see available commands\n");

// Export for global access
window.NotificationTests = {
  testNotificationAPI,
  getNotifications,
  getAdminNotifications,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
  clearNotifications,
  watchNotifications,
  stopWatching,
  viewTokenInfo,
  quickTest,
  adminQuickTest,
  showHelp
};

// ============================================
// USAGE EXAMPLES
// ============================================

/*

// USER TESTING
quickTest()                              // Run all tests
getNotifications()                       // Check notifications
markAllAsRead()                          // Mark all as read
watchNotifications(5)                    // Auto-refresh every 5s
stopWatching()                           // Stop auto-refresh

// ADMIN TESTING
adminQuickTest()                         // Run admin tests
getAdminNotifications()                  // Check admin notifications
markNotificationAsRead("NOTIF_ID")       // Mark specific as read
deleteNotification("NOTIF_ID")           // Delete notification

// SPECIFIC TESTS
testNotificationAPI()                    // Check backend connection
viewTokenInfo()                          // See JWT details
clearNotifications()                     // Delete all notifications

*/

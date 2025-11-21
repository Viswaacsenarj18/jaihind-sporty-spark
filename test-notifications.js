#!/usr/bin/env node

/**
 * 🧪 NOTIFICATION SYSTEM - AUTOMATED TEST SCRIPT
 * 
 * This script tests all notification API endpoints
 * Works on both localhost and Render production
 * 
 * Usage:
 *   node test-notifications.js [localhost|render]
 * 
 * Example:
 *   node test-notifications.js localhost
 *   node test-notifications.js render
 */

const https = require("https");
const http = require("http");

// ============================================
// CONFIGURATION
// ============================================

const ENVIRONMENT = process.argv[2] || "localhost";
const CONFIG = {
  localhost: {
    baseUrl: "http://localhost:5000",
    frontendUrl: "http://localhost:5173",
    protocol: "http",
  },
  render: {
    baseUrl: "https://jaihind-sporty-spark-backend.onrender.com",
    frontendUrl: "https://jaihind-sporty-spark.vercel.app",
    protocol: "https",
  },
};

const CURRENT_CONFIG = CONFIG[ENVIRONMENT];

if (!CURRENT_CONFIG) {
  console.error(
    "❌ Invalid environment. Use: localhost or render"
  );
  process.exit(1);
}

// Test data
let TEST_TOKENS = {
  admin: null,
  user: null,
};

let TEST_DATA = {
  adminId: null,
  userId: null,
  notificationId: null,
  orderId: null,
};

// ============================================
// HTTP REQUEST HELPER
// ============================================

function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, CURRENT_CONFIG.baseUrl);
    const isHttps = url.protocol === "https:";
    const client = isHttps ? https : http;

    const options = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
    }

    const request = client.request(url, options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        try {
          const parsedData = data ? JSON.parse(data) : {};
          resolve({
            status: response.statusCode,
            data: parsedData,
          });
        } catch (error) {
          reject(error);
        }
      });
    });

    request.on("error", (error) => {
      reject(error);
    });

    if (body) {
      request.write(JSON.stringify(body));
    }

    request.end();
  });
}

// ============================================
// TEST HELPER FUNCTIONS
// ============================================

function printHeader(title) {
  console.log("\n" + "=".repeat(60));
  console.log(`🧪 ${title}`);
  console.log("=".repeat(60));
}

function printTest(testName, passed, message = "") {
  const status = passed ? "✅" : "❌";
  console.log(`${status} ${testName}`);
  if (message) {
    console.log(`   └─ ${message}`);
  }
}

function printResult(data) {
  console.log(`   Response: ${JSON.stringify(data, null, 2)}`);
}

// ============================================
// TESTS
// ============================================

async function testBackendConnection() {
  printHeader("TEST 1: Backend Connection");

  try {
    const response = await makeRequest("GET", "/");
    printTest(
      "Backend is running",
      response.status === 200,
      `Status: ${response.status}`
    );

    if (response.status === 200) {
      console.log(`   Message: ${response.data.message}`);
    }

    return response.status === 200;
  } catch (error) {
    printTest("Backend is running", false, error.message);
    return false;
  }
}

async function testAdminLogin() {
  printHeader("TEST 2: Admin Login");

  try {
    const response = await makeRequest("POST", "/api/auth/login", {
      email: "admin@jaihind.com",
      password: "admin123",
    });

    const success =
      response.status === 200 && response.data.token;

    printTest(
      "Admin login successful",
      success,
      `Status: ${response.status}`
    );

    if (success) {
      TEST_TOKENS.admin = response.data.token;
      TEST_DATA.adminId = response.data.userId;
      console.log(`   Admin ID: ${TEST_DATA.adminId}`);
      console.log(`   Token: ${response.data.token.substring(0, 20)}...`);
    } else {
      console.log(`   Error: ${response.data.message}`);
    }

    return success;
  } catch (error) {
    printTest("Admin login successful", false, error.message);
    return false;
  }
}

async function testUserLogin() {
  printHeader("TEST 3: User Login");

  try {
    // Try to login with test user
    const response = await makeRequest("POST", "/api/auth/login", {
      email: "user1@test.com",
      password: "Test@123",
    });

    if (response.status === 200 && response.data.token) {
      TEST_TOKENS.user = response.data.token;
      TEST_DATA.userId = response.data.userId;
      printTest("User login successful", true, `Status: ${response.status}`);
      console.log(`   User ID: ${TEST_DATA.userId}`);
      return true;
    } else {
      printTest(
        "User login successful",
        false,
        `Status: ${response.status} - User might not exist`
      );
      console.log(
        "   Note: Create user via signup or use existing test account"
      );
      return false;
    }
  } catch (error) {
    printTest("User login successful", false, error.message);
    return false;
  }
}

async function testGetAdminNotifications() {
  printHeader("TEST 4: Admin Get All Notifications");

  if (!TEST_TOKENS.admin) {
    printTest(
      "Admin notifications retrieved",
      false,
      "Admin token not available"
    );
    return false;
  }

  try {
    const response = await makeRequest(
      "GET",
      "/api/notifications/admin/all",
      null,
      TEST_TOKENS.admin
    );

    const success =
      response.status === 200 && response.data.success;

    printTest(
      "Admin notifications retrieved",
      success,
      `Status: ${response.status}`
    );

    if (success) {
      console.log(
        `   Total notifications: ${response.data.notifications.length}`
      );
      console.log(`   Unread count: ${response.data.unreadCount}`);

      if (response.data.notifications.length > 0) {
        const lastNotif = response.data.notifications[0];
        console.log(`   Latest notification:`);
        console.log(`     - Type: ${lastNotif.type}`);
        console.log(`     - Title: ${lastNotif.title}`);
        console.log(`     - Read: ${lastNotif.read}`);
        TEST_DATA.notificationId = lastNotif._id;
      }
    } else {
      console.log(`   Error: ${response.data.message}`);
    }

    return success;
  } catch (error) {
    printTest("Admin notifications retrieved", false, error.message);
    return false;
  }
}

async function testGetUserNotifications() {
  printHeader("TEST 5: User Get Own Notifications");

  if (!TEST_TOKENS.user) {
    printTest(
      "User notifications retrieved",
      false,
      "User token not available"
    );
    return false;
  }

  try {
    const response = await makeRequest(
      "GET",
      "/api/notifications",
      null,
      TEST_TOKENS.user
    );

    const success =
      response.status === 200 && response.data.success;

    printTest(
      "User notifications retrieved",
      success,
      `Status: ${response.status}`
    );

    if (success) {
      console.log(
        `   Total notifications: ${response.data.notifications.length}`
      );
      console.log(`   Unread count: ${response.data.unreadCount}`);

      if (response.data.notifications.length > 0) {
        const lastNotif = response.data.notifications[0];
        console.log(`   Latest notification:`);
        console.log(`     - Type: ${lastNotif.type}`);
        console.log(`     - Title: ${lastNotif.title}`);
        console.log(`     - Read: ${lastNotif.read}`);
        TEST_DATA.notificationId = lastNotif._id;
      }
    } else {
      console.log(`   Error: ${response.data.message}`);
    }

    return success;
  } catch (error) {
    printTest("User notifications retrieved", false, error.message);
    return false;
  }
}

async function testMarkAsRead() {
  printHeader("TEST 6: Mark Notification as Read");

  if (!TEST_DATA.notificationId || !TEST_TOKENS.user) {
    printTest(
      "Notification marked as read",
      false,
      "No unread notification or user token"
    );
    return false;
  }

  try {
    const response = await makeRequest(
      "PATCH",
      `/api/notifications/${TEST_DATA.notificationId}/read`,
      null,
      TEST_TOKENS.user
    );

    const success = response.status === 200 && response.data.success;

    printTest(
      "Notification marked as read",
      success,
      `Status: ${response.status}`
    );

    if (!success) {
      console.log(`   Error: ${response.data.message || response.data.error}`);
    }

    return success;
  } catch (error) {
    printTest("Notification marked as read", false, error.message);
    return false;
  }
}

async function testMarkAllAsRead() {
  printHeader("TEST 7: Mark All Notifications as Read");

  if (!TEST_TOKENS.user) {
    printTest(
      "All notifications marked as read",
      false,
      "User token not available"
    );
    return false;
  }

  try {
    const response = await makeRequest(
      "PATCH",
      "/api/notifications/mark-all-as-read",
      null,
      TEST_TOKENS.user
    );

    const success = response.status === 200 && response.data.success;

    printTest(
      "All notifications marked as read",
      success,
      `Status: ${response.status}`
    );

    if (!success) {
      console.log(`   Error: ${response.data.message || response.data.error}`);
    }

    return success;
  } catch (error) {
    printTest("All notifications marked as read", false, error.message);
    return false;
  }
}

async function testDeleteNotification() {
  printHeader("TEST 8: Delete Notification");

  if (!TEST_DATA.notificationId || !TEST_TOKENS.user) {
    printTest(
      "Notification deleted",
      false,
      "No notification or user token"
    );
    return false;
  }

  try {
    const response = await makeRequest(
      "DELETE",
      `/api/notifications/${TEST_DATA.notificationId}`,
      null,
      TEST_TOKENS.user
    );

    const success = response.status === 200 && response.data.success;

    printTest(
      "Notification deleted",
      success,
      `Status: ${response.status}`
    );

    if (!success) {
      console.log(`   Error: ${response.data.message || response.data.error}`);
    }

    return success;
  } catch (error) {
    printTest("Notification deleted", false, error.message);
    return false;
  }
}

// ============================================
// MAIN TEST EXECUTION
// ============================================

async function runAllTests() {
  console.log("\n");
  console.log("╔════════════════════════════════════════════════════════╗");
  console.log("║   🧪 NOTIFICATION SYSTEM - AUTOMATED TEST SUITE        ║");
  console.log("╚════════════════════════════════════════════════════════╝");
  console.log(`\n📍 Environment: ${ENVIRONMENT.toUpperCase()}`);
  console.log(`🔗 Backend URL: ${CURRENT_CONFIG.baseUrl}`);
  console.log(`🔗 Frontend URL: ${CURRENT_CONFIG.frontendUrl}\n`);

  const results = [];

  // Run tests in sequence
  results.push(await testBackendConnection());
  if (!results[0]) {
    console.log("\n❌ Backend not reachable. Stopping tests.");
    process.exit(1);
  }

  results.push(await testAdminLogin());
  results.push(await testUserLogin());
  results.push(await testGetAdminNotifications());
  results.push(await testGetUserNotifications());
  results.push(await testMarkAsRead());
  results.push(await testMarkAllAsRead());
  results.push(await testDeleteNotification());

  // Summary
  printHeader("TEST SUMMARY");
  const passedCount = results.filter((r) => r).length;
  const totalCount = results.length;
  const passPercentage = Math.round((passedCount / totalCount) * 100);

  console.log(`\n✅ Passed: ${passedCount}/${totalCount} (${passPercentage}%)\n`);

  if (passPercentage === 100) {
    console.log("🎉 All tests passed! Notification system is working correctly.");
  } else if (passPercentage >= 80) {
    console.log("⚠️  Most tests passed. Some features may need attention.");
  } else {
    console.log("❌ Many tests failed. Check the issues above.");
  }

  console.log("\n" + "=".repeat(60) + "\n");

  // Exit with appropriate code
  process.exit(passPercentage === 100 ? 0 : 1);
}

// Run tests
runAllTests().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

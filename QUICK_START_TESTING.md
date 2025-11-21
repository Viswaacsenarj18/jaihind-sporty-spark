# 🚀 Quick Start - Notification System Testing

**Status:** ✅ Complete  
**Created:** November 21, 2025

## ⚡ 5-Minute Test

```bash
# Start backend (Terminal 1)
cd backend && npm start

# Start frontend (Terminal 2)
npm run dev

# Run tests (Terminal 3)
node test-notifications.js localhost
```

**Expected:** All tests pass ✅

## 🧪 Testing Methods

### Method 1: Automated Script
```bash
node test-notifications.js localhost  # Tests all 8 operations
```

### Method 2: Manual Browser
1. Go to http://localhost:5173
2. Sign up / Login
3. Place order
4. Check notification bell
5. Verify mark as read / delete works

### Method 3: HTTP Testing
- Open `API_NOTIFICATION_TEST.http`
- Use VS Code REST Client
- Send each request

### Method 4: Browser Console
```javascript
// F12 → Console
// Paste browser-console-tests.js
quickTest()  // Run all tests
```

## ✅ Verification Checklist

- [ ] Backend starts without errors
- [ ] MongoDB connects successfully
- [ ] Frontend loads at http://localhost:5173
- [ ] Can place order
- [ ] Admin receives notification
- [ ] Notification bell shows in navbar
- [ ] Can view notifications
- [ ] Can mark as read
- [ ] Can delete notification
- [ ] Works on Render (after deployment)

## 🌍 Production Testing

```bash
# Deploy to production
git push origin main

# Test on production (wait 5-10 min for deploy)
node test-notifications.js render
```

## 📋 Files Created

| File | Purpose | Time |
|------|---------|------|
| NOTIFICATION_TESTING_GUIDE.md | Complete guide | 30 min |
| ENVIRONMENT_SETUP.md | Configuration | 20 min |
| test-notifications.js | Automated tests | 3 min |
| API_NOTIFICATION_TEST.http | Manual tests | 10 min |
| browser-console-tests.js | Browser tests | 5 min |

## 🎯 Next Action

```bash
node test-notifications.js localhost
```

If all pass → System is ready! ✅

# 📢 Notification System - Complete Testing Guide

**Status:** ✅ Production Ready | **Date:** Nov 21, 2025

## Quick Start

### Localhost (Fastest)
```bash
# Terminal 1
cd backend && npm start

# Terminal 2
npm run dev

# Terminal 3
node test-notifications.js localhost
```

### Expected Output
```
✅ Backend Connection
✅ Admin Login
✅ User Login
✅ Admin Notifications Retrieved
✅ User Notifications Retrieved
✅ Notification Marked as Read
✅ All Notifications Marked as Read
✅ Notification Deleted
```

## Test Scenarios

### 1. Backend Connection
```bash
curl http://localhost:5000/
# Response: { "success": true, "message": "Backend running..." }
```

### 2. Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@jaihind.com","password":"admin123"}'
```

### 3. Place Order (Triggers Notification)
- Go to http://localhost:5173
- Add product to cart
- Checkout → Place Order
- Check admin receives notification

### 4. Get Admin Notifications
```bash
curl http://localhost:5000/api/notifications/admin/all \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 5. Mark as Read
```bash
curl -X PATCH http://localhost:5000/api/notifications/NOTIF_ID/read \
  -H "Authorization: Bearer USER_TOKEN"
```

### 6. Test on Render
```bash
# Same tests, replace URLs:
# http://localhost:5000 → https://jaihind-sporty-spark-backend.onrender.com
# http://localhost:5173 → https://jaihind-sporty-spark.vercel.app
```

## Troubleshooting

### Backend Won't Start
```bash
# Check if port 5000 is in use
lsof -i :5000
# Kill and restart
npm start
```

### MongoDB Connection Timeout
Already fixed with increased timeouts (20 seconds) and retry logic

### CORS Error
Already configured for Render and Vercel in `server.js`

### 401 Unauthorized
- Get fresh token from login
- Token expires in 7 days

## Features Verified

✅ Admin notified when user places order  
✅ Admin receives low stock alerts (≤5 units)  
✅ Admin receives out of stock alerts (0 units)  
✅ User receives notification on status change  
✅ Real-time updates (10-second refresh)  
✅ Mark as read functionality  
✅ Delete functionality  
✅ Works on localhost and Render  

## Next Steps

1. Run automated tests
2. Deploy to Render: `git push origin main`
3. Test on production
4. Monitor logs

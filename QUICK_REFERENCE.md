# 🎯 Quick Reference - Order Management System

## For Users

### View My Orders
1. Login to account
2. Click **Profile** (user icon in navbar)
3. Go to **Orders** tab
4. See all past orders with status

### Check Notifications
1. Look for **🔔 bell icon** in navbar
2. Red badge shows unread notifications
3. Click bell to open notification panel
4. View all order status updates
5. Mark as read or delete

### Place an Order
1. Browse products
2. Add items to cart
3. Click **Checkout**
4. Fill shipping details (all fields required)
5. Click **Place Order**
6. See order in "My Orders" page

### Cancel an Order
1. Go to **My Orders** page
2. Find order with "Pending" or "Processing" status
3. Click **Cancel Order** button
4. Confirm cancellation
5. Stock will be restored

---

## For Admins

### View All Orders
```
/admin/orders
```

### Update Order Status
1. Go to **Orders** page
2. Click on customer order
3. Click **Update Status** button
4. Select new status:
   - Processing (order being prepared)
   - Shipped (order sent)
   - Delivered (order received)
   - Cancelled (order cancelled)
5. Click **Update**
6. **Automatic notification** sent to customer

### Download Invoice (PDF)
1. Go to **Orders** page
2. Find order
3. Click **Download Invoice** button
4. PDF saved with order details

### Delete Order
1. Go to **Orders** page
2. Find order
3. Click **Delete** button
4. Confirm (⚠️ Cannot undo!)

### Check Order Count
- **Sidebar** shows `Orders (X)` count
- Updates automatically every 30 seconds
- Shows total unfinished orders

---

## Database Collections

```
📁 Users
   - Email, Name, Phone
   - pastOrders: [OrderIds]
   - role: "user" or "admin"

📁 Orders
   - user: UserId
   - items: [Products ordered]
   - shippingInfo: [Delivery address]
   - status: Pending/Processing/Shipped/Delivered/Cancelled
   - summary: Total price breakdown

📁 Products
   - name, price, image
   - stock: Number (decrements on order)

📁 Notifications
   - user: UserId
   - orderId: OrderId
   - type: "status_updated"
   - message: Notification text
   - read: true/false
```

---

## API Endpoints Quick List

### User Routes (require token)
```
GET  /api/orders/user/my-orders       → Get user's orders
GET  /api/orders/details/:orderId     → Get order details
POST /api/orders/create               → Create new order
PATCH /api/orders/cancel/:orderId     → Cancel order

GET  /api/notifications               → Get notifications
PATCH /api/notifications/:id/read     → Mark as read
DELETE /api/notifications/:id         → Delete notification
```

### Admin Routes (require token + role: admin)
```
GET    /api/orders                    → Get all orders
GET    /api/orders/details/:orderId   → Get order details
PATCH  /api/orders/status/:orderId    → Update status (creates notification!)
DELETE /api/orders/:orderId           → Delete order
```

---

## Notification Triggers

When admin updates order status:

| Status | User Gets | Message |
|--------|-----------|---------|
| Processing | 📬 Notification | "Your order is being prepared for shipment" |
| Shipped | 📬 Notification | "Your order is on its way!" |
| Delivered | 🎉 Notification | "Order successfully delivered!" |
| Cancelled | 📬 Notification | "Order cancelled, stock restored" |

---

## Useful Commands

### Start Backend
```bash
cd backend
npm start
# Listens on http://localhost:5000
```

### Start Frontend
```bash
npm run dev
# Listens on http://localhost:8080
```

### Check if Services Running
```bash
# In browser console:
fetch('http://localhost:5000/status').then(r => r.json()).then(console.log)
```

### Test API Call
```javascript
// In browser console:
const token = localStorage.getItem('token');
fetch('http://localhost:5000/api/orders/user/my-orders', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json()).then(console.log);
```

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Orders not showing | ✅ Login, check token in localStorage |
| Notifications not appearing | ✅ Refresh page, check bell icon |
| Can't update order status | ✅ Login as admin, check role in token |
| Stock not decremented | ✅ Check order was created successfully |
| Sidebar count wrong | ✅ Wait 30 seconds for auto-refresh |
| PDF not downloading | ✅ Check browser popup blocker |

---

## Token Structure

```javascript
{
  id: "userId",
  role: "user" or "admin",
  iat: 1234567890,      // issued at
  exp: 1234654290       // expires at
}
```

Stored in: `localStorage.getItem('token')`

---

## Files to Know

### Backend
- `server.js` - Main server file
- `routes/orderRoutes.js` - Order endpoints
- `routes/notificationRoutes.js` - Notification endpoints
- `controllers/orderController.js` - Order logic
- `controllers/notificationController.js` - Notification logic
- `models/Order.js` - Order schema
- `models/Notification.js` - Notification schema

### Frontend
- `pages/Checkout.tsx` - Place order
- `pages/Profile.tsx` - View orders
- `pages/MyOrders.tsx` - Order management
- `pages/admin/AdminOrders.tsx` - Admin panel
- `components/NotificationBell.tsx` - Notification UI
- `components/Navbar.tsx` - Navigation with bell

---

## Testing Workflow

```
1. User logs in → /profile/orders tab empty ✅
2. User adds items and goes to /checkout ✅
3. User fills shipping info and clicks "Place Order" ✅
4. Order appears in /profile/orders ✅
5. Admin goes to /admin/orders ✅
6. Admin finds customer order and updates status ✅
7. Notification sent to user (bell shows badge) ✅
8. User clicks bell and sees notification ✅
9. Notification message matches status update ✅
10. Sidebar order count updates ✅
```

---

**Version:** 1.0 Complete  
**Status:** ✅ Production Ready  
**Last Updated:** November 14, 2025

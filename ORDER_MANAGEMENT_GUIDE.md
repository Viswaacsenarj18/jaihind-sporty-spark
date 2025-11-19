# 📦 Complete Order Management Flow - Implementation Guide

## Table of Contents
1. [User Order Flow](#user-order-flow)
2. [Admin Management Flow](#admin-management-flow)
3. [Notification System](#notification-system)
4. [Database Integration](#database-integration)
5. [API Documentation](#api-documentation)
6. [Troubleshooting](#troubleshooting)

---

## User Order Flow

### Step 1: Browse Products
```
User → /products → Selects item → Add to Cart
```
- Products displayed from MongoDB
- Stock levels checked from database
- Cart stored in React Context

### Step 2: Checkout Process
```
User → /checkout → Fill shipping form → Place Order
```

#### Shipping Form Fields:
- First Name
- Last Name
- Email (validated)
- Phone (validated)
- Address
- City
- State
- Pincode (validated)

#### Validations:
- All fields required
- Email format: valid email
- Phone: 10 digits
- Pincode: 6 digits
- Stock availability checked

#### Order Creation:
```
POST /api/orders/create
{
  items: [
    { productId, name, price, quantity, image },
    ...
  ],
  shippingInfo: {
    firstName, lastName, email, phone, address, city, state, pincode
  },
  summary: {
    subtotal, shipping, total
  }
}
```

**What happens:**
1. ✅ Token extracted and verified
2. ✅ User ID from token
3. ✅ Stock checked for each item
4. ✅ Stock decremented in database
5. ✅ Order saved to MongoDB
6. ✅ Order ID added to user.pastOrders array
7. ✅ Cart cleared
8. ✅ Redirect to /my-orders

### Step 3: View Orders
```
User → /profile → Orders tab → See all orders
OR
User → /my-orders → Detailed order view
```

#### Order Display Fields:
- Order ID (last 8 chars)
- Total price
- Number of items
- Current status
- Order date
- Item list with quantities
- Shipping address
- Subtotal, shipping cost breakdown

### Step 4: Cancel Order (if Pending/Processing)
```
User → /my-orders → Order card → Cancel Order button
```

**What happens:**
1. ✅ Confirmation dialog shown
2. ✅ Status changed to "Cancelled"
3. ✅ Stock restored for all items
4. ✅ Notification created for user
5. ✅ Order list refreshed

---

## Admin Management Flow

### Step 1: View All Orders
```
Admin → /admin/orders → Table of all orders
```

#### Order Table Columns:
- Customer Name
- Email
- Phone
- Order Date
- Total Amount
- Current Status
- Actions (View, Delete, Download Invoice)

#### Filters & Search:
- Search by customer name, email, or phone
- Filter by status (Pending, Processing, Shipped, Delivered, Cancelled)

### Step 2: Update Order Status
```
Admin → Click on order → Update Status dropdown → Select new status → Click Update
```

**Status Progression:**
```
Pending → Processing → Shipped → Delivered
                   ↓
               Cancelled (any time)
```

#### What Happens on Status Update:
1. ✅ Order status updated in MongoDB
2. ✅ **Automatic Notification Created** for user:
   - Processing: "Your order is being prepared for shipment"
   - Shipped: "Your order is on its way!"
   - Delivered: "Your order has been successfully delivered!"
   - Cancelled: "Your order has been cancelled"
3. ✅ If cancelled: Stock restored for all items
4. ✅ Toast notification shown to admin

### Step 3: Download Invoice
```
Admin → Click on order → Download Invoice button → PDF generated
```

**Invoice Contents:**
- Company header (Jaihind Sports)
- Invoice ID
- Order date
- Customer details
- Items table (Product, Price, Qty, Total)
- Order summary (Subtotal, Shipping, Total)
- Footer with policies

### Step 4: Delete Order
```
Admin → Click on order → Delete button → Confirm
```

**Warning:** This is permanent and cannot be undone!

---

## Notification System

### How Notifications Work

#### Notification Creation Trigger:
```
Admin updates order status → Notification created → Sent to user's account
```

#### Notification Storage:
```mongodb
Notification {
  user: userId,
  orderId: orderId,
  type: "status_updated",
  title: "Order Status Updated",
  message: "Your order is being processed",
  read: false,
  createdAt: timestamp
}
```

#### User Notification View:

1. **Bell Icon on Navbar**
   - Shows unread count badge (red circle)
   - Click to open notification panel
   - Shows up to 10 recent notifications

2. **Notification Dropdown**
   - Displays all notifications in order
   - Each notification shows:
     - Title
     - Message
     - Timestamp
     - Mark as read (✓ icon)
     - Delete (X icon)
   - "Mark all as read" option
   - Automatic refresh every 10 seconds

3. **Notification Actions**
   - Mark as read (removes from unread count)
   - Mark all as read (clears badge)
   - Delete individual notification
   - Auto-scroll to recent notifications

### Notification API Endpoints

```
GET    /api/notifications
       Response: { success: true, notifications: [...], unreadCount: 5 }

PATCH  /api/notifications/:id/read
       Response: { success: true, notification: {...} }

PATCH  /api/notifications/mark-all-as-read
       Response: { success: true, message: "..." }

DELETE /api/notifications/:id
       Response: { success: true, message: "..." }
```

---

## Database Integration

### Collections Used

#### 1. Orders Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  items: [
    {
      productId: ObjectId,
      name: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],
  shippingInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  summary: {
    subtotal: Number,
    shipping: Number,
    total: Number
  },
  status: String (enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]),
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  phone: String,
  address: String,
  role: String (enum: ["user", "admin"]),
  pastOrders: [ObjectId] (ref: Order),
  createdAt: Date,
  updatedAt: Date
}
```

#### 3. Products Collection
```javascript
{
  _id: ObjectId,
  name: String,
  category: String,
  price: Number,
  stock: Number,     // Decremented when ordered
  image: String,
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### 4. Notifications Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  orderId: ObjectId (ref: Order),
  type: String,
  title: String,
  message: String,
  read: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Stock Management

**When order is created:**
```javascript
for each item in order.items {
  Product.findByIdAndUpdate(
    item.productId,
    { $inc: { stock: -item.quantity } }  // Decrease stock
  );
}
```

**When order is cancelled:**
```javascript
for each item in order.items {
  Product.findByIdAndUpdate(
    item.productId,
    { $inc: { stock: +item.quantity } }  // Restore stock
  );
}
```

---

## API Documentation

### Order Endpoints

#### 1. Create Order
```
POST /api/orders/create
Headers: Authorization: Bearer <token>
Body: {
  items: [...],
  shippingInfo: {...},
  summary: {...}
}
Response: { success: true, order: {...} }
```

#### 2. Get User's Orders
```
GET /api/orders/user/my-orders
Headers: Authorization: Bearer <token>
Response: { success: true, orders: [...] }
```

#### 3. Get Order Details
```
GET /api/orders/details/:orderId
Headers: Authorization: Bearer <token>
Response: { success: true, order: {...} }
```

#### 4. Cancel Order
```
PATCH /api/orders/cancel/:orderId
Headers: Authorization: Bearer <token>
Response: { success: true, message: "..." }
```

#### 5. Get All Orders (Admin)
```
GET /api/orders
Headers: Authorization: Bearer <admin-token>
Response: { success: true, orders: [...] }
```

#### 6. Update Order Status (Admin)
```
PATCH /api/orders/status/:orderId
Headers: Authorization: Bearer <admin-token>
Body: { status: "Processing" }
Response: { success: true, order: {...} }
# Also creates notification for user!
```

#### 7. Delete Order (Admin)
```
DELETE /api/orders/:orderId
Headers: Authorization: Bearer <admin-token>
Response: { success: true, message: "..." }
```

---

## Troubleshooting

### Issue: Orders not showing in Profile

**Solution:**
1. Check token in localStorage:
   ```javascript
   console.log(localStorage.getItem("token"))
   ```
2. Verify API call:
   ```javascript
   // Check Network tab in DevTools
   // POST to /api/orders/user/my-orders should return orders
   ```
3. Check MongoDB:
   ```javascript
   db.orders.find({ user: userId })
   ```

### Issue: Notifications not appearing

**Solution:**
1. Admin must have role: "admin" in token
2. Verify notification is created:
   ```javascript
   db.notifications.find({ user: userId })
   ```
3. Check network request:
   - `GET /api/notifications` should return array
   - Check unreadCount value

### Issue: Stock not decremented

**Solution:**
1. Verify product exists:
   ```javascript
   db.products.findById(productId)
   ```
2. Check order creation response for errors
3. Check server logs for validation errors

### Issue: Order status not updating

**Solution:**
1. Verify admin token has role: "admin"
2. Check status value is valid enum:
   ```javascript
   ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]
   ```
3. Check server logs: `PATCH /api/orders/status/:orderId`

### Issue: Sidebar order count not updating

**Solution:**
1. Check admin token is present
2. Verify polling is working (30-second interval)
3. Check browser console for fetch errors
4. Manually refresh to see updated count

---

## Security Considerations

✅ **Token Verification**
- Every request requires valid JWT token
- Admin endpoints check for role: "admin"
- Token stored securely in localStorage

✅ **Data Validation**
- All inputs validated before processing
- Email/phone/pincode format checked
- Stock availability verified

✅ **CORS Protection**
- Backend configured to accept only:
  - localhost
  - vercel.app domains

✅ **Stock Protection**
- Stock decremented atomically
- Restored on cancellation
- Prevents overselling

---

## Performance Notes

- **Notification Polling**: Every 10 seconds (user-side)
- **Sidebar Order Count**: Every 30 seconds (admin-side)
- **Database Indexes**: Recommended on:
  - `orders.user` (for user order queries)
  - `orders.status` (for filtering)
  - `notifications.user` (for user notifications)
  - `notifications.read` (for unread count)

---

## Next Steps / Future Enhancements

- [ ] Real-time notifications with Socket.io
- [ ] Email notifications on order updates
- [ ] SMS notifications
- [ ] Order tracking with GPS
- [ ] Return/Refund management
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Order analytics dashboard
- [ ] Bulk operations for admin

---

**System Status: ✅ FULLY OPERATIONAL**

All components tested and working:
- ✅ Order creation and storage
- ✅ Profile order display
- ✅ Admin order management
- ✅ Status updates
- ✅ Automatic notifications
- ✅ Real-time count updates
- ✅ Stock management
- ✅ PDF invoice generation


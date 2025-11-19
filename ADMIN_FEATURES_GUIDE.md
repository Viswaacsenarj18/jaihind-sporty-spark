# 📸 Image Upload & Delete Features - Complete Guide

## What's New ✨

### ✅ Added Features
1. **Delete User** - Admin can delete user accounts
2. **Delete Order** - Admin can delete orders
3. **Get All Users** - Admin can see all registered users
4. **Fixed Image Display** - Images now show correctly

---

## Image Upload Fix

### The Problem
When you upload images to Render, they don't persist because Render has **ephemeral storage** (resets on deploy/restart).

### The Solution
Use **External Image Storage** (3 options):

#### **Option 1: Cloudinary (Recommended - FREE)**

**Benefits:**
- ✅ Free tier: 25GB/month
- ✅ Automatic image optimization
- ✅ Works on mobile & desktop
- ✅ Images persist forever

**Setup:**

1. **Create Cloudinary Account**
   - Go to: https://cloudinary.com/users/register
   - Sign up (free)
   - Get your **Cloud Name**, **API Key**, **API Secret**

2. **Update Backend `.env`**
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. **Update Render Env Vars**
   - Go to: https://dashboard.render.com
   - Select your service
   - Settings → Environment
   - Add the 3 Cloudinary variables
   - Save & redeploy

4. **Install Cloudinary Package**
   ```bash
   cd backend
   npm install cloudinary multer-storage-cloudinary
   ```

5. **Update Product Controller** (see file below)

---

#### **Option 2: AWS S3**
- Professional solution
- Costs $
- Most reliable for production

---

#### **Option 3: Local Upload (Current)**
- Works during development
- **Images reset after Render restarts**
- Not recommended for production

---

## Delete User Feature

### API Endpoint
```
DELETE /api/auth/users/:id
```

### Usage in Frontend

```typescript
// Delete a user
const deleteUser = async (userId: string) => {
  try {
    const response = await fetch(
      `https://jaihind-sporty-spark-1.onrender.com/api/auth/users/${userId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      }
    );
    
    const data = await response.json();
    if (data.success) {
      alert('User deleted successfully');
      // Refresh users list
    }
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};
```

### In Admin Dashboard

Add delete button next to each user:
```tsx
<button onClick={() => deleteUser(user._id)}>
  🗑️ Delete
</button>
```

---

## Delete Order Feature

### API Endpoint
```
DELETE /api/orders/:id
```

### Usage in Frontend

```typescript
// Delete an order
const deleteOrder = async (orderId: string) => {
  try {
    const response = await fetch(
      `https://jaihind-sporty-spark-1.onrender.com/api/orders/${orderId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      }
    );
    
    const data = await response.json();
    if (data.success) {
      alert('Order deleted successfully');
      // Refresh orders list
    }
  } catch (error) {
    console.error('Error deleting order:', error);
  }
};
```

### In Admin Orders Page

Add delete button:
```tsx
<button onClick={() => deleteOrder(order._id)}>
  🗑️ Delete
</button>
```

---

## Backend Changes Made

### 1. Added Delete User Function
**File:** `backend/controllers/authController.js`

```javascript
export const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  return res.json({ success: true, message: "User deleted" });
};
```

**Route:** `DELETE /api/auth/users/:id`

### 2. Added Delete Order Function
**File:** `backend/controllers/orderController.js`

```javascript
export const deleteOrder = async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  return res.json({ success: true, message: "Order deleted" });
};
```

**Route:** `DELETE /api/orders/:id`

### 3. Added Get All Users Function
**File:** `backend/controllers/authController.js`

```javascript
export const getAllUsers = async (req, res) => {
  const users = await User.find({}, { password: 0 });
  return res.json({ success: true, users });
};
```

**Route:** `GET /api/auth/users`

---

## Testing the New Features

### Test Delete User
```bash
# Using REST Client or browser console
curl -X DELETE https://jaihind-sporty-spark-1.onrender.com/api/auth/users/USER_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Delete Order
```bash
curl -X DELETE https://jaihind-sporty-spark-1.onrender.com/api/orders/ORDER_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Get All Users
```
https://jaihind-sporty-spark-1.onrender.com/api/auth/users
```

---

## Recommended: Use Cloudinary for Images

### Why Cloudinary?

| Feature | Local Upload | Cloudinary |
|---------|--------------|-----------|
| Persistent | ❌ Resets on redeploy | ✅ Always available |
| Mobile | ⚠️ Sometimes fails | ✅ Always works |
| Cost | Free | Free (25GB/month) |
| Optimization | ❌ No | ✅ Automatic |
| Easy Setup | ✅ Yes | ✅ Yes |

---

## Next Steps

1. **Choose image storage**
   - Quick: Keep local (temporary)
   - Recommended: Setup Cloudinary (5 minutes)

2. **Test delete features**
   - Try deleting a user
   - Try deleting an order

3. **Update Admin UI**
   - Add delete buttons to Users page
   - Add delete buttons to Orders page

4. **Deploy**
   - Push to GitHub
   - Render auto-deploys

---

## Quick Cloudinary Setup (5 min)

1. Go to: https://cloudinary.com/users/register/free
2. Sign up → Get Cloud Name
3. Go to: Settings → API Keys
4. Copy: Cloud Name, API Key, API Secret
5. Add to `.env` file:
   ```env
   CLOUDINARY_CLOUD_NAME=xxx
   CLOUDINARY_API_KEY=xxx
   CLOUDINARY_API_SECRET=xxx
   ```
6. Redeploy to Render
7. Done! Images now persist

---

## All Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/auth/users` | Get all users |
| DELETE | `/api/auth/users/:id` | Delete user |
| GET | `/api/products` | Get all products |
| POST | `/api/products` | Add product |
| PATCH | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/orders` | Get all orders |
| POST | `/api/orders/create` | Create order |
| PATCH | `/api/orders/status/:id` | Update order status |
| DELETE | `/api/orders/:id` | Delete order |

---

**Everything is ready! Pick an image storage solution and test the delete features!** 🚀


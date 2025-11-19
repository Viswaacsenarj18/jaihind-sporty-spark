# 🖥️ Localhost Development Guide - Full Setup

## ✅ What's Fixed

Frontend now automatically detects localhost and connects to `http://localhost:5000`!

**No more CORS errors!** ✅

---

## 🚀 Quick Start (2 terminals)

### Terminal 1: Backend

```bash
cd backend
npm run dev
```

**Expected Output:**
```
✅ Server running on port: 5000
✅ MongoDB Connected
```

### Terminal 2: Frontend

```bash
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

---

## ✅ Open in Browser

### Homepage
```
http://localhost:5173
```

You should see:
- ✅ Products loading (from localhost:5000)
- ✅ No CORS errors
- ✅ Images displaying
- ✅ Everything working!

---

## 🔧 How It Works

### Smart Environment Detection

**Frontend:** `src/config/api.ts`

```typescript
const isLocalhost = window.location.hostname === "localhost" || 
                    window.location.hostname === "127.0.0.1";

export const API_BASE_URL = isLocalhost
  ? "http://localhost:5000"           // Local development
  : "https://jaihind-sporty-spark-1.onrender.com";  // Production
```

✅ **Automatically detects where it's running and uses correct backend!**

### CORS Allows Everything Locally

**Backend:** `backend/server.js`

```javascript
const corsOptions = {
  origin: function (origin, callback) {
    // Allow:
    // ✅ localhost:5173 (frontend)
    // ✅ localhost:3000 (alternative port)
    // ✅ 127.0.0.1 (localhost IP)
    // ✅ Any localhost variant
    // ❌ Random URLs (blocked for security)
    
    if (!origin || origin.includes("localhost") || origin.includes("127.0.0.1")) {
      callback(null, true);
    }
  }
};
```

---

## 📋 Complete Localhost Testing Checklist

### Homepage
- [ ] Page loads
- [ ] Products display
- [ ] "Add to Cart" works
- [ ] Images show
- [ ] No CORS errors

### Product Detail
- [ ] Click product → page loads
- [ ] Product info shows
- [ ] Image displays
- [ ] Add to cart button works
- [ ] Related products show

### Shopping Cart
- [ ] Items in cart display
- [ ] Can increase/decrease quantity
- [ ] Total price updates
- [ ] Checkout button works

### User Login
```
http://localhost:5173/login

Email: any@email.com
Password: any123
```

- [ ] Click "Signup" link
- [ ] Register new user
- [ ] Login with new account
- [ ] Redirects to homepage

### Admin Login
```
http://localhost:5173/login

Email: admin@jaihind-sports.com
Password: admin123
```

- [ ] Admin recognized (blue button)
- [ ] Redirects to /admin/dashboard
- [ ] Dashboard loads
- [ ] Products page works
- [ ] Orders page works

### Admin Features
- [ ] Add new product
- [ ] Upload product image
- [ ] Edit product
- [ ] Delete product
- [ ] View orders
- [ ] Download PDF invoice
- [ ] Delete order
- [ ] Delete user

### All Pages
- [ ] Categories page
- [ ] About Us page
- [ ] Contact Us page
- [ ] Wishlist page
- [ ] Footer links work

---

## 🐛 Troubleshooting

### "CORS error: Missing Access-Control-Allow-Origin"

**Solution:**
1. Make sure backend is running on `localhost:5000`
   ```bash
   cd backend
   npm run dev
   ```

2. Restart frontend (Ctrl+C, then `npm run dev`)

3. Clear browser cache (Ctrl+Shift+Delete)

4. Refresh page (F5)

### "Cannot connect to MongoDB"

**Solution:**
1. Check `.env` file has `MONGODB_URI`
2. Verify MongoDB Atlas cluster is online
3. Check username/password is correct
4. Look for "MongoDB Connected" in backend logs

### "Products not showing"

**Solution:**
1. Check console (F12) for CORS errors
2. Verify backend is running (`localhost:5000`)
3. Try: `http://localhost:5000/api/products` in browser
4. Should show JSON array of products

### "Admin login not working"

**Solution:**
1. Did you run `npm run create-admin`?
   ```bash
   cd backend
   npm run create-admin
   ```

2. Try credentials:
   ```
   Email: admin@jaihind-sports.com
   Password: admin123
   ```

3. Check browser console (F12) for errors

---

## 📝 Environment Variables Needed

### `.env` (Frontend - optional)
```env
# Uses localhost by default
# No env vars needed - auto detects!
```

### `backend/.env` (Required)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jaihind-sports
JWT_SECRET=your_secret_key_123
PORT=5000
NODE_ENV=development
```

---

## 🔄 Workflow

### Making Changes

**Frontend Code:**
```bash
# Edit files in src/
# Vite auto-reloads!
# Just refresh browser (F5)
```

**Backend Code:**
```bash
# Edit files in backend/
# nodemon auto-restarts!
# Just refresh browser (F5)
```

### Testing Workflow

1. Make changes
2. Files auto-reload
3. Refresh browser (F5)
4. Test feature
5. Check console for errors
6. Fix and repeat

---

## 🎨 Ports Reference

| Service | Port | URL |
|---------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Backend | 5000 | http://localhost:5000 |
| Database | N/A | MongoDB Atlas (cloud) |

---

## 📱 Testing on Mobile (Local Network)

Want to test on your phone while developing?

### Step 1: Get Your Laptop IP

**Windows:**
```powershell
ipconfig
```

Look for: `IPv4 Address` like `192.168.1.100`

**Mac/Linux:**
```bash
ifconfig
```

### Step 2: Update Frontend Config (Optional)

**File:** `src/config/api.ts`

```typescript
// For testing on mobile with local backend
export const API_BASE_URL = "http://192.168.1.100:5000";
// Replace 192.168.1.100 with YOUR IP
```

### Step 3: Access on Mobile

On mobile phone, go to:
```
http://192.168.1.100:5173
```

Replace `192.168.1.100` with your actual IP.

✅ Now test on mobile while running locally!

---

## ✅ Everything Ready!

### What Works Now:

✅ Frontend auto-detects localhost  
✅ CORS allows all localhost variants  
✅ Backend on localhost:5000  
✅ Frontend on localhost:5173  
✅ MongoDB Atlas connected  
✅ Admin login works  
✅ All features working locally  

### Next Steps:

1. **Start Backend:**
   ```bash
   cd backend && npm run dev
   ```

2. **Start Frontend:** (new terminal)
   ```bash
   npm run dev
   ```

3. **Open Browser:**
   ```
   http://localhost:5173
   ```

4. **Test Everything!** 🎉

---

**You're all set for local development!** 🚀


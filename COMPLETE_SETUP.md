# 📱💻 Mobile + Laptop Complete Setup Guide

## Table of Contents
1. [Quick Start](#quick-start)
2. [Desktop Setup](#desktop-setup)
3. [Mobile Setup](#mobile-setup)
4. [Admin Login](#admin-login)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

---

## Quick Start

### ⚡ TL;DR (30 seconds)

```bash
# 1. Backend folder - create admin
cd backend && npm run create-admin

# 2. Open browser
# Desktop: http://localhost:5173
# Mobile: https://jaihind-sporty-spark.vercel.app

# 3. Login
# Email: admin@jaihind-sports.com
# Password: admin123
```

**Done!** ✅

---

## Desktop Setup

### Prerequisites
- Node.js v18+ installed
- Git installed
- Code editor (VS Code recommended)

### Step 1: Clone Repository

```bash
git clone https://github.com/Viswaacsenarj18/jaihind-sporty-spark.git
cd jaihind-sporty-spark
```

### Step 2: Frontend Setup

```bash
# Install dependencies
npm install

# Create .env file (optional, uses defaults)
# Just press Enter when prompted

# Start development server
npm run dev
```

**Output:**
```
  VITE v5.x.x  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

✅ **Frontend running** on http://localhost:5173

### Step 3: Backend Setup (New Terminal)

```bash
# Go to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
```

Create file: `backend/.env`
```env
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/jaihind-sports
JWT_SECRET=your_secret_key_123
PORT=5000
NODE_ENV=development
```

**Get MongoDB URI:**
1. Visit https://mongodb.com/cloud/atlas
2. Sign up (free)
3. Create cluster → Shared tier (free)
4. Click "Connect" → "Drivers"
5. Copy connection string
6. Replace `<username>` and `<password>`

**Start Backend:**
```bash
npm run dev
```

**Output:**
```
Server running on port 5000
✅ MongoDB Connected
```

✅ **Backend running** on http://localhost:5000

### Step 4: Create Admin Account

```bash
# Still in backend folder
npm run create-admin
```

**Output:**
```
✅ MongoDB Connected
✅ Default admin account created successfully:
Email: admin@jaihind-sports.com
Password (use this to login): admin123
```

✅ **Admin account created**

---

## Mobile Setup

### Method 1: Testing on Mobile (Easiest)

Just open in mobile browser:
```
https://jaihind-sporty-spark.vercel.app
```

✅ Everything works! No setup needed.

### Method 2: Local Development on Mobile

If you want to test with local backend:

**Step 1: Get Your Laptop's IP**

**Windows (PowerShell):**
```powershell
ipconfig
```

Look for line like:
```
IPv4 Address . . . . . . . . . . . . : 192.168.1.100
```

**Mac/Linux:**
```bash
ifconfig
```

Look for `inet` address like `192.168.1.100`

**Step 2: Update Frontend Config**

File: `src/config/api.ts`

```typescript
// For mobile testing with local backend:
export const API_BASE_URL = "http://192.168.1.100:5000";
// Replace 192.168.1.100 with YOUR IP from Step 1
```

**Step 3: Restart Frontend**

```bash
# Stop current frontend (Ctrl+C)
# Then restart
npm run dev
```

**Step 4: Open on Mobile**

In mobile browser, go to:
```
http://192.168.1.100:5173
```

Replace `192.168.1.100` with your actual IP.

✅ Mobile connected to local backend!

### Method 3: PWA Install (App Icon on Home Screen)

**iPhone (Safari):**
1. Open https://jaihind-sporty-spark.vercel.app
2. Tap Share (box with arrow)
3. Scroll down → "Add to Home Screen"
4. Tap "Add"
5. App now on home screen!

**Android (Chrome):**
1. Open https://jaihind-sporty-spark.vercel.app
2. Tap ⋮ (three dots)
3. Tap "Install app"
4. Tap "Install"
5. App now on home screen!

✅ App icon on mobile home screen!

---

## Admin Login

### Desktop

**URL:** `http://localhost:5173/login`

```
Email:    admin@jaihind-sports.com
Password: admin123
```

Click "Login" → You're admin! ✅

### Mobile

**URL:** `https://jaihind-sporty-spark.vercel.app/login`

```
Email:    admin@jaihind-sports.com
Password: admin123
```

Click "Login" → You're admin! ✅

### What Happens Behind Scenes

```
1. Email detected (ends with @jaihind-sports.com)
         ↓
2. Treated as ADMIN (not user)
         ↓
3. POST request to: /api/admin/login
         ↓
4. Backend checks MongoDB for matching email & password
         ↓
5. Password verified with bcrypt
         ↓
6. JWT token created and returned
         ↓
7. Token saved in browser localStorage
         ↓
8. Redirect to /admin dashboard
         ↓
9. All admin requests include token automatically
```

---

## Admin Features (After Login)

### 📊 Dashboard
- View total products, users, orders
- See sales statistics
- Monitor active sessions

### 📦 Products
- **View:** All products with prices
- **Add:** New product with image upload
- **Edit:** Update product details
- **Delete:** Remove product from store

### 📋 Orders
- **View:** All customer orders
- **Status:** Change order status (Pending → Completed)
- **Details:** See customer info, items, totals
- **Invoice:** Download PDF invoice (with rupee symbols ₹)

### 👥 Users
- View all registered users
- See user profiles

### ⚙️ Settings
- Logout
- Change profile

---

## Testing Checklist

### ✅ Desktop (Local Development)

- [ ] Backend runs on `localhost:5000`
- [ ] Frontend runs on `localhost:5173`
- [ ] Homepage loads (shows products)
- [ ] Products page displays all products with images
- [ ] Product detail page works
- [ ] Can add products to cart
- [ ] Cart shows correct items and total
- [ ] Checkout process works
- [ ] Can place order
- [ ] Login page works
- [ ] Admin login with `admin@jaihind-sports.com` works
- [ ] Admin dashboard loads
- [ ] Can add new product as admin
- [ ] Can upload product image
- [ ] Can edit product
- [ ] Can delete product
- [ ] Orders page shows orders
- [ ] Can download PDF invoice
- [ ] Rupee symbol (₹) displays correctly everywhere
- [ ] No console errors (press F12)

### ✅ Mobile (Production)

- [ ] Opens: https://jaihind-sporty-spark.vercel.app
- [ ] Products load and display nicely
- [ ] Images load properly
- [ ] Responsive design looks good
- [ ] Can scroll without issues
- [ ] Product detail page works
- [ ] Add to cart works
- [ ] Cart page displays correctly
- [ ] Can checkout
- [ ] Login page is responsive
- [ ] Can login as admin
- [ ] Admin dashboard is usable on mobile
- [ ] All buttons are clickable
- [ ] PDF download works
- [ ] No layout breaks

### ✅ Both (Desktop + Mobile)

- [ ] All API calls go to: https://jaihind-sporty-spark-1.onrender.com
- [ ] No localhost errors in console
- [ ] No CORS errors
- [ ] Token persists after page refresh
- [ ] Can logout and login again
- [ ] Images load from API correctly

---

## Troubleshooting

### "Command not found: npm run create-admin"

**Solution:**
```bash
# Go to backend folder first
cd backend

# Then run
npm run create-admin
```

### "Cannot connect to MongoDB"

**Solution:**
1. Check `.env` file in backend
2. Verify MONGODB_URI is correct
3. Make sure database user password has no special chars (or escape them)
4. Test connection in MongoDB Atlas dashboard

### "Admin login returns 401"

**Solution:**
```bash
# Create admin account
cd backend
npm run create-admin

# Then login with:
# admin@jaihind-sports.com / admin123
```

### "Frontend can't reach backend"

**Solution (Desktop):**
- Check if backend is running on `localhost:5000`
- Run: `npm run dev` in backend folder

**Solution (Mobile with local backend):**
- Update `src/config/api.ts` with your IP
- Make sure laptop and phone are on same WiFi
- Restart frontend

### "Images not loading"

**Solution:**
1. Check `src/config/api.ts` - should use Render URL for production
2. Products must have image URL starting with `http://` or `/uploads/`
3. Check backend uploads folder exists

### "PDF download doesn't work"

**Solution:**
- Check browser console (F12) for errors
- Browser might be blocking popup
- Try different browser
- Verify backend is accessible

### "Mobile app slow"

**Solution:**
1. Close other apps
2. Refresh page
3. Clear browser cache (Settings → Clear browsing data)
4. Use WiFi instead of 4G
5. Try different browser

---

## Production Deployment

### Frontend (Vercel)

Already deployed! Just push to GitHub:

```bash
git add -A
git commit -m "Your changes"
git push origin main
```

Vercel auto-deploys to: https://jaihind-sporty-spark.vercel.app

### Backend (Render)

Already deployed! Render auto-deploys when you push to GitHub.

Backend at: https://jaihind-sporty-spark-1.onrender.com

### Database (MongoDB Atlas)

Already connected! No changes needed.

---

## Useful Commands Reference

### Frontend

```bash
npm run dev      # Start development
npm run build    # Build for production  
npm run preview  # Preview production build
```

### Backend

```bash
npm run dev           # Start with auto-reload
npm run start         # Start normally
npm run create-admin  # Create admin user
```

### Git

```bash
git status              # Check changes
git add -A              # Stage all files
git commit -m "msg"     # Commit changes
git push origin main    # Deploy to GitHub (auto-deploys)
git pull                # Get latest changes
```

---

## Environment Variables

### Backend `.env`

```env
# MongoDB connection
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/jaihind-sports

# JWT secret (change to something unique)
JWT_SECRET=your_super_secret_key_change_this

# Server port
PORT=5000

# Environment
NODE_ENV=development
```

### Frontend (auto-handled)

All configured in `src/config/api.ts`
- Points to Render backend for production
- Points to localhost for development

---

## Support URLs

| Item | URL |
|------|-----|
| **Frontend (Production)** | https://jaihind-sporty-spark.vercel.app |
| **Backend (Production)** | https://jaihind-sporty-spark-1.onrender.com |
| **GitHub Repository** | https://github.com/Viswaacsenarj18/jaihind-sporty-spark |
| **MongoDB Atlas** | https://mongodb.com/cloud/atlas |

---

## You're All Set! 🎉

Your Jaihind Sports project is:
- ✅ Set up on laptop
- ✅ Running on mobile
- ✅ Admin login working
- ✅ Deployed to production
- ✅ Ready to use!

**Happy coding! 🚀**


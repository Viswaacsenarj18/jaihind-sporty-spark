# Complete Setup Guide - Admin Login & Full Project Setup

## 🎯 Quick Start - Admin Login

### Step 1: Create Admin Account (One-time setup)

Your backend needs an admin user in the database. Run this command:

**On your laptop (in backend folder):**
```powershell
cd backend
npm run create-admin
```

Or if that doesn't work:
```powershell
node scripts/CreateDefaultAdmin.js
```

**Expected Output:**
```
✅ MongoDB Connected
✅ Default admin account created successfully:
Email: admin@jaihind-sports.com
Password (use this to login): admin123
```

### Step 2: Login to Admin Dashboard

**URL:** https://jaihind-sporty-spark.vercel.app/login

**Admin Credentials:**
```
Email: admin@jaihind-sports.com
Password: admin123
```

**What happens:**
1. Page detects `@jaihind-sports.com` email → Routes to admin login
2. Sends credentials to backend: `https://jaihind-sporty-spark-1.onrender.com/api/admin/login`
3. Backend verifies and returns JWT token
4. Token saved in localStorage
5. Redirected to admin dashboard

---

## 🔧 Complete Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Vercel)                         │
│          https://jaihind-sporty-spark.vercel.app            │
│                                                              │
│  - React + TypeScript                                       │
│  - All API calls go to: https://jaihind-sporty-spark-1...   │
│  - Configured in: src/config/api.ts                         │
└─────────────────────────────────────────────────────────────┘
                            ↕ (API Calls)
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Render)                          │
│        https://jaihind-sporty-spark-1.onrender.com          │
│                                                              │
│  - Node.js + Express                                        │
│  - Routes: /api/auth, /api/admin, /api/products, /api/orders│
│  - Database: MongoDB Atlas                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 Mobile Setup (iPhone/Android)

### Method 1: Direct URL (Recommended for Testing)
Simply open in mobile browser:
```
https://jaihind-sporty-spark.vercel.app
```

### Method 2: Add to Home Screen (PWA)
1. Open URL in mobile browser
2. Tap menu (⋯ or Share)
3. Select "Add to Home Screen" / "Install App"
4. Tap the new app icon

### Method 3: Development on Mobile
If developing on mobile with local backend:

**Step 1:** Find your laptop's IP address
```powershell
# Windows - Run in PowerShell:
ipconfig

# Look for "IPv4 Address" like: 192.168.x.x
```

**Step 2:** Edit frontend config for mobile
Edit `src/config/api.ts`:
```typescript
// For mobile testing with local backend:
export const API_BASE_URL = "http://192.168.x.x:5000"; // Replace x.x with your IP
```

**Step 3:** Restart dev server and open on mobile:
```
http://192.168.x.x:3000
```

---

## 💻 Laptop Setup - Full Development

### Prerequisites
```
✅ Node.js (v18+)
✅ Git
✅ MongoDB Atlas account (free tier available)
```

### Part 1: Frontend Setup

```powershell
# Clone if not already done
git clone https://github.com/Viswaacsenarj18/jaihind-sporty-spark.git
cd jaihind-sporty-spark

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend runs on:** `http://localhost:5173` (or similar)

### Part 2: Backend Setup

```powershell
# In a new terminal, go to backend folder
cd backend

# Install dependencies
npm install

# Create .env file with these values:
```

Create `backend/.env`:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
PORT=5000
```

**Get MongoDB URI:**
1. Go to https://mongodb.com/cloud/atlas
2. Create free cluster
3. Click "Connect" → "Drivers"
4. Copy connection string
5. Replace `<password>` and `<username>` with your credentials

**Start backend:**
```powershell
npm run dev
# or
node server.js
```

**Backend runs on:** `http://localhost:5000`

### Part 3: Create Admin Account

```powershell
# In backend folder
npm run create-admin
```

Or manually:
```powershell
# backend folder
node scripts/CreateDefaultAdmin.js
```

---

## 🔑 Admin Login Flow - Step by Step

### Desktop (Laptop)
1. **Frontend:** Open http://localhost:5173
2. **Click:** Login link
3. **Enter:**
   - Email: `admin@jaihind-sports.com`
   - Password: `admin123`
4. **Frontend:** Sends POST to `http://localhost:5000/api/admin/login`
5. **Backend:** Verifies credentials in MongoDB
6. **Response:** Returns JWT token
7. **Frontend:** Saves token in localStorage
8. **Redirect:** Goes to `/admin` dashboard

### Mobile (Same Production URLs)
1. **Mobile Browser:** Open https://jaihind-sporty-spark.vercel.app
2. **Click:** Login link
3. **Enter:**
   - Email: `admin@jaihind-sports.com`
   - Password: `admin123`
4. **Frontend (Vercel):** Sends POST to `https://jaihind-sporty-spark-1.onrender.com/api/admin/login`
5. **Backend (Render):** Verifies in MongoDB
6. **Response:** Returns JWT token
7. **Mobile Browser:** Saves token in localStorage
8. **Redirect:** Goes to admin dashboard

---

## 🛠️ Configuration Files Explained

### 1. Frontend Config: `src/config/api.ts`
```typescript
// This controls which backend is used
export const API_BASE_URL = "https://jaihind-sporty-spark-1.onrender.com";

// To use local backend instead:
// export const API_BASE_URL = "http://localhost:5000";

// For mobile with local backend:
// export const API_BASE_URL = "http://192.168.x.x:5000";
```

**When to change:**
- **Production:** `https://jaihind-sporty-spark-1.onrender.com`
- **Local development:** `http://localhost:5000`
- **Mobile + local backend:** `http://YOUR_IP:5000`

### 2. Backend Config: `backend/.env`
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/jaihind-sports
JWT_SECRET=your_super_secret_key
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

### 3. Deployment Configs

**Vercel (Frontend):** `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "framework": "vite"
}
```

**Render (Backend):** Environment variables in dashboard
```
MONGODB_URI=your_uri
JWT_SECRET=your_secret
```

---

## 🧪 Testing Checklist

### ✅ Local Development (Laptop)
- [ ] Backend running on `localhost:5000`
- [ ] Frontend running on `localhost:5173`
- [ ] Admin account created
- [ ] Can login with `admin@jaihind-sports.com` / `admin123`
- [ ] Products load on product page
- [ ] Can create/edit/delete products in admin dashboard
- [ ] Can place orders
- [ ] Can download PDF invoice
- [ ] Rupee symbol (₹) displays correctly

### ✅ Production (Vercel + Render)
- [ ] Open https://jaihind-sporty-spark.vercel.app
- [ ] Products load from Render backend
- [ ] Can login as admin
- [ ] Admin dashboard works
- [ ] Can download PDF invoice
- [ ] Works on mobile (iPhone/Android)

### ✅ Mobile Testing
- [ ] Open app in mobile browser
- [ ] All pages load
- [ ] Login works
- [ ] Products display correctly
- [ ] Admin features work
- [ ] Responsive design looks good

---

## 🐛 Troubleshooting

### Problem: "Cannot login - 401 error"
**Solution:**
```powershell
# Make sure admin exists in database
cd backend
npm run create-admin
```

### Problem: "API calls going to localhost"
**Solution:** Check `src/config/api.ts`
```typescript
// Should be:
export const API_BASE_URL = "https://jaihind-sporty-spark-1.onrender.com";

// NOT:
// export const API_BASE_URL = "http://localhost:5000";
```

### Problem: "Products not loading on mobile"
**Solution:** 
1. Open DevTools (F12) on desktop
2. Check Network tab
3. See if API calls are successful
4. Verify CORS is enabled in backend

### Problem: "PDF download doesn't work"
**Solution:**
- Rupee symbol uses `\u20B9` encoding (already fixed)
- System font supports it
- Check browser console for errors

### Problem: "Mobile shows 404 on login"
**Solution:**
- This is a routing issue
- Make sure React Router has `/login` route
- Check that route is correctly configured in `src/App.tsx`

---

## 📊 Current Deployment Status

| Component | URL | Status |
|-----------|-----|--------|
| **Frontend** | https://jaihind-sporty-spark.vercel.app | ✅ Live |
| **Backend API** | https://jaihind-sporty-spark-1.onrender.com | ✅ Live |
| **Database** | MongoDB Atlas | ✅ Connected |

---

## 🔄 Workflow - Development to Production

### For Development (Laptop)
```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
npm run dev

# Access at: http://localhost:5173
```

### For Production Deployment
```powershell
# Push to GitHub (auto-deploys to Vercel + Render)
git add -A
git commit -m "Your message"
git push origin main

# Then:
# ✅ Vercel auto-builds & deploys frontend
# ✅ Render auto-builds & deploys backend
# ✅ Available at: https://jaihind-sporty-spark.vercel.app
```

---

## 📱 Mobile Browser Support

| Browser | iOS | Android |
|---------|-----|---------|
| **Chrome** | ✅ | ✅ |
| **Safari** | ✅ | - |
| **Firefox** | ✅ | ✅ |
| **Samsung Internet** | - | ✅ |

---

## 🎓 Key Points

1. **Admin email must end with `@jaihind-sports.com`** for auto-detection
   - If you change this, update `src/pages/Login.tsx`
   
2. **API_BASE_URL in `src/config/api.ts` controls all API calls**
   - Change this to switch backends
   
3. **Admin account must exist in MongoDB**
   - Run `npm run create-admin` in backend folder
   
4. **JWT token stored in localStorage**
   - Automatically added to all authenticated requests
   
5. **CORS must be enabled** for cross-origin requests
   - Already configured in backend

---

## 🚀 Quick Commands Reference

```powershell
# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Backend
npm run dev          # Start with nodemon
npm run create-admin # Create admin account
npm start            # Start normally

# Git
git status           # Check changes
git add -A           # Stage all
git commit -m "msg"  # Commit
git push origin main # Deploy
```

---

## 📞 Support

If something doesn't work:

1. **Check console errors** (F12 → Console tab)
2. **Check Network tab** (F12 → Network) - see API calls
3. **Check backend logs** - Render dashboard
4. **Check MongoDB** - See if admin exists
5. **Read TROUBLESHOOTING.md** - Detailed guide

---

**You're all set! 🎉 Your project is ready for mobile and laptop!**


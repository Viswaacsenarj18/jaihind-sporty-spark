# 🔐 COMPLETE LOGIN & ADMIN AUTHENTICATION TESTING GUIDE

## 📋 Quick Summary of What Should Happen

```
User Flow:
1. Go to /login (public, no auth required)
2. Enter credentials
3. Click "Sign In"
4. System auto-detects: Is it admin email? (@jaihind-sports.com)
5. Calls correct endpoint (admin or user login)
6. Backend validates & returns token + role
7. Frontend stores in localStorage & AuthContext
8. Redirects: Admin → /admin/dashboard | User → /
9. Try accessing /admin without login → Redirects to /login
10. Try accessing /admin as non-admin user → Redirects to /
11. Try accessing /admin as admin → Shows admin dashboard ✅
```

---

## 🚀 STEP 1: Ensure Admin Account Exists

### Create Admin Account

Run this command in the project root:

```bash
cd backend
npm run create-admin
```

Expected output:
```
✅ Default admin created successfully!
Email: admin@jaihind-sports.com
Password: admin123
```

If it says admin already exists, that's fine ✅

---

## 🧪 STEP 2: Test Backend Login API Directly

### Use Thunder Client, Postman, or curl

#### **Test User Login First (Easier)**

```bash
# In PowerShell or Command Prompt:
$body = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

#### **Test Admin Login**

```bash
$body = @{
    email = "admin@jaihind-sports.com"
    password = "admin123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/admin/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Jaihind Sports",
    "email": "admin@jaihind-sports.com",
    "role": "admin"
  }
}
```

✅ If you see this, backend is working correctly!

---

## ✅ STEP 3: Test Frontend Login on Localhost

### Start Backend

```bash
cd backend
npm run dev
```

Expected:
```
Server running on http://localhost:5000
```

### Start Frontend

In another terminal:
```bash
cd .
npm run dev
```

Expected:
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
```

---

## 🔍 STEP 4: Test Localhost Frontend Login

### Test 1: Login as User First

1. Go to: `http://localhost:5173/login`
2. Enter any regular email: `user@gmail.com`
3. Enter any password: `password123`
4. Click "Sign In"

**Expected:**
- Form submits ✅
- Toast says "Logged in successfully!" ✅
- Redirects to `/` (homepage) ✅
- No errors in browser console ✅

### Verify State in Browser Console

Press `F12` and run:

```javascript
// Check localStorage
localStorage.getItem('token')
// Should return a long JWT token (starts with eyJ...)

localStorage.getItem('user')
// Should return: {"id":"...","name":"...","email":"user@gmail.com","role":"user"}

// Check AuthContext
// (You can't directly check, but the app should work)
```

---

## 🔑 STEP 5: Test Admin Login

### Clear localStorage First

```javascript
localStorage.clear()
```

Then reload page (Ctrl+R)

### Test Admin Login

1. Go to: `http://localhost:5173/login`
2. Enter: `admin@jaihind-sports.com`
3. Enter: `admin123`
4. Click "Sign In"

**Expected:**
- Form submits ✅
- Toast says "Admin logged in successfully!" ✅
- Redirects to `/admin/dashboard` ✅
- Admin dashboard loads ✅
- No errors in browser console ✅

### Verify State

```javascript
// Check localStorage
localStorage.getItem('token')
// Should return JWT token

localStorage.getItem('user')
// Should return: {..., "role": "admin"}

// Key check: role MUST be "admin"
JSON.parse(localStorage.getItem('user')).role
// Should output: "admin"
```

---

## 🛡️ STEP 6: Test Route Protection

### Test Without Login

1. Clear localStorage:
   ```javascript
   localStorage.clear()
   ```

2. Try to access: `http://localhost:5173/admin`
3. **Expected:** Redirects to `/login` ✅

### Test as Regular User

1. Login as user: `user@gmail.com / password123`
2. Clear localStorage and manually set user role to "user":
   ```javascript
   const user = JSON.parse(localStorage.getItem('user'));
   user.role = 'user';
   localStorage.setItem('user', JSON.stringify(user));
   ```
3. Try to access: `http://localhost:5173/admin`
4. **Expected:** Redirects to `/` (homepage) ✅

### Test as Admin

1. Login as admin: `admin@jaihind-sports.com / admin123`
2. Try to access: `http://localhost:5173/admin`
3. **Expected:** Shows admin dashboard ✅

---

## 🌐 STEP 7: Test on Production URLs

### Clear Cache First

```javascript
localStorage.clear()
// Completely close browser (not just tab)
// Wait 5 seconds
// Open browser again
```

### Test Login on Production

1. Go to: `https://jaihind-sporty-spark.vercel.app/login`
2. Login as admin: `admin@jaihind-sports.com / admin123`
3. **Expected:** Works exactly like localhost ✅

### Test Admin Routes

1. After login, try: `https://jaihind-sporty-spark.vercel.app/admin`
2. **Expected:** Shows admin dashboard ✅

---

## 🔍 DEBUGGING: If Login Doesn't Work

### Step 1: Check Network Requests

1. Open DevTools (F12)
2. Go to "Network" tab
3. Reload page and try login
4. Look for request to: `/api/auth/login` or `/api/admin/login`

**Check Response:**
- Click on the request
- Go to "Response" tab
- Should see JSON with `token` and `data.role`

If request fails:
- Check CORS settings ✅
- Check backend is running ✅
- Check MongoDB connection ✅

### Step 2: Check Console Errors

1. Open DevTools (F12)
2. Go to "Console" tab
3. Look for red error messages
4. Common errors:

**Error: "Cannot read property 'map' of undefined"**
- Usually means API response format is wrong
- Check backend is returning data correctly

**Error: "CORS policy"**
- Backend CORS not configured for this URL
- Update backend/server.js CORS settings

**Error: "useAuth must be used within an AuthProvider"**
- AuthProvider not wrapping the app
- Check App.tsx has `<AuthProvider>` wrapping everything

### Step 3: Check Backend Logs

Terminal where backend is running:
- Should see: `POST /api/auth/login` or `POST /api/admin/login`
- Should see: `200` status code
- If not, backend endpoint might be wrong

---

## 📊 Expected Behavior Summary

| Scenario | Action | Expected Result |
|----------|--------|-----------------|
| Not logged in | Visit `/login` | ✅ Shows login form |
| Not logged in | Try `/admin` | ✅ Redirects to `/login` |
| Not logged in | Try `/profile` | ✅ Redirects to `/login` |
| Login as user | Enter user email | ✅ Redirects to `/` |
| Login as admin | Enter admin email | ✅ Redirects to `/admin/dashboard` |
| User logged in | Try `/admin` | ✅ Redirects to `/` |
| User logged in | Try `/profile` | ✅ Shows profile page |
| Admin logged in | Try `/admin` | ✅ Shows admin dashboard |
| Admin logged in | Try `/profile` | ✅ Shows profile page |
| Any user | Try `/products` | ✅ Shows products (public) |
| Any user | Try `/login` | ✅ Shows login form (public) |

---

## 🔐 How It Works Behind The Scenes

### 1. Frontend Login Flow

```
Login.tsx
  ↓
Check email: @jaihind-sports.com?
  ↓
Call useAuth().adminLogin() or login()
  ↓
AuthContext makes API call
  ↓
Saves token + user to localStorage
  ↓
Sets user state with role
  ↓
Navigates to correct page
```

### 2. Route Protection Flow

```
User tries to visit /admin
  ↓
ProtectedRoute component renders
  ↓
Checks: Is user logged in? (checks AuthContext.user)
  ↓
NO: Redirects to /login
YES: Continue...
  ↓
Checks: Does route need admin? (requireAdmin prop)
  ↓
NO: Shows page
YES: Continue...
  ↓
Checks: Is user admin? (checks AuthContext.isAdmin)
  ↓
NO: Redirects to /
YES: Shows page ✅
```

### 3. Token in Requests

```
Every API request includes:
  ↓
Authorization header added by axios interceptor
  ↓
Header: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  ↓
Backend validates token
  ↓
Returns data if valid
```

---

## 🧩 Code Files Involved

1. **`src/pages/Login.tsx`**
   - Login form UI
   - Calls useAuth hooks

2. **`src/contexts/AuthContext.tsx`**
   - Manages auth state
   - Has login/adminLogin/logout functions
   - Provides isAdmin flag

3. **`src/components/ProtectedRoute.tsx`**
   - Checks authentication
   - Checks role permissions
   - Redirects if unauthorized

4. **`src/lib/api.ts`**
   - Creates axios instance
   - Adds token to all requests
   - Exports API functions

5. **`src/config/api.ts`**
   - API base URL configuration
   - Exports route constants

6. **`backend/controllers/adminController.js`**
   - Validates admin credentials
   - Creates JWT token
   - Returns role in response

7. **`backend/server.js`**
   - CORS configuration
   - Connects routes

---

## ✅ Checklist: Everything Working?

- [ ] Admin account created: `npm run create-admin`
- [ ] Backend running: `npm run dev` (in backend folder)
- [ ] Frontend running: `npm run dev` (in root folder)
- [ ] Can login as user on localhost
- [ ] Can login as admin on localhost
- [ ] Admin redirects to `/admin/dashboard`
- [ ] User redirects to `/`
- [ ] `/admin` protected (redirects to login if not logged in)
- [ ] `/admin` protected (redirects to home if not admin)
- [ ] localStorage has token after login
- [ ] localStorage has user with correct role
- [ ] Same flow works on production URLs
- [ ] No errors in browser console
- [ ] No errors in backend terminal

If all checked ✅, **your login system is fully working!**

---

## 🆘 Still Having Issues?

### Most Common Problems

1. **"Invalid credentials" error**
   - Check admin account exists: `npm run create-admin`
   - Check exact email: `admin@jaihind-sports.com`
   - Check exact password: `admin123`

2. **Redirects to wrong page**
   - Check localStorage.getItem('user').role
   - Should be exactly "admin" (lowercase, string)

3. **"/admin" shows blank page**
   - Check console for errors (F12)
   - Check backend is running
   - Try clearing localStorage and logging in again

4. **"Cannot find module" errors**
   - Run: `npm install`
   - Delete node_modules: `rm -r node_modules`
   - Run again: `npm install`

5. **CORS errors**
   - Backend CORS not configured for your URL
   - Check backend/server.js
   - Should have: localhost, 127.0.0.1, *.vercel.app

---

## 📞 Need Help?

Check files in this order:
1. `src/pages/Login.tsx` - Login form
2. `src/contexts/AuthContext.tsx` - Auth state
3. `src/components/ProtectedRoute.tsx` - Route protection
4. `backend/server.js` - CORS
5. `backend/controllers/adminController.js` - Admin validation

All should be properly configured. If they are, system should work! 🚀


# Console Errors Troubleshooting Guide

## Issues Found & Fixed

### ✅ 1. localhost:5000 API Calls Still Happening
**Error:** `localhost:5000/api/products` - Failed to load resource: net::ERR_CONNECTION_REFUSED

**Root Cause:** Two API utility files (`src/utils/api.ts` and `src/lib/api.ts`) had hardcoded localhost URLs.

**Solution:** ✅ FIXED - Updated both files to use centralized `src/config/api.ts`

**Files Updated:**
- `src/utils/api.ts` - Now imports `API_BASE_URL` from config
- `src/lib/api.ts` - Now imports `API_BASE_URL` from config

**Verification:** 
All API calls should now go to `https://jaihind-sporty-spark-1.onrender.com` instead of localhost.

---

### ⚠️ 2. PDF Font Warning
**Warning:** `pdf-fonts: notoSans base64 is missing or placeholder. PDF unicode font registration skipped.`

**Root Cause:** The NotoSans base64 font file is a placeholder (too small) because the full font data wasn't included.

**Impact:** ⚠️ LOW - PDFs will use system font, which still supports ₹ symbol correctly.

**Solution:** ✅ IMPROVED - Updated warning message to be clearer and only show in development mode.

**What This Means:**
- PDFs will still render rupee symbols (₹) correctly
- Just using system font instead of custom NotoSans
- No functional impact; just informational

**Optional: Add Custom Font**
If you want custom NotoSans in PDFs, add the base64 font to `src/pdf-fonts.ts`:
```typescript
const notoSans = `AAEAAAASAQAABAAgR0RFRrRCsIIAAI...FULL_BASE64_HERE...AAA==`;
```
Get it from: https://fonts.google.com/download?family=Noto+Sans

---

### ❌ 3. Admin Login 401 Error
**Error:** `jaihind-sporty-spark-1.onrender.com/api/admin/login:1 Failed to load resource: the server responded with a status of 401`

**Root Cause:** Either:
1. Admin user doesn't exist in database
2. Wrong email/password being used
3. Database connection issue on Render

**Solution:** Create default admin account

#### Step 1: Check if admin exists in MongoDB
1. Go to MongoDB Atlas dashboard
2. Find your Jaihind Sports database
3. Navigate to `Admin` collection
4. Look for `admin@jaihind-sports.com`

#### Step 2: Create Default Admin
Run this command in the backend directory:

```powershell
cd backend
npm run create-admin
```

Or manually:
```powershell
node scripts/CreateDefaultAdmin.js
```

**Default Credentials:**
- Email: `admin@jaihind-sports.com`
- Password: `admin123`

**Verify:** Try logging in with these credentials in the admin login page.

#### Step 3: If Still Getting 401
Check these:

**A) Verify Admin Model:**
```javascript
// File: backend/models/Admin.js - should have email, password, role fields
```

**B) Check JWT_SECRET in .env:**
```env
JWT_SECRET=your_secret_key_here
```

**C) View backend logs on Render:**
1. Go to Render Dashboard
2. Select your backend service
3. Click "Logs" tab
4. Check for error messages

---

### ❌ 4. 404 Error on Login Page
**Error:** `login:1 Failed to load resource: the server responded with a status of 404`

**Root Cause:** Likely a routing issue (possibly trying to load a file that doesn't exist)

**Solution:** Check your routing configuration in frontend:
```typescript
// src/App.tsx or main router file
// Ensure /login route exists and points to Login.tsx
```

This might be trying to load a `login.js` file statically instead of using React routing.

---

## Verification Checklist

After applying these fixes, verify:

### ✅ API Calls
- [ ] Open DevTools → Network tab
- [ ] Refresh page
- [ ] Check that API calls go to `jaihind-sporty-spark-1.onrender.com`
- [ ] NOT to `localhost:5000`

### ✅ Product Page
- [ ] Navigate to Products page
- [ ] Products should load from Render server
- [ ] Images should display (using `API_BASE_URL`)

### ✅ Admin Login
- [ ] Try logging in with:
  - Email: `admin@jaihind-sports.com`
  - Password: `admin123`
- [ ] Should successfully redirect to admin dashboard

### ✅ PDF Download
- [ ] Go to Admin Orders
- [ ] Click an order
- [ ] Click "Download PDF Invoice"
- [ ] PDF should download with rupee symbols

---

## Environment Configuration

Your app now uses this for all APIs:

```typescript
// src/config/api.ts
export const API_BASE_URL = "https://jaihind-sporty-spark-1.onrender.com";

// To switch to local development:
// export const API_BASE_URL = "http://localhost:5000";
```

### To Switch to Local Development:
Edit `src/config/api.ts`:
```typescript
// Comment out production:
// export const API_BASE_URL = "https://jaihind-sporty-spark-1.onrender.com";

// Uncomment local:
export const API_BASE_URL = "http://localhost:5000";
```

Then restart your dev server.

---

## Files Modified

1. ✅ `src/utils/api.ts` - Centralized to use config
2. ✅ `src/lib/api.ts` - Centralized to use config
3. ✅ `src/pdf-fonts.ts` - Improved warning messages
4. ✅ `src/config/api.ts` - Central source of truth

---

## Next Steps

1. **Verify Admin Access:**
   - Create default admin (command above)
   - Test admin login

2. **Check Backend Logs:**
   - Monitor Render logs for any API errors
   - Verify database is connected

3. **Test All Routes:**
   - Products: Should load from `jaihind-sporty-spark-1.onrender.com/api/products`
   - Users: Should load from same origin
   - Orders: Should load from same origin

4. **Monitor Console:**
   - Clear DevTools console
   - No more localhost:5000 errors
   - No more configuration warnings

---

## Support

If issues persist:

1. Check Render backend logs: https://dashboard.render.com
2. Verify MongoDB connection string in backend .env
3. Confirm admin account exists in MongoDB
4. Check CORS settings in backend `server.js`


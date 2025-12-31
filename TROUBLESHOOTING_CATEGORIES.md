# 🚨 Troubleshooting: Categories Not Loading on www.jaihindsportsfit.in

## ⚡ Quick Fixes (Try These First)

### 1. Hard Refresh Browser
```
Windows/Linux: Ctrl + Shift + Delete (Clear Cache & Hard Refresh)
Mac: Cmd + Shift + Delete
```

### 2. Check Browser Console (F12)
Look for:
```
🔄 Fetching categories from: https://jaihind-sporty-spark-backend.onrender.com/api/categories
📦 Response status: 200 OK
✅ Categories received: { success: true, categories: [...] }
```

---

## 🔍 What's Happening?

When you visit **https://www.jaihindsportsfit.in/**:

1. Frontend loads on: `https://www.jaihindsportsfit.in`
2. Frontend detects domain has "jaihindsportsfit.in"
3. Frontend tries to fetch from: `https://jaihind-sporty-spark-backend.onrender.com/api/categories`
4. If backend fails → Shows error "Could not load categories from server"

---

## 🔧 Common Issues & Solutions

### Issue 1: Render Backend is Sleeping
**Symptoms:**
- Error message: `HTTP 503` or timeout
- Console shows: "Failed to fetch" or "Service Unavailable"

**Solution:**
```
Visit: https://jaihind-sporty-spark-backend.onrender.com/api/health
Should return: { success: true, message: "API is healthy ✅" }
If not, Render service is sleeping.

Fix: Wait 30 seconds or upgrade Render to paid tier
```

### Issue 2: CORS Error
**Symptoms:**
- Console error: "CORS policy"
- Status: 200 but request blocked

**Solution:**
✅ We already added www. domains to CORS:
```javascript
allowedOrigins = [
  "https://jaihindsportsfit.in",
  "https://www.jaihindsportsfit.in",  // ✅ Added
  ...
]
```

**Deploy this fix:**
```bash
git add backend/server.js
git commit -m "Fix CORS for www subdomain"
git push
# Restart backend on Render
```

### Issue 3: Network Error
**Symptoms:**
- Console shows: "Failed to fetch"
- Status: No HTTP code shown

**Solution:**
- Check your internet connection
- Try accessing Render backend directly
- Check if you're behind a proxy/firewall

---

## 📋 Step-by-Step Debugging

### Step 1: Open Browser Console (F12)
Press `F12` → Click `Console` tab

### Step 2: Look for Initial Logs
You should see:
```
🌐 API_BASE_URL: https://jaihind-sporty-spark-backend.onrender.com
🔄 Fetching categories from: https://jaihind-sporty-spark-backend.onrender.com/api/categories
```

### Step 3: Check Response Status
```
📦 Response status: 200 OK  ← Success
or
📦 Response status: 503 Service Unavailable  ← Render sleeping
or
CORS policy error  ← Domain not in allowlist
```

### Step 4: Test Backend Directly
Open new tab and visit:
```
https://jaihind-sporty-spark-backend.onrender.com/api/health
```

Should return:
```json
{
  "success": true,
  "message": "API is healthy ✅",
  "timestamp": "2025-12-31T...",
  "environment": "production"
}
```

If you see error or timeout:
- **Render backend is down/sleeping**
- Wait 30 seconds for Render to wake up
- Or check Render dashboard

### Step 5: Test Categories Endpoint
Visit:
```
https://jaihind-sporty-spark-backend.onrender.com/api/categories
```

Should return:
```json
{
  "success": true,
  "categories": [
    { "name": "Cricket", "slug": "cricket", ... },
    { "name": "Badminton", "slug": "badminton", ... },
    ...
  ]
}
```

---

## 🌐 Domain Routing Logic

**Current Setup:**
```
https://www.jaihindsportsfit.in/ 
  ↓
Frontend detects "jaihindsportsfit.in" in hostname
  ↓
Routes API calls to: https://jaihind-sporty-spark-backend.onrender.com
  ↓
Returns: 11 Categories + 16 Products
```

**This applies to:**
- ✅ jaihindsportsfit.in
- ✅ www.jaihindsportsfit.in
- ✅ jaihindsports.in
- ✅ www.jaihindsports.in

All route to same Render backend!

---

## 🚀 Performance Issues

### If Loading is Slow:

**Reason:** Render free tier has limitations
```
- Spins down if unused for 15 minutes
- Takes 30 seconds to wake up
- Limited to ~0.5 CPU
```

**Solutions:**
1. **Keep Render Awake** (Free)
   - Use an uptime monitoring service
   - Pings backend every 10 minutes
   - Services: UptimeRobot, Fresh Ping, etc.

2. **Upgrade Render** (Paid)
   - $7/month for persistent instance
   - Much faster response times

3. **Switch Hosting** (Better)
   - Deploy to Railway, Heroku, or Vercel
   - Better performance
   - Pay-per-use pricing

---

## 🔐 CORS Configuration

**Backend allows these domains (server.js line 35):**
```javascript
const allowedOrigins = [
  "http://localhost:5173",           // Dev
  "https://jaihind-sporty-spark.vercel.app",  // Old vercel
  "http://jaihindsportsfit.in",      // Custom domain
  "https://jaihindsportsfit.in",     // Custom domain HTTPS
  "https://www.jaihindsportsfit.in", // Custom domain with www ✅
  "http://jaihindsports.in",         // New domain
  "https://jaihindsports.in",        // New domain HTTPS
  "https://www.jaihindsports.in"     // New domain with www ✅
];
```

If you add a new domain, add it here!

---

## 🐛 Browser Errors to Look For

### CORS Error
```
Access to XMLHttpRequest at '...' from origin 'https://www.jaihindsportsfit.in'
has been blocked by CORS policy
```
→ Domain not in `allowedOrigins`

### Network Error
```
Failed to fetch
```
→ Backend down or unreachable

### Timeout
```
Request timeout after 30s
```
→ Backend overloaded or sleeping

### JSON Parse Error
```
SyntaxError: Unexpected token '<' in JSON at position 0
```
→ Got HTML error page instead of JSON

---

## 📞 Getting Help

### Check These First:
1. ✅ Hard refresh (Ctrl+Shift+Delete)
2. ✅ Open F12 console, find error message
3. ✅ Test backend directly: `/api/health`
4. ✅ Check CORS domain in allowedOrigins
5. ✅ Wait 30 seconds (Render waking up)

### If Still Broken:
1. Check Render dashboard: https://dashboard.render.com
2. Look for errors in Render logs
3. Verify backend is deployed
4. Check git commits were pushed

### Quick Test Links:
- Health: `https://jaihind-sporty-spark-backend.onrender.com/api/health`
- Categories: `https://jaihind-sporty-spark-backend.onrender.com/api/categories`
- Products: `https://jaihind-sporty-spark-backend.onrender.com/api/products`

All should return JSON with status 200.

---

## ✅ What Should Happen After Fix

**On https://www.jaihindsportsfit.in/**

Console shows:
```
🌐 API_BASE_URL: https://jaihind-sporty-spark-backend.onrender.com
🔄 Fetching categories from: https://jaihind-sporty-spark-backend.onrender.com/api/categories
📂 Categories response: { success: true, categories: [11 items] }
✅ Categories loaded: 12 (including "All")
```

Page shows:
```
Shop by Category
[Cricket] [Badminton] [Tennis] [Kabaddi] [Football] ...
(Real categories from database, not defaults)
```

---

## 🎯 Summary

| Check | Status |
|-------|--------|
| CORS Updated | ✅ www. domains added |
| Frontend Code | ✅ Better error logs |
| Backend Logging | ✅ Shows what's happening |
| Database | ✅ 11 categories exist |
| API Config | ✅ Auto-detects domain |

**Next Step:** Deploy backend CORS fix and check browser console for detailed error messages!

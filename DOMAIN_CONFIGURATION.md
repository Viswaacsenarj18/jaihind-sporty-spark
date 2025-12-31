# 🌐 Domain Configuration Guide

## Current Setup

### Localhost (Development)
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000
- **Auto-detected:** ✅ Works automatically

### jaihindsportsfit.in (Current)
- **Frontend:** https://jaihindsportsfit.in
- **Backend:** https://jaihind-sporty-spark-backend.onrender.com (Render)
- **Status:** Products loading from Render backend ✅

### jaihindsports.in (New Domain)
- **Frontend:** https://jaihindsports.in
- **Backend:** ??? (Needs to be configured)
- **Options:** 
  1. Same Render backend (current setup)
  2. Same domain backend (reverse proxy required)
  3. Custom backend

---

## 🔧 How to Fix Products Not Loading on jaihindsports.in

### Option 1: Use Same Render Backend (Simplest)
**No code changes needed!** The system will automatically use Render backend.

**Status:** Just ensure:
- ✅ Backend CORS allows `https://jaihindsports.in`
- ✅ Backend is running on Render

### Option 2: Use Same Domain Backend (Production)
**Requires:** Backend running on same domain (via reverse proxy)

```
Frontend: https://jaihindsports.in
Backend: https://jaihindsports.in/api/*
```

**Setup needed:**
1. Deploy backend to same domain (Vercel, your own server, etc.)
2. Configure reverse proxy if needed
3. No code changes needed - system auto-detects

### Option 3: Custom Backend Per Domain (Advanced)
**If you want different backends:**

Edit `src/config/api.ts` to specify which backend for which domain:
```typescript
if (hostname.includes("jaihindsports.in")) {
  LIVE_BACKEND = "https://your-backend-for-jaihindsports.in";
} else if (hostname.includes("jaihindsportsfit.in")) {
  LIVE_BACKEND = "https://jaihind-sporty-spark-backend.onrender.com";
}
```

### Option 4: Runtime Query Parameter
**For testing with custom backends:**

Visit: `https://jaihindsportsfit.in?apiBackend=http://localhost:5000`

This overrides the default backend for that session.

---

## ✅ Current Configuration

### What Happens Now:

| Domain | Frontend | Backend | Status |
|--------|----------|---------|--------|
| localhost | :5173 | :5000 | ✅ Auto-detected |
| jaihindsportsfit.in | Same | Render | ✅ Configured |
| jaihindsports.in | Same | Render | ✅ Using Render |

### Console Logs You'll See:

**On localhost:**
```
🌐 API_BASE_URL: http://localhost:5000
```

**On jaihindsportsfit.in:**
```
🌐 API_BASE_URL: https://jaihind-sporty-spark-backend.onrender.com
```

**On jaihindsports.in (current):**
```
🌐 API_BASE_URL: https://jaihind-sporty-spark-backend.onrender.com
```

---

## 🐛 Debugging Product Loading Issues

### Step 1: Open Browser Console (F12)
Look for logs like:
```
🛒 Fetching products from: https://jaihind-sporty-spark-backend.onrender.com/api/products
📦 Products response status: 200 OK
✅ Got products: 16
```

### Step 2: Check What URL It's Using
The first log line shows which backend it's calling.

### Step 3: Verify Backend is Responding
Visit the URL directly:
```
https://jaihind-sporty-spark-backend.onrender.com/api/products
```
Should return JSON with products.

### Step 4: Check CORS
If you see CORS errors, make sure:
- ✅ Domain is in backend `allowedOrigins` (in server.js)
- ✅ Backend is running
- ✅ Network is connected

---

## 🚀 Backend Deployment Options

### Current: Render (Free tier)
- ✅ Free
- ⚠️ Sleeps if inactive
- Solution: Set up uptime bot or upgrade to paid

### Recommended Options:
1. **Vercel** - Deploy Next.js/Node backend
2. **Railway** - Simple Node deployment
3. **Heroku** - Traditional Node hosting
4. **Your own server** - Full control

---

## 📋 Next Steps

### If products aren't loading on jaihindsports.in:

1. **Check console logs** (F12) - shows which backend is being called
2. **Verify backend is running** - Visit `/api/health`
3. **Check CORS** - Ensure domain is in allowedOrigins
4. **Try query parameter** - Use `?apiBackend=https://...` to test

### To make jaihindsports.in production-ready:

Choose one:
- **Keep using Render** - Works for both domains
- **Deploy backend to jaihindsports.in** - Better performance
- **Use CDN/proxy** - Distribute across regions

---

## 🔒 Security Notes

- ✅ CORS configured for allowed domains only
- ✅ Different domains can't access each other's data
- ✅ Same database used for all domains (intended)
- ⚠️ Don't expose backend URLs in console (already fixed with config)

---

## Questions?

**Products loading slowly?**
- Render free tier sleeps. Upgrade or add uptime bot.

**Products not showing at all?**
- Check backend logs with `npm run check:db`
- Verify products exist: Should show "16 Products in Database"

**CORS errors?**
- Add domain to backend CORS allowlist
- Backend CORS: Line 35-42 in `server.js`

**Different data on different domains?**
- All domains share same MongoDB database (by design)
- Database configured once in `.env`

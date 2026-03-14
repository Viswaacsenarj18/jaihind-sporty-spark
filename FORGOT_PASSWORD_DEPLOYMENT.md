# 🔐 Forgot Password - Testing & Deployment Guide

## ✅ Current Setup (Both Dev + Production)

Your forgot password system now automatically detects the environment:

### Development (localhost)
- **Frontend URL**: `http://localhost:5173`
- **Reset Link Examples**: `http://localhost:5173/reset-password/{token}`
- **Emails to**: Console logs show the full URL

### Production (After Deploy)
- **Frontend URL**: `https://jaihindsportsfit.in`
- **Reset Link Examples**: `https://jaihindsportsfit.in/reset-password/{token}`
- **Emails to**: Actual production domain

---

## 🧪 TESTING LOCALLY (Development)

### Step 1: Verify .env Settings
```
FRONTEND_URL=http://localhost:5173
FRONTEND_URL_PROD=https://jaihindsportsfit.in
EMAIL_USER=jaihindsports2026@gmail.com
EMAIL_PASS=lbrjwjxdoneweitq
NODE_ENV=development
```

### Step 2: Start Backend
```bash
cd backend
npm start
```

**Expected Console Output:**
```
✅ Email Transporter Ready: true
🌐 Frontend URL for reset link: http://localhost:5173
```

### Step 3: Start Frontend
```bash
npm run dev
```

### Step 4: Test Full Flow
1. Go to: **http://localhost:5173/forgot-password**
2. Enter email: `jaihindsports2026@gmail.com`
3. Click: **"Send Reset Link"**
4. Check: **Console & Gmail inbox**
5. Verify reset link shows: `http://localhost:5173/reset-password/...`
6. Click link and reset password
7. Login with new password ✓

---

## 🚀 DEPLOYMENT (Production)

### Step 1: Build & Push Code
```bash
git add .
git commit -m "Deploy: Fixed forgot password for both dev and production"
git push origin main
```

### Step 2: Update Production Environment on Render

1. Go to: https://dashboard.render.com/
2. Select: **jaihind-sporty-spark-backend** service
3. Click: **Environment** tab
4. **Update these variables:**

```
NODE_ENV=production
FRONTEND_URL_PROD=https://jaihindsportsfit.in
FRONTEND_URL=http://localhost:5173
```

5. Click: **Save**
6. Render will auto-redeploy

### Step 3: Verify Deployment
```
✓ Backend deployed
✓ Console shows: NODE_ENV=production
✓ System uses FRONTEND_URL_PROD automatically
```

---

## 📧 Email Reset Links Generated

### Development
```
✓ Frontend detects: localhost
✓ Reset URL used: http://localhost:5173/reset-password/{token}
✓ Email contains: reset-password link to localhost
```

### Production  
```
✓ Frontend detects: jaihindsportsfit.in
✓ Reset URL used: https://jaihindsportsfit.in/reset-password/{token}
✓ Email contains: reset-password link to production domain
```

---

## 🔍 How It Works

### Controller Logic
```javascript
// Checks environment
if (NODE_ENV === "production") {
  // Uses FRONTEND_URL_PROD
  frontendUrl = "https://jaihindsportsfit.in"
} else {
  // Uses FRONTEND_URL  
  frontendUrl = "http://localhost:5173"
}

// Generates reset link
resetUrl = `${frontendUrl}/reset-password/${token}`
```

---

## ✨ Testing Checklist

### Local Development (http://localhost:5173)
- [ ] Backend starts with "Email Transporter Ready: true"
- [ ] Frontend loads forgot-password page
- [ ] Can submit email
- [ ] Email received with localhost reset link
- [ ] Reset link works: http://localhost:5173/reset-password/...
- [ ] Can reset password
- [ ] Can login with new password

### Production (https://jaihindsportsfit.in)
- [ ] Frontend deployed to production domain
- [ ] Backend deployed with NODE_ENV=production
- [ ] Can submit email on forgot-password
- [ ] Email received with production reset link
- [ ] Reset link works: https://jaihindsportsfit.in/reset-password/...
- [ ] Can reset password on production
- [ ] Can login with new password

---

## 🐛 Troubleshooting

### Issue: Reset link shows wrong domain
**Solution:**
- Check Render environment: NODE_ENV should be `production`
- Check FRONTEND_URL_PROD is set correctly
- Verify backend redeployed after env changes

### Issue: Still showing localhost after deploy
**Causes:**
- NODE_ENV not set to `production`
- Frontend not deployed to production domain
- Browser cache

**Fix:**
```bash
# Clear cache in browser (Ctrl+Shift+Delete)
# Then refresh page
```

### Issue: Email not received
**Check:**
- Is backend deployed? Check Render logs
- Check Gmail spam folder
- Verify EMAIL_USER and EMAIL_PASS correct

---

## 📋 Quick Summary

| Scenario | Frontend URL | Reset Link |
|----------|--------------|-----------|
| **Local Dev** | `localhost:5173` | `http://localhost:5173/reset-password/{token}` |
| **Production** | `jaihindsportsfit.in` | `https://jaihindsportsfit.in/reset-password/{token}` |

✅ **Both environments fully supported!**

---

## 🎯 Next Steps

1. **Test locally** - Make sure everything works on localhost
2. **Commit & push to GitHub**
3. **Deploy to production**
4. **Test on production domain**
5. **Monitor email sending**

You're all set! 🚀

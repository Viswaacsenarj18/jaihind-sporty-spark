# 🚀 Production Email Setup Guide - Render & Vercel

## ❌ Current Issue
- Emails not working in production (Render backend)
- Reset password links might have wrong URLs
- Environment variables not set in Render dashboard

---

## ✅ Step 1: Configure Render Environment Variables

### Go to Render Dashboard:
1. Visit: https://dashboard.render.com
2. Select your **jaihind-sporty-spark** service
3. Click **"Environment"** tab
4. Add these variables exactly:

```
NODE_ENV=production
MONGO_URI=mongodb+srv://viswaacsenarj18_db_user:Alt8DSu4uAfgISXl@jaihind-sports.tvfrics.mongodb.net/jaihind_sports?retryWrites=true&w=majority&appName=jaihind-sports&authSource=admin
JWT_SECRET=yourSuperSecretKey123
EMAIL_USER=jaihindsports2026@gmail.com
EMAIL_PASS=lbrjwjxdoneweitq
FRONTEND_URL=https://jaihindsportsfit.in
FRONTEND_URL_PROD=https://jaihindsportsfit.in
CLOUDINARY_CLOUD_NAME=dzyilb43m
CLOUDINARY_API_KEY=118945342211411
CLOUDINARY_API_SECRET=22JNSgAN_bpn4ghZWmmGDkLIv5Y
GMAIL_USER=jaihindsports2026@gmail.com
GMAIL_PASSWORD=cbsixwgsmvfryzlk
ADMIN_EMAIL=jaihindsports2026@gmail.com
```

---

## ✅ Step 2: Verify Gmail Credentials

Your Gmail app password: `lbrjwjxdoneweitq`

Make sure it's correct:
1. Go to: https://myaccount.google.com/apppasswords
2. It should show an app password for "Mail" and "Windows"
3. Verify it matches: `lbrjwjxdoneweitq`

If expired or missing, generate a new one and update both Render AND `.env`

---

## ✅ Step 3: Frontend URL Configuration

For Vercel (Frontend), the domain is: **https://jaihindsportsfit.in**

This is already set in:
- `FRONTEND_URL_PROD=https://jaihindsportsfit.in` in Render
- This ensures password reset links go to the correct domain

---

## ✅ Step 4: Test the Flow

### On Production:
1. Go to: https://jaihindsportsfit.in/forgot-password
2. Enter your email
3. You should receive an email to: **jaihindsports2026@gmail.com** inbox
4. Check spam folder if not in inbox
5. Click the reset link
6. You'll be redirected to: https://jaihindsportsfit.in/reset-password/{token}

---

## 🔧 Troubleshooting Production Emails

### Email not arriving?

1. **Check Render Logs**:
   ```
   Dashboard > Your Service > Logs
   Look for: ✅ Email sent successfully
   Or: ❌ Email sending failed
   ```

2. **Check Gmail**:
   - Verify app password is correct
   - Check if Gmail is blocking the connection
   - Try sending a test email from another service

3. **Check Reset Link**:
   - Make sure `FRONTEND_URL_PROD` is set correctly
   - Reset URL should contain: `https://jaihindsportsfit.in/reset-password/`

### Common Issues:

| Issue | Solution |
|-------|----------|
| "Gmail authentication failed" | Update `EMAIL_PASS` in Render |
| "Invalid frontend URL" | Set `FRONTEND_URL_PROD` correctly |
| "CORS error" | Make sure Vercel domain in allowed origins |
| "Email timeout" | Gmail SMTP may be slow, it retries automatically |

---

## 🧪 Manual Testing

If you want to test production email quickly:

```bash
# SSH into Render
# Then run:
node scripts/TestEmail.js
```

This will send a test email directly.

---

## 📋 Render Environment Variables Checklist

- [ ] `NODE_ENV=production`
- [ ] `MONGO_URI` - your MongoDB connection string
- [ ] `JWT_SECRET` - your secret key
- [ ] `EMAIL_USER` - Gmail address
- [ ] `EMAIL_PASS` - 16-char app password
- [ ] `FRONTEND_URL` - https://jaihindsportsfit.in
- [ ] `FRONTEND_URL_PROD` - https://jaihindsportsfit.in
- [ ] `CLOUDINARY_*` - your Cloudinary credentials
- [ ] `GMAIL_USER` - Gmail address
- [ ] `GMAIL_PASSWORD` - Gmail app password
- [ ] `ADMIN_EMAIL` - Admin email address

---

## 🚀 Deploy Steps

1. **Set all environment variables in Render dashboard** ✅
2. **Push code to GitHub**
3. **Render will auto-deploy**
4. **Check logs to verify deployment**
5. **Test forgot password** on production site
6. **Watch Render logs** for email sending confirmation

---

## 📧 Email Flow in Production

```
User enters email on Vercel
        ↓
Frontend sends request to Render API
        ↓
Render finds user in MongoDB
        ↓
Render generates reset token
        ↓
Render sends email via Gmail SMTP
        ↓
Email arrives in user's inbox
        ↓
User clicks link (https://jaihindsportsfit.in/reset-password/TOKEN)
        ↓
User resets password
```

---

## ⚠️ Important Notes

- **Gmail App Password**: Only works if 2FA is enabled on Google account
- **Email Address**: Both sender and recipient emails are important
- **Frontend URL**: Must match your actual domain exactly
- **MongoDB**: Must be accessible from Render (should be already)

---

Still not working? Reply with the Render log messages and I'll help debug! 🔧

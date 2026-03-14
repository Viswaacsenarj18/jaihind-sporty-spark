# Render Environment Variables Setup

## 🎯 Complete Configuration for Render Deployment

Copy ALL these variables to your Render Dashboard:
**Dashboard > your-service > Environment**

```
NODE_ENV=production
PORT=5000

# MongoDB Connection
MONGO_URI=mongodb+srv://viswaacsenarj18_db_user:Alt8DSu4uAfgISXl@jaihind-sports.tvfrics.mongodb.net/jaihind_sports?retryWrites=true&w=majority&appName=jaihind-sports&authSource=admin

# JWT & Security
JWT_SECRET=yourSuperSecretKey123

# EMAIL CONFIGURATION - CRITICAL FOR PASSWORD RESET
EMAIL_USER=jaihindsports2026@gmail.com
EMAIL_PASS=lbrjwjxdoneweitq

# Frontend URLs for Password Reset Links
FRONTEND_URL=https://jaihindsportsfit.in
FRONTEND_URL_PROD=https://jaihindsportsfit.in

# Cloudinary Configuration (Image Upload)
CLOUDINARY_CLOUD_NAME=dzyilb43m
CLOUDINARY_API_KEY=118945342211411
CLOUDINARY_API_SECRET=22JNSgAN_bpn4ghZWmmGDkLIv5Y

# Admin Email Configuration
GMAIL_USER=jaihindsports2026@gmail.com
GMAIL_PASSWORD=cbsixwgsmvfryzlk
ADMIN_EMAIL=jaihindsports2026@gmail.com
```

---

## ⚠️ IMPORTANT: Email Setup Steps

### Step 1: Verify Gmail Credentials
- Gmail Account: `jaihindsports2026@gmail.com`
- App Password: `lbrjwjxdoneweitq`
- Enable 2-Factor Authentication on Gmail account (required for app passwords)

### Step 2: Set Variables in Render Dashboard

1. Go to: https://dashboard.render.com
2. Select your backend service
3. Click **Environment** tab
4. Paste all variables above
5. Click **Save** (Render will auto-deploy)

### Step 3: Test Email After Deployment

1. Wait for Render deployment to complete
2. Go to: https://jaihindsportsfit.in/forgot-password
3. Enter any email and submit
4. Check **Render Logs** for:
   - ✅ `✅ Email sent successfully!`
   - ❌ or error message if failed

---

## 🧪 How to Check Render Logs

1. Dashboard > your-service > Logs
2. Search for: `EMAIL` or `SENT`
3. You should see:

```
📧 === PASSWORD RESET EMAIL [PRODUCTION] ===
👤 To: user@gmail.com
🔗 Reset URL: https://jaihindsportsfit.in/reset-password/...
✅ Email sent successfully!
📨 Message ID: <message-id>
```

---

## 🔍 Troubleshooting Checklist

| Problem | Solution |
|---------|----------|
| "EMAIL_USER or EMAIL_PASS not set" | Add both to Render environment |
| "Gmail authentication failed" | Verify app password is correct |
| "Connection timeout" | Gmail SMTP firewall issue, auto-retry works |
| "CORS error" | Add Vercel domain to allowedOrigins |
| "Invalid reset URL" | Check FRONTEND_URL_PROD is correct |
| "Email not arriving" | Check spam folder, verify recipient email |

---

## 📧 Email Flow Diagram (Production)

```
User on Vercel (https://jaihindsportsfit.in)
         ↓
   Enters email
         ↓
   Sends to Render API (CORS enabled)
         ↓
   Render finds user in MongoDB
         ↓
   Generates reset token (15-min expiry)
         ↓
   Creates reset URL: https://jaihindsportsfit.in/reset-password/TOKEN
         ↓
   Sends email via Gmail SMTP (EMAIL_USER + EMAIL_PASS)
         ↓
   Email arrives in user's inbox
         ↓
   User clicks link in email
         ↓
   Redirected to Vercel reset-password page
         ↓
   User enters new password
         ↓
   Vercel sends update to Render API
         ↓
   Password updated in MongoDB
         ↓
   Success! User can login with new password
```

---

## 🚀 Deploy Workflow

1. **Set Environment Variables** (Render Dashboard)
2. **Push code to GitHub** (already done)
3. **Render auto-deploys** (check Logs tab)
4. **Test forgot password** on production
5. **Monitor Logs** for any issues

---

## 💡 Pro Tips

- **Keep EMAIL_PASS secure** - Never commit to GitHub
- **Use same Gmail account** for both EMAIL_USER and GMAIL_USER
- **Frontend URL must be exact** - Including https:// and domain
- **Check expiry** - reset token expires in 15 minutes
- **Logs are your friend** - Always check Render logs first when debugging

---

Still having issues? Check the Render logs for exact error messages and reply with them!

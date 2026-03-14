# 🔐 Forgot Password - Complete Setup Guide

## ✅ What Was Fixed

1. **Email Credentials** - Updated `.env` with proper Gmail app password setup
2. **Email Transporter** - Enhanced with verification and logging
3. **API Routes** - Added forgot-password and reset-password endpoints to config
4. **Frontend Integration** - Both `ForgotPassword.tsx` and `ResetPassword.tsx` are ready to use

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get Gmail App Password

1. **Go to:** https://myaccount.google.com/apppasswords
   - You MUST have 2-Factor Authentication enabled first
   
2. **If 2FA not enabled:**
   - Go to: https://myaccount.google.com/security
   - Find "2-Step Verification" and enable it
   
3. **Generate App Password:**
   - Select **"Mail"** from app menu
   - Select **"Windows/Linux"** from device menu
   - Click **"Generate"**
   - Copy the 16-character password (without spaces)

4. **Update `.env`:**
   ```
   EMAIL_USER=sethupathi51469@gmail.com
   EMAIL_PASS=cbsixwgsmvfryzlk  ← Paste your 16-char password here
   ```

### Step 2: Update Backend `.env`

Make sure `.env` has:
```
EMAIL_USER=jaihindsports2026@gmail.com
EMAIL_PASS=cbsixwgsmvfryzlk
FRONTEND_URL=http://localhost:5173
```

For production, update to your live domain:
```
FRONTEND_URL=https://jaihindsportsfit.in
```

---

## 🧪 Test the Full Flow

### 1. Start Backend
```bash
cd backend
npm install  # if needed
npm start
```

You should see:
```
✅ Email Transporter Ready: true
```

### 2. Start Frontend
```bash
npm run dev
```

### 3. Test Forgot Password

1. Go to: http://localhost:5173/forgot-password
2. Enter: `jaihindsports2026@gmail.com` (or a test email you can access)
3. Click "Send Reset Link"
4. Check email inbox for reset link
5. Click the reset link (it expires in 15 minutes)
6. Enter new password and confirm
7. Login with new password

---

## 📋 System Architecture

### Frontend Components
- **[src/pages/ForgotPassword.tsx](src/pages/ForgotPassword.tsx)** - Email submission form
- **[src/pages/ResetPassword.tsx](src/pages/ResetPassword.tsx)** - Password reset with token

### Backend Controllers
- **[backend/controllers/authController.js](backend/controllers/authController.js)** - `forgotPassword()` and `resetPassword()`
- **[backend/routes/authRoutes.js](backend/routes/authRoutes.js)** - POST `/forgot-password` and `/reset-password/:token`

### Email System
- **[backend/utils/emailTransporter.js](backend/utils/emailTransporter.js)** - Nodemailer Gmail configuration
- **[backend/utils/sendPasswordResetEmail.js](backend/utils/sendPasswordResetEmail.js)** - Email template

### Database
- **User Model** - `resetToken` and `resetTokenExpire` fields (expires in 15 minutes)

---

## 🔄 How It Works

### 1. User Requests Reset
```
Frontend → POST /api/auth/forgot-password { email }
         ↓
Backend: Find user by email
         ↓
         Generate random reset token (32 bytes hex)
         ↓
         Save token + 15-min expiry to database
         ↓
         Send email with reset link
         ↓
Frontend ← Success message
```

### 2. User Clicks Email Link
```
Link Format: https://domain.com/reset-password/{token}
             ↓
Frontend loads ResetPassword.tsx with token from URL
             ↓
User enters new password
```

### 3. User Submits New Password
```
Frontend → POST /api/auth/reset-password/{token} { password }
         ↓
Backend: Find user with valid token (not expired)
         ↓
         Hash password with bcrypt
         ↓
         Clear resetToken and resetTokenExpire
         ↓
         Save updated user
         ↓
Frontend ← Success message
         ↓
         Redirect to login after 2.5 seconds
```

---

## 🐛 Troubleshooting

### ❌ "Missing credentials for 'PLAIN'"
**Cause:** Email credentials in `.env` are wrong
**Fix:** 
1. Double-check you copied the 16-char app password correctly
2. Ensure no extra spaces in `EMAIL_PASS`
3. Restart backend server

### ❌ Email not sending
**Check:**
1. Look at backend console for error logs
2. Verify Gmail account isn't blocking app access: https://myaccount.google.com/u/0/device-activity
3. Try a different test email first
4. Check spam folder

### ❌ "User not found"
**Cause:** Email doesn't match exactly
**Fix:** 
- Email is case-insensitive but check spelling
- Must be an account that used signup form

### ❌ "Invalid or expired token"
**Cause:** Token expired (15-minute limit) or wrong token
**Fix:**
- Request a new password reset
- Complete within 15 minutes

### ❌ Cannot find reset link in email
**Check:**
1. Spam/Promotions folder
2. That the email address is correct (check backend logs)
3. Whitelist `sethupathi51469@gmail.com` in Gmail

---

## 📧 Email Template

The reset email looks like this:

```
From: "Jaihind Sports" <jaihindsports2026@gmail.com>
To: user@example.com
Subject: 🔐 Jaihind Sports - Password Reset Request

---

Hello [User Name],

You requested a password reset.

[RESET PASSWORD BUTTON]

Link expires in 15 minutes.
```

---

## 🔒 Security Features

✅ **Token Generated**: 32-byte random hex (cryptographically secure)
✅ **Token Expires**: 15 minutes (auto-clears from database)
✅ **Password Hashed**: bcryptjs with salt rounds = 10
✅ **One-time Use**: Token cleared after password reset
✅ **HTTPS Ready**: Works with both HTTP (dev) and HTTPS (prod)

---

## 🚢 Environment Variables Checklist

```bash
# Backend/.env
EMAIL_USER=jaihindsports2026@gmail.com         ← Gmail address
EMAIL_PASS=cbsixwgsmvfryzlk                    ← 16-char app password
FRONTEND_URL=http://localhost:5173             ← Update for production
MONGO_URI=...                                   ← Already configured
JWT_SECRET=...                                  ← Already configured
```

---

## 📱 Testing with Real Email

To test with your own Gmail:

1. Create a temporary Gmail account (or use existing)
2. Enable 2-Factor Authentication
3. Generate app password
4. Update `.env` with your credentials
5. Test signup → forgot password → reset

---

## ✨ Additional Features You Can Add

- Resend reset email option (another button on reset page)
- Rate limiting (max 3 reset requests per hour)
- Email confirmation before password change
- Admin ability to reset user password
- SMS notifications as backup

---

## 📞 Need Help?

If emails still aren't sending:
1. Check backend console for detailed error messages
2. Verify Gmail allows less secure apps: https://myaccount.google.com/u/0/apppasswords
3. Test with `transporter.verify()` output in console
4. Check spam folder thoroughly
5. Verify email address is spelled correctly in database

✅ **Everything is now set up and ready to use!**

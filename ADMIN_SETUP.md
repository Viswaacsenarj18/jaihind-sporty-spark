# Jaihind Sportify - Admin Setup Guide

## 🎉 Your Full-Stack System is Ready!

This system includes:
- ✅ **Wishlist Feature**: Users can add/remove products from their wishlist
- ✅ **Admin Panel**: Complete product management system
- ✅ **Real-time Updates**: Changes automatically reflect across all users
- ✅ **Authentication**: Secure login/signup system
- ✅ **Database**: PostgreSQL database powered by Lovable Cloud

## 🚀 Quick Start

### 1. Create an Account
1. Go to `/auth` route
2. Click "Create Account"
3. Fill in your details and sign up

### 2. Make Yourself Admin
After signing up, you need admin privileges to access the product management panel.

**Option A: Using the Cloud Interface**
1. Click the "Cloud" tab in Lovable
2. Go to the "Data" section
3. Find the `user_roles` table
4. Click "Insert row"
5. Fill in:
   - `user_id`: Your user ID (find it in the `profiles` table)
   - `role`: Select "admin"
6. Click "Save"

**Option B: Using SQL**
1. Click the "Cloud" tab in Lovable
2. Go to "SQL Editor" (if available)
3. Run this query (replace with your email):
```sql
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'your-email@example.com'
ON CONFLICT (user_id, role) DO NOTHING;
```

### 3. Access Admin Panel
1. Logout and login again (so admin status is recognized)
2. Go to `/admin/products`
3. Start managing products!

## 📱 Features Overview

### For Users:
- **Browse Products**: View all products with real-time stock updates
- **Wishlist**: Save favorite products (requires login)
- **Shopping Cart**: Add items and proceed to checkout
- **Authentication**: Secure login/signup

### For Admins:
- **Product Management**: 
  - Add new products
  - Edit existing products
  - Delete products
  - Set pricing and stock levels
- **Real-time Sync**: Changes instantly visible to all users
- **Categories**: Cricket, Badminton, Tennis, Football, Kabaddi, T-Shirts & Apparel

## 🔗 Important Routes

- `/auth` - Login/Signup
- `/` - Homepage with featured products
- `/shop` - All products
- `/wishlist` - Your wishlist (requires login)
- `/cart` - Shopping cart
- `/admin/products` - Product management (admin only)

## 💡 Tips

1. **Test Real-time Updates**: 
   - Open the site in two browsers
   - Add a product as admin in one
   - Watch it appear instantly in the other!

2. **Wishlist Feature**:
   - Hover over products to see the heart icon
   - Click to add/remove from wishlist
   - View all wishlist items at `/wishlist`

3. **Product Images**:
   - Use direct image URLs
   - Recommended: Unsplash, product websites, or upload to Lovable Cloud Storage

## 🎨 Customization

- All products are stored in the `products` table
- Wishlists are in the `wishlist` table  
- User roles are in the `user_roles` table
- Products auto-sync via Supabase Realtime

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- Only admins can add/edit/delete products
- Users can only manage their own wishlists
- Authentication required for wishlist features

Enjoy your full-stack sports e-commerce platform! 🏆

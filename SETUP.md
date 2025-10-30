# Jaihind Sports - Full Stack Setup Guide

## 🏗️ Project Structure

This is a full-stack e-commerce application with:
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🚀 Backend Setup

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create `backend/.env` file:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/jaihind_sports
JWT_SECRET=yourSuperSecretKey123
NODE_ENV=development
```

For MongoDB Atlas, use:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/jaihind_sports
```

### 3. Create Default Admin Account

```bash
cd backend
npm run create-admin
```

This creates an admin account with:
- **Email**: admin@jaihind-sports.com
- **Password**: admin123

### 4. Start Backend Server

```bash
cd backend
npm run dev
```

Backend will run on: `http://localhost:5000`

## 🎨 Frontend Setup

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Configure API URL

Create `.env.local` file in root:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Frontend Development Server

```bash
npm run dev
```

Frontend will run on: `http://localhost:5173`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/admin/login` - Admin login

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

## 🔐 Default Credentials

### Admin Access
- Email: `admin@jaihind-sports.com`
- Password: `admin123`

## 📱 Frontend Routes

- `/` - Home page
- `/auth` - Login/Register page
- `/admin/products` - Product management (Admin only)
- `/cart` - Shopping cart
- `/checkout` - Checkout page
- `/about-us` - About page
- `/contact-us` - Contact page

## 🛠️ Common Issues

### Backend won't start
- Make sure MongoDB is running
- Check if port 5000 is available
- Verify MONGO_URI in .env file

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check VITE_API_URL in .env.local
- Check browser console for CORS errors

### Database connection failed
- MongoDB service must be running
- Check MONGO_URI format
- For local MongoDB: `mongodb://127.0.0.1:27017/jaihind_sports`
- For Atlas: Use connection string from MongoDB Atlas

## 🚢 Deployment

### Backend (Render/Railway/Heroku)
1. Push code to GitHub
2. Connect repository to hosting service
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variable: `VITE_API_URL`

## 📝 Notes

- **Important**: Lovable cannot run the Node.js backend. You must run it separately.
- The frontend preview in Lovable will show errors until backend is running.
- For production, deploy backend to a hosting service and update `VITE_API_URL`.

## 🤝 Support

For issues or questions, check:
- MongoDB connection string
- Backend console logs
- Frontend browser console
- Network tab for API requests

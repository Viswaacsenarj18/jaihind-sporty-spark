# 🌍 Environment Setup - Localhost vs Render

## Localhost Development

### URLs
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Database: MongoDB Atlas (same as production)

### Quick Start
```bash
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend
npm run dev

# Terminal 3: Tests
node test-notifications.js localhost
```

### Create Admin (First Time)
```bash
cd backend/scripts
node CreateDefaultAdmin.js

# Admin: admin@jaihind.com / admin123
```

### Restart Backend
```bash
# Stop with Ctrl+C
npm start
```

## Render Production

### URLs
- Frontend: https://jaihind-sporty-spark.vercel.app
- Backend: https://jaihind-sporty-spark-backend.onrender.com
- Database: MongoDB Atlas (same)

### Deployment
```bash
git add .
git commit -m "Fix notifications"
git push origin main

# Auto-deploys:
# Render backend: 5-10 minutes
# Vercel frontend: 3-5 minutes
```

### View Logs
- Render: https://dashboard.render.com → Logs
- Vercel: https://vercel.com → Deployments → Logs

### Test Production
```bash
node test-notifications.js render
```

## Database (Shared)

- **Connection:** MongoDB Atlas (cloud)
- **Database:** jaihind_sports
- **Accessibility:** Both environments use same DB
- **Data:** Persists across all environments

## API Configuration (Auto-Detection)

Located in: `src/config/api.ts`

```typescript
const baseURL = 
  window.location.hostname === "localhost" 
    ? "http://localhost:5000"
    : "https://jaihind-sporty-spark-backend.onrender.com";
```

✅ No code changes needed - automatically detects environment!

## Development Workflow

```
1. Code locally
   ↓
2. Test on localhost
   ↓
3. Commit to GitHub
   ↓
4. Render auto-deploys
   ↓
5. Test on production
   ↓
6. Monitor logs
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5000 in use | Kill process or use `PORT=5001 npm start` |
| MongoDB timeout | Already fixed with retry logic |
| CORS error | Already configured for both |
| 401 error | Get new token from login |
| Cold start slow | Render first request slower (normal) |

## Quick Commands

```bash
# Localhost
cd backend && npm start     # Backend
npm run dev                 # Frontend
node test-notifications.js localhost  # Test

# Production
git push origin main        # Deploy
https://dashboard.render.com  # Check Render
https://vercel.com         # Check Vercel

# Monitor
tail -f backend/logs       # Backend logs
F12 in browser            # Frontend logs
```

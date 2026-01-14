# 🚀 Vercel Deployment Guide for TedBus

## ✅ Pre-Deployment Checklist

Your project is **READY** for Vercel deployment! Here's what has been configured:

### Files Created/Updated:
- ✅ `vercel.json` - Vercel configuration
- ✅ `.gitignore` - Ignore unnecessary files
- ✅ `frontend/package.json` - Added `vercel-build` script
- ✅ `frontend/server/package.json` - Updated start script for production

### What's Configured:
- ✅ Angular build configuration
- ✅ Node.js backend API routes
- ✅ Static file serving
- ✅ Production environment variables
- ✅ Build optimization

## 🌐 Deployment Options

You have **TWO options** for deploying to Vercel:

### Option 1: Deploy via GitHub (Recommended)
This enables automatic deployments on every push.

### Option 2: Deploy via Vercel CLI
Quick deployment without GitHub integration.

---

## 📦 Option 1: Deploy via GitHub (Recommended)

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: TedBus application ready for deployment"

# Create repository on GitHub (go to github.com)
# Then add remote and push
git remote add origin https://github.com/YOUR-USERNAME/tedbus.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"** (use GitHub account)
3. Click **"Add New Project"**
4. Click **"Import Git Repository"**
5. Select your **tedbus** repository
6. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `cd frontend && npm install && npm run build:prod`
   - **Output Directory**: `frontend/dist/frontend/browser`
   - **Install Command**: `npm install`

7. Add Environment Variables (click "Environment Variables"):
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   ```

8. Click **"Deploy"**

### Step 3: Wait for Deployment
- Vercel will build and deploy your app (takes 2-5 minutes)
- You'll get a URL like: `https://tedbus.vercel.app`

---

## 🖥️ Option 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

```bash
# From your project root directory
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? tedbus
# - Directory? ./
# - Override settings? No
```

### Step 4: Deploy to Production

```bash
vercel --prod
```

---

## 🗄️ Database Setup (MongoDB Atlas)

Since Vercel is serverless, you need a cloud database:

### Step 1: Create MongoDB Atlas Account
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free
3. Create a new cluster (Free tier M0)

### Step 2: Get Connection String
1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy the connection string
4. Replace `<password>` with your database password

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/tedbus?retryWrites=true&w=majority
```

### Step 3: Add to Vercel
1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Environment Variables"**
3. Add:
   - **Name**: `MONGODB_URI`
   - **Value**: Your connection string
4. Click **"Save"**

### Step 4: Update Backend Code
Update `frontend/server/index.js`:

```javascript
// Replace the MongoDB connection line with:
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tedbus';
mongoose.connect(mongoURI)
```

### Step 5: Seed Database
Run locally to seed your Atlas database:
```bash
# Update seedDatabase.js with Atlas URI
MONGODB_URI=your_atlas_uri node frontend/server/seedDatabase.js
```

---

## ⚙️ Environment Variables

Add these to Vercel (Settings → Environment Variables):

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `MONGODB_URI` | Your Atlas URI | Database connection |
| `PORT` | `5001` | Backend port (optional) |

---

## 🔧 Post-Deployment Configuration

### Update API URLs
After deployment, update your frontend API configuration:

**File**: `frontend/src/app/config.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-app.vercel.app/api'
};
```

### Update CORS Settings
**File**: `frontend/server/index.js`

```javascript
const cors = require('cors');
app.use(cors({
  origin: ['https://your-app.vercel.app', 'http://localhost:4200'],
  credentials: true
}));
```

---

## 🧪 Testing Your Deployment

After deployment, test these features:

### ✅ Frontend Tests
- [ ] Landing page loads
- [ ] Search functionality works
- [ ] Language selector works
- [ ] Theme toggle works
- [ ] Navigation works

### ✅ Backend Tests
- [ ] API endpoints respond: `https://your-app.vercel.app/api/bus`
- [ ] Database connection works
- [ ] Booking creation works
- [ ] User authentication works

### ✅ Integration Tests
- [ ] Bus search returns results
- [ ] Seat selection works
- [ ] Booking flow completes
- [ ] My Trips displays bookings

---

## 🐛 Common Issues & Solutions

### Issue 1: Build Fails
**Error**: `Module not found` or `Cannot find module`

**Solution**:
```bash
# Clear node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue 2: API Routes Not Working
**Error**: `404 Not Found` on API calls

**Solution**:
- Check `vercel.json` routes configuration
- Ensure API calls use `/api/` prefix
- Verify backend is deployed correctly

### Issue 3: Database Connection Fails
**Error**: `MongooseError: Connection failed`

**Solution**:
- Verify MongoDB Atlas connection string
- Check IP whitelist (allow all: `0.0.0.0/0`)
- Ensure environment variable is set in Vercel

### Issue 4: Large Bundle Size
**Error**: `Bundle size exceeds limit`

**Solution**:
Update `frontend/angular.json`:
```json
"budgets": [
  {
    "type": "initial",
    "maximumWarning": "3mb",
    "maximumError": "6mb"
  }
]
```

### Issue 5: Environment Variables Not Working
**Solution**:
- Redeploy after adding environment variables
- Check variable names match exactly
- Restart Vercel project

---

## 📊 Monitoring Your Deployment

### Vercel Dashboard
- **Analytics**: View traffic and performance
- **Logs**: Check runtime logs for errors
- **Deployments**: View deployment history

### Check Logs
```bash
vercel logs your-deployment-url
```

---

## 🔄 Continuous Deployment

Once connected to GitHub:
- Every push to `main` branch triggers automatic deployment
- Pull requests get preview deployments
- Rollback to previous versions anytime

---

## 🎯 Custom Domain (Optional)

### Add Custom Domain
1. Go to Vercel project → **Settings** → **Domains**
2. Add your domain (e.g., `tedbus.com`)
3. Update DNS records as instructed
4. SSL certificate is automatic

---

## 📈 Performance Optimization

### Already Configured:
- ✅ Production build optimization
- ✅ Code splitting
- ✅ Tree shaking
- ✅ Minification
- ✅ Gzip compression

### Additional Optimizations:
- Enable Vercel Analytics
- Use Vercel Edge Network (automatic)
- Implement lazy loading for routes
- Optimize images with Vercel Image Optimization

---

## 🆘 Need Help?

### Resources:
- [Vercel Documentation](https://vercel.com/docs)
- [Angular Deployment Guide](https://angular.io/guide/deployment)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)

### Support:
- Vercel Support: support@vercel.com
- GitHub Issues: Create issue in your repository

---

## ✅ Deployment Checklist

Before going live:

- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] Database seeded with sample data
- [ ] Environment variables configured in Vercel
- [ ] API URLs updated in frontend
- [ ] CORS settings updated
- [ ] Build successful on Vercel
- [ ] All features tested on live site
- [ ] Custom domain configured (optional)
- [ ] Analytics enabled (optional)

---

## 🎉 Success!

Your TedBus application is now live on Vercel!

**Your URLs:**
- Frontend: `https://your-app.vercel.app`
- API: `https://your-app.vercel.app/api`

**Next Steps:**
1. Share your live URL
2. Monitor analytics
3. Gather user feedback
4. Iterate and improve

---

*Last Updated: January 2026*

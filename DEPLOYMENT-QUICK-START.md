# 🚀 Quick Start: Deploy to Vercel in 5 Minutes

## ✅ Your Project is READY!

All configuration files have been created. Follow these simple steps:

---

## 🎯 Fastest Method: GitHub + Vercel

### 1️⃣ Push to GitHub (2 minutes)

```bash
# Initialize git
git init
git add .
git commit -m "Ready for deployment"

# Create repo on github.com, then:
git remote add origin https://github.com/YOUR-USERNAME/tedbus.git
git branch -M main
git push -u origin main
```

### 2️⃣ Deploy on Vercel (3 minutes)

1. Go to **[vercel.com](https://vercel.com)** → Sign up with GitHub
2. Click **"New Project"** → Import your **tedbus** repository
3. Configure:
   - Framework: **Other**
   - Build Command: `cd frontend && npm install && npm run build:prod`
   - Output Directory: `frontend/dist/frontend/browser`
4. Add Environment Variable:
   - `MONGODB_URI` = `your_mongodb_atlas_connection_string`
5. Click **"Deploy"** ✨

### 3️⃣ Done! 🎉

Your app will be live at: `https://tedbus-xxxxx.vercel.app`

---

## 🗄️ Database Setup (MongoDB Atlas)

**Quick Setup:**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster (M0)
3. Get connection string
4. Add to Vercel environment variables
5. Seed database:
   ```bash
   MONGODB_URI=your_uri node frontend/server/seedDatabase.js
   ```

---

## 🔧 Important Files Created

- ✅ `vercel.json` - Deployment configuration
- ✅ `.gitignore` - Files to ignore
- ✅ `vercel-deployment-guide.md` - Detailed guide
- ✅ Updated `package.json` files

---

## 📝 What to Update After Deployment

### 1. Update API URL
**File**: `frontend/src/app/config.ts`
```typescript
export const apiUrl = 'https://your-app.vercel.app/api';
```

### 2. Update CORS
**File**: `frontend/server/index.js`
```javascript
app.use(cors({
  origin: 'https://your-app.vercel.app'
}));
```

### 3. Redeploy
```bash
git add .
git commit -m "Update API URLs"
git push
```

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails | Check `vercel-deployment-guide.md` |
| API not working | Verify `/api/` routes in vercel.json |
| Database error | Check MongoDB Atlas connection string |
| 404 errors | Ensure output directory is correct |

---

## 📚 Full Documentation

For detailed instructions, see: **`vercel-deployment-guide.md`**

---

**Ready to deploy? Let's go! 🚀**

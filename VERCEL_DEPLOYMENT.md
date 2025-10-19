# 🚀 Vercel Deployment Guide - Document Tweaker

Complete guide to deploy your Document Tweaker application on Vercel (both frontend and backend).

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure for Vercel](#project-structure-for-vercel)
3. [Setup Steps](#setup-steps)
4. [Environment Variables](#environment-variables)
5. [Deploy to Vercel](#deploy-to-vercel)
6. [Testing Deployment](#testing-deployment)
7. [Troubleshooting](#troubleshooting)
8. [Custom Domain](#custom-domain)

---

## 🎯 Prerequisites

Before deploying to Vercel, you need:

### Required Accounts
- ✅ **Vercel Account** - Sign up at https://vercel.com/signup
- ✅ **GitHub Account** - Your code needs to be in a Git repository
- ✅ **Unstract API Key** - Get from https://unstract.com/
- ✅ **Gemini API Key** - Get from https://makersuite.google.com/app/apikey

### Required Tools
- ✅ **Git** - Install from https://git-scm.com/
- ✅ **Vercel CLI** (optional) - `npm install -g vercel`

---

## 📁 Project Structure for Vercel

Your project should have this structure:

```
doc_tweak-main/
├── api/                          # Serverless API functions
│   ├── health.py                 # Health check endpoint
│   ├── enhance.py                # Document enhancement
│   └── requirements.txt          # Python dependencies for API
├── src/                          # React frontend source
│   ├── pages/
│   ├── components/
│   └── lib/
├── public/                       # Static assets
├── dist/                         # Build output (auto-generated)
├── vercel.json                   # Vercel configuration
├── package.json                  # Node.js dependencies
├── vite.config.ts                # Vite configuration
└── .env.local                    # Local environment (not committed)
```

**Key Files Created for Vercel:**
- `vercel.json` - Deployment configuration
- `api/health.py` - Serverless health check
- `api/enhance.py` - Serverless enhancement endpoint
- `api/requirements.txt` - Python dependencies for serverless functions

---

## 🔧 Setup Steps

### Step 1: Prepare Your Repository

1. **Initialize Git (if not already done):**
   ```bash
   cd doc_tweak-main
   git init
   ```

2. **Create `.gitignore` file:**
   ```bash
   # Node
   node_modules/
   dist/
   .env
   .env.local
   
   # Python
   venv/
   __pycache__/
   *.pyc
   
   # Vercel
   .vercel
   
   # Uploads
   uploads/
   processed/
   
   # IDE
   .vscode/
   .idea/
   ```

3. **Add all files:**
   ```bash
   git add .
   git commit -m "Initial commit - Document Tweaker"
   ```

4. **Create GitHub repository:**
   - Go to https://github.com/new
   - Name: `document-tweaker`
   - Public or Private (your choice)
   - Don't initialize with README (you already have code)
   - Click "Create repository"

5. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/document-tweaker.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Verify Vercel Configuration

Make sure `vercel.json` exists with this content:

```json
{
  "version": 2,
  "name": "document-tweaker",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "api/**/*.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "functions": {
    "api/**/*.py": {
      "memory": 1024,
      "maxDuration": 60
    }
  },
  "framework": "vite",
  "installCommand": "npm install",
  "buildCommand": "npm run build"
}
```

### Step 3: Update Frontend Configuration

The frontend is already configured to work with Vercel. It automatically detects if running in production and uses `/api` instead of `http://localhost:5000/api`.

**In `src/lib/enhancedBackendService.ts`:**
```typescript
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "/api" : "http://localhost:5000/api");
```

This means:
- **Development:** Uses `http://localhost:5000/api`
- **Production (Vercel):** Uses `/api` (same domain)

---

## 🔐 Environment Variables

### Step 1: Prepare Your API Keys

You'll need:
- **UNSTRACT_API_KEY** - From https://unstract.com/
- **GEMINI_API_KEY** - From https://makersuite.google.com/app/apikey

### Step 2: Add to Vercel

**Option A: Via Vercel Dashboard (Recommended)**

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - **Name:** `UNSTRACT_API_KEY`
   - **Value:** Your Unstract API key
   - **Environment:** Production, Preview, Development (select all)
   - Click **Save**
   
   - **Name:** `GEMINI_API_KEY`
   - **Value:** Your Gemini API key
   - **Environment:** Production, Preview, Development (select all)
   - Click **Save**

**Option B: Via Vercel CLI**

```bash
vercel env add UNSTRACT_API_KEY
# Paste your Unstract API key when prompted

vercel env add GEMINI_API_KEY
# Paste your Gemini API key when prompted
```

**Important Notes:**
- ⚠️ Never commit API keys to Git
- ⚠️ Environment variables are only available after deployment
- ✅ You can change them anytime in Vercel dashboard

---

## 🚀 Deploy to Vercel

### Method 1: Deploy via Vercel Dashboard (Easiest)

1. **Go to Vercel Dashboard:**
   - Visit https://vercel.com/dashboard
   - Click **"Add New..."** → **"Project"**

2. **Import Git Repository:**
   - Click **"Import Git Repository"**
   - Select your GitHub account
   - Find and select your `document-tweaker` repository
   - Click **"Import"**

3. **Configure Project:**
   - **Project Name:** `document-tweaker` (or your choice)
   - **Framework Preset:** Vite (should auto-detect)
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)

4. **Add Environment Variables:**
   - Expand **"Environment Variables"**
   - Add `UNSTRACT_API_KEY` with your key
   - Add `GEMINI_API_KEY` with your key
   - Make sure both are available for **Production**

5. **Deploy:**
   - Click **"Deploy"**
   - Wait 2-5 minutes for build to complete
   - You'll get a URL like: `https://document-tweaker.vercel.app`

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd doc_tweak-main
   vercel
   ```

4. **Follow prompts:**
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - What's your project's name? **document-tweaker**
   - In which directory is your code? **./
   - Want to override settings? **N**

5. **Add environment variables:**
   ```bash
   vercel env add UNSTRACT_API_KEY production
   vercel env add GEMINI_API_KEY production
   ```

6. **Deploy to production:**
   ```bash
   vercel --prod
   ```

---

## ✅ Testing Deployment

### 1. Check Health Endpoint

Visit:
```
https://your-app.vercel.app/api/health
```

You should see:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00",
  "unstract_configured": true,
  "gemini_configured": true,
  "environment": "vercel"
}
```

### 2. Test Frontend

Visit:
```
https://your-app.vercel.app/enhanced-doc-tweaker
```

You should see:
- ✅ Application loads
- ✅ Green "Backend Ready" badge
- ✅ Can upload files
- ✅ Can enhance documents

### 3. Test Enhancement Flow

1. Upload a test document (TXT, PDF, or Word)
2. Enter enhancement context: "Make this more professional"
3. Click "Enhance with AI"
4. Verify results appear

---

## 🐛 Troubleshooting

### Issue: "API key not configured"

**Symptoms:**
- Health endpoint shows `"unstract_configured": false` or `"gemini_configured": false`

**Solution:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify both `UNSTRACT_API_KEY` and `GEMINI_API_KEY` are set
3. Make sure they're enabled for **Production** environment
4. Redeploy: Go to Deployments → Latest → **"Redeploy"**

### Issue: "Backend server is not running"

**Symptoms:**
- Frontend can't connect to API
- Network errors in browser console

**Solution:**
1. Check if serverless functions are deployed:
   - Go to Vercel Dashboard → Your Project → Functions
   - Should see `api/health.py` and `api/enhance.py`
2. Check function logs:
   - Go to Vercel Dashboard → Your Project → Logs
   - Look for errors
3. Verify `vercel.json` is in root directory

### Issue: "Module not found" in API functions

**Symptoms:**
- Function errors showing missing Python packages

**Solution:**
1. Ensure `api/requirements.txt` exists and contains:
   ```
   google-generativeai==0.3.2
   requests==2.31.0
   python-dotenv==1.0.0
   ```
2. Redeploy the application

### Issue: Build fails

**Symptoms:**
- Deployment fails with build errors

**Solution:**
1. Check build logs in Vercel Dashboard
2. Common fixes:
   - Run `npm install` locally and commit `package-lock.json`
   - Ensure `dist/` is in `.gitignore` (not committed)
   - Verify `vite.config.ts` is properly configured

### Issue: 404 errors on routes

**Symptoms:**
- Routes like `/enhanced-doc-tweaker` return 404

**Solution:**
- Vercel should handle this automatically with SPA routing
- If issues persist, add to `vercel.json`:
  ```json
  {
    "rewrites": [
      { "source": "/((?!api).*)", "destination": "/index.html" }
    ]
  }
  ```

### Issue: Function timeout

**Symptoms:**
- "Function execution timed out"

**Solution:**
1. Increase timeout in `vercel.json`:
   ```json
   "functions": {
     "api/**/*.py": {
       "memory": 1024,
       "maxDuration": 60
     }
   }
   ```
2. Note: Free plan max is 10s, Pro plan allows up to 60s

---

## 🌐 Custom Domain

### Add Your Own Domain

1. **Purchase a domain** (from GoDaddy, Namecheap, etc.)

2. **Add to Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Domains
   - Click **"Add"**
   - Enter your domain: `yourdomain.com`
   - Click **"Add"**

3. **Configure DNS:**
   - Vercel will show DNS records to add
   - Go to your domain registrar's DNS settings
   - Add the records Vercel provides:
     - Type: `A`, Name: `@`, Value: `76.76.21.21`
     - Type: `CNAME`, Name: `www`, Value: `cname.vercel-dns.com`

4. **Wait for propagation:**
   - DNS changes can take 1-48 hours
   - Vercel will auto-configure SSL certificate

5. **Access your app:**
   - `https://yourdomain.com`
   - `https://yourdomain.com/enhanced-doc-tweaker`

---

## 📊 Monitoring & Analytics

### View Deployment Logs

1. Go to Vercel Dashboard → Your Project
2. Click **"Deployments"**
3. Click on any deployment
4. View:
   - Build logs
   - Function logs
   - Runtime logs

### Monitor Usage

1. Go to Vercel Dashboard → Your Project → **"Analytics"**
2. See:
   - Page views
   - Unique visitors
   - Top pages
   - Load times

### Function Invocations

1. Go to Vercel Dashboard → Your Project → **"Functions"**
2. Click on a function (e.g., `api/enhance.py`)
3. View:
   - Invocation count
   - Execution time
   - Error rate
   - Logs

---

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:

1. **Make changes locally:**
   ```bash
   # Edit files
   git add .
   git commit -m "Update feature"
   git push
   ```

2. **Auto-deployment:**
   - Vercel detects the push
   - Builds and deploys automatically
   - You get a new deployment URL
   - Production URL updates

3. **Preview deployments:**
   - Every branch gets a unique URL
   - Perfect for testing before merging

---

## 💰 Vercel Pricing & Limits

### Free Plan (Hobby)
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Serverless functions: 100GB-Hrs compute time
- ✅ 10-second function timeout
- ✅ Perfect for personal projects

### Pro Plan ($20/month)
- ✅ Everything in Free
- ✅ 1TB bandwidth/month
- ✅ 1,000GB-Hrs compute time
- ✅ 60-second function timeout
- ✅ Priority support
- ✅ Team collaboration

**For Document Tweaker:**
- Free plan is sufficient for personal use
- Consider Pro if high traffic or need longer processing times

---

## 🎯 Optimization Tips

### 1. Reduce Cold Starts
Serverless functions "sleep" when not used. To reduce latency:
- Use Vercel's Edge Functions (faster startup)
- Consider upgrading to Pro for better performance

### 2. Optimize Bundle Size
```bash
# Analyze bundle
npm run build
# Check dist/ folder size
```

### 3. Cache API Responses
Add caching headers in API responses:
```python
self.send_header('Cache-Control', 'public, max-age=3600')
```

### 4. Monitor API Usage
- Check Unstract dashboard for OCR usage
- Check Gemini dashboard for API usage
- Set up alerts for quota limits

---

## 🔒 Security Best Practices

1. **Never commit secrets:**
   - Always use Vercel environment variables
   - Add `.env*` to `.gitignore`

2. **Enable CORS properly:**
   - Already configured in API functions
   - Only allows necessary methods

3. **Validate inputs:**
   - API functions validate request data
   - Frontend validates file types and sizes

4. **Use HTTPS:**
   - Vercel provides SSL by default
   - Always access via `https://`

5. **Rate limiting:**
   - Consider adding rate limiting for production
   - Vercel Pro includes DDoS protection

---

## 📚 Additional Resources

- **Vercel Documentation:** https://vercel.com/docs
- **Vercel CLI Docs:** https://vercel.com/docs/cli
- **Python on Vercel:** https://vercel.com/docs/functions/serverless-functions/runtimes/python
- **Environment Variables:** https://vercel.com/docs/projects/environment-variables
- **Custom Domains:** https://vercel.com/docs/custom-domains

---

## 📝 Deployment Checklist

Before deploying, verify:

- [ ] Code is pushed to GitHub
- [ ] `vercel.json` exists in root
- [ ] `api/` folder has Python functions
- [ ] `api/requirements.txt` lists dependencies
- [ ] `.gitignore` excludes sensitive files
- [ ] Environment variables are ready (API keys)
- [ ] Frontend build works locally (`npm run build`)
- [ ] All routes work locally

During deployment:

- [ ] Connected GitHub repository to Vercel
- [ ] Added environment variables in Vercel
- [ ] Build completed successfully
- [ ] No errors in deployment logs
- [ ] Health endpoint returns "healthy"
- [ ] Frontend loads correctly

After deployment:

- [ ] Tested health endpoint
- [ ] Tested document upload
- [ ] Tested AI enhancement
- [ ] Verified API keys work
- [ ] Checked function logs for errors
- [ ] Set up custom domain (optional)

---

## 🎉 Success!

Your Document Tweaker is now live on Vercel! 

**Your app is available at:**
```
https://your-app.vercel.app/enhanced-doc-tweaker
```

**Share it with others and enjoy AI-powered document enhancement! 🚀**

---

## 🆘 Need Help?

- **Vercel Discord:** https://vercel.com/discord
- **Vercel Support:** https://vercel.com/support
- **Project Issues:** Check deployment logs in Vercel Dashboard
- **API Issues:** Check function logs in Vercel Dashboard

---

**Last Updated:** January 2024
**Version:** 1.0
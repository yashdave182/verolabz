# 🚀 HuggingFace Spaces Deployment Guide

Complete step-by-step guide to deploy your LaTeX-enhanced document backend on HuggingFace Spaces.

## 📦 Files Ready for Deployment

All these files are in the `backend` folder and need to be uploaded to HuggingFace:

```
backend/
├── app.py                    # Main Flask application
├── gemini_client.py          # Gemini API integration
├── latex_processor.py        # LaTeX processing logic
├── document_converter.py     # Document conversion utilities
├── requirements.txt          # Python dependencies
├── Dockerfile               # Docker container configuration
├── .gitignore              # Git ignore rules
├── .env.example            # Environment template (don't upload .env!)
├── README.md               # Documentation
└── test_backend.py         # Test script (optional)
```

## 🎯 Step-by-Step Deployment

### Step 1: Create HuggingFace Account

1. Go to [https://huggingface.co/join](https://huggingface.co/join)
2. Sign up with your email or GitHub account
3. Verify your email

### Step 2: Create a New Space

1. Visit [https://huggingface.co/new-space](https://huggingface.co/new-space)
2. Fill in the details:
   - **Owner**: Your username
   - **Space name**: Choose a name (e.g., `doc-latex-enhancer`)
   - **License**: Apache 2.0 (or your choice)
   - **Select the Space SDK**: **Docker** ⚠️ IMPORTANT: Must be Docker!
   - **Hardware**: CPU basic - 2 vCPU - 16 GB (Free tier)
   - **Visibility**: Public or Private (your choice)
3. Click **Create Space**

### Step 3: Upload Files

You have two options:

#### Option A: Web Upload (Easiest)

1. In your Space, click **Files** → **Add file** → **Upload files**
2. Drag and drop ALL files from the `backend` folder
3. Add commit message: "Initial backend deployment"
4. Click **Commit changes to main**

#### Option B: Git Upload (Advanced)

```bash
# Clone your space
git clone https://huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE_NAME
cd YOUR_SPACE_NAME

# Copy all backend files
cp -r path/to/backend/* .

# Commit and push
git add .
git commit -m "Initial backend deployment"
git push
```

### Step 4: Set Environment Variables (Secret)

⚠️ **IMPORTANT**: Never commit your API key to the repository!

1. In your Space, go to **Settings**
2. Scroll to **Repository secrets**
3. Click **New secret**
4. Add your Gemini API key:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your actual Gemini API key (get it from [Google AI Studio](https://makersuite.google.com/app/apikey))
5. Click **Save**

### Step 5: Wait for Build

1. Go to the **Logs** tab in your Space
2. Watch the build process (takes 2-5 minutes)
3. Look for messages like:
   ```
   Building Docker image...
   Installing dependencies...
   Running on http://0.0.0.0:7860
   ```
4. Once you see "Application startup complete", it's ready!

### Step 6: Test Your Backend

Your backend is now live at:
```
https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space
```

#### Test the Health Endpoint

Open in browser or use curl:
```bash
curl https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "LaTeX Document Enhancement API",
  "version": "1.0.0"
}
```

#### Test Document Enhancement

Use curl or Postman:
```bash
curl -X POST https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space/enhance \
  -F "file=@test_document.docx" \
  -F "prompt=Make this more professional" \
  -o enhanced.docx
```

### Step 7: Update Frontend

Once deployed, update your frontend to use the new backend URL:

**File**: `src/pages/EnhancedDocTweaker.tsx`

Change line 34 from:
```typescript
const BACKEND_URL = "https://omgy-vero-back-test.hf.space";
```

To:
```typescript
const BACKEND_URL = "https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space";
```

Replace with your actual Space URL!

## 🔍 Monitoring & Debugging

### View Logs

1. Go to your Space
2. Click **Logs** tab
3. Watch real-time logs of your application

### Common Issues

#### Build Fails

**Problem**: Docker build fails
**Solution**: 
- Check all files are uploaded correctly
- Verify `Dockerfile` syntax
- Check `requirements.txt` for typos

#### App Crashes on Startup

**Problem**: Application starts but crashes
**Solution**:
- Check `GEMINI_API_KEY` is set in secrets
- View logs for error messages
- Verify API key is valid

#### API Returns 500 Error

**Problem**: `/enhance` endpoint returns errors
**Solution**:
- Check logs for detailed error
- Verify uploaded file format is supported
- Test with smaller files first

#### CORS Errors from Frontend

**Problem**: Browser blocks requests
**Solution**:
- Verify `flask-cors` is in requirements.txt
- Check CORS is enabled in app.py (it is by default)
- Try accessing API directly first

## 📊 Space Settings

### Recommended Settings

- **Hardware**: CPU basic (free) works fine
- **Visibility**: Public (unless sensitive data)
- **Sleep time**: Default (Space sleeps after inactivity)

### Upgrading Hardware

If you get high traffic:
1. Settings → Hardware
2. Upgrade to CPU basic - 2 vCPU (still free)
3. Or use paid GPU for faster processing

## 🔐 Security Best Practices

✅ **DO:**
- Use Repository secrets for API keys
- Keep `.env` in `.gitignore`
- Use HTTPS endpoints only
- Validate input files

❌ **DON'T:**
- Commit API keys to repository
- Share your Space URL with API key embedded
- Accept extremely large files (add size limits)

## 🎨 Customization

### Change Port (if needed)

Default port is 7860 (HuggingFace standard). To change:

1. Edit `Dockerfile`:
   ```dockerfile
   EXPOSE 8080
   CMD ["gunicorn", "--bind", "0.0.0.0:8080", ...]
   ```

2. Add to Repository secrets:
   ```
   PORT=8080
   ```

### Add Rate Limiting

To prevent abuse, add Flask-Limiter:

1. Add to `requirements.txt`:
   ```
   flask-limiter==3.5.0
   ```

2. Update `app.py`:
   ```python
   from flask_limiter import Limiter
   
   limiter = Limiter(app, default_limits=["100 per hour"])
   ```

## 📈 Usage Limits

### HuggingFace Free Tier
- CPU: 2 vCPU, 16GB RAM
- Storage: 10GB
- No time limits
- Space sleeps after 48h inactivity

### Gemini API Free Tier
- 60 requests per minute
- 1,500 requests per day
- Check current limits: [Google AI Studio](https://makersuite.google.com/)

## ✅ Deployment Checklist

Before going live, verify:

- [ ] All files uploaded to HuggingFace Space
- [ ] Space type is **Docker**
- [ ] `GEMINI_API_KEY` set in Repository secrets
- [ ] Build completed successfully
- [ ] `/health` endpoint returns success
- [ ] Test document enhancement works
- [ ] Frontend updated with new backend URL
- [ ] CORS allows your frontend domain
- [ ] Logs show no errors

## 🎉 You're Live!

Congratulations! Your LaTeX-enhanced document backend is now deployed and ready to use!

### Next Steps

1. Share your Space with users
2. Monitor usage in HuggingFace dashboard
3. Check Gemini API usage in Google AI Studio
4. Add more features as needed

### Get Your Space URL

Your backend is available at:
```
https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space
```

Example:
```
https://john-doc-enhancer.hf.space
```

---

**Need Help?** Check the logs first, then review the README.md troubleshooting section!

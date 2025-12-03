# 🚀 Quick Deployment Checklist

## Before You Start

- [ ] Have your Gemini API key ready
- [ ] HuggingFace account created
- [ ] All files in `backend/` folder ready

## Deployment Steps

### 1️⃣ Create HuggingFace Space

**URL**: https://huggingface.co/new-space

**Settings**:
- SDK: **Docker** ⚠️ (REQUIRED!)
- Hardware: CPU basic (Free)
- Visibility: Your choice

### 2️⃣ Upload Files

Upload ALL files from `backend/` folder:

```
✅ app.py
✅ gemini_client.py
✅ latex_processor.py
✅ document_converter.py
✅ requirements.txt
✅ Dockerfile
✅ .gitignore
✅ .env.example
✅ README.md
✅ DEPLOYMENT.md
✅ FILES_SUMMARY.md
✅ test_backend.py (optional)
```

### 3️⃣ Set Secret

**Settings → Repository secrets → New secret**

- Name: `GEMINI_API_KEY`
- Value: Your Gemini API key

Get key: https://makersuite.google.com/app/apikey

### 4️⃣ Wait for Build

**Logs tab** - Watch for:
```
✅ Building Docker image...
✅ Installing dependencies...
✅ Running on http://0.0.0.0:7860
```

Time: 2-5 minutes

### 5️⃣ Test Your Backend

**Health Check**:
```bash
https://YOUR_USERNAME-SPACE_NAME.hf.space/health
```

Expected:
```json
{"status": "healthy", ...}
```

### 6️⃣ Update Frontend

**File**: `src/pages/EnhancedDocTweaker.tsx`

**Line 34**: Change to your Space URL:
```typescript
const BACKEND_URL = "https://YOUR_USERNAME-SPACE_NAME.hf.space";
```

### 7️⃣ Test Full Flow

1. Upload a document
2. Add enhancement instructions
3. Click "Enhance with AI"
4. Download enhanced document
5. Verify LaTeX formatting

## 🎯 Your Backend URL

```
https://YOUR_USERNAME-SPACE_NAME.hf.space
```

## 📋 Common Issues

| Issue | Solution |
|-------|----------|
| Build fails | Check all files uploaded |
| 500 error | Verify `GEMINI_API_KEY` in secrets |
| CORS error | Already configured, check URL |
| Timeout | File too large, use smaller test |

## ✅ Success Indicators

- [ ] Build completed without errors
- [ ] `/health` returns healthy status
- [ ] Can upload document
- [ ] Enhancement completes
- [ ] Can download result
- [ ] LaTeX equations formatted properly

## 📞 Get Help

1. Check [DEPLOYMENT.md](file:///c:/Users/yashd/Downloads/verolabz_prod/DocTweaker/backend/DEPLOYMENT.md)
2. View HuggingFace Logs tab
3. Test with curl first
4. Verify API key is valid

## 🎉 Done!

Once all checkboxes are ✅, you're live!

Share your Space: `https://huggingface.co/spaces/YOUR_USERNAME/SPACE_NAME`

---

**Remember:**
- Never commit `.env` file
- Set API key in HuggingFace secrets only
- Test /health before testing /enhance
- Start with small documents

---

**Quick Test Command**:
```bash
curl -X POST https://YOUR-SPACE.hf.space/enhance \
  -F "file=@test.docx" \
  -F "prompt=Make professional" \
  -o enhanced.docx
```

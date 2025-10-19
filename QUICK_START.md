# 🚀 Quick Start Guide - Document Tweaker

Get up and running in 5 minutes!

## ⚡ Fastest Setup (Windows)

1. **Get Your API Keys First**
   
   **Unstract API Key:**
   - Go to: https://unstract.com/
   - Sign up (free)
   - Go to Dashboard → API Keys → Create New Key
   - Copy the key
   
   **Gemini API Key:**
   - Go to: https://makersuite.google.com/app/apikey
   - Sign in with Google
   - Click "Create API Key"
   - Copy the key

2. **Configure Environment**
   ```bash
   # In the project folder, copy the example file
   copy .env.example .env
   
   # Open .env in notepad and paste your keys
   notepad .env
   ```
   
   Your `.env` should look like:
   ```
   UNSTRACT_API_KEY=sk-xxxxxxxxxxxxx
   GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxx
   ```

3. **Run the Application**
   ```bash
   # Just double-click this file or run:
   start.bat
   ```
   
   This will:
   - Install everything automatically
   - Start backend server (Flask)
   - Start frontend server (Vite)
   - Open 2 terminal windows

4. **Open in Browser**
   ```
   http://localhost:5173/enhanced-doc-tweaker
   ```

## 🎯 First Use

1. **Upload a Document**
   - Click "Choose File"
   - Select any `.pdf`, `.doc`, `.docx`, or `.txt` file

2. **Tell the AI What You Want**
   ```
   Example: "Make this more professional for a business proposal"
   ```

3. **Click "Enhance with AI"**
   - Wait 10-30 seconds
   - Watch the progress bar

4. **Get Your Enhanced Document**
   - Review original vs enhanced
   - Click "Download" or "Copy"

## 📝 Example Enhancement Requests

**For Job Applications:**
```
Make this cover letter more compelling and highlight my achievements 
for a senior position
```

**For Academic Papers:**
```
Improve academic tone, fix grammar, and strengthen arguments
```

**For Business Documents:**
```
Make this more persuasive and professional for executive audience
```

**For Marketing Content:**
```
Make this more engaging with strong call-to-action language
```

## ⚠️ Common First-Time Issues

### "Backend server is not running"
**Solution:**
```bash
# Open terminal and run:
cd doc_tweak-main
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python backend_api.py
```

### "API key not configured"
**Solution:**
- Check `.env` file exists in project root (not in `src/` folder)
- No quotes around API keys
- No spaces before/after `=`
- Restart both servers after editing `.env`

### "Cannot connect to backend"
**Solution:**
- Make sure backend terminal shows: `Running on http://0.0.0.0:5000`
- Don't close the backend terminal window
- Check Windows Firewall isn't blocking port 5000

### "File upload fails"
**Solution:**
- Try a smaller file first (under 5MB)
- Use simple PDF/Word document for testing
- Ensure file isn't password-protected

## 🎓 Understanding the Process

```
Your Document (PDF/Word/TXT)
          ↓
    [Upload to Server]
          ↓
[Unstract OCR - Extracts Text]
          ↓
[Gemini AI - Enhances Content]
          ↓
[Format Preservation - Maintains Layout]
          ↓
Enhanced Document Ready!
```

## 🔍 What Each Part Does

**Backend (Flask Server - Port 5000):**
- Receives your file
- Calls Unstract API for OCR
- Calls Gemini API for enhancement
- Preserves formatting
- Returns enhanced text

**Frontend (React/Vite - Port 5173):**
- Beautiful user interface
- File upload handling
- Progress tracking
- Preview and download

## 📦 What Gets Installed

**Python Packages:**
- `flask` - Web server
- `google-generativeai` - Gemini AI SDK
- `requests` - API calls
- `python-docx` - Word document support
- `PyPDF2` - PDF processing

**Node Packages:**
- `react` - UI framework
- `vite` - Build tool
- Various UI components

## 💡 Pro Tips

1. **Start Simple**
   - Test with a small text file first
   - Use clear, simple enhancement instructions
   - Review results before processing large documents

2. **Be Specific**
   - Instead of: "Make it better"
   - Try: "Make this more formal with technical terminology"

3. **Use Appropriate Context**
   - Mention target audience
   - Specify document purpose
   - Include tone preferences

4. **Monitor Usage**
   - Both APIs have free tiers with limits
   - Check dashboards regularly
   - Unstract: ~1000 pages/month free
   - Gemini: Generous free tier

## 🆘 Getting Help

**Check Logs:**
```bash
# Backend terminal shows detailed logs
# Look for lines starting with:
[Unstract] ...
[Gemini] ...
[Format] ...
```

**Test Backend Directly:**
```bash
# In browser, go to:
https://doctweaker.vercel.app/health

# Should show:
{
  "status": "healthy",
  "unstract_configured": true,
  "gemini_configured": true
}
```

**Reset Everything:**
```bash
# Close all terminal windows
# Delete these folders:
venv/
node_modules/
uploads/
processed/

# Run start.bat again
```

## 📚 Next Steps

Once you have it running:

1. Read `README_NEW.md` for detailed features
2. Check `SETUP_GUIDE.md` for advanced configuration
3. Review `backend_api.py` to customize processing
4. Explore `module.py` to understand format preservation

## 🎉 Success Checklist

- [ ] Both API keys configured in `.env`
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Health check returns "healthy"
- [ ] Successfully processed a test document
- [ ] Can download enhanced version

**Congratulations! You're ready to enhance documents with AI! 🚀**

---

**Need Help?** Check the full documentation in:
- `README_NEW.md` - Complete guide
- `SETUP_GUIDE.md` - Detailed setup
- `backend_api.py` - Code comments
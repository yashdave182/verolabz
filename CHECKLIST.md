# ✅ Document Tweaker - Installation Checklist

Use this checklist to ensure everything is set up correctly.

## 📋 Pre-Installation

### System Requirements
- [ ] Windows 10/11 OR Mac/Linux
- [ ] Internet connection
- [ ] At least 2GB free disk space

### Software Requirements
- [ ] Python 3.9 or higher installed
  - Check: Open terminal and run `python --version`
  - Download: https://www.python.org/downloads/
  - ⚠️ During install, check "Add Python to PATH"

- [ ] Node.js 18 or higher installed
  - Check: Open terminal and run `node --version`
  - Download: https://nodejs.org/
  - Use LTS (Long Term Support) version

---

## 🔑 API Keys Setup

### Unstract API Key
- [ ] Created account at https://unstract.com/
- [ ] Navigated to Dashboard → API Keys
- [ ] Generated new API key
- [ ] Copied key to clipboard or text file
- [ ] ✏️ Key starts with: `_______` (write first 7 characters for reference)

### Gemini API Key
- [ ] Visited https://makersuite.google.com/app/apikey
- [ ] Signed in with Google account
- [ ] Clicked "Create API Key"
- [ ] Copied key to clipboard or text file
- [ ] ✏️ Key starts with: `_______` (write first 7 characters for reference)

---

## ⚙️ Configuration

### Environment File
- [ ] Copied `.env.example` to `.env`
  - Command: `copy .env.example .env`
  
- [ ] Opened `.env` in text editor
  - Command: `notepad .env`
  
- [ ] Pasted Unstract API key in `UNSTRACT_API_KEY=`
  - ⚠️ No quotes, no spaces
  - Example: `UNSTRACT_API_KEY=sk-abc123xyz`
  
- [ ] Pasted Gemini API key in `GEMINI_API_KEY=`
  - ⚠️ No quotes, no spaces
  - Example: `GEMINI_API_KEY=AIzaSy123abc`
  
- [ ] Saved and closed the file

---

## 🛠️ Installation

### Run Setup Script
- [ ] Double-clicked `setup.bat` (Windows)
  - OR ran `bash setup.sh` (Mac/Linux)
  
- [ ] Waited for "Virtual environment created" message
- [ ] Waited for "Python packages installed" message
- [ ] Waited for "Node.js packages installed" message
- [ ] Saw "Setup Complete!" at the end

### Verify Installation
- [ ] Folder `venv/` exists in project directory
- [ ] Folder `node_modules/` exists in project directory
- [ ] Folders `uploads/` and `processed/` exist

---

## 🧪 Testing

### Run Diagnostic
- [ ] Ran: `python diagnose.py`
- [ ] All 9 checks passed:
  - [ ] ✓ Python Installation
  - [ ] ✓ Node.js Installation
  - [ ] ✓ Virtual Environment
  - [ ] ✓ Environment Configuration
  - [ ] ✓ Python Packages
  - [ ] ✓ Node.js Modules
  - [ ] ✓ Required Directories
  - [ ] ✓ Port Availability
  - [ ] ✓ Backend Import

### Manual Verification (Optional)
- [ ] Checked Python version: `python --version` shows 3.9+
- [ ] Checked Node version: `node --version` shows 18+
- [ ] Checked pip: `venv\Scripts\python.exe -m pip list` shows packages
- [ ] Checked npm: `npm list --depth=0` shows packages

---

## 🚀 Launch Application

### Start Backend
- [ ] Opened terminal/command prompt
- [ ] Ran `run_backend.bat` (Windows) or `python backend_api.py`
- [ ] Saw "Document Tweaker Backend API" banner
- [ ] Saw "Unstract API Key: ✓ Configured"
- [ ] Saw "Gemini API Key: ✓ Configured"
- [ ] Saw "Running on http://0.0.0.0:5000"
- [ ] **Left this window OPEN**

### Start Frontend
- [ ] Opened NEW terminal/command prompt
- [ ] Ran `run_frontend.bat` (Windows) or `npm run dev`
- [ ] Saw "VITE" banner
- [ ] Saw "Local: http://localhost:5173/"
- [ ] **Left this window OPEN**

### Verify in Browser
- [ ] Opened browser (Chrome, Firefox, or Edge)
- [ ] Navigated to: `http://localhost:5173/enhanced-doc-tweaker`
- [ ] Page loaded successfully
- [ ] Saw "Transform Your Documents with AI Precision" heading
- [ ] Saw green "Backend Ready" badge (if yes, APIs are configured)

---

## 🎯 First Use Test

### Upload Test
- [ ] Clicked "Choose File" button
- [ ] Selected a test document (.txt, .pdf, or .docx)
- [ ] File name appeared below button

### Enhancement Test
- [ ] Typed in enhancement instructions
  - Example: "Make this more professional"
- [ ] Clicked "Enhance with AI" button
- [ ] Progress bar appeared and moved from 0% to 100%
- [ ] Saw stages: Uploading → OCR → Enhancing → Complete

### Results Verification
- [ ] "Original" tab shows extracted text
- [ ] "Enhanced" tab shows improved text
- [ ] Text is different (improved)
- [ ] Clicked "Copy" button - text copied successfully
- [ ] Clicked "Download" button - file downloaded

---

## ✅ Final Checks

### Backend Health
- [ ] Visited: `https://doctweaker.vercel.app/health` in browser
- [ ] Saw JSON response with:
  ```json
  {
    "status": "healthy",
    "unstract_configured": true,
    "gemini_configured": true
  }
  ```

### Console Logs (No Critical Errors)
- [ ] Backend console shows processing logs (not errors)
- [ ] Frontend console (F12 in browser) has no red errors

### File System
- [ ] `uploads/` folder contains uploaded file(s)
- [ ] `processed/` folder contains JSON template(s)

---

## 🎉 Success Criteria

All items checked above? **Congratulations!** Your setup is complete!

You should now be able to:
- ✅ Upload documents (PDF, Word, TXT)
- ✅ Extract text with OCR
- ✅ Enhance with AI
- ✅ Download improved documents
- ✅ See original vs enhanced comparison

---

## 📝 Notes & Troubleshooting

### Common Issues

**If Backend won't start:**
```
Issue: API keys not configured
Fix: Edit .env file, add your actual keys, restart backend
```

**If Frontend shows "Backend Not Configured":**
```
Issue: Backend not running or wrong port
Fix: Make sure run_backend.bat is running in another window
```

**If OCR fails:**
```
Issue: Invalid Unstract API key
Fix: Check key at https://unstract.com/, update .env, restart
```

**If Enhancement fails:**
```
Issue: Invalid Gemini API key  
Fix: Check key at https://makersuite.google.com/, update .env, restart
```

### Quick Fixes

**Reset Everything:**
```bash
# Close both terminal windows
# Delete these folders:
rmdir /s venv
rmdir /s node_modules
# Run setup again
setup.bat
```

**Check Configuration:**
```bash
python diagnose.py
```

**View Logs:**
- Backend logs are in the terminal running backend
- Frontend logs in browser console (F12)

---

## 📞 Support Resources

- **START_HERE.md** - Quick 3-step guide
- **QUICK_START.md** - 5-minute detailed setup
- **SETUP_GUIDE.md** - Complete installation guide
- **README_NEW.md** - Full documentation
- **WORKFLOW.md** - How it works
- **IMPLEMENTATION_SUMMARY.md** - Technical details

### Online Documentation
- Unstract: https://docs.unstract.com/
- Gemini: https://ai.google.dev/docs
- Flask: https://flask.palletsprojects.com/
- React: https://react.dev/

---

## 📅 Date Completed: ___________________

## ✍️ Completed By: ___________________

---

**You're all set! Happy document enhancing! 🚀**
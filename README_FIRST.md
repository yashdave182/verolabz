# 🎯 README FIRST - Document Tweaker Setup

## ⚡ YOU ARE HERE - Follow These Steps:

```
┌─────────────────────────────────────────────────────────────┐
│  Current Status: FRESH INSTALL - PACKAGES NOT INSTALLED    │
│  Error You Saw: "ModuleNotFoundError: No module named 'flask'" │
│  Solution: Follow the 4 steps below ↓                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 WHAT YOU NEED TO DO (12 minutes total):

### ✅ STEP 1: Get API Keys (5 minutes)

**A) Unstract API Key (FREE):**
```
1. Visit: https://unstract.com/
2. Sign up → Dashboard → API Keys → Create New Key
3. COPY the key (starts with something like: sk-...)
```

**B) Gemini API Key (FREE):**
```
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google → Create API Key
3. COPY the key (starts with: AIzaSy...)
```

**💾 Save both keys somewhere safe - you'll need them in Step 2**

---

### ✅ STEP 2: Configure Your Keys (2 minutes)

**Open Command Prompt in this folder and run:**

```batch
REM Copy the template
copy .env.example .env

REM Open in Notepad
notepad .env
```

**In Notepad, you'll see:**
```
UNSTRACT_API_KEY=your_unstract_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

**Replace the text with your actual keys:**
```
UNSTRACT_API_KEY=sk-abc123xyz456
GEMINI_API_KEY=AIzaSy789def012
```

**⚠️ IMPORTANT:**
- NO quotes around keys
- NO spaces before/after =
- Replace the ENTIRE placeholder text

**Save (Ctrl+S) and close Notepad**

---

### ✅ STEP 3: Install Packages (5 minutes)

**Double-click this file:**
```
install.bat
```

**Or run in Command Prompt:**
```batch
install.bat
```

**Wait for:**
```
================================================================================
Installation Complete!
================================================================================
```

**This installs:**
- ✓ Python packages (Flask, Gemini SDK, etc.)
- ✓ Node.js packages (React, Vite, etc.)
- ✓ Creates required folders

---

### ✅ STEP 4: Start the Application

**A) Start Backend (Terminal 1):**

Double-click: `run_backend.bat`

Wait for this message:
```
================================================================================
Document Tweaker Backend API
================================================================================
Unstract API Key: ✓ Configured
Gemini API Key: ✓ Configured
================================================================================
 * Running on http://0.0.0.0:5000
```

**✋ KEEP THIS WINDOW OPEN!**

---

**B) Start Frontend (Terminal 2):**

Double-click: `run_frontend.bat`

Wait for this message:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

**✋ KEEP THIS WINDOW OPEN TOO!**

---

**C) Open Browser:**

Navigate to:
```
http://localhost:5173/enhanced-doc-tweaker
```

You should see the application! 🎉

---

## 🎮 HOW TO USE IT:

```
┌─────────────────────────────────────────────────┐
│  1. Upload Document                             │
│     • Click "Choose File"                       │
│     • Select PDF, Word, or TXT file             │
│                                                 │
│  2. Describe What You Want                      │
│     • Example: "Make this professional"         │
│     • Be specific about your goal               │
│                                                 │
│  3. Click "Enhance with AI"                     │
│     • Progress: 0% → 20% → 40% → 60% → 100%   │
│     • Wait 20-40 seconds                        │
│                                                 │
│  4. Download Enhanced Document                  │
│     • Review in tabs (Original vs Enhanced)     │
│     • Click "Download" or "Copy"                │
└─────────────────────────────────────────────────┘
```

---

## 🆘 TROUBLESHOOTING:

### "No module named 'flask'"
**You're seeing this error because packages aren't installed yet.**

**Solution:**
```batch
install.bat
```

---

### "Python not found"
**Python isn't installed or not in PATH**

**Solution:**
1. Download Python 3.9+ from: https://www.python.org/downloads/
2. During installation, CHECK ☑ "Add Python to PATH"
3. Restart Command Prompt
4. Run `install.bat`

---

### "Node not found"
**Node.js isn't installed**

**Solution:**
1. Download Node.js 18+ from: https://nodejs.org/
2. Install it (use LTS version)
3. Restart Command Prompt
4. Run `install.bat`

---

### "API key not configured"
**Your .env file doesn't have real API keys**

**Solution:**
1. Open `.env` file (not `.env.example`)
2. Make sure you pasted your ACTUAL keys (not the placeholder text)
3. No quotes, no spaces
4. Save the file
5. Restart `run_backend.bat`

---

### "Backend server is not running"
**The Flask server isn't started**

**Solution:**
1. Make sure `run_backend.bat` is running in a terminal window
2. Check for the "Running on http://0.0.0.0:5000" message
3. Don't close that window!

---

## 🧪 VERIFY EVERYTHING WORKS:

Run this diagnostic tool:
```batch
python diagnose.py
```

Should show: **9/9 tests passed ✓**

If any fail, it tells you exactly what to fix!

---

## 📁 FILES REFERENCE:

| File | Purpose | When to Use |
|------|---------|-------------|
| `install.bat` | Install packages | First time only |
| `run_backend.bat` | Start Flask server | Every time |
| `run_frontend.bat` | Start React app | Every time |
| `.env` | Your API keys | Create & configure once |
| `diagnose.py` | Check setup | If problems occur |
| `README_FIRST.md` | **THIS FILE** | Start here! |

---

## 💡 EXAMPLE ENHANCEMENT REQUESTS:

**Business:**
```
"Transform this into a professional executive summary with 
persuasive language and clear value propositions"
```

**Academic:**
```
"Improve academic rigor with scholarly vocabulary and 
strengthen the thesis arguments"
```

**Job Application:**
```
"Make this cover letter more compelling by highlighting 
leadership achievements and quantifiable results"
```

**General:**
```
"Fix grammar, improve clarity, and make the tone more 
professional while preserving the original meaning"
```

---

## 🎯 QUICK COMMAND REFERENCE:

```batch
# First Time Setup (Run Once):
copy .env.example .env       # Copy template
notepad .env                 # Add your API keys
install.bat                  # Install packages

# Every Time You Use It:
run_backend.bat              # Terminal 1 - keep open
run_frontend.bat             # Terminal 2 - keep open
# Then open: http://localhost:5173/enhanced-doc-tweaker

# If Problems:
python diagnose.py           # Check what's wrong

# Stop Application:
# Press Ctrl+C in both terminal windows
```

---

## ✅ SUCCESS CHECKLIST:

After setup, verify these:

- [ ] Backend shows: "Unstract API Key: ✓ Configured"
- [ ] Backend shows: "Gemini API Key: ✓ Configured"  
- [ ] Backend shows: "Running on http://0.0.0.0:5000"
- [ ] Frontend shows: "Local: http://localhost:5173/"
- [ ] Browser opens the application
- [ ] See green "Backend Ready" badge in UI
- [ ] Can upload a test file
- [ ] Can click "Enhance with AI"
- [ ] Results appear with enhanced text

**All checked? 🎉 YOU'RE READY!**

---

## 📚 MORE DOCUMENTATION:

If you need more help:

1. **INSTALL_INSTRUCTIONS.txt** - Simple text instructions
2. **ACTION_PLAN.md** - Complete action plan
3. **START_HERE.md** - Detailed 3-step guide
4. **SETUP_GUIDE.md** - Advanced configuration
5. **README_NEW.md** - Full documentation
6. **WORKFLOW.md** - Visual workflow guide

---

## 🎉 SUMMARY:

```
┌───────────────────────────────────────────────────────┐
│  TO FIX YOUR ERROR:                                   │
│  1. Get 2 API keys (5 min)                           │
│  2. Configure .env file (2 min)                      │
│  3. Run install.bat (5 min) ← THIS FIXES THE ERROR  │
│  4. Run run_backend.bat                              │
│  5. Run run_frontend.bat                             │
│  6. Open browser                                     │
│  7. Enhance documents! 🚀                            │
└───────────────────────────────────────────────────────┘
```

**The error you saw means packages aren't installed yet. Step 3 fixes it!**

**Start with Step 1 above ↑ and you'll be running in 12 minutes!**

---

**Need help? Run:** `python diagnose.py`

**Let's go! 🚀**
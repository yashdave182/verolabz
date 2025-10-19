# 🚀 START HERE - Document Tweaker Setup

## Quick 3-Step Setup

### Step 1: Get Your API Keys (5 minutes)

You need two free API keys:

#### A) Unstract API Key
1. Go to: https://unstract.com/
2. Click "Sign Up" (it's free!)
3. After signing in, go to Dashboard
4. Click "API Keys" in the sidebar
5. Click "Create New API Key"
6. **COPY THE KEY** - you'll need it in Step 2

#### B) Gemini API Key
1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key" button
4. **COPY THE KEY** - you'll need it in Step 2

---

### Step 2: Configure API Keys (2 minutes)

1. **Copy the example file:**
   ```
   copy .env.example .env
   ```

2. **Open .env in Notepad:**
   ```
   notepad .env
   ```

3. **Replace the placeholders with your actual keys:**
   ```
   UNSTRACT_API_KEY=paste_your_unstract_key_here
   GEMINI_API_KEY=paste_your_gemini_key_here
   ```

4. **Save and close** (Ctrl+S, then close Notepad)

---

### Step 3: Run Setup and Start (3 minutes)

**Option A - Automatic (Recommended):**

1. Double-click `setup.bat` 
   - This installs everything needed
   - Wait for "Setup Complete!" message

2. Double-click `run_backend.bat`
   - A window opens showing "Running on http://0.0.0.0:5000"
   - **KEEP THIS WINDOW OPEN**

3. Double-click `run_frontend.bat`
   - A window opens showing the Vite server
   - **KEEP THIS WINDOW OPEN**

4. Open your browser to:
   ```
   http://localhost:5173/enhanced-doc-tweaker
   ```

**Option B - Manual:**

Open Command Prompt and run these commands:

```bash
# Setup (first time only)
python -m venv venv
venv\Scripts\python.exe -m pip install -r requirements.txt
npm install

# Run Backend (Terminal 1)
venv\Scripts\python.exe backend_api.py

# Run Frontend (Terminal 2 - open new window)
npm run dev
```

---

## ✅ You're Ready!

The application should now be open in your browser at:
**http://localhost:5173/enhanced-doc-tweaker**

### How to Use:

1. **Upload a document** (PDF, Word, or TXT file)
   - Click "Choose File" button
   - Select your document

2. **Tell AI what you want**
   - Example: "Make this more professional for a business proposal"
   - Be specific about your goal

3. **Click "Enhance with AI"**
   - Wait 20-40 seconds (progress bar shows status)

4. **Download your enhanced document**
   - Review the results in the tabs
   - Click "Download" or "Copy"

---

## ⚠️ Troubleshooting

### "Backend server is not running"

**Fix:**
```bash
# Make sure you ran setup.bat first
setup.bat

# Then start backend
run_backend.bat
```

### "API key not configured"

**Fix:**
1. Make sure `.env` file exists (not `.env.example`)
2. Open `.env` and check your API keys are pasted correctly
3. No quotes needed around the keys
4. Save the file
5. Restart `run_backend.bat`

### "Virtual environment not found"

**Fix:**
```bash
# Create it manually
python -m venv venv
venv\Scripts\python.exe -m pip install -r requirements.txt
```

### "Port already in use"

**Fix:**
- Close any other applications using ports 5000 or 5173
- Or restart your computer

### "Python not found"

**Fix:**
- Install Python 3.9 or higher from: https://www.python.org/downloads/
- During installation, check "Add Python to PATH"

### "Node not found"

**Fix:**
- Install Node.js 18 or higher from: https://nodejs.org/
- Use the LTS (Long Term Support) version

---

## 🧪 Test Your Setup

Run this diagnostic:
```bash
python diagnose.py
```

This will automatically check everything and tell you what needs fixing.

---

## 📚 Need More Help?

Check these files:
- `QUICK_START.md` - Detailed 5-minute guide
- `SETUP_GUIDE.md` - Complete setup instructions
- `README_NEW.md` - Full documentation
- `WORKFLOW.md` - How the system works

---

## 🎯 Quick Reference

**Start the application:**
1. Run `run_backend.bat`
2. Run `run_frontend.bat`
3. Open http://localhost:5173/enhanced-doc-tweaker

**Stop the application:**
- Press Ctrl+C in both terminal windows
- Or close the windows

**Reinstall everything:**
```bash
setup.bat
```

---

## 💡 Example Enhancement Requests

Try these in the "Enhancement Instructions" field:

**For Business:**
```
Transform this into a compelling executive summary with 
professional tone and clear value propositions
```

**For Academic:**
```
Improve academic rigor with scholarly language and 
strengthen the thesis arguments
```

**For Job Applications:**
```
Make this cover letter more impactful by highlighting 
achievements and leadership experience
```

**For General Improvement:**
```
Fix grammar, improve clarity, and make the tone more 
professional while keeping the original meaning
```

---

## ✨ Features

- 🔍 **OCR Text Extraction** - Reads PDFs and Word docs
- 🤖 **AI Enhancement** - Improves your content intelligently
- 🎨 **Format Preservation** - Keeps your original layout
- 👁️ **Live Preview** - See before and after
- 📥 **Easy Export** - Download or copy with one click

---

**That's it! You're all set to enhance documents with AI! 🚀**

If you have any issues, run `python diagnose.py` for automatic troubleshooting.
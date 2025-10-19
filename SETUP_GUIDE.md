# Document Tweaker - Setup Guide

Complete guide to set up and run the AI-powered document enhancement system with Unstract OCR and Gemini AI.

## 🎯 Overview

This application allows you to:
- Upload documents (PDF, Word, TXT)
- Extract text using Unstract's LLMWhisperer OCR API (preserving layout)
- Enhance content with Google Gemini AI
- Preserve original formatting and structure
- Preview and download enhanced documents

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **Unstract API Key** - [Get it here](https://unstract.com/)
- **Google Gemini API Key** - [Get it here](https://makersuite.google.com/app/apikey)

## 🚀 Quick Start

### Step 1: Clone and Navigate to Project

```bash
cd doc_tweak-main
```

### Step 2: Set Up Backend (Python/Flask)

#### 2.1 Create Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Mac/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

#### 2.2 Install Python Dependencies

```bash
pip install -r requirements.txt
```

#### 2.3 Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
# Unstract LLMWhisperer API Configuration
UNSTRACT_API_KEY=your_actual_unstract_api_key_here

# Google Gemini API Configuration
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**Getting API Keys:**

1. **Unstract API Key:**
   - Visit: https://unstract.com/
   - Sign up for an account
   - Navigate to API Keys section
   - Generate a new API key

2. **Gemini API Key:**
   - Visit: https://makersuite.google.com/app/apikey
   - Sign in with Google account
   - Click "Create API Key"
   - Copy the key

#### 2.4 Start Backend Server

```bash
python backend_api.py
```

You should see:
```
================================================================================
Document Tweaker Backend API
================================================================================
Unstract API Key: ✓ Configured
Gemini API Key: ✓ Configured
================================================================================
 * Running on http://0.0.0.0:5000
```

**Leave this terminal running!**

### Step 3: Set Up Frontend (React/Vite)

Open a **new terminal** window.

#### 3.1 Install Node Dependencies

```bash
npm install
```

#### 3.2 Configure Frontend Environment

Create `.env.local` file:

```bash
# Copy example
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_API_URL=https://doctweaker.vercel.app
```

#### 3.3 Start Frontend Development Server

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 4: Open Application

Open your browser and navigate to:
```
http://localhost:5173/doc-tweaker
```

Or use the enhanced version:
```
http://localhost:5173/enhanced-doc-tweaker
```

## 🎨 Using the Application

### Basic Workflow

1. **Upload Document**
   - Click "Choose File" button
   - Select a PDF, Word, or TXT file
   - Or paste text directly into the text area

2. **Provide Context**
   - Describe what you want to achieve
   - Examples:
     - "Make this more professional for a job application"
     - "Improve grammar and clarity for an academic paper"
     - "Simplify language for general audience"
     - "Add more persuasive language for business proposal"

3. **Click "Enhance with AI"**
   - The system will:
     - Extract text using Unstract OCR (for PDF/Word)
     - Send to Gemini AI for enhancement
     - Preserve original formatting
     - Display results

4. **Review Results**
   - Compare original vs enhanced in tabs
   - Copy to clipboard or download

### Processing Modes

The system automatically selects the best mode based on your file:

- **native_text**: For digital PDFs/Word (fastest)
- **form**: For documents with forms/structure (default)
- **table**: For spreadsheets and tabular data
- **high_quality**: For scanned documents
- **low_cost**: For basic OCR needs

## 🔧 Advanced Configuration

### Backend Configuration

Edit `backend_api.py` to customize:

```python
# Upload limits
UPLOAD_FOLDER = Path("uploads")
PROCESSED_FOLDER = Path("processed")

# Unstract API URL (change region if needed)
UNSTRACT_API_URL = "https://llmwhisperer-api.us-central.unstract.com/api/v2"
```

### Unstract Processing Options

In `backend_api.py`, modify the `extract_text` method parameters:

```python
params = {
    "mode": "form",  # native_text, low_cost, high_quality, form, table
    "output_mode": "layout_preserving",  # or "text"
    "page_seperator": "<<<PAGE_BREAK>>>",
    "mark_vertical_lines": "true",
    "mark_horizontal_lines": "true",
    "add_line_nos": "true",  # Adds line numbers for better tracking
}
```

### Gemini Model Selection

To use a different Gemini model, edit `GeminiEnhancerService` in `backend_api.py`:

```python
# Available models:
# - gemini-2.5-flash (most capable)
# - gemini-1.5-flash (fast and efficient, default)
# - gemini-1.0-pro (legacy)

self.model = genai.GenerativeModel("gemini-2.5-flash")
```

### Format Preservation

The system uses `module.py` for format preservation. To customize:

```python
# In DocumentProcessor class
template = self.extractor.extract_from_text_patterns(original_text)
formatted_result = self.applier.apply_format_smart(enhanced_text, template)
```

## 📁 Project Structure

```
doc_tweak-main/
├── backend_api.py          # Flask backend server
├── module.py               # Format preservation system
├── requirements.txt        # Python dependencies
├── src/
│   ├── pages/
│   │   ├── DocTweaker.tsx           # Original page
│   │   └── EnhancedDocTweaker.tsx   # Enhanced version with OCR
│   └── lib/
│       ├── enhancedBackendService.ts  # API client
│       └── groq.ts                    # Legacy Groq support
├── uploads/                # Uploaded documents (temporary)
├── processed/              # Processed documents and templates
└── .env                    # API configuration (DO NOT COMMIT)
```

## 🐛 Troubleshooting

### Backend Issues

**Problem: "Backend server is not running"**
```bash
# Make sure Flask server is running
python backend_api.py

# Check if port 5000 is available
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Mac/Linux
```

**Problem: "API key not configured"**
- Check `.env` file exists in root directory
- Verify API keys are set correctly (no quotes needed)
- Restart backend server after changing `.env`

**Problem: "Unstract API error"**
- Verify API key is valid
- Check API quota/limits on Unstract dashboard
- Try different processing mode (native_text, form, etc.)

### Frontend Issues

**Problem: "Cannot connect to backend"**
- Verify backend is running on http://localhost:5000
- Check `.env.local` has correct `VITE_API_URL`
- Check browser console for CORS errors

**Problem: "File upload fails"**
- Check file size (max 15MB recommended)
- Verify file type (.pdf, .doc, .docx, .txt)
- Try a different file format

### OCR Issues

**Problem: "No text extracted from PDF"**
- PDF might be scanned/image-based
- Try `high_quality` mode for scanned documents
- Consider converting to searchable PDF first

**Problem: "Processing timeout"**
- Large files may take longer
- Check Unstract API status
- Try smaller documents or fewer pages

### Gemini AI Issues

**Problem: "Enhancement failed"**
- Check Gemini API quota
- Try shorter documents
- Verify API key is active

## 🔐 Security Best Practices

1. **Never commit API keys**
   - `.env` is in `.gitignore`
   - Always use `.env.example` for sharing

2. **Production deployment**
   ```bash
   # Use environment variables, not .env file
   export UNSTRACT_API_KEY=xxx
   export GEMINI_API_KEY=xxx
   ```

3. **Rate limiting**
   - Monitor API usage on provider dashboards
   - Implement rate limiting in production

## 📊 API Endpoints

### Health Check
```
GET /api/health
```

### Upload Document
```
POST /api/upload
Body: FormData with 'file'
```

### Enhance Text
```
POST /api/enhance
Body: { text, context, preserve_format }
```

### Complete Pipeline
```
POST /api/process
Body: FormData with 'file', 'context', 'mode'
```

### Download Enhanced Document
```
GET /api/download/<document_id>
```

## 🚀 Production Deployment

### Backend (Flask)

Use a production WSGI server:

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 backend_api:app
```

Or with Docker:

```dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "backend_api:app"]
```

### Frontend (React)

Build for production:

```bash
npm run build
```

Serve with nginx or deploy to:
- Vercel
- Netlify
- AWS S3 + CloudFront

## 📝 Example Use Cases

### Business Documents
```
Context: "Make this more professional and persuasive for a business proposal"
```

### Academic Papers
```
Context: "Improve clarity and academic tone, fix grammar, enhance vocabulary"
```

### Job Applications
```
Context: "Make this cover letter more compelling and highlight my achievements"
```

### Marketing Content
```
Context: "Make this more engaging and add persuasive call-to-action language"
```

## 🤝 Support

For issues or questions:
1. Check this guide first
2. Review error messages in browser console and backend logs
3. Check API provider status pages
4. Review documentation:
   - Unstract: https://docs.unstract.com/
   - Gemini: https://ai.google.dev/docs

## 📄 License

See LICENSE file for details.

---

**Happy Document Tweaking! 🚀**
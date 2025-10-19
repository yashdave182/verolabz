# 📄 Document Tweaker - AI-Powered Document Enhancement

Transform your documents with AI precision! Upload PDFs, Word documents, or plain text files and let our intelligent system extract, enhance, and preserve your formatting.

## ✨ Features

- 🔍 **Advanced OCR** - Extract text from PDFs and Word documents using Unstract's LLMWhisperer API
- 🤖 **AI Enhancement** - Improve content with Google Gemini AI
- 🎨 **Format Preservation** - Maintain original document structure and layout
- 👁️ **Live Preview** - Compare original vs enhanced versions side-by-side
- 📥 **Easy Download** - Export enhanced documents with one click
- ⚡ **Fast Processing** - Optimized pipeline from upload to download

## 🎯 How It Works

```
1. Upload Document (PDF/Word/TXT)
         ↓
2. OCR Extraction (Unstract API)
         ↓
3. AI Enhancement (Gemini AI)
         ↓
4. Format Preservation
         ↓
5. Download Enhanced Document
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.9+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Unstract API Key** - [Get Free Key](https://unstract.com/)
- **Gemini API Key** - [Get Free Key](https://makersuite.google.com/app/apikey)

### Installation

1. **Clone or extract the project**
   ```bash
   cd doc_tweak-main
   ```

2. **Configure API Keys**
   
   Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   UNSTRACT_API_KEY=your_unstract_key_here
   GEMINI_API_KEY=your_gemini_key_here
   ```

3. **Run the Startup Script** (Windows)
   ```bash
   start.bat
   ```
   
   This will:
   - Create Python virtual environment
   - Install all dependencies
   - Start backend server (Flask)
   - Start frontend server (Vite)

4. **Manual Setup** (Alternative)
   
   **Backend:**
   ```bash
   # Create virtual environment
   python -m venv venv
   
   # Activate it
   venv\Scripts\activate  # Windows
   source venv/bin/activate  # Mac/Linux
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Start server
   python backend_api.py
   ```
   
   **Frontend:** (in new terminal)
   ```bash
   # Install dependencies
   npm install
   
   # Start dev server
   npm run dev
   ```

5. **Open Application**
   
   Navigate to: http://localhost:5173/enhanced-doc-tweaker

## 🎨 Usage Guide

### Basic Enhancement

1. **Upload Your Document**
   - Click "Choose File" and select your PDF, Word, or TXT file
   - OR paste text directly into the text area

2. **Describe Your Goal**
   ```
   Examples:
   • "Make this more professional for a job application"
   • "Improve grammar and clarity for an academic paper"
   • "Simplify language for a general audience"
   • "Add persuasive elements for a business proposal"
   ```

3. **Click "Enhance with AI"**
   - Watch the progress bar as your document is processed
   - OCR extraction, AI enhancement, and format preservation happen automatically

4. **Review & Download**
   - Compare original vs enhanced versions in tabs
   - Copy to clipboard or download as text file

### Advanced Features

#### OCR Processing Modes

The system automatically selects the best mode, but you can customize in code:

- **native_text** - Digital PDFs/Word (fastest, no OCR needed)
- **form** - Documents with forms and structure (default)
- **table** - Spreadsheets and tabular data
- **high_quality** - Scanned documents with poor quality
- **low_cost** - Basic OCR for simple documents

#### Enhancement Contexts

Be specific for best results:

**Business:**
```
"Transform this into a compelling business proposal with professional 
tone, persuasive language, and clear value propositions"
```

**Academic:**
```
"Enhance academic rigor, improve citation flow, strengthen thesis 
statements, and use scholarly vocabulary"
```

**Creative:**
```
"Make this more engaging with vivid descriptions, varied sentence 
structure, and compelling narrative flow"
```

**Technical:**
```
"Clarify technical concepts, improve documentation structure, add 
clear examples, and ensure accuracy"
```

## 📁 Project Structure

```
doc_tweak-main/
├── backend_api.py                 # Flask backend server
├── module.py                      # Format preservation engine
├── requirements.txt               # Python dependencies
├── package.json                   # Node.js dependencies
├── start.bat                      # Windows startup script
├── .env                          # API configuration (create from .env.example)
├── src/
│   ├── pages/
│   │   ├── EnhancedDocTweaker.tsx    # Main UI with OCR & AI
│   │   └── DocTweaker.tsx            # Legacy UI
│   └── lib/
│       └── enhancedBackendService.ts # API client
├── uploads/                       # Temporary upload storage
└── processed/                     # Processed documents & templates
```

## 🔧 API Configuration

### Getting API Keys

#### Unstract API Key

1. Visit https://unstract.com/
2. Sign up for a free account
3. Navigate to Dashboard → API Keys
4. Generate new API key
5. Copy to `.env` file

**Features:**
- Layout-preserving OCR
- Multiple processing modes
- Line number tracking
- Form and table detection

#### Gemini API Key

1. Visit https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy to `.env` file

**Features:**
- Advanced language understanding
- Context-aware enhancement
- Multiple model options
- High-quality output

### API Endpoints

#### Backend API (Port 5000)

```
GET  /api/health              # Check server status
POST /api/upload              # Upload & extract text
POST /api/enhance             # Enhance text with AI
POST /api/process             # Complete pipeline
GET  /api/download/:id        # Download processed doc
```

## 🐛 Troubleshooting

### Backend Issues

**"Backend server is not running"**
```bash
# Check if Python is installed
python --version

# Activate virtual environment
venv\Scripts\activate

# Run backend manually
python backend_api.py
```

**"API key not configured"**
- Ensure `.env` file exists in project root
- Verify API keys are correct (no quotes needed)
- Restart backend after changing `.env`

**"Unstract API error: 401"**
- Check API key validity on Unstract dashboard
- Ensure no extra spaces in `.env` file
- Verify API quota hasn't been exceeded

### Frontend Issues

**"Cannot connect to backend"**
- Verify backend is running on http://localhost:5000
- Check console for CORS errors
- Ensure `.env.local` has `VITE_API_URL=https://doctweaker.vercel.app`

**"File upload fails"**
- Check file size (max 15MB recommended)
- Verify file type (.pdf, .doc, .docx, .txt only)
- Try a simpler/smaller document first

### Processing Issues

**"No text extracted from PDF"**
- PDF might be image-based (scanned)
- Try different OCR mode (high_quality for scans)
- Ensure PDF isn't password-protected

**"Processing timeout"**
- Large documents take longer
- Try processing fewer pages
- Check Unstract API status dashboard

**"Enhancement failed"**
- Check Gemini API quota
- Ensure text isn't too long (max ~8000 tokens)
- Verify API key is active

## 🔐 Security & Best Practices

### API Key Security

✅ **DO:**
- Store keys in `.env` file (never commit to Git)
- Use environment variables in production
- Rotate keys periodically
- Monitor usage on provider dashboards

❌ **DON'T:**
- Hardcode API keys in source files
- Commit `.env` to version control
- Share keys in public repositories
- Use same keys for dev/prod

### Production Deployment

**Backend:**
```bash
# Use production WSGI server
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 backend_api:app
```

**Frontend:**
```bash
# Build for production
npm run build

# Serve with nginx or deploy to:
# - Vercel
# - Netlify  
# - AWS S3 + CloudFront
```

**Environment Variables:**
```bash
# Set in production environment
export UNSTRACT_API_KEY=xxx
export GEMINI_API_KEY=xxx
export FLASK_ENV=production
```

## 📊 Usage Examples

### Example 1: Job Application

**Original:**
```
I am writing to apply for the position. I have experience in the field 
and think I would be good for the role.
```

**Context:** 
```
"Make this compelling for a senior software engineer position, 
highlighting leadership and technical expertise"
```

**Enhanced:**
```
I am excited to apply for the Senior Software Engineer position, bringing 
over 8 years of proven expertise in full-stack development and technical 
leadership. My track record of architecting scalable solutions and 
mentoring development teams aligns perfectly with your requirements.
```

### Example 2: Academic Paper

**Original:**
```
This study looks at how social media affects people. We found that 
it has both good and bad effects on users.
```

**Context:**
```
"Enhance for academic publication with scholarly tone and precise 
terminology"
```

**Enhanced:**
```
This empirical investigation examines the multifaceted impact of social 
media engagement on individual psychological well-being. Our findings 
reveal a nuanced relationship, demonstrating both beneficial and 
detrimental effects on user outcomes.
```

### Example 3: Business Proposal

**Original:**
```
We want to work with you on this project. We have done similar things 
before and can help you.
```

**Context:**
```
"Transform into persuasive business proposal emphasizing value and ROI"
```

**Enhanced:**
```
We are excited to propose a strategic partnership that will deliver 
measurable value to your organization. Our proven track record in 
similar high-impact initiatives, combined with our innovative approach, 
positions us to exceed your project objectives while maximizing ROI.
```

## 🎓 Technical Details

### Format Preservation System

The system uses a sophisticated template-based approach:

1. **Format Extraction**
   - Analyzes document structure (headings, paragraphs, lists)
   - Detects formatting (bold, italic, font sizes)
   - Creates reusable template

2. **Content Enhancement**
   - Sends text to Gemini AI with context
   - Preserves formatting markers
   - Maintains document structure

3. **Format Reapplication**
   - Maps enhanced text to original template
   - Preserves character-level formatting
   - Maintains block-level structure

### OCR Pipeline

Unstract LLMWhisperer provides:
- **Layout Preservation** - Maintains visual structure
- **Line Tracking** - Numbered lines for reference
- **Table Detection** - Recognizes tabular data
- **Form Extraction** - Handles checkboxes and fields

### AI Enhancement

Gemini AI capabilities:
- **Context Awareness** - Understands document purpose
- **Tone Adaptation** - Adjusts formality and style
- **Grammar & Clarity** - Fixes errors and improves flow
- **Content Expansion** - Adds detail where needed

## 📈 Performance Tips

1. **Faster Processing**
   - Use `native_text` mode for digital PDFs
   - Process smaller documents first
   - Limit to essential pages only

2. **Better Results**
   - Be specific in enhancement context
   - Provide examples of desired tone
   - Review and iterate as needed

3. **Cost Optimization**
   - Monitor API usage dashboards
   - Use appropriate processing modes
   - Cache results when possible

## 🤝 Contributing

Contributions welcome! Areas for improvement:

- [ ] Support for more file formats (PPTX, etc.)
- [ ] Batch processing multiple documents
- [ ] Custom formatting templates
- [ ] Export to Word/PDF with formatting
- [ ] Real-time collaboration features
- [ ] Enhanced preview with rich formatting

## 📄 License

See LICENSE file for details.

## 🆘 Support

Need help? Here's where to look:

1. **Documentation**
   - This README
   - SETUP_GUIDE.md (detailed setup)
   - Code comments in source files

2. **API Documentation**
   - [Unstract Docs](https://docs.unstract.com/)
   - [Gemini AI Docs](https://ai.google.dev/docs)

3. **Common Issues**
   - Check Troubleshooting section above
   - Review error messages in console
   - Check API provider status pages

## 🌟 Credits

Built with:
- [Unstract LLMWhisperer](https://unstract.com/) - Advanced OCR
- [Google Gemini](https://ai.google.dev/) - AI Enhancement
- [Flask](https://flask.palletsprojects.com/) - Backend Framework
- [React](https://react.dev/) - Frontend Framework
- [Vite](https://vitejs.dev/) - Build Tool
- [shadcn/ui](https://ui.shadcn.com/) - UI Components

---

**Made with ❤️ for better documents**

🚀 **Start enhancing your documents today!**
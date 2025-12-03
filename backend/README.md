# LaTeX-Enhanced Document Backend

AI-powered document enhancement backend with LaTeX support using Google Gemini API.

## 🚀 Features

- **AI-Powered Enhancement**: Uses Google Gemini to improve document quality
- **LaTeX Support**: Automatically formats mathematical equations and scientific notation
- **Multiple Formats**: Supports DOCX, PDF, and TXT input files
- **Professional Output**: Generates well-formatted, professional documents
- **Cloud-Ready**: Designed for HuggingFace Spaces deployment

## 📋 Prerequisites

- Google Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))
- HuggingFace Account ([Sign up](https://huggingface.co/join))

## 🎯 HuggingFace Spaces Deployment

### Step 1: Create a New Space

1. Go to [HuggingFace Spaces](https://huggingface.co/new-space)
2. Choose a name for your Space
3. Select **Docker** as the Space SDK
4. Choose visibility (Public or Private)
5. Click **Create Space**

### Step 2: Upload Files

Upload all files from the `backend` folder to your Space:
- `app.py`
- `gemini_client.py`
- `latex_processor.py`
- `document_converter.py`
- `requirements.txt`
- `Dockerfile`
- `README.md` (this file)

### Step 3: Set Environment Variables

1. Go to your Space's **Settings**
2. Navigate to **Repository secrets**
3. Add a new secret:
   - Name: `GEMINI_API_KEY`
   - Value: Your Google Gemini API key

### Step 4: Deploy

Your Space will automatically build and deploy! Wait for the build to complete (usually 2-5 minutes).

### Step 5: Get Your API URL

Once deployed, your backend will be available at:
```
https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space
```

Example: `https://omgy-doc-enhancer.hf.space`

## 🔧 API Endpoints

### Health Check
```
GET /health
```

Returns server status.

### Enhance Document
```
POST /enhance
```

**Parameters:**
- `file`: Document file (DOCX, PDF, or TXT)
- `prompt` (optional): Enhancement instructions
- `doc_type` (optional): Document type hint (auto, academic, technical, business)

**Example with curl:**
```bash
curl -X POST https://your-space.hf.space/enhance \
  -F "file=@document.docx" \
  -F "prompt=Make this more professional and add LaTeX for equations"
```

**Response:**
Enhanced document file (same format as input)

### Add Signature
```
POST /add-signature
```

**Parameters:**
- `file`: Document file (.docx)
- `signature`: Base64 encoded image
- `position`: bottom-right, bottom-center, or bottom-left
- `signer_name`: Optional name

### API Info
```
GET /
```

Returns API information and available features.

## 🧪 Local Testing (Optional)

If you want to test locally before deploying:

1. Install Python 3.11+
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your `GEMINI_API_KEY`

4. Run the app:
   ```bash
   python app.py
   ```

5. Test at `http://localhost:7860`

## 📖 LaTeX Support

The backend automatically detects mathematical content and formats it using LaTeX:

- **Inline equations**: `$E = mc^2$`
- **Display equations**: `$$\int_0^\infty e^{-x} dx = 1$$`
- **Matrices**: `$$\begin{matrix} a & b \\ c & d \end{matrix}$$`
- **Symbols**: α, β, γ, ∫, ∑, ∏, √, ∞, etc.

## 🎨 Document Types

Specify `doc_type` for optimized enhancement:

- `auto`: Automatic detection (default)
- `academic`: Research papers, theses
- `technical`: Technical documentation, manuals
- `business`: Business reports, proposals

## ⚙️ Configuration

Environment variables (set in HuggingFace Spaces secrets):

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Your Google Gemini API key |
| `FLASK_ENV` | No | Environment (production/development) |
| `PORT` | No | Server port (default: 7860) |

## 🐛 Troubleshooting

### Build Fails
- Check that all files are uploaded
- Verify Dockerfile syntax
- Check HuggingFace Spaces logs

### API Returns Errors
- Verify `GEMINI_API_KEY` is set correctly in secrets
- Check API key is valid at [Google AI Studio](https://makersuite.google.com/)
- Review Space logs for detailed error messages

### Document Processing Fails
- Ensure file format is supported (.docx, .pdf, .txt)
- Check file is not corrupted
- Verify file size is reasonable (< 10MB recommended)

## 📚 Tech Stack

- **Flask**: Web framework
- **Google Gemini**: AI enhancement
- **python-docx**: DOCX processing
- **PyPDF2**: PDF processing
- **Gunicorn**: Production WSGI server

## 📄 License

This project is open source and available for modification.

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review HuggingFace Spaces logs
3. Check that your Gemini API key is valid

---

**Made with ♥ using Google Gemini and HuggingFace Spaces**

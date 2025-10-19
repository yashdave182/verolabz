# PythonAnywhere Deployment Guide

This guide explains how to deploy the DocTweak backend to PythonAnywhere using Anaconda.

## Prerequisites

1. A PythonAnywhere account (free or paid tier)
2. Anaconda installed on PythonAnywhere
3. API Keys:
   - Unstract LLMWhisperer API Key
   - Google Gemini API Key

## Deployment Steps

### 1. Upload Your Code

1. Log in to your PythonAnywhere account
2. Go to the "Files" tab
3. Upload all your project files to a directory (e.g., `/home/yourusername/doctweak/`)

### 2. Set Up the Environment

1. Open a Bash console in PythonAnywhere
2. Navigate to your project directory:
   ```bash
   cd /home/yourusername/doctweak/
   ```

3. Run the setup script:
   ```bash
   python setup_pythonanywhere.py
   ```

### 3. Configure Environment Variables

1. Go to the "Web" tab in PythonAnywhere
2. Click on "Add a new web app" or edit your existing web app
3. In the "Environment variables" section, add:
   - `UNSTRACT_API_KEY`: Your Unstract API key
   - `GEMINI_API_KEY`: Your Google Gemini API key

### 4. Configure the Web App

1. In the "Web" tab, find your web app configuration
2. Set the "WSGI configuration file" to point to your `pythonanywhere_wsgi.py` file:
   ```
   /home/yourusername/doctweak/pythonanywhere_wsgi.py
   ```

3. Set the "Source code" directory:
   ```
   /home/yourusername/doctweak/
   ```

4. Make sure the Python version matches your requirements (Python 3.9+ recommended)

### 5. Reload the Web App

1. After making changes, click the "Reload" button for your web app
2. Your backend should now be running at your PythonAnywhere subdomain

## Directory Structure

Ensure your directory structure looks like this:

```
/home/yourusername/doctweak/
├── backend_api.py
├── pythonanywhere_wsgi.py
├── setup_pythonanywhere.py
├── requirements.txt
├── module.py
├── uploads/ (created automatically)
└── processed/ (created automatically)
```

## Environment Variables

The following environment variables must be set in your PythonAnywhere web app configuration:

| Variable | Description | Required |
|----------|-------------|----------|
| `UNSTRACT_API_KEY` | Unstract LLMWhisperer API key | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |

## API Endpoints

Once deployed, your backend will be available at your PythonAnywhere subdomain with the following endpoints:

- `GET /api/health` - Health check
- `POST /api/upload` - Upload and OCR documents
- `POST /api/enhance` - Enhance documents with AI
- `POST /api/process` - Complete processing pipeline
- `GET /api/download/<document_id>` - Download processed documents

## Frontend Configuration

After deploying the backend, update your frontend [.env](file:///C:/Users/yashd/Downloads/delovable-yashdavece-doc_tweak-1756458605682/doc_tweak-main/.env) file to point to your PythonAnywhere backend URL:

```
VITE_API_URL=https://yourusername.pythonanywhere.com
```

Replace `yourusername` with your actual PythonAnywhere username.

## Troubleshooting

1. **Import Errors**: Make sure all dependencies are installed by running the setup script
2. **Permission Errors**: Ensure the `uploads` and `processed` directories are writable
3. **API Key Issues**: Verify that environment variables are correctly set in the PythonAnywhere web app configuration
4. **CORS Issues**: The backend already includes CORS support, but you may need to adjust the configuration for your specific domain

## Logs and Monitoring

You can view your application logs in PythonAnywhere:

1. Go to the "Web" tab
2. Click on "Log files" for your web app
3. Check `access.log` and `error.log` for debugging information
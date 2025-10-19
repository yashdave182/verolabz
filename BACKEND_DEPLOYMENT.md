# Backend Deployment Guide

This guide explains how to deploy the DocTweak backend to Render.

## Prerequisites

1. API Keys:
   - Unstract LLMWhisperer API Key
   - Google Gemini API Key

## Deployment to Render

1. Go to [Render.com](https://render.com/) and create an account
2. Create a new Web Service
3. Connect your GitHub repository
4. Set the build command to use Docker
5. Specify the [Dockerfile](file:///C:/Users/yashd/Downloads/delovable-yashdavece-doc_tweak-1756458605682/doc_tweak-main/Dockerfile) path
6. Add the following environment variables in the Render dashboard:
   - `UNSTRACT_API_KEY`: Your Unstract API key
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `FRONTEND_URL`: https://doctweaker.vercel.app (your frontend URL)
   - `PORT`: 5000 (or let Render auto-assign)

## Environment Variables

The following environment variables are required:

| Variable | Description | Required |
|----------|-------------|----------|
| `UNSTRACT_API_KEY` | Unstract LLMWhisperer API key | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `FRONTEND_URL` | Frontend URL for CORS configuration | Yes |
| `PORT` | Port to run the server on | No (defaults to 5000) |

## API Endpoints

Once deployed, your backend will be available at your deployment URL with the following endpoints:

- `GET /api/health` - Health check
- `POST /api/upload` - Upload and OCR documents
- `POST /api/enhance` - Enhance documents with AI
- `POST /api/process` - Complete processing pipeline
- `GET /api/download/<document_id>` - Download processed documents

## Frontend Configuration

After deploying the backend, update your frontend [.env](file:///C:/Users/yashd/Downloads/delovable-yashdavece-doc_tweak-1756458605682/doc_tweak-main/.env) file to point to your new backend URL:

```
VITE_API_URL=https://doctweaker.onrender.com
FRONTEND_URL=https://doctweaker.vercel.app
```

## CORS Configuration

The backend is configured to accept requests from the frontend URL specified in the `FRONTEND_URL` environment variable. Make sure this matches your actual frontend deployment URL.
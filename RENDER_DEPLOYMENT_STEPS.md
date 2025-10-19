# Render Deployment Steps

This guide provides step-by-step instructions for deploying the DocTweak backend to Render.

## Prerequisites

1. A Render account (free or paid tier)
2. API Keys:
   - Unstract LLMWhisperer API Key
   - Google Gemini API Key

## Deployment Steps

### 1. Fork or Clone the Repository

1. Go to your GitHub repository at https://github.com/yashdave182/DocTweaker
2. Make sure it contains all the latest files including:
   - [Dockerfile](file:///C:/Users/yashd/Downloads/delovable-yashdavece-doc_tweak-1756458605682/doc_tweak-main/Dockerfile)
   - [render.yaml](file:///C:/Users/yashd/Downloads/delovable-yashdavece-doc_tweak-1756458605682/doc_tweak-main/render.yaml)
   - [backend_api.py](file:///C:/Users/yashd/Downloads/delovable-yashdavece-doc_tweak-1756458605682/doc_tweak-main/backend_api.py)
   - [requirements.txt](file:///C:/Users/yashd/Downloads/delovable-yashdavece-doc_tweak-1756458605682/doc_tweak-main/requirements.txt)

### 2. Connect Render to Your GitHub Repository

1. Log in to your Render account at https://render.com
2. Click on "New" and select "Web Service"
3. Choose "Build and deploy from a Git repository"
4. Connect your GitHub account if not already connected
5. Select your `DocTweaker` repository

### 3. Configure the Web Service

1. **Name**: Enter a name for your service (e.g., `doctweak-backend`)
2. **Region**: Choose the region closest to your users
3. **Branch**: Select `main` (or your default branch)
4. **Root Directory**: Leave empty if your files are in the root, or specify the path
5. **Environment**: Select `Docker` (this is important!)
6. **Dockerfile Path**: `Dockerfile` (should be auto-detected from [render.yaml](file:///C:/Users/yashd/Downloads/delovable-yashdavece-doc_tweak-1756458605682/doc_tweak-main/render.yaml))

### 4. Set Up Environment Variables

In the "Advanced" section, add the following environment variables:

| Key | Value | Description |
|-----|-------|-------------|
| `UNSTRACT_API_KEY` | Your Unstract API key | Required for OCR processing |
| `GEMINI_API_KEY` | Your Google Gemini API key | Required for AI enhancement |
| `PORT` | `5000` | Port for the application (Render will auto-assign if not specified) |

### 5. Configure Instance Settings

1. **Plan**: Select `Free` (or `Starter` for better performance)
2. **Instance Type**: `Standard` is sufficient for most use cases

### 6. Deploy

1. Click "Create Web Service"
2. Render will start building your application using the Dockerfile
3. The build process will:
   - Pull the Python 3.9 slim image
   - Install system dependencies
   - Install Python requirements from [requirements.txt](file:///C:/Users/yashd/Downloads/delovable-yashdavece-doc_tweak-1756458605682/doc_tweak-main/requirements.txt)
   - Copy your application code
   - Expose port 5000
   - Start the application

### 7. Monitor Deployment

1. Watch the build logs in the Render dashboard
2. Wait for the deployment to complete (usually takes 5-10 minutes)
3. Once deployed, your backend will be available at a URL like:
   `https://your-service-name.onrender.com`

## API Endpoints

After deployment, your backend will be available at your Render URL with the following endpoints:

- `GET /api/health` - Health check
- `POST /api/upload` - Upload and OCR documents
- `POST /api/enhance` - Enhance documents with AI
- `POST /api/process` - Complete processing pipeline
- `GET /api/download/<document_id>` - Download processed documents

## Frontend Configuration

After deploying the backend, update your frontend [.env](file:///C:/Users/yashd/Downloads/delovable-yashdavece-doc_tweak-1756458605682/doc_tweak-main/.env) file to point to your Render backend URL:

```
VITE_API_URL=https://your-service-name.onrender.com
```

Replace `your-service-name` with your actual Render service name.

## Troubleshooting

### Common Issues:

1. **Build Failures**: 
   - Check the build logs for specific error messages
   - Ensure all dependencies in [requirements.txt](file:///C:/Users/yashd/Downloads/delovable-yashdavece-doc_tweak-1756458605682/doc_tweak-main/requirements.txt) are correct
   - Make sure the [Dockerfile](file:///C:/Users/yashd/Downloads/delovable-yashdavece-doc_tweak-1756458605682/doc_tweak-main/Dockerfile) is properly formatted

2. **Application Crashes**:
   - Check the application logs in Render
   - Verify that all environment variables are set correctly
   - Ensure API keys are valid

3. **Timeout Issues**:
   - For free tier, Render may spin down inactive services
   - First request after inactivity may take longer

4. **CORS Errors**:
   - The backend already includes CORS support
   - If you encounter CORS issues, verify the frontend URL matches the allowed origins

### Logs and Monitoring:

1. Go to your service dashboard in Render
2. Click on "Logs" to view real-time application logs
3. Check for any error messages or warnings
4. Use the health check endpoint (`/api/health`) to verify the service is running

## Scaling Considerations

For production use:

1. **Upgrade Plan**: Consider moving from the free tier to a paid plan for better performance
2. **Custom Domain**: Add a custom domain in the Render dashboard
3. **Environment**: Consider using Render's "Starter" or "Standard" environment for better performance
4. **Auto-Scaling**: Configure auto-scaling based on your usage patterns

## Updating Your Deployment

To update your deployed application:

1. Push changes to your GitHub repository
2. Render will automatically detect the changes and start a new deployment
3. Alternatively, you can manually trigger a deployment from the Render dashboard

## Cost Management

1. **Free Tier**: The free tier includes:
   - 750 hours of instance time per month
   - 100GB bandwidth per month
   - 500MB disk space

2. **Sleep Mode**: Free tier services automatically sleep after 15 minutes of inactivity
3. **Wakeup Time**: First request to a sleeping service may take a few seconds to respond
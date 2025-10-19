# CORS Configuration for Render Deployment

This document explains how to properly configure CORS for your DocTweak backend when deploying to Render.

## Why Configure CORS?

CORS (Cross-Origin Resource Sharing) is a security feature that controls which websites can access your backend API. Proper CORS configuration ensures:

1. Only your frontend can communicate with your backend
2. Prevents unauthorized access from other domains
3. Ensures secure communication between frontend and backend

## Environment Variables

The backend now supports the following environment variables for CORS configuration:

| Variable | Description | Default Value | Example |
|----------|-------------|---------------|---------|
| `FRONTEND_URL` | The URL of your frontend application | `*` (allows all origins) | `https://your-frontend.vercel.app` |

## Render Deployment Configuration

When deploying to Render, you should set the `FRONTEND_URL` environment variable in your Render dashboard:

1. Go to your Render web service dashboard
2. Click on "Environment Variables" in the settings
3. Add a new environment variable:
   - Key: `FRONTEND_URL`
   - Value: Your frontend URL (e.g., `https://doctweaker.vercel.app`)

## Local Development

For local development, you can set the frontend URL in your [.env](file:///C:/Users/yashd/Downloads/delovable-yashdavece-doc_tweak-1756458605682/doc_tweak-main/.env) file:

```
FRONTEND_URL=http://localhost:8080
```

Or for multiple origins:
```
FRONTEND_URL=http://localhost:8080,http://localhost:8081
```

## Multiple Frontend URLs

If you need to support multiple frontend URLs (e.g., development and production), you can separate them with commas:

```
FRONTEND_URL=https://doctweaker.vercel.app,http://localhost:8080,https://staging.yourapp.com
```

## Security Considerations

1. **Never use `*` in production**: While `*` allows all origins, it's not secure for production environments
2. **Specify exact URLs**: Always specify the exact URLs that should be allowed to access your backend
3. **Use HTTPS**: In production, always use HTTPS URLs for your frontend

## Troubleshooting CORS Issues

If you encounter CORS errors:

1. Verify that `FRONTEND_URL` is correctly set in your environment variables
2. Check that the URL matches exactly (including protocol `http://` or `https://`)
3. Ensure there are no trailing slashes in the URL
4. For multiple URLs, make sure they are comma-separated without spaces

## Example Render Configuration

In your Render web service settings, add these environment variables:

```
UNSTRACT_API_KEY=your_unstract_api_key
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=https://doctweaker.vercel.app
```

After updating the environment variables, redeploy your application for the changes to take effect.
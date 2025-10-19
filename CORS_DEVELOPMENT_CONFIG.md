# CORS Development Configuration

## Overview
This configuration allows the backend API to accept requests from both the production frontend and local development environment.

## Configuration Details

### Current Setup
The backend now supports CORS from multiple origins:
1. **Production Frontend**: Configured via `FRONTEND_URL` environment variable
2. **Development Environment**: `http://localhost:8080` for local testing

### Implementation
```python
frontend_url = os.getenv("FRONTEND_URL", "*")
# For development, also allow localhost:8080
origins = [frontend_url]
if frontend_url != "*" and frontend_url != "http://localhost:8080":
    origins.append("http://localhost:8080")

CORS(app, origins=origins)
```

### How It Works
1. If `FRONTEND_URL` is set to "*", the backend accepts requests from any origin
2. If `FRONTEND_URL` is set to a specific URL (e.g., "https://doctweaker.vercel.app"), the backend accepts requests from:
   - That specific URL
   - `http://localhost:8080` (for local development)
3. If `FRONTEND_URL` is already set to `http://localhost:8080`, no duplicate is added

### Testing Locally
To test the application locally:
1. Start the backend server
2. Start the frontend development server on port 8080
3. The frontend will be able to make API calls to the backend without CORS issues

### Environment Variables
- `FRONTEND_URL`: The production frontend URL (e.g., "https://doctweaker.vercel.app")
- When not set, defaults to "*" which allows all origins (useful for development)

### Security Notes
- In production, always set `FRONTEND_URL` to the specific frontend domain
- The "*" setting should only be used in development environments
- The localhost addition is only made when it's not already the primary origin

### Example Configurations

#### Production Render Deployment
```
FRONTEND_URL=https://doctweaker.vercel.app
```
Results in allowed origins: ["https://doctweaker.vercel.app", "http://localhost:8080"]

#### Local Development
```
FRONTEND_URL=http://localhost:8080
```
Results in allowed origins: ["http://localhost:8080"]

#### Development with Open CORS (not recommended for production)
```
FRONTEND_URL=*
```
Results in allowed origins: ["*"]
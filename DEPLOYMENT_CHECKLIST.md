# Deployment Checklist

## Backend (Render)

- [ ] Verify `UNSTRACT_API_KEY` is set in Render environment variables
- [ ] Verify `GEMINI_API_KEY` is set in Render environment variables
- [ ] Verify `FRONTEND_URL` is set to `https://doctweaker.vercel.app` in Render environment variables
- [ ] Redeploy backend on Render to apply CORS configuration changes
- [ ] Verify backend is accessible at `https://doctweaker.onrender.com/api/health`

## Frontend (Vercel)

- [ ] Verify `.env` file contains:
  ```
  VITE_API_URL=https://doctweaker.onrender.com
  FRONTEND_URL=https://doctweaker.vercel.app
  ```
- [ ] Rebuild and redeploy frontend on Vercel
- [ ] Clear browser cache or perform hard refresh (Ctrl+F5)
- [ ] Test document enhancement workflow

## Testing

- [ ] Test health check endpoint: `curl https://doctweaker.onrender.com/api/health`
- [ ] Test document upload endpoint: `curl -X POST https://doctweaker.onrender.com/api/upload`
- [ ] Verify no CORS errors in browser console
- [ ] Test complete document enhancement workflow through UI

## Common Issues

If you still encounter CORS errors:

1. Ensure backend redeployment completed successfully
2. Ensure frontend redeployment completed successfully
3. Check that environment variables are correctly set in both services
4. Verify the frontend is calling the correct API endpoints with `/api/` prefix
5. Check browser developer tools Network tab to see the actual API calls being made

## Support

If issues persist, please provide:
1. Browser console errors
2. Network tab screenshots showing failed API calls
3. Backend logs from Render
4. Frontend deployment URL
# Google Generative AI Library Update

## Issue
The current version of google-generativeai (0.3.2) has compatibility issues that cause errors when using certain parameters like `response_mime_type`.

## Solution
Update to a newer version of the library that supports all required features.

## Changes Made

1. **requirements.txt**: Updated google-generativeai from 0.3.2 to 0.7.1
2. **backend_api.py**: 
   - Updated model name from "gemini-2.5-pro" to "gemini-2.5-pro"
   - Updated generation_config to use `genai.types.GenerationConfig`
   - Re-enabled `response_mime_type="text/plain"` parameter

## Deployment Instructions

### For Render Deployment:
1. Update your `requirements.txt` file with the new version
2. Redeploy your application on Render
3. The new version will be automatically installed during the build process

### For Local Development:
```bash
pip install --upgrade google-generativeai==0.7.1
```

## Benefits of the Update

1. **Better Compatibility**: The newer version has fixed compatibility issues
2. **Enhanced Features**: Support for `response_mime_type` parameter for cleaner output
3. **Improved Performance**: Better handling of large documents
4. **Stable API**: More reliable API responses

## Error Resolution

This update resolves the following error:
```
Unknown field for GenerationConfig: response_mime_type
```

The `response_mime_type` parameter is now properly supported in version 0.7.1, allowing for cleaner text output from the Gemini API.
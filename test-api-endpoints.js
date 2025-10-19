// Test script to verify API endpoints are correctly configured
console.log("Testing API endpoint configuration...");

// Import the enhanced backend service
import { checkBackendHealth, uploadDocument, enhanceDocument } from './src/lib/enhancedBackendService';

// Test the API base URL configuration
console.log("Testing API base URL configuration...");
const baseUrl = import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:3001" : import.meta.env.VITE_API_URL);

console.log("API Base URL:", baseUrl);

// Test health check endpoint
console.log("Testing health check endpoint...");
checkBackendHealth()
  .then(result => {
    console.log("Health check result:", result);
  })
  .catch(error => {
    console.error("Health check error:", error);
  });

console.log("API endpoint test completed.");
/**
 * Test script to verify backend connection and API endpoints
 * Run this script to check if the backend is properly configured
 */

async function testBackendConnection() {
  const BACKEND_URL = "https://doctweaker.onrender.com";
  
  console.log("Testing backend connection...");
  console.log(`Backend URL: ${BACKEND_URL}`);
  
  try {
    // Test 1: Health check
    console.log("\n1. Testing health check endpoint...");
    const healthResponse = await fetch(`${BACKEND_URL}/api/health`);
    console.log(`   Status: ${healthResponse.status} ${healthResponse.statusText}`);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log(`   Response:`, healthData);
      console.log("   ✅ Health check passed");
    } else {
      console.log("   ❌ Health check failed");
      return;
    }
    
    // Test 2: CORS preflight for enhance endpoint
    console.log("\n2. Testing CORS preflight for enhance endpoint...");
    const corsResponse = await fetch(`${BACKEND_URL}/api/enhance`, {
      method: 'OPTIONS'
    });
    console.log(`   Status: ${corsResponse.status} ${corsResponse.statusText}`);
    
    const allowOrigin = corsResponse.headers.get('Access-Control-Allow-Origin');
    const allowMethods = corsResponse.headers.get('Access-Control-Allow-Methods');
    const allowHeaders = corsResponse.headers.get('Access-Control-Allow-Headers');
    
    console.log(`   Access-Control-Allow-Origin: ${allowOrigin}`);
    console.log(`   Access-Control-Allow-Methods: ${allowMethods}`);
    console.log(`   Access-Control-Allow-Headers: ${allowHeaders}`);
    
    if (corsResponse.ok) {
      console.log("   ✅ CORS preflight passed");
    } else {
      console.log("   ❌ CORS preflight failed");
    }
    
    console.log("\n🎉 Backend connection test completed!");
    
  } catch (error) {
    console.error("❌ Error testing backend connection:", error);
  }
}

// Run the test
testBackendConnection();
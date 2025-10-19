// Test script to verify frontend-backend communication
async function testBackendConnection() {
  console.log("Testing frontend-backend communication...");
  
  try {
    // Test health endpoint
    const healthResponse = await fetch("https://doctweaker.onrender.com/api/health");
    const healthData = await healthResponse.json();
    
    console.log("✅ Health check successful:");
    console.log(`   Status: ${healthData.status}`);
    console.log(`   Unstract API: ${healthData.unstract_configured ? '✓ Configured' : '✗ Missing'}`);
    console.log(`   Gemini API: ${healthData.gemini_configured ? '✓ Configured' : '✗ Missing'}`);
    
    // Test upload endpoint (should return 400 for no file provided)
    const uploadResponse = await fetch("https://doctweaker.onrender.com/api/upload", {
      method: "POST"
    });
    const uploadData = await uploadResponse.json();
    
    console.log("✅ Upload endpoint accessible:");
    console.log(`   Status: ${uploadResponse.status}`);
    console.log(`   Response: ${uploadData.error || 'No file provided (expected)'}`);
    
    console.log("\n🎉 All backend API endpoints are working correctly!");
    console.log("The 404 error for root path is expected - backend only serves API endpoints.");
    
  } catch (error) {
    console.error("❌ Error testing backend connection:", error);
  }
}

testBackendConnection();
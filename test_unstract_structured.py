"""
Test script to explore Unstract API structured data capabilities
"""

import requests
import os
import json

def test_unstract_endpoints():
    """Test what endpoints are available in Unstract API"""
    
    # Get API key from environment
    api_key = os.getenv("UNSTRACT_API_KEY")
    if not api_key:
        print("UNSTRACT_API_KEY not found in environment variables")
        return
    
    base_url = "https://llmwhisperer-api.us-central.unstract.com/api/v2"
    headers = {"unstract-key": api_key}
    
    print("Testing Unstract API endpoints...")
    print(f"Base URL: {base_url}")
    
    # Test basic endpoints
    endpoints_to_test = [
        "/whisper",
        "/whisper-status",
        "/whisper-retrieve",
        "/whisper-structured",
        "/whisper-metadata",
        "/whisper-layout",
        "/whisper-format"
    ]
    
    for endpoint in endpoints_to_test:
        try:
            url = f"{base_url}{endpoint}"
            response = requests.options(url, headers=headers, timeout=10)
            if response.status_code == 200:
                print(f"✓ {endpoint} - Available (OPTIONS)")
                print(f"  Supported methods: {response.headers.get('Allow', 'Unknown')}")
            else:
                print(f"? {endpoint} - Status {response.status_code}")
        except Exception as e:
            print(f"✗ {endpoint} - Error: {str(e)}")
    
    # Test what documentation is available
    try:
        response = requests.get(f"{base_url}/docs", headers=headers, timeout=10)
        if response.status_code == 200:
            print("✓ /docs - Documentation available")
        else:
            print(f"? /docs - Status {response.status_code}")
    except Exception as e:
        print(f"✗ /docs - Error: {str(e)}")
    
    # Test what OpenAPI spec is available
    try:
        response = requests.get(f"{base_url}/openapi.json", headers=headers, timeout=10)
        if response.status_code == 200:
            print("✓ /openapi.json - OpenAPI spec available")
            # Save a small portion for analysis
            spec = response.json()
            if "paths" in spec:
                print(f"  Available paths: {list(spec['paths'].keys())}")
        else:
            print(f"? /openapi.json - Status {response.status_code}")
    except Exception as e:
        print(f"✗ /openapi.json - Error: {str(e)}")

if __name__ == "__main__":
    test_unstract_endpoints()
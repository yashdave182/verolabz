import requests
import json

# Test the health endpoint
print("Testing health endpoint...")
try:
    response = requests.get("https://doctweaker.onrender.com/api/health")
    print(f"Health check status: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")

# Test the upload endpoint with a simple POST
print("\nTesting upload endpoint...")
try:
    response = requests.post("https://doctweaker.onrender.com/api/upload")
    print(f"Upload endpoint status: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")

# Test the process endpoint with a simple POST
print("\nTesting process endpoint...")
try:
    response = requests.post("https://doctweaker.onrender.com/api/process")
    print(f"Process endpoint status: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
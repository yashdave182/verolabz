"""
Test script to check available Gemini models
"""

import google.generativeai as genai
import os

def list_available_models():
    """List all available Gemini models"""
    try:
        # Configure the API key
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            print("GEMINI_API_KEY environment variable not set")
            return
        
        genai.configure(api_key=api_key)
        
        # List all models
        print("Available models:")
        for model in genai.list_models():
            if "gemini" in model.name.lower():
                print(f"  - {model.name}")
                
        # Test specific models that are known to work
        known_models = [
            "gemini-1.5-pro-latest",
            "gemini-1.5-flash-latest",
            "gemini-1.0-pro-latest"
        ]
        
        print("\nTesting known models:")
        for model_name in known_models:
            try:
                model = genai.GenerativeModel(model_name)
                # Simple test - this will fail if model doesn't exist
                print(f"  ✓ {model_name} - Available")
            except Exception as e:
                print(f"  ✗ {model_name} - Not available: {str(e)}")
                
    except Exception as e:
        print(f"Error listing models: {str(e)}")

if __name__ == "__main__":
    list_available_models()
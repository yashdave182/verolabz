"""
Simple test script to verify backend functionality locally
Run this after setting up your environment
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_imports():
    """Test that all required modules can be imported"""
    print("Testing imports...")
    try:
        from app import app
        from gemini_client import GeminiClient
        from latex_processor import LaTeXProcessor
        from document_converter import DocumentConverter
        print("✅ All imports successful!")
        return True
    except Exception as e:
        print(f"❌ Import failed: {str(e)}")
        return False

def test_api_key():
    """Test that API key is configured"""
    print("\nTesting API key configuration...")
    api_key = os.getenv('GEMINI_API_KEY')
    if api_key and len(api_key) > 20:
        print(f"✅ API key found (length: {len(api_key)})")
        return True
    else:
        print("❌ GEMINI_API_KEY not found or invalid")
        print("Please set it in .env file or HuggingFace Spaces secrets")
        return False

def test_latex_detection():
    """Test LaTeX content detection"""
    print("\nTesting LaTeX detection...")
    try:
        from latex_processor import LaTeXProcessor
        processor = LaTeXProcessor()
        
        # Test with mathematical content
        math_text = "The equation E = mc^2 shows the relationship"
        has_math = processor.detect_mathematical_content(math_text)
        
        if has_math:
            print("✅ LaTeX detection working!")
            return True
        else:
            print("⚠️  LaTeX detection may need adjustment")
            return False
    except Exception as e:
        print(f"❌ LaTeX detection failed: {str(e)}")
        return False

def test_gemini_client():
    """Test Gemini client initialization"""
    print("\nTesting Gemini client...")
    try:
        from gemini_client import GeminiClient
        
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            print("⚠️  Skipping Gemini test - no API key")
            return False
        
        client = GeminiClient(api_key)
        print("✅ Gemini client initialized!")
        return True
    except Exception as e:
        print(f"❌ Gemini client failed: {str(e)}")
        return False

def main():
    print("=" * 50)
    print("Backend Test Suite")
    print("=" * 50)
    
    results = {
        "Imports": test_imports(),
        "API Key": test_api_key(),
        "LaTeX Detection": test_latex_detection(),
        "Gemini Client": test_gemini_client(),
    }
    
    print("\n" + "=" * 50)
    print("Test Results Summary")
    print("=" * 50)
    
    for test_name, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{test_name}: {status}")
    
    total_passed = sum(results.values())
    total_tests = len(results)
    
    print("\n" + "=" * 50)
    print(f"Total: {total_passed}/{total_tests} tests passed")
    print("=" * 50)
    
    if total_passed == total_tests:
        print("\n🎉 All tests passed! Ready for deployment!")
    else:
        print("\n⚠️  Some tests failed. Please fix before deploying.")

if __name__ == "__main__":
    main()

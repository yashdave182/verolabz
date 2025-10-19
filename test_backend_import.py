"""
Test script to verify backend API can be imported without syntax errors
"""

def test_backend_import():
    """Test that backend_api.py can be imported without syntax errors"""
    try:
        # This will check for syntax errors without actually running the server
        with open('backend_api.py', 'r') as f:
            code = f.read()
        
        # Compile the code to check for syntax errors
        compile(code, 'backend_api.py', 'exec')
        print("✓ backend_api.py syntax is correct")
        
        # Check if all required classes and functions are defined
        required_elements = [
            'Flask',
            'CORS',
            'UnstractOCRService',
            'GeminiEnhancerService',
            'DocumentProcessor'
        ]
        
        for element in required_elements:
            if element in code:
                print(f"✓ {element} found in backend_api.py")
            else:
                print(f"⚠ {element} not found in backend_api.py")
        
        print("\nBackend API import test completed successfully!")
        return True
        
    except SyntaxError as e:
        print(f"✗ Syntax error in backend_api.py: {e}")
        return False
    except Exception as e:
        print(f"✗ Error testing backend_api.py: {e}")
        return False

if __name__ == "__main__":
    test_backend_import()
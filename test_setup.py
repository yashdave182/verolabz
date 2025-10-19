"""
Test Setup Script
Verifies that the Document Tweaker backend is properly configured
"""

import os
import sys
from pathlib import Path


def print_header(text):
    """Print formatted header"""
    print("\n" + "=" * 80)
    print(f"  {text}")
    print("=" * 80)


def check_python_version():
    """Check if Python version is sufficient"""
    print("\n[1/8] Checking Python version...")
    version = sys.version_info
    if version.major >= 3 and version.minor >= 9:
        print(f"✓ Python {version.major}.{version.minor}.{version.micro} - OK")
        return True
    else:
        print(f"✗ Python {version.major}.{version.minor}.{version.micro} - Need 3.9+")
        return False


def check_env_file():
    """Check if .env file exists and has required keys"""
    print("\n[2/8] Checking .env file...")

    if not Path(".env").exists():
        print("✗ .env file not found!")
        print("  → Copy .env.example to .env and configure your API keys")
        return False

    print("✓ .env file exists")

    # Check for API keys
    with open(".env", "r") as f:
        content = f.read()

    has_unstract = "UNSTRACT_API_KEY=" in content
    has_gemini = "GEMINI_API_KEY=" in content

    unstract_key = None
    gemini_key = None

    for line in content.split("\n"):
        if line.startswith("UNSTRACT_API_KEY="):
            unstract_key = line.split("=", 1)[1].strip()
        if line.startswith("GEMINI_API_KEY="):
            gemini_key = line.split("=", 1)[1].strip()

    issues = []

    if not unstract_key or unstract_key == "your_unstract_api_key_here":
        issues.append("UNSTRACT_API_KEY not set")
    else:
        print(f"✓ UNSTRACT_API_KEY configured ({unstract_key[:10]}...)")

    if not gemini_key or gemini_key == "your_gemini_api_key_here":
        issues.append("GEMINI_API_KEY not set")
    else:
        print(f"✓ GEMINI_API_KEY configured ({gemini_key[:10]}...)")

    if issues:
        print("✗ Issues found:")
        for issue in issues:
            print(f"  → {issue}")
        return False

    return True


def check_required_files():
    """Check if required files exist"""
    print("\n[3/8] Checking required files...")

    required_files = ["backend_api.py", "module.py", "requirements.txt", "package.json"]

    all_exist = True
    for file in required_files:
        if Path(file).exists():
            print(f"✓ {file}")
        else:
            print(f"✗ {file} - MISSING")
            all_exist = False

    return all_exist


def check_python_packages():
    """Check if required Python packages are installed"""
    print("\n[4/8] Checking Python packages...")

    required_packages = {
        "flask": "Flask",
        "flask_cors": "flask-cors",
        "google.generativeai": "google-generativeai",
        "requests": "requests",
    }

    missing = []

    for module_name, package_name in required_packages.items():
        try:
            __import__(module_name)
            print(f"✓ {package_name}")
        except ImportError:
            print(f"✗ {package_name} - NOT INSTALLED")
            missing.append(package_name)

    if missing:
        print("\nTo install missing packages:")
        print("  pip install -r requirements.txt")
        return False

    return True


def check_directories():
    """Check if required directories exist, create if not"""
    print("\n[5/8] Checking directories...")

    required_dirs = ["uploads", "processed"]

    for dir_name in required_dirs:
        dir_path = Path(dir_name)
        if dir_path.exists():
            print(f"✓ {dir_name}/ exists")
        else:
            dir_path.mkdir(exist_ok=True)
            print(f"✓ {dir_name}/ created")

    return True


def test_unstract_api():
    """Test Unstract API connection"""
    print("\n[6/8] Testing Unstract API connection...")

    try:
        import requests
        import os

        api_key = os.getenv("UNSTRACT_API_KEY")
        if not api_key or api_key == "your_unstract_api_key_here":
            print("✗ UNSTRACT_API_KEY not configured")
            return False

        # Test with a simple health check (if available)
        # For now, just verify the key format
        if len(api_key) > 10:
            print(f"✓ API key format looks valid ({api_key[:10]}...)")
            print("  Note: Actual API test requires uploading a document")
            return True
        else:
            print("✗ API key seems too short")
            return False

    except Exception as e:
        print(f"✗ Error testing API: {str(e)}")
        return False


def test_gemini_api():
    """Test Gemini API connection"""
    print("\n[7/8] Testing Gemini API connection...")

    try:
        import google.generativeai as genai
        import os

        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or api_key == "your_gemini_api_key_here":
            print("✗ GEMINI_API_KEY not configured")
            return False

        # Configure and test
        genai.configure(api_key=api_key)

        # Try to list models (quick test)
        try:
            models = genai.list_models()
            model_count = len(list(models))
            print(f"✓ Successfully connected to Gemini API")
            print(f"  Available models: {model_count}")
            return True
        except Exception as e:
            error_str = str(e)
            if "API key" in error_str or "invalid" in error_str.lower():
                print("✗ API key appears to be invalid")
            else:
                print(f"✗ Connection error: {error_str[:100]}")
            return False

    except ImportError:
        print("✗ google-generativeai package not installed")
        return False
    except Exception as e:
        print(f"✗ Error testing API: {str(e)}")
        return False


def test_module_import():
    """Test if module.py can be imported"""
    print("\n[8/8] Testing format preservation module...")

    try:
        from module import DocumentProcessor, FormatTemplate

        print("✓ Successfully imported DocumentProcessor")
        print("✓ Successfully imported FormatTemplate")

        # Quick functional test
        processor = DocumentProcessor()
        test_text = "# Heading\n\nThis is a test paragraph."
        template = processor.extractor.extract_from_text_patterns(test_text)
        print(f"✓ Format extraction works ({len(template.blocks)} blocks detected)")

        return True
    except ImportError as e:
        print(f"✗ Import error: {str(e)}")
        return False
    except Exception as e:
        print(f"✗ Runtime error: {str(e)}")
        return False


def main():
    """Run all tests"""
    print_header("Document Tweaker - Setup Verification")
    print("\nThis script will verify your setup is correct.")

    # Load environment variables
    try:
        from dotenv import load_dotenv

        load_dotenv()
        print("✓ Loaded environment variables from .env")
    except ImportError:
        print("⚠ python-dotenv not installed, reading .env manually")
        # Manual loading
        if Path(".env").exists():
            with open(".env") as f:
                for line in f:
                    if "=" in line and not line.strip().startswith("#"):
                        key, value = line.strip().split("=", 1)
                        os.environ[key] = value

    # Run all checks
    results = [
        ("Python Version", check_python_version()),
        ("Environment File", check_env_file()),
        ("Required Files", check_required_files()),
        ("Python Packages", check_python_packages()),
        ("Directories", check_directories()),
        ("Unstract API", test_unstract_api()),
        ("Gemini API", test_gemini_api()),
        ("Format Module", test_module_import()),
    ]

    # Summary
    print_header("Test Summary")

    passed = sum(1 for _, result in results if result)
    total = len(results)

    print()
    for test_name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{status:8} - {test_name}")

    print(f"\n{'=' * 80}")
    print(f"  Results: {passed}/{total} tests passed")
    print("=" * 80)

    if passed == total:
        print("\n🎉 SUCCESS! Your setup is complete and ready to use.")
        print("\nNext steps:")
        print("  1. Run: python backend_api.py")
        print("  2. In another terminal: npm run dev")
        print("  3. Open: http://localhost:5173/enhanced-doc-tweaker")
        return 0
    else:
        print("\n⚠ ISSUES FOUND! Please fix the failed tests above.")
        print("\nQuick fixes:")
        print("  - Missing packages: pip install -r requirements.txt")
        print("  - API keys: Edit .env file with your actual keys")
        print("  - Missing files: Ensure you're in the correct directory")
        return 1


if __name__ == "__main__":
    sys.exit(main())

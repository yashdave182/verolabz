"""
Setup script for PythonAnywhere deployment
"""

import os
import subprocess
import sys
from pathlib import Path

def setup_pythonanywhere():
    """Setup the environment for PythonAnywhere deployment"""
    
    print("Setting up DocTweak backend for PythonAnywhere...")
    
    # Create necessary directories
    directories = ["uploads", "processed"]
    for directory in directories:
        Path(directory).mkdir(exist_ok=True)
        print(f"Created directory: {directory}")
    
    # Install requirements
    print("Installing Python requirements...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("Requirements installed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"Error installing requirements: {e}")
        return False
    
    # Check if API keys are set
    unstract_key = os.environ.get("UNSTRACT_API_KEY", "")
    gemini_key = os.environ.get("GEMINI_API_KEY", "")
    
    print("\nAPI Key Status:")
    print(f"Unstract API Key: {'✓ Configured' if unstract_key else '✗ Missing'}")
    print(f"Gemini API Key: {'✓ Configured' if gemini_key else '✗ Missing'}")
    
    if not unstract_key or not gemini_key:
        print("\nWarning: Please set your API keys in PythonAnywhere environment variables:")
        print("  - UNSTRACT_API_KEY")
        print("  - GEMINI_API_KEY")
    
    print("\nSetup complete! You can now configure your PythonAnywhere web app to use pythonanywhere_wsgi.py")
    return True

if __name__ == "__main__":
    setup_pythonanywhere()
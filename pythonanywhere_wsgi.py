"""
WSGI config for PythonAnywhere deployment
"""

import os
import sys

# Add your project directory to the sys.path
project_home = os.path.dirname(os.path.abspath(__file__))
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Set environment variables
os.environ['PYTHONPATH'] = project_home

# Import your Flask application
from backend_api import app as application

if __name__ == "__main__":
    application.run()
"""
Health Check API Endpoint for Vercel
"""

from http.server import BaseHTTPRequestHandler
import json
import os
from datetime import datetime


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Health check endpoint"""
        try:
            # Check if API keys are configured
            unstract_configured = bool(os.environ.get("UNSTRACT_API_KEY"))
            gemini_configured = bool(os.environ.get("GEMINI_API_KEY"))

            response = {
                "status": "healthy",
                "timestamp": datetime.now().isoformat(),
                "unstract_configured": unstract_configured,
                "gemini_configured": gemini_configured,
                "environment": "vercel",
            }

            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.end_headers()

            self.wfile.write(json.dumps(response).encode())

        except Exception as e:
            self.send_response(500)
            self.send_header("Content-type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()

            error_response = {"status": "error", "error": str(e)}
            self.wfile.write(json.dumps(error_response).encode())

    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

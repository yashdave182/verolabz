"""
Document Enhancement API Endpoint for Vercel
Handles AI enhancement using Gemini API
"""

from http.server import BaseHTTPRequestHandler
import json
import os
import sys

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    import google.generativeai as genai
except ImportError:
    genai = None


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        """Enhance document text using Gemini AI"""
        try:
            # Read request body
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode("utf-8"))

            text = data.get("text", "")
            context = data.get("context", "")
            preserve_format = data.get("preserve_format", True)

            if not text or not context:
                self.send_error_response(400, "Both text and context are required")
                return

            # Check Gemini API key
            gemini_api_key = os.environ.get("GEMINI_API_KEY")
            if not gemini_api_key:
                self.send_error_response(500, "Gemini API key not configured")
                return

            if not genai:
                self.send_error_response(
                    500, "google-generativeai package not available"
                )
                return

            # Configure Gemini
            genai.configure(api_key=gemini_api_key)
            model = genai.GenerativeModel("gemini-1.5-flash")

            # Build prompt
            if preserve_format:
                system_prompt = """You are an expert document enhancer. Your task is to improve the document while STRICTLY PRESERVING all formatting markers and layout structure.

CRITICAL RULES:
1. Keep ALL formatting markers exactly as they are (bold markers, line breaks, spacing, indentation)
2. Maintain the same document structure (headings, paragraphs, lists, tables)
3. Preserve line numbers if present
4. Keep page breaks (<<<PAGE_BREAK>>>) in the same positions
5. Maintain vertical and horizontal line markers (|, -, +, etc.)
6. Preserve indentation and spacing patterns

Your enhancements should focus on:
- Improving clarity and readability of the text content
- Fixing grammar and spelling errors
- Enhancing word choice and tone
- Making the content more professional and impactful
- Following the user's specific instructions

DO NOT change the structure, formatting markers, or layout. Only improve the actual text content."""
            else:
                system_prompt = """You are an expert document enhancer. Improve the document's content based on the user's instructions while maintaining a professional and clear style."""

            user_prompt = f"""{system_prompt}

USER'S ENHANCEMENT REQUEST:
{context}

ORIGINAL DOCUMENT:
{text}

Please provide the enhanced version. Return ONLY the enhanced document without any additional commentary or explanations."""

            # Generate enhanced content
            response = model.generate_content(
                user_prompt,
                generation_config={
                    "temperature": 0.3,
                    "top_p": 0.9,
                    "top_k": 40,
                    "max_output_tokens": 8192,
                },
            )

            if not response or not response.text:
                self.send_error_response(500, "No response from Gemini API")
                return

            enhanced_text = response.text.strip()

            # Send success response
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.end_headers()

            result = {
                "success": True,
                "enhanced_text": enhanced_text,
                "format_preserved": preserve_format,
            }

            self.wfile.write(json.dumps(result).encode())

        except json.JSONDecodeError:
            self.send_error_response(400, "Invalid JSON in request body")
        except Exception as e:
            self.send_error_response(500, f"Enhancement error: {str(e)}")

    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def send_error_response(self, code, message):
        """Send error response"""
        self.send_response(code)
        self.send_header("Content-type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

        error_response = {"success": False, "error": message}
        self.wfile.write(json.dumps(error_response).encode())

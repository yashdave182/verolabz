import os
import google.generativeai as genai
from typing import Optional

class GeminiClient:
    """Client for interacting with Google Gemini API"""
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize Gemini client
        
        Args:
            api_key: Gemini API key (if not provided, reads from environment)
        """
        self.api_key = api_key or os.getenv('GEMINI_API_KEY')
        
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY is required")
        
        # Configure Gemini
        genai.configure(api_key=self.api_key)
        
        # Use Gemini Pro model
        self.model = genai.GenerativeModel('gemini-pro')
        
        # Generation config for better output
        self.generation_config = {
            'temperature': 0.7,
            'top_p': 0.95,
            'top_k': 40,
            'max_output_tokens': 8192,
        }
    
    def enhance_content(self, prompt: str) -> str:
        """
        Enhance content using Gemini API
        
        Args:
            prompt: The enhancement prompt including content and instructions
            
        Returns:
            Enhanced content from Gemini
        """
        try:
            response = self.model.generate_content(
                prompt,
                generation_config=self.generation_config
            )
            
            if not response or not response.text:
                raise ValueError("Empty response from Gemini")
            
            return response.text
            
        except Exception as e:
            print(f"Gemini API error: {str(e)}")
            raise Exception(f"Failed to enhance content with AI: {str(e)}")
    
    def enhance_with_context(self, content: str, instructions: str, context: dict = None) -> str:
        """
        Enhance content with specific instructions and context
        
        Args:
            content: Original content to enhance
            instructions: User's specific enhancement instructions
            context: Additional context (document type, formatting preferences, etc.)
            
        Returns:
            Enhanced content
        """
        # Build contextual prompt
        prompt_parts = [
            "You are an expert document editor and LaTeX formatter.",
            "Enhance the following document content according to the user's instructions.",
            ""
        ]
        
        if context:
            if context.get('doc_type'):
                prompt_parts.append(f"Document Type: {context['doc_type']}")
            if context.get('include_latex'):
                prompt_parts.append("IMPORTANT: Format mathematical equations using LaTeX notation.")
                prompt_parts.append("Use $...$ for inline math and $$...$$ for display equations.")
        
        prompt_parts.extend([
            "",
            f"User Instructions: {instructions}",
            "",
            "Original Content:",
            "---",
            content,
            "---",
            "",
            "Enhanced Content (maintain structure, improve quality, add LaTeX where appropriate):"
        ])
        
        prompt = "\n".join(prompt_parts)
        return self.enhance_content(prompt)

import re
from typing import List, Tuple

class LaTeXProcessor:
    """Processor for LaTeX content in documents"""
    
    # Common mathematical terms and symbols that indicate math content
    MATH_INDICATORS = [
        r'\b(equation|formula|theorem|proof|lemma|corollary)\b',
        r'[∫∑∏√∞≤≥≠±×÷∈∉⊂⊃∪∩∀∃∇∂]',
        r'\d+\s*[+\-*/=]\s*\d+',
        r'\b(sin|cos|tan|log|ln|exp|lim|integral|derivative)\b',
        r'[a-z]\s*=\s*[a-z0-9]',
        r'\^|\d+_\d+',
    ]
    
    def detect_mathematical_content(self, text: str) -> bool:
        """
        Detect if text contains mathematical/scientific content
        
        Args:
            text: Text to analyze
            
        Returns:
            True if mathematical content is detected
        """
        text_lower = text.lower()
        
        for pattern in self.MATH_INDICATORS:
            if re.search(pattern, text_lower, re.IGNORECASE):
                return True
        
        return False
    
    def build_enhancement_prompt(
        self, 
        content: str, 
        user_instructions: str = "",
        doc_type: str = "auto",
        include_latex: bool = False
    ) -> str:
        """
        Build comprehensive enhancement prompt for Gemini
        
        Args:
            content: Original document content
            user_instructions: User's specific instructions
            doc_type: Type of document (auto, academic, technical, business, etc.)
            include_latex: Whether to include LaTeX formatting
            
        Returns:
            Complete prompt for Gemini
        """
        prompt_parts = [
            "You are an expert document editor specializing in professional and academic writing.",
            ""
        ]
        
        # Add LaTeX instructions if needed
        if include_latex:
            prompt_parts.extend([
                "🔬 IMPORTANT: This document contains mathematical or scientific content.",
                "- Format ALL equations using proper LaTeX notation",
                "- Use $...$ for inline equations (e.g., $E = mc^2$)",
                "- Use $$...$$ for display equations on their own lines",
                "- Use proper LaTeX commands: \\frac{}{}, \\sqrt{}, \\int, \\sum, \\alpha, \\beta, etc.",
                "- Number important equations as needed",
                "- Ensure all mathematical notation is professional and consistent",
                ""
            ])
        
        # Add document type specific instructions
        if doc_type == "academic":
            prompt_parts.extend([
                "📚 Document Type: Academic/Research Paper",
                "- Use formal academic tone",
                "- Structure with clear sections (Abstract, Introduction, Methods, Results, Discussion, Conclusion)",
                "- Include proper citations where needed (use [Author, Year] format)",
                "- Ensure technical accuracy",
                ""
            ])
        elif doc_type == "technical":
            prompt_parts.extend([
                "🔧 Document Type: Technical Documentation",
                "- Use clear, precise technical language",
                "- Include code examples in proper formatting if relevant",
                "- Use numbered lists for procedures",
                "- Add technical diagrams descriptions where helpful",
                ""
            ])
        elif doc_type == "business":
            prompt_parts.extend([
                "💼 Document Type: Business Document",
                "- Use professional business tone",
                "- Focus on clarity and conciseness",
                "- Highlight key points and actionable items",
                "- Use bullet points for readability",
                ""
            ])
        
        # Add user instructions
        if user_instructions:
            prompt_parts.extend([
                f"👤 User's Specific Instructions:",
                f"{user_instructions}",
                ""
            ])
        
        # Add the content
        prompt_parts.extend([
            "📄 Original Document Content:",
            "=" * 60,
            content,
            "=" * 60,
            "",
            "✨ Please provide the ENHANCED version following all guidelines above.",
            "Maintain the document structure but improve quality, clarity, and professionalism.",
            "Return ONLY the enhanced content, no explanations or meta-commentary.",
        ])
        
        return "\n".join(prompt_parts)
    
    def process_latex_content(self, content: str) -> str:
        """
        Process and validate LaTeX content
        
        Args:
            content: Content potentially containing LaTeX
            
        Returns:
            Processed content with valid LaTeX
        """
        # Ensure proper spacing around inline equations
        content = re.sub(r'(\S)\$', r'\1 $', content)
        content = re.sub(r'\$(\S)', r'$ \1', content)
        
        # Ensure display equations are on their own lines
        content = re.sub(r'(\S)\$\$', r'\1\n$$', content)
        content = re.sub(r'\$\$(\S)', r'$$\n\1', content)
        
        return content
    
    def extract_latex_equations(self, content: str) -> List[Tuple[str, str]]:
        """
        Extract LaTeX equations from content
        
        Args:
            content: Content containing LaTeX
            
        Returns:
            List of tuples (equation_type, equation_content)
            equation_type is either 'inline' or 'display'
        """
        equations = []
        
        # Extract display equations ($$...$$)
        display_pattern = r'\$\$(.*?)\$\$'
        for match in re.finditer(display_pattern, content, re.DOTALL):
            equations.append(('display', match.group(1).strip()))
        
        # Extract inline equations ($...$)
        inline_pattern = r'(?<!\$)\$(?!\$)(.*?)(?<!\$)\$(?!\$)'
        for match in re.finditer(inline_pattern, content):
            equations.append(('inline', match.group(1).strip()))
        
        return equations
    
    def validate_latex(self, latex_code: str) -> Tuple[bool, str]:
        """
        Basic validation of LaTeX code
        
        Args:
            latex_code: LaTeX code to validate
            
        Returns:
            Tuple of (is_valid, error_message)
        """
        # Check for balanced braces
        if latex_code.count('{') != latex_code.count('}'):
            return False, "Unbalanced braces in LaTeX code"
        
        # Check for balanced brackets
        if latex_code.count('[') != latex_code.count(']'):
            return False, "Unbalanced brackets in LaTeX code"
        
        # Check for common LaTeX commands
        common_commands = [
            r'\\frac', r'\\sqrt', r'\\sum', r'\\int', r'\\prod',
            r'\\alpha', r'\\beta', r'\\gamma', r'\\delta',
            r'\\sin', r'\\cos', r'\\tan', r'\\log', r'\\ln',
        ]
        
        # Basic validation passed
        return True, ""
    
    def enhance_equations(self, content: str) -> str:
        """
        Enhance mathematical equations in content
        
        Args:
            content: Content with equations
            
        Returns:
            Content with enhanced equations
        """
        # This is a placeholder for more sophisticated equation enhancement
        # For now, just ensure proper spacing
        return self.process_latex_content(content)

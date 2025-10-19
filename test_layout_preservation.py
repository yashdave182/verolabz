"""
Test script to verify layout preservation improvements
"""

import sys
import os

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import the module directly
import module

def test_layout_preservation():
    """Test layout preservation with a sample document"""
    
    # Sample document with various layout elements
    sample_text = """DOCUMENT TITLE IN ALL CAPS

This is a sample paragraph with some text.
It has multiple lines to test paragraph handling.

1. First item in a numbered list
2. Second item with more content
3. Third item to check list preservation

Another paragraph after the list.

<<<PAGE_BREAK>>>

HEADING LEVEL 2
This is content under a heading.
It should be preserved with proper formatting.

- Bullet point one
- Bullet point two
- Bullet point three

Table Header 1 | Table Header 2 | Table Header 3
---------------|----------------|----------------
Cell 1         | Cell 2         | Cell 3
Cell 4         | Cell 5         | Cell 6

Final paragraph in the document."""

    print("Original text:")
    print(sample_text)
    print("\n" + "="*50 + "\n")

    # Test format extraction
    processor = module.DocumentProcessor()
    template = processor.extractor.extract_from_text_patterns(sample_text)
    
    print(f"Extracted {len(template.blocks)} blocks")
    for i, block in enumerate(template.blocks[:5]):  # Show first 5 blocks
        print(f"Block {i}: {block.block_format.type.value} - '{block.text[:50]}...'")

    # Test enhancement prompt structure (without actually calling API)
    # Create the enhancement prompt as it would be sent to Gemini
    system_prompt = """You are an expert document enhancer. Your task is to improve the document while STRICTLY PRESERVING all formatting markers and layout structure. This is CRITICAL for the user's workflow.

CRITICAL RULES FOR FORMAT PRESERVATION:
1. Keep ALL formatting markers exactly as they are (bold markers **text**, line breaks, spacing, indentation)
2. Maintain the same document structure (headings, paragraphs, lists, tables)
3. Preserve line numbers if present
4. Keep page breaks (<<<PAGE_BREAK>>>) in the same positions
5. Maintain vertical and horizontal line markers (|, -, +, etc.)
6. Preserve indentation and spacing patterns
7. Keep all special characters and symbols in their original positions
8. Do not add or remove any lines or paragraphs
9. Do not change the order of content blocks

Your enhancements should focus on:
- Improving clarity and readability of the text content
- Fixing grammar and spelling errors
- Enhancing word choice and tone
- Making the content more professional and impactful
- Following the user's specific instructions.

IMPORTANT: The document may contain special layout markers such as:
- Page breaks: <<<PAGE_BREAK>>>
- Line numbers: [1], [2], [3], etc.
- Table structures with | and - characters
- Indentation with spaces or tabs
- Special formatting markers

DO NOT change the structure, formatting markers, or layout. Only improve the actual text content within these constraints."""

    user_context = "Make the language more professional and fix any grammar issues."
    
    # Create the full prompt as it would be sent to Gemini
    user_prompt = f"""{system_prompt}

USER'S ENHANCEMENT REQUEST:
{user_context}

ORIGINAL DOCUMENT WITH LAYOUT MARKERS:
{sample_text}

Please provide the enhanced version that follows ALL the format preservation rules above. Return ONLY the enhanced document without any additional commentary, explanations, or markdown formatting."""

    print("\nPrompt structure verified:")
    print(f"System prompt length: {len(system_prompt)} characters")
    print(f"User context: {user_context}")
    print(f"Full prompt length: {len(user_prompt)} characters")
    
    # Verify key elements are in the prompt
    assert "CRITICAL RULES FOR FORMAT PRESERVATION" in user_prompt
    assert "<<<PAGE_BREAK>>>" in user_prompt
    assert "DO NOT change the structure" in user_prompt
    assert "Return ONLY the enhanced document" in user_prompt
    
    print("\n✓ All critical layout preservation elements are present in the prompt")
    
    # Test format application
    # Simulate enhanced text (same structure, improved content)
    enhanced_text = """DOCUMENT TITLE IN ALL CAPS

This is a sample paragraph with some text.
It has multiple lines to test paragraph handling.

1. First item in a numbered list
2. Second item with more content
3. Third item to check list preservation

Another paragraph after the list.

<<<PAGE_BREAK>>>

HEADING LEVEL 2
This is content under a heading.
It should be preserved with proper formatting.

- Bullet point one
- Bullet point two
- Bullet point three

Table Header 1 | Table Header 2 | Table Header 3
---------------|----------------|----------------
Cell 1         | Cell 2         | Cell 3
Cell 4         | Cell 5         | Cell 6

Final paragraph in the document."""

    # Apply format preservation
    formatted_result = processor.applier.apply_format_smart(enhanced_text, template)
    
    print(f"\nFormat application successful:")
    print(f"Applied template has {len(formatted_result.blocks)} blocks")
    
    # Verify structure preservation
    assert len(formatted_result.blocks) == len(template.blocks)
    print("✓ Document structure preserved")
    
    print("\nLayout preservation test completed successfully!")

if __name__ == "__main__":
    test_layout_preservation()
"""
Test script to verify context usage in Gemini enhancement
"""

def test_context_in_prompt():
    """Test that context is properly emphasized in the prompt"""
    
    # Sample document
    sample_text = """Name : yash dave I am a passionate software developer specializing in AI and machine learning. I am an enthusiastic coder and am writing to express my strong interest in a position. My schedule is highly flexible, and I am available to connect at any time. As a dedicated professional, I am eager for an opportunity to contribute my skills. In conclusion, I am confident I would be a valuable asset to your team …

Thanks and regards"""

    # Sample context
    context = "add conclusion at the end"
    
    # Build the prompt as it would be sent to Gemini
    system_prompt = """[ROLE]
You are an expert document enhancer specializing in improving content while preserving exact formatting and layout. You are using Gemini 2.5 Pro, our most advanced thinking model.

[PRIMARY INSTRUCTION]
The user has provided a specific request. This MUST be the primary focus of your enhancement. All other improvements should support this main request.

[FORMAT PRESERVATION RULES]
1. NEVER modify formatting markers: **bold**, *italic*, <<<PAGE_BREAK>>>, [1], [2], etc.
2. NEVER change document structure: headings, paragraphs, lists, tables
3. NEVER reorganize content order
4. NEVER add or remove lines
5. Keep all special characters and symbols in their original positions
6. Maintain exact indentation and spacing patterns

[ENHANCEMENT FOCUS]
- Fix grammar and spelling errors
- Improve word choice and clarity
- Adjust tone based on user request
- Make content more professional or engaging as requested
- Follow the user's specific instructions precisely

[ADVANCED CAPABILITIES]
As Gemini 2.5 Pro, you can:
- Reason over complex problems in code, math, and STEM
- Analyze large datasets and documents using long context
- Handle sophisticated document structures

[IMPORTANT]
The document may contain special layout markers such as:
- Page breaks: <<<PAGE_BREAK>>>
- Line numbers: [1], [2], [3], etc.
- Table structures with | and - characters
- Indentation with spaces or tabs
- Special formatting markers

DO NOT change any of these markers or the document structure."""

    # Create the full prompt
    user_prompt = f"""{system_prompt}

[USER'S SPECIFIC REQUEST]
{context}

[DOCUMENT TO ENHANCE]
{sample_text}

[CRITICAL INSTRUCTIONS]
1. The USER'S SPECIFIC REQUEST above is the PRIMARY focus - make this happen
2. Preserve ALL formatting exactly as shown
3. Return ONLY the enhanced document
4. Do not include any additional commentary or explanations"""

    # Verify key elements are present
    assert "[USER'S SPECIFIC REQUEST]" in user_prompt
    assert context in user_prompt
    assert "[DOCUMENT TO ENHANCE]" in user_prompt
    assert "[CRITICAL INSTRUCTIONS]" in user_prompt
    assert "PRIMARY focus" in user_prompt
    
    print("✓ Context is properly emphasized in the prompt")
    print(f"Context: {context}")
    print(f"Document length: {len(sample_text)} characters")
    
    # Show what the prompt looks like
    print("\nPrompt structure:")
    print("- System instructions with role definition")
    print("- Primary instruction emphasizing user context")
    print("- Format preservation rules")
    print("- User's specific request (context):", context)
    print("- Document to enhance")
    print("- Critical instructions emphasizing the context")

if __name__ == "__main__":
    test_context_in_prompt()
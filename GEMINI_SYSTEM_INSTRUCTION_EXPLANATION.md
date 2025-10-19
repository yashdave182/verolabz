# Gemini AI System Instruction and Context Handling

## Understanding System Instructions and Context

### What is a System Instruction?

A **system instruction** is a set of guidelines that define how an AI model should behave when processing a request. It acts as the "personality" or "role" for the AI, telling it:
- What role to assume (e.g., "expert document enhancer")
- How to approach the task
- What rules to follow
- What constraints to observe

In your application, the system instruction is embedded within the prompt sent to Gemini AI and contains detailed rules about:
1. Preserving document formatting and layout
2. Maintaining structure (headings, paragraphs, lists)
3. Keeping special markers intact
4. Focusing only on content improvement

### What is Context in Your Application?

The **context** in your application refers to the user's specific instructions for how they want the document enhanced. This is what users type in the "Enhancement Instructions" text area, such as:
- "Make this more professional for a business proposal"
- "Improve clarity and fix grammar for an academic paper"
- "Shorten this document while keeping key points"

## How Your Application Handles System Instruction and Context

### 1. Data Flow from Frontend to Backend

1. **User Input**:
   - User uploads a document (or pastes text)
   - User provides enhancement instructions in the context text area

2. **Frontend Processing**:
   - The [EnhancedDocTweaker.tsx](file:///c%3A/Users/yashd/Downloads/delovable-yashdavece-doc_tweak-1756458605682/doc_tweak-main/src/pages/EnhancedDocTweaker.tsx) component captures both the document text and context
   - When the user clicks "Enhance with AI", the frontend calls the [enhancedBackendService.ts](file:///c%3A/Users/yashd/Downloads/delovable-yashdavece-doc_tweak-1756458605682/doc_tweak-main/src/lib/enhancedBackendService.ts) function

3. **API Communication**:
   - The `enhanceDocument` function in [enhancedBackendService.ts](file:///c%3A/Users/yashd/Downloads/delovable-yashdavece-doc_tweak-1756458605682/doc_tweak-main/src/lib/enhancedBackendService.ts) sends a POST request to `/api/enhance`
   - The request body contains:
     ```json
     {
       "text": "The document content...",
       "context": "User's enhancement instructions...",
       "preserve_format": true
     }
     ```

4. **Backend Processing**:
   - The Flask backend at [backend_api.py](file:///c%3A/Users/yashd/Downloads/delovable-yashdavece-doc_tweak-1756458605682/doc_tweak-main/backend_api.py) receives the request
   - It extracts both the document text and user context
   - It builds a comprehensive prompt that combines:
     - System instruction (the detailed rules for format preservation)
     - User context (the specific enhancement request)
     - Document content (the text to be enhanced)

### 2. Prompt Structure

The prompt sent to Gemini AI follows this structure:

```
[SYSTEM INSTRUCTION]
You are an expert document enhancer. Your task is to improve the document while STRICTLY PRESERVING all formatting markers and layout structure...

CRITICAL RULES FOR FORMAT PRESERVATION:
1. Keep ALL formatting markers exactly as they are...
2. Maintain the same document structure...
...

[USER CONTEXT]
USER'S ENHANCEMENT REQUEST:
Make this more professional for a business proposal

ORIGINAL DOCUMENT WITH LAYOUT MARKERS:
This is the actual document content with all its formatting...

Please provide the enhanced version that follows ALL the format preservation rules above.
```

### 3. How Context is Used by Gemini

When Gemini processes the request, it:

1. **Understands its role** from the system instruction (expert document enhancer)
2. **Knows the constraints** (must preserve formatting, structure, etc.)
3. **Receives specific instructions** from the user context
4. **Gets the content** to work on (the document text)
5. **Applies the enhancement** while following all rules

## Current Implementation Analysis

### Strengths
1. **Clear Separation**: System instructions and user context are clearly separated in the prompt
2. **Comprehensive Guidelines**: Detailed rules for format preservation
3. **Proper Data Flow**: Context is correctly passed from frontend to backend to Gemini
4. **Structured Approach**: Well-organized prompt structure

### Areas for Improvement
1. **Context Specificity**: Users might not always provide detailed enough context
2. **SSO Integration**: Currently no single sign-on context is being passed to Gemini
3. **User Profile Context**: No user-specific preferences or history are considered

## Suggested Enhancements

### 1. SSO Context Integration
If you want to pass SSO context to Gemini, you could:

1. **Capture User Information**:
   ```typescript
   // In the frontend, capture user info from SSO
   const userInfo = {
     name: "John Doe",
     role: "Marketing Manager",
     company: "Acme Corp",
     preferences: "Professional, concise tone"
   };
   ```

2. **Enhance the Context**:
   ```typescript
   // Modify the context sent to backend
   const enhancedContext = `
   USER PROFILE:
   Name: ${userInfo.name}
   Role: ${userInfo.role}
   Company: ${userInfo.company}
   Preferences: ${userInfo.preferences}
   
   ENHANCEMENT REQUEST:
   ${context}
   `;
   ```

3. **Update Backend Prompt**:
   ```python
   # In backend_api.py, enhance the prompt structure
   user_prompt = f"""{system_prompt}
   
   USER PROFILE AND CONTEXT:
   {context}
   
   ORIGINAL DOCUMENT WITH LAYOUT MARKERS:
   {text}
   
   Please provide the enhanced version following the format preservation rules above."""
   ```

### 2. Better Context Guidance
Improve the context input area with examples and suggestions:

```tsx
{/* Enhanced Context Input with Guidance */}
<div>
  <Label htmlFor="context" className="text-base font-medium">
    Enhancement Instructions *
  </Label>
  <Textarea
    id="context"
    placeholder="Examples:
    - 'Make this more professional for a business proposal'
    - 'Improve clarity and fix grammar for an academic paper'
    - 'Shorten this document while keeping key points'
    - 'Adapt this for a technical audience'"
    className="min-h-[120px] mt-2"
    value={context}
    onChange={(e) => setContext(e.target.value)}
    disabled={isProcessing}
  />
  <p className="text-xs text-muted-foreground mt-2">
    Be specific about what you want to achieve. The AI will follow your instructions.
  </p>
</div>
```

## Verification That Context is Working

The current implementation correctly passes context from frontend to backend to Gemini. You can verify this by:

1. **Checking Backend Logs**: When you process a document, you should see:
   ```
   [Enhance] Processing document of length: XXX
   [Enhance] Context: Your enhancement instructions here
   ```

2. **Testing with Specific Context**: Try different context instructions and observe how the output changes:
   - "Make this more formal"
   - "Make this more casual"
   - "Fix grammar only"

3. **Examining the Prompt**: The system instruction and context are properly combined in the prompt sent to Gemini.

## Conclusion

Your application correctly implements system instructions and context handling. The system instruction provides the rules for format preservation, while the user context provides specific enhancement instructions. Both are properly passed through the frontend → backend → Gemini flow.

If you want to add SSO context, you would need to capture user information from your SSO system and include it in the context sent to the backend.
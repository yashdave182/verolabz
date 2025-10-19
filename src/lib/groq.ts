import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

interface EnhanceDocumentParams {
  document: string;
  context: string;
  documentType: 'business' | 'student' | 'general';
}

export const enhanceDocument = async ({ 
  document, 
  context, 
  documentType 
}: EnhanceDocumentParams): Promise<string> => {
  try {
    // Check if API key is available
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey || apiKey === 'your_groq_api_key_here') {
      throw new Error('Groq API key is missing or not configured. Please check your .env.local file.');
    }

    console.log('Using Groq API key:', apiKey.substring(0, 10) + '...');

    const systemPrompts = {
      business: `You are an expert business document enhancer. Your task is to:
- Improve professional tone and clarity
- Enhance persuasive language for business contexts
- Optimize structure and flow
- Ensure technical accuracy and professionalism
- Maintain the original meaning while making it more impactful
- Use industry-appropriate terminology
- Make it compelling for decision-makers`,
      
      student: `You are an expert document enhancer for students and freelancers. Your task is to:
- Enhance personal voice while maintaining authenticity
- Improve structure and readability
- Strengthen impact and persuasiveness
- Optimize for applications, resumes, and proposals
- Maintain genuine personal tone
- Highlight achievements and skills effectively
- Make it stand out to recruiters and admissions officers`,
      
      general: `You are an expert document enhancer. Your task is to:
- Improve clarity, structure, and readability
- Enhance the document based on the user's specific context
- Maintain the original meaning while making it more effective
- Optimize tone and language for the intended purpose
- Ensure proper formatting and flow
- Make it compelling and professional as needed`
    };

    // List of current production models to try in order of preference
    const modelsToTry = [
      'llama-3.3-70b-versatile',  // Latest high-quality 70B model
      'llama-3.1-8b-instant',     // Fast and reliable 8B model
      'openai/gpt-oss-120b',      // OpenAI's largest model on Groq
      'openai/gpt-oss-20b'        // OpenAI's smaller model as fallback
    ];

    let lastError;
    
    for (const model of modelsToTry) {
      try {
        console.log(`Trying model: ${model}`);
        
        const completion = await groq.chat.completions.create({
          messages: [
            {
              role: "system",
              content: systemPrompts[documentType]
            },
            {
              role: "user",
              content: `Please enhance this document for the following context: "${context}"

Original Document:
${document}

Please provide the enhanced version that is professional, well-structured, and optimized for the given context. Return only the enhanced document without additional commentary.`
            }
          ],
          model: model,
          temperature: 0.3,
          max_tokens: 2048,
          top_p: 0.9,
        });

        const result = completion.choices[0]?.message?.content;
        if (result) {
          console.log(`Successfully used model: ${model}`);
          return result;
        }
      } catch (error) {
        console.log(`Model ${model} failed:`, error);
        lastError = error;
        // Continue to next model
        continue;
      }
    }
    
    // If all models failed
    throw lastError || new Error('All models failed');
    
  } catch (error) {
    console.error('Groq API Error Details:', error);
    
    // More specific error messages
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        throw new Error('Invalid API key. Please check your Groq API key.');
      }
      if (error.message.includes('429')) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }
      if (error.message.includes('network') || error.message.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      }
      if (error.message.includes('model_decommissioned')) {
        throw new Error('All available models are currently unavailable. Please try again later.');
      }
    }
    
    throw new Error(`Failed to enhance document: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
  }
};
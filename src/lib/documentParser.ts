import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure PDF.js worker with multiple fallback options for browser compatibility
let workerConfigured = false;

const configurePdfWorker = () => {
  if (workerConfigured) return;
  
  try {
    // Method 1: Try CDN worker (most reliable)
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
    console.log('PDF.js worker configured with CDN');
    workerConfigured = true;
  } catch (error) {
    console.warn('CDN worker failed, trying local worker:', error);
    
    try {
      // Method 2: Try local worker
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.js',
        import.meta.url
      ).toString();
      console.log('PDF.js worker configured with local build');
      workerConfigured = true;
    } catch (localError) {
      console.warn('Local worker failed, trying alternative CDN:', localError);
      
      try {
        // Method 3: Try alternative CDN
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
        console.log('PDF.js worker configured with alternative CDN');
        workerConfigured = true;
      } catch (altError) {
        console.error('All worker configuration methods failed:', altError);
        // Worker will be configured on demand
      }
    }
  }
};

// Initialize worker configuration
if (typeof window !== 'undefined') {
  configurePdfWorker();
}

export interface DocumentParseResult {
  success: boolean;
  content?: string;
  error?: string;
}

export const parseDocument = async (file: File): Promise<DocumentParseResult> => {
  try {
    const fileExtension = file.name.toLowerCase().split('.').pop();
    
    switch (fileExtension) {
      case 'txt':
        return await parseTextFile(file);
      case 'pdf':
        return await parsePdfFile(file);
      case 'doc':
      case 'docx':
        return await parseWordFile(file);
      default:
        return {
          success: false,
          error: 'Unsupported file type. Please upload .txt, .pdf, .doc, or .docx files.'
        };
    }
  } catch (error) {
    console.error('Document parsing error:', error);
    return {
      success: false,
      error: 'Failed to parse document. Please try again or copy-paste the content manually.'
    };
  }
};

const parseTextFile = async (file: File): Promise<DocumentParseResult> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      resolve({
        success: true,
        content: content.trim()
      });
    };
    reader.onerror = () => {
      resolve({
        success: false,
        error: 'Failed to read text file.'
      });
    };
    reader.readAsText(file);
  });
};

const parsePdfFile = async (file: File): Promise<DocumentParseResult> => {
  // Ensure worker is configured before processing
  configurePdfWorker();
  
  try {
    console.log('Starting PDF parsing for:', file.name, 'Size:', file.size);
    
    // Enhanced file validation
    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      return {
        success: false,
        error: 'File does not appear to be a PDF. Please ensure the file has a .pdf extension.'
      };
    }
    
    const arrayBuffer = await file.arrayBuffer();
    console.log('ArrayBuffer created, size:', arrayBuffer.byteLength);
    
    if (arrayBuffer.byteLength === 0) {
      return {
        success: false,
        error: 'PDF file appears to be empty or corrupted.'
      };
    }
    
    // PDF signature verification
    const uint8Array = new Uint8Array(arrayBuffer);
    const pdfSignature = uint8Array.slice(0, 5);
    const signatureString = String.fromCharCode(...pdfSignature);
    
    if (!signatureString.includes('%PDF')) {
      return {
        success: false,
        error: 'File does not appear to be a valid PDF (missing PDF signature).'
      };
    }
    
    console.log('PDF signature verified:', signatureString.substring(0, 8));
    
    // Try multiple PDF.js configurations for browser compatibility
    const configs = [
      // Config 1: Minimal (most compatible)
      {
        data: arrayBuffer,
        verbosity: 0,
        isEvalSupported: false,
        disableFontFace: true,
        useSystemFonts: false,
        useWorkerFetch: false
      },
      // Config 2: Standard
      {
        data: arrayBuffer,
        verbosity: 0
      },
      // Config 3: Basic fallback
      {
        data: arrayBuffer
      }
    ];
    
    let pdf = null;
    let configUsed = -1;
    
    for (let i = 0; i < configs.length; i++) {
      try {
        console.log(`Trying PDF config ${i + 1}...`);
        const loadingTask = pdfjsLib.getDocument(configs[i]);
        pdf = await loadingTask.promise;
        configUsed = i + 1;
        console.log(`PDF loaded successfully with config ${configUsed}`);
        break;
      } catch (configError) {
        console.warn(`Config ${i + 1} failed:`, configError);
        if (i === configs.length - 1) {
          throw configError; // Re-throw last error if all configs fail
        }
      }
    }
    
    if (!pdf) {
      throw new Error('All PDF loading configurations failed');
    }
    
    console.log('PDF loaded successfully, pages:', pdf.numPages, 'using config:', configUsed);
    
    let fullText = '';
    const maxPages = 15; // Conservative limit for compatibility
    const numPages = Math.min(pdf.numPages, maxPages);
    
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        if (textContent.items.length === 0) {
          console.log(`Page ${pageNum} has no text items`);
          continue;
        }
        
        const pageText = textContent.items
          .map((item) => {
            const textItem = item as { str?: string };
            return textItem.str || '';
          })
          .filter(text => text.trim().length > 0)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        if (pageText) {
          fullText += pageText + '\n\n';
        }
        
        // Add small delay to prevent browser freezing
        if (pageNum % 5 === 0) {
          await new Promise(resolve => setTimeout(resolve, 10));
        }
      } catch (pageError) {
        console.warn(`Error processing page ${pageNum}:`, pageError);
        continue;
      }
    }
    
    // Clean up resources
    try {
      await pdf.destroy();
    } catch (destroyError) {
      console.warn('PDF cleanup error (non-critical):', destroyError);
    }
    
    if (!fullText.trim()) {
      return {
        success: false,
        error: `No readable text found in PDF (processed ${numPages}/${pdf.numPages} pages). This might be a scanned document, image-based PDF, or use complex formatting. Please try copy-pasting the text manually.`
      };
    }
    
    if (numPages < pdf.numPages) {
      fullText += `\n\n[Note: Processed first ${numPages} of ${pdf.numPages} pages for browser compatibility]`;
    }
    
    console.log('PDF parsing completed successfully. Text length:', fullText.length);
    
    return {
      success: true,
      content: fullText.trim()
    };
  } catch (error) {
    console.error('PDF parsing error details:', error);
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Enhanced error categorization
    if (errorMessage.includes('Worker') || errorMessage.includes('worker')) {
      return {
        success: false,
        error: 'PDF processing failed due to browser worker issues. Please refresh the page or try a different browser (Chrome/Firefox recommended).'
      };
    }
    
    if (errorMessage.includes('Invalid PDF') || errorMessage.includes('corrupted')) {
      return {
        success: false,
        error: 'PDF file appears to be corrupted or invalid. Please try a different PDF file.'
      };
    }
    
    if (errorMessage.includes('password') || errorMessage.includes('encrypted')) {
      return {
        success: false,
        error: 'PDF is password protected or encrypted. Please remove the password and try again.'
      };
    }
    
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return {
        success: false,
        error: 'Network error while processing PDF. Please check your internet connection.'
      };
    }
    
    if (errorMessage.includes('memory') || errorMessage.includes('out of memory')) {
      return {
        success: false,
        error: 'PDF is too large for browser processing. Please try a smaller PDF or extract the text manually.'
      };
    }
    
    return {
      success: false,
      error: `PDF processing failed. Please try copy-pasting the text manually. Error: ${errorMessage}`
    };
  }
};

const parseWordFile = async (file: File): Promise<DocumentParseResult> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    if (!result.value.trim()) {
      return {
        success: false,
        error: 'No text content found in Word document.'
      };
    }
    
    // Log any warnings from mammoth
    if (result.messages.length > 0) {
      console.warn('Word document parsing warnings:', result.messages);
    }
    
    return {
      success: true,
      content: result.value.trim()
    };
  } catch (error) {
    console.error('Word document parsing error:', error);
    return {
      success: false,
      error: 'Failed to parse Word document. Please ensure the file is not corrupted or password protected.'
    };
  }
};

export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file size (15MB limit for better PDF/Word support)
  const maxSize = 15 * 1024 * 1024; // 15MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size must be less than 15MB'
    };
  }
  
  // Check if file is empty
  if (file.size === 0) {
    return {
      isValid: false,
      error: 'File appears to be empty'
    };
  }
  
  // Check file type
  const allowedExtensions = ['txt', 'pdf', 'doc', 'docx'];
  const fileExtension = file.name.toLowerCase().split('.').pop();
  
  if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
    return {
      isValid: false,
      error: 'Please upload a .txt, .pdf, .doc, or .docx file'
    };
  }
  
  // Additional validation for PDF files
  if (fileExtension === 'pdf') {
    // Check if file name seems reasonable
    if (file.name.includes('%') || file.name.includes('?')) {
      return {
        isValid: false,
        error: 'PDF filename contains invalid characters'
      };
    }
  }
  
  return { isValid: true };
};
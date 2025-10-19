import { BackendService, BackendProcessResult } from './backendService';
import { PythonBackendService, PythonProcessResult } from './pythonBackend';
import { parseDocument } from './documentParser';
import { enhanceDocument } from './groq';

export interface HybridProcessResult {
  success: boolean;
  originalText?: string;
  enhancedText?: string;
  pdfBlob?: Blob;
  downloadUrl?: string;
  processingMethod?: 'python' | 'browser';
  error?: string;
  needsOCR?: boolean;
}

export interface HybridProcessOptions {
  file: File;
  context: string;
  documentType: 'business' | 'student' | 'general';
  apiKey?: string; // Made optional since backend handles API keys
  onProgress?: (message: string) => void;
  preferBackend?: boolean; // Changed from preferPython to preferBackend
}

export class HybridDocumentProcessor {
  
  /**
   * Process document using Backend API with fallbacks
   */
  static async processDocument(options: HybridProcessOptions): Promise<HybridProcessResult> {
    const { 
      file, 
      context, 
      documentType, 
      apiKey, 
      onProgress,
      preferBackend = true 
    } = options;

    // Try Backend API first if preferred (recommended)
    if (preferBackend) {
      try {
        onProgress?.('Checking backend API availability...');
        
        const isBackendAvailable = await BackendService.isAvailable();
        
        if (isBackendAvailable) {
          onProgress?.('Using backend API for processing...');
          
          const result = await BackendService.processDocument(
            file,
            context,
            documentType,
            onProgress
          );

          if (result.success && result.data) {
            return {
              success: true,
              originalText: result.data.originalText,
              enhancedText: result.data.enhancedText,
              processingMethod: 'backend' as any
            };
          }

          // Backend failed, fall back to other methods
          console.warn('Backend API failed, falling back to other processing methods:', result.error);
          onProgress?.('Backend API failed, trying alternative methods...');

        } else {
          console.warn('Backend API not available, using alternative processing');
          onProgress?.('Backend API not available, using alternative processing...');
        }

      } catch (error) {
        console.warn('Backend API error, falling back to alternative processing:', error);
        onProgress?.('Backend API error, switching to alternative processing...');
      }
    }

    // Try Python backend as secondary option
    if (apiKey) {
      try {
        onProgress?.('Checking Python backend availability...');
        
        const isBackendHealthy = await PythonBackendService.checkHealth();
        
        if (isBackendHealthy) {
          onProgress?.('Using Python backend for processing...');
          
          const result = await PythonBackendService.processDocument(
            file,
            context,
            documentType,
            apiKey,
            onProgress
          );

          if (result.success) {
            return {
              ...result,
              processingMethod: 'python'
            };
          }

          console.warn('Python backend failed, falling back to browser processing:', result.error);
          onProgress?.('Python backend failed, switching to browser processing...');

        } else {
          console.warn('Python backend not available, using browser processing');
          onProgress?.('Python backend not available, using browser processing...');
        }

      } catch (error) {
        console.warn('Python backend error, falling back to browser:', error);
        onProgress?.('Python backend error, switching to browser processing...');
      }
    }

    // Browser fallback processing
    return await this.processBrowserFallback(options);
  }

  /**
   * Process document using browser-based methods
   */
  private static async processBrowserFallback(options: HybridProcessOptions): Promise<HybridProcessResult> {
    const { file, context, documentType, apiKey, onProgress } = options;

    try {
      let originalText = '';
      const pdfBlob: Blob | null = null;

      onProgress?.('Processing document in browser...');

      // Regular document parsing
      onProgress?.('Extracting text from document...');

      const parseResult = await parseDocument(file);
      
      if (!parseResult.success || !parseResult.content) {
        // Check if this is likely an OCR-needed document
        const needsOCR = parseResult.error && 
          (parseResult.error.includes('scanned') || 
           parseResult.error.includes('image-based') || 
           parseResult.error.includes('no readable text'));
        
        return {
          success: false,
          error: parseResult.error || 'Failed to extract text from document',
          needsOCR: needsOCR
        };
      }

      originalText = parseResult.content;

      // Enhance with AI (only if API key is available)
      if (apiKey) {
        onProgress?.('Enhancing document with AI...');

        const enhancedText = await enhanceDocument({
          document: originalText,
          context,
          documentType
        });

        return {
          success: true,
          originalText,
          enhancedText,
          processingMethod: 'browser'
        };
      } else {
        // Return original text if no API key for enhancement
        onProgress?.('No API key available for enhancement, returning original text...');
        return {
          success: true,
          originalText,
          enhancedText: originalText, // Return original as enhanced
          processingMethod: 'browser'
        };
      }

    } catch (error) {
      console.error('Browser processing failed:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Browser processing failed',
        processingMethod: 'browser'
      };
    }
  }

  /**
   * Download file from Python backend or create blob download
   */
  static async downloadResult(result: HybridProcessResult, filename: string): Promise<void> {
    try {
      if (result.processingMethod === 'python' && result.downloadUrl) {
        // Download from Python backend
        await PythonBackendService.downloadFile(result.downloadUrl, filename);
      } else if (result.pdfBlob) {
        // Download browser-generated PDF
        const url = URL.createObjectURL(result.pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (result.enhancedText) {
        // Download as text file
        const blob = new Blob([result.enhancedText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename.replace(/\.[^/.]+$/, '.txt');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        throw new Error('No downloadable content available');
      }
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  }

  /**
   * Check if backend is available
   */
  static async isBackendAvailable(): Promise<boolean> {
    return await BackendService.isAvailable();
  }

  /**
   * Check if Python backend is available
   */
  static async isPythonBackendAvailable(): Promise<boolean> {
    return await PythonBackendService.checkHealth();
  }
}
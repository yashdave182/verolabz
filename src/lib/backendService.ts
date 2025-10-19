export interface BackendProcessResult {
  success: boolean;
  data?: {
    originalText: string;
    enhancedText: string;
    reconstructedDocument?: string | ArrayBuffer; // Updated to allow ArrayBuffer
    layoutData?: any;
    statistics?: any;
    processingInfo?: any;
    documentStructure?: any;
    insights?: any;
    downloadInfo?: {
      fileName: string;
      downloadUrl: string;
      fileSize: number;
      format: string;
    };
    metadata: {
      originalFileName: string;
      fileType: string;
      fileSize: number;
      originalLength: number;
      enhancedLength: number;
      processingTimeMs: number;
      enhancementLevel: string;
      documentType: string;
    };
  };
  error?: string;
  stage?: string;
}

export interface BackendHealthResult {
  success: boolean;
  data?: {
    status: string;
    timestamp: string;
    uptime: number;
    memory: any;
    version: string;
    environment: string;
    services: {
      googleVision: boolean;
      geminiAPI: boolean;
    };
  };
  error?: string;
}

export class BackendService {
  private static readonly BASE_URL = 'http://localhost:3002/api';

  /**
   * Enhanced document processing with format preservation
   */
  static async processDocumentEnhanced(
    file: File,
    context: string,
    documentType: 'business' | 'student',
    options: {
      outputFormat?: 'html' | 'markdown' | 'text' | 'json' | 'docx' | 'pdf';
      enhancementLevel?: 'light' | 'standard' | 'comprehensive';
      includeOriginal?: boolean;
    } = {},
    onProgress?: (message: string) => void
  ): Promise<BackendProcessResult> {
    try {
      onProgress?.('Starting enhanced document processing...');
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('context', context);
      formData.append('documentType', documentType);
      formData.append('outputFormat', options.outputFormat || 'html');
      formData.append('enhancementLevel', options.enhancementLevel || 'standard');
      formData.append('includeOriginal', String(options.includeOriginal ?? true));

      onProgress?.('Uploading file and processing...');
      
      const response = await fetch(`${this.BASE_URL}/documents/process-enhanced`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      let result;
      if (options.outputFormat === 'docx' || options.outputFormat === 'pdf') {
        const arrayBuffer = await response.arrayBuffer();
        result = { success: true, data: { reconstructedDocument: arrayBuffer } };
      } else {
        result = await response.json();
      }
      
      if (result.success) {
        onProgress?.('Enhanced processing completed successfully!');
        return {
          success: true,
          data: {
            originalText: result.data.originalText,
            enhancedText: result.data.enhancedText,
            reconstructedDocument: result.data.reconstructedDocument,
            layoutData: result.data.layoutData,
            statistics: result.data.statistics,
            processingInfo: result.data.processingInfo,
            metadata: {
              originalFileName: 'text-input',
              fileType: 'text',
              fileSize: 0,
              originalLength: result.data.originalText?.length || 0,
              enhancedLength: result.data.enhancedText?.length || 0,
              processingTimeMs: result.data.processingTimeMs || 0,
              enhancementLevel: options.enhancementLevel || 'standard',
              documentType
            }
          }
        };
      } else {
        throw new Error(result.error || 'Enhanced processing failed');
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Check if backend is available and properly configured
   */
  static async checkHealth(): Promise<BackendHealthResult> {
    try {
      const response = await fetch(`${this.BASE_URL}/health`);
      
      if (!response.ok) {
        return {
          success: false,
          error: `Backend health check failed: ${response.status} ${response.statusText}`
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data
      };
    } catch (error) {
      console.error('Backend health check error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to connect to backend'
      };
    }
  }

  /**
   * Process document using backend OCR and AI enhancement
   */
  static async processDocument(
    file: File,
    context: string,
    documentType: 'business' | 'student' | 'general',
    onProgress?: (message: string) => void
  ): Promise<BackendProcessResult> {
    try {
      onProgress?.('Connecting to backend...');

      // First check if backend is available
      const healthCheck = await this.checkHealth();
      if (!healthCheck.success) {
        throw new Error(`Backend not available: ${healthCheck.error}`);
      }

      if (!healthCheck.data?.services.googleVision || !healthCheck.data?.services.geminiAPI) {
        throw new Error('Backend services not properly configured (Vision API or Gemini API missing)');
      }

      onProgress?.('Uploading document for processing...');

      // Prepare form data
      const formData = new FormData();
      formData.append('document', file);
      formData.append('documentType', documentType);
      formData.append('context', context);
      formData.append('preserveFormat', 'true');
      formData.append('enhancementLevel', 'standard');

      // Process document
      const response = await fetch(`${this.BASE_URL}/documents/process`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Processing failed: ${response.status}`);
      }

      if (!result.success) {
        throw new Error(result.error || 'Document processing failed');
      }

      onProgress?.('Document processing completed!');

      return {
        success: true,
        data: result.data
      };

    } catch (error) {
      console.error('Backend document processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Document processing failed'
      };
    }
  }

  /**
   * Enhance text directly without file upload
   */
  static async enhanceText(
    text: string,
    context: string,
    documentType: 'business' | 'student' | 'general'
  ): Promise<BackendProcessResult> {
    try {
      // Check backend health
      const healthCheck = await this.checkHealth();
      if (!healthCheck.success) {
        throw new Error(`Backend not available: ${healthCheck.error}`);
      }

      const response = await fetch(`${this.BASE_URL}/documents/enhance-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text,
          context,
          documentType
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Enhancement failed: ${response.status}`);
      }

      if (!result.success) {
        throw new Error(result.error || 'Text enhancement failed');
      }

      return {
        success: true,
        data: result.data
      };

    } catch (error) {
      console.error('Backend text enhancement error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Text enhancement failed'
      };
    }
  }

  /**
   * Summarize document
   */
  static async summarizeDocument(
    file: File,
    maxLength: number = 500
  ): Promise<BackendProcessResult> {
    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('maxLength', maxLength.toString());

      const response = await fetch(`${this.BASE_URL}/documents/summarize`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Summarization failed: ${response.status}`);
      }

      if (!result.success) {
        throw new Error(result.error || 'Document summarization failed');
      }

      return {
        success: true,
        data: result.data
      };

    } catch (error) {
      console.error('Backend document summarization error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Document summarization failed'
      };
    }
  }

  /**
   * Get supported file formats
   */
  static async getSupportedFormats(): Promise<any> {
    try {
      const response = await fetch(`${this.BASE_URL}/documents/supported-formats`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error('Failed to get supported formats');
      }

      return result.data;
    } catch (error) {
      console.error('Error getting supported formats:', error);
      return null;
    }
  }

  /**
   * Download a generated document file
   */
  static async downloadFile(downloadUrl: string, filename: string): Promise<void> {
    try {
      const response = await fetch(`${this.BASE_URL}${downloadUrl}`);
      
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  }

  /**
   * Check if backend processing is available (fallback detection)
   */
  static async isAvailable(): Promise<boolean> {
    const healthCheck = await this.checkHealth();
    return healthCheck.success && 
           healthCheck.data?.services.googleVision === true && 
           healthCheck.data?.services.geminiAPI === true;
  }
}
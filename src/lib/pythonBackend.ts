export interface PythonProcessResult {
  success: boolean;
  original_text?: string;
  enhanced_text?: string;
  download_url?: string;
  message?: string;
  error?: string;
}

export class PythonBackendService {
  private static readonly BACKEND_URL = 'http://localhost:5000';

  /**
   * Process document using Python backend
   */
  static async processDocument(
    file: File,
    context: string,
    documentType: 'business' | 'student' | 'general',
    apiKey: string,
    onProgress?: (message: string) => void
  ): Promise<PythonProcessResult> {
    try {
      onProgress?.('Uploading document to Python backend...');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('context', context);
      formData.append('document_type', documentType);
      formData.append('api_key', apiKey);

      onProgress?.('Processing document with Python libraries...');

      const response = await fetch(`${this.BACKEND_URL}/process-document`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        onProgress?.('Document processed successfully!');
        return result;
      }

      throw new Error(result.error || 'Unknown error occurred');

    } catch (error) {
      console.error('Python backend error:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          error: 'Cannot connect to Python backend. Please ensure the backend server is running on http://localhost:5000'
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Download processed file from Python backend
   */
  static async downloadFile(downloadUrl: string, filename: string): Promise<void> {
    try {
      const response = await fetch(`${this.BACKEND_URL}${downloadUrl}`);
      
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
   * Check if Python backend is running
   */
  static async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.BACKEND_URL}/health`, {
        method: 'GET'
      });
      
      return response.ok;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  }
}
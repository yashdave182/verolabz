/**
 * Enhanced Backend Service
 * Handles communication with the Flask backend for document processing
 * using Unstract OCR and Gemini AI with format preservation
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface UploadResponse {
  success: boolean;
  document_id?: string;
  text?: string;
  filename?: string;
  whisper_hash?: string;
  method?: string;
  error?: string;
}

export interface EnhanceResponse {
  success: boolean;
  enhanced_text?: string;
  template_id?: string;
  format_preserved?: boolean;
  error?: string;
}

export interface ProcessResponse {
  success: boolean;
  document_id?: string;
  original_text?: string;
  enhanced_text?: string;
  filename?: string;
  error?: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  unstract_configured: boolean;
  gemini_configured: boolean;
}

/**
 * Check backend health and API configuration
 */
export const checkBackendHealth = async (): Promise<HealthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Backend health check error:', error);
    throw new Error(
      `Backend server is not responding. Please ensure the Flask server is running on ${API_BASE_URL}`
    );
  }
};

/**
 * Upload document and extract text using Unstract OCR
 */
export const uploadDocument = async (
  file: File,
  mode: 'native_text' | 'low_cost' | 'high_quality' | 'form' | 'table' = 'form',
  outputMode: 'layout_preserving' | 'text' = 'layout_preserving'
): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', mode);
    formData.append('output_mode', outputMode);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Upload failed: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Document upload error:', error);
    throw error instanceof Error
      ? error
      : new Error('Failed to upload document');
  }
};

/**
 * Enhance document text using Gemini AI
 */
export const enhanceDocument = async (
  text: string,
  context: string,
  preserveFormat: boolean = true
): Promise<EnhanceResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/enhance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        context,
        preserve_format: preserveFormat,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Enhancement failed: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Document enhancement error:', error);
    throw error instanceof Error
      ? error
      : new Error('Failed to enhance document');
  }
};

/**
 * Complete pipeline: Upload -> OCR -> Enhance -> Format
 */
export const processDocument = async (
  file: File,
  context: string,
  mode: 'native_text' | 'low_cost' | 'high_quality' | 'form' | 'table' = 'form',
  preserveFormat: boolean = true
): Promise<ProcessResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('context', context);
    formData.append('mode', mode);
    formData.append('preserve_format', preserveFormat.toString());

    const response = await fetch(`${API_BASE_URL}/process`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Processing failed: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Document processing error:', error);
    throw error instanceof Error
      ? error
      : new Error('Failed to process document');
  }
};

/**
 * Download enhanced document
 */
export const downloadDocument = async (documentId: string): Promise<Blob> => {
  try {
    const response = await fetch(`${API_BASE_URL}/download/${documentId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`);
    }

    return await response.blob();
  } catch (error) {
    console.error('Document download error:', error);
    throw error instanceof Error
      ? error
      : new Error('Failed to download document');
  }
};

/**
 * Helper function to validate backend configuration
 */
export const validateBackendConfiguration = async (): Promise<{
  isConfigured: boolean;
  missingServices: string[];
  message: string;
}> => {
  try {
    const health = await checkBackendHealth();

    const missingServices: string[] = [];

    if (!health.unstract_configured) {
      missingServices.push('Unstract API');
    }

    if (!health.gemini_configured) {
      missingServices.push('Gemini API');
    }

    const isConfigured = missingServices.length === 0;

    let message = '';
    if (!isConfigured) {
      message = `Missing API keys: ${missingServices.join(', ')}. Please configure them in the .env file.`;
    } else {
      message = 'Backend is fully configured and ready!';
    }

    return {
      isConfigured,
      missingServices,
      message,
    };
  } catch (error) {
    return {
      isConfigured: false,
      missingServices: ['Backend Server'],
      message:
        'Cannot connect to backend server. Please ensure Flask server is running.',
    };
  }
};

/**
 * Utility function to detect document type based on file
 */
export const detectDocumentMode = (file: File): 'native_text' | 'form' | 'table' => {
  const fileName = file.name.toLowerCase();

  // Native text for digital PDFs and Word documents
  if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
    return 'native_text';
  }

  // Form mode for most documents (default)
  // Use 'table' if filename suggests it's a table/spreadsheet
  if (fileName.includes('table') || fileName.includes('sheet') || fileName.includes('data')) {
    return 'table';
  }

  return 'form';
};

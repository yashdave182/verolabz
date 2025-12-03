from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import traceback
from io import BytesIO
import tempfile

from gemini_client import GeminiClient
from document_converter import DocumentConverter
from latex_processor import LaTeXProcessor

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize services
gemini_client = GeminiClient(api_key=os.getenv('GEMINI_API_KEY'))
latex_processor = LaTeXProcessor()
doc_converter = DocumentConverter()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'LaTeX Document Enhancement API',
        'version': '1.0.0'
    })

@app.route('/enhance', methods=['POST'])
def enhance_document():
    """
    Enhance document with AI and LaTeX support
    
    Expected form data:
    - file: Document file (.docx or .pdf)
    - prompt: (optional) User's enhancement instructions
    - doc_type: (optional) Document type hint
    """
    try:
        # Validate file upload
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'Empty filename'}), 400
        
        # Get optional parameters
        user_prompt = request.args.get('prompt', request.form.get('prompt', ''))
        doc_type = request.args.get('doc_type', request.form.get('doc_type', 'auto'))
        
        # Save uploaded file temporarily
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in ['.docx', '.pdf', '.txt', '.doc']:
            return jsonify({'error': 'Unsupported file format. Please use .docx or .pdf'}), 400
        
        # Read file content
        file_content = file.read()
        
        # Extract text from document
        extracted_text = doc_converter.extract_text(file_content, file_ext)
        
        if not extracted_text or len(extracted_text.strip()) < 10:
            return jsonify({'error': 'Could not extract text from document'}), 400
        
        # Detect if document contains mathematical/scientific content
        has_math = latex_processor.detect_mathematical_content(extracted_text)
        
        # Build enhancement prompt
        enhancement_prompt = latex_processor.build_enhancement_prompt(
            content=extracted_text,
            user_instructions=user_prompt,
            doc_type=doc_type,
            include_latex=has_math
        )
        
        # Use Gemini to enhance the content
        enhanced_content = gemini_client.enhance_content(enhancement_prompt)
        
        # Process LaTeX in the enhanced content
        processed_content = latex_processor.process_latex_content(enhanced_content)
        
        # Convert back to document format
        output_format = file_ext if file_ext in ['.docx', '.pdf'] else '.docx'
        output_file = doc_converter.create_document(
            content=processed_content,
            original_format=file_ext,
            output_format=output_format,
            include_latex=has_math
        )
        
        # Prepare response
        output_buffer = BytesIO(output_file)
        output_buffer.seek(0)
        
        # Determine output filename
        base_name = os.path.splitext(file.filename)[0]
        output_filename = f"enhanced_{base_name}{output_format}"
        
        return send_file(
            output_buffer,
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document' if output_format == '.docx' else 'application/pdf',
            as_attachment=True,
            download_name=output_filename
        )
        
    except Exception as e:
        # Log error for debugging (will appear in HuggingFace logs)
        print(f"Error processing document: {str(e)}")
        print(traceback.format_exc())
        
        # Return generic error to client
        return jsonify({
            'error': 'Failed to process document. Please try again.',
            'details': str(e) if os.getenv('FLASK_ENV') == 'development' else None
        }), 500

@app.route('/add-signature', methods=['POST'])
def add_signature():
    """
    Add digital signature to document
    
    Expected form data:
    - file: Document file (.docx)
    - signature: Base64 signature image
    - position: (optional) Position of signature
    - signer_name: (optional) Name of signer
    """
    try:
        # Validate file upload
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'Empty filename'}), 400
            
        # Get signature data
        signature_data = request.form.get('signature')
        if not signature_data:
            return jsonify({'error': 'No signature provided'}), 400
            
        position = request.form.get('position', 'bottom-right')
        signer_name = request.form.get('signer_name')
        
        # Read file content
        file_content = file.read()
        
        # Add signature
        signed_doc = doc_converter.add_signature(
            file_content=file_content,
            signature_data=signature_data,
            position=position,
            signer_name=signer_name
        )
        
        # Prepare response
        output_buffer = BytesIO(signed_doc)
        output_buffer.seek(0)
        
        base_name = os.path.splitext(file.filename)[0]
        output_filename = f"Signed_{base_name}.docx"
        
        return send_file(
            output_buffer,
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            as_attachment=True,
            download_name=output_filename
        )
        
    except Exception as e:
        print(f"Error signing document: {str(e)}")
        print(traceback.format_exc())
        return jsonify({
            'error': 'Failed to sign document',
            'details': str(e) if os.getenv('FLASK_ENV') == 'development' else None
        }), 500

@app.route('/', methods=['GET'])
def index():
    """Root endpoint with API information"""
    return jsonify({
        'name': 'LaTeX Document Enhancement API',
        'version': '1.0.0',
        'description': 'AI-powered document enhancement with LaTeX support using Google Gemini',
        'endpoints': {
            '/health': 'Health check',
            '/enhance': 'Enhance document (POST with file)',
        },
        'supported_formats': ['.docx', '.pdf', '.txt'],
        'features': [
            'AI-powered content enhancement',
            'LaTeX equation support',
            'Mathematical notation',
            'Scientific formatting',
            'Professional document structure'
        ]
    })

if __name__ == '__main__':
    # Check for API key
    if not os.getenv('GEMINI_API_KEY'):
        print("WARNING: GEMINI_API_KEY environment variable not set!")
        print("Please set it in HuggingFace Spaces Settings → Repository secrets")
    
    # Run Flask app
    port = int(os.getenv('PORT', 7860))  # HuggingFace uses port 7860
    app.run(host='0.0.0.0', port=port, debug=os.getenv('FLASK_ENV') == 'development')

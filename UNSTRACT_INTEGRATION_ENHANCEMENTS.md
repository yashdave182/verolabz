# Unstract Integration Enhancements

## Overview

Based on the Unstract API documentation, I've enhanced the integration to better utilize the available features for improved layout preservation and format extraction.

## Key Enhancements

### 1. Enhanced API Parameter Usage

**Previously**: Basic parameter usage
**Now**: Full utilization of Unstract's advanced features

**Enhanced Parameters**:
- `add_line_nos=true`: Adds line numbers and saves line metadata
- `mark_vertical_lines=true`: Reproduces vertical lines in documents
- `mark_horizontal_lines=true`: Reproduces horizontal lines in documents
- `page_seperator=<<<PAGE_BREAK>>>`: Clear page separation markers

### 2. Structured Data Retrieval

**New Endpoints Utilized**:
1. **Line Metadata**: Retrieves detailed line-level information
2. **Highlights Data**: Gets highlight information for better context

### 3. Rich Format Extraction

**Enhanced FormatExtractor** now processes:
- Line-level positioning data (x, y, width, height)
- Font information (family, size, bold, italic)
- Page number information
- Line numbers and metadata

## Technical Implementation

### Backend API Enhancements

#### UnstractOCRService Improvements:
```python
# Enhanced parameters for better extraction
params = {
    "mode": mode,
    "output_mode": output_mode,
    "page_seperator": "<<<PAGE_BREAK>>>",
    "mark_vertical_lines": "true",
    "mark_horizontal_lines": "true",
    "add_line_nos": "true",  # Key enhancement
}

# Additional data retrieval
line_metadata_response = requests.get(
    f"{base_url}/whisper-line-metadata",
    headers=headers,
    params={"whisper_hash": whisper_hash}
)

highlights_response = requests.get(
    f"{base_url}/whisper-highlights",
    headers=headers,
    params={"whisper_hash": whisper_hash}
)
```

### Format Extraction Improvements

#### TextFormatExtractor Enhancements:
```python
def _extract_from_line_metadata(self, text: str, structured_data: Dict) -> RichFormatTemplate:
    """Extract format from line metadata provided by Unstract"""
    template = RichFormatTemplate()
    
    # Store line metadata
    if 'line_metadata' in structured_data:
        template.metadata['line_metadata'] = structured_data['line_metadata']
    
    # Process each line with its metadata
    for i, line_info in enumerate(line_metadata.get('lines', [])):
        block = self._create_rich_block_from_line_metadata(line_info, i)
        template.blocks.append(block)
    
    return template

def _create_rich_block_from_line_metadata(self, line_info: Dict, index: int) -> RichFormatBlock:
    """Create a RichFormatBlock from line metadata"""
    # Extract precise positioning
    position = PositionInfo(
        x=line_info['bbox'].get('x', 0),
        y=line_info['bbox'].get('y', 0),
        width=line_info['bbox'].get('width', 0),
        height=line_info['bbox'].get('height', 0),
        page_number=line_info['bbox'].get('page', 1)
    )
    
    # Extract font information
    if 'font' in line_info:
        font_info = line_info['font']
        char_formats.append(TextFormat(
            start=0,
            end=len(text),
            font_family=font_info.get('family', 'Arial'),
            font_size=font_info.get('size', 12),
            bold=font_info.get('bold', False),
            italic=font_info.get('italic', False)
        ))
```

## Benefits Achieved

### 1. Improved Layout Preservation
- **Precise Positioning**: Actual x,y coordinates instead of guessed positions
- **Font Information**: Real font family, size, and styling
- **Page Awareness**: Page number tracking for multi-page documents
- **Line Metadata**: Detailed line-level information

### 2. Better Format Extraction
- **Structured Data**: Utilizes Unstract's line metadata API
- **Rich Information**: Captures comprehensive formatting details
- **Fallback Support**: Graceful degradation when metadata unavailable

### 3. Enhanced Document Processing
- **Vertical/Horizontal Lines**: Preserves table and document structure
- **Page Breaks**: Clear separation for multi-page documents
- **Line Numbers**: Better tracking and referencing

## API Endpoints Enhanced

### 1. Upload Endpoint (`/api/upload`)
- Returns structured data along with extracted text
- Includes line metadata and highlights when available
- Better error handling and response structure

### 2. Process Endpoint (`/api/process`)
- Utilizes structured data for enhanced format preservation
- Passes line metadata to format extractor
- Improved template creation with rich formatting

### 3. OCR Service (`UnstractOCRService`)
- Enhanced parameter configuration
- Additional structured data retrieval
- Better error handling and logging

## Expected Results

### 1. Quality Improvements
- **Better Layout Preservation**: Actual document structure maintained
- **Accurate Formatting**: Real font and styling information preserved
- **Professional Output**: Enhanced document appearance

### 2. Performance Benefits
- **Faster Processing**: More efficient data extraction
- **Reduced Guesswork**: Less reliance on pattern-based formatting
- **Better Accuracy**: Higher quality format preservation

### 3. User Experience
- **More Reliable Results**: Consistent layout preservation
- **Better Context**: Enhanced document understanding
- **Professional Quality**: Improved output documents

## Future Enhancements

### 1. Advanced Features
- **Webhook Integration**: Real-time processing notifications
- **Highlight Queries**: Advanced text searching and highlighting
- **Custom Processing**: Mode-specific optimizations

### 2. Enhanced Data Utilization
- **Form Recognition**: Better handling of form-like documents
- **Table Processing**: Improved table structure preservation
- **Image Handling**: Better integration with visual elements

These enhancements fully leverage Unstract's capabilities to provide superior document processing and layout preservation.
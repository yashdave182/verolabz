import json
import re
from dataclasses import dataclass, field, asdict
from typing import List, Dict, Any, Optional, Tuple
from enum import Enum
from collections import defaultdict

# ============================================================================
# DOCUMENT TWEAK - FORMAT TEMPLATE SYSTEM
# ============================================================================

# ============================================================================
# CORE DATA STRUCTURES
# ============================================================================

class FormatType(Enum):
    BOLD = "bold"
    ITALIC = "italic"
    UNDERLINE = "underline"
    FONT_SIZE = "font_size"
    FONT_FAMILY = "font_family"
    COLOR = "color"
    BACKGROUND = "background"
    ALIGNMENT = "alignment"

class BlockType(Enum):
    HEADING = "heading"
    PARAGRAPH = "paragraph"
    LIST_ITEM = "list_item"
    TABLE_CELL = "table_cell"

@dataclass
class TextFormat:
    """Character-level formatting"""
    start: int
    end: int
    bold: bool = False
    italic: bool = False
    underline: bool = False
    font_size: int = 12
    font_family: str = "Arial"
    color: str = "#000000"
    
    def to_dict(self):
        return asdict(self)
    
    @classmethod
    def from_dict(cls, data):
        return cls(**data)

@dataclass
class BlockFormat:
    """Block-level formatting (paragraph, heading, etc.)"""
    type: BlockType
    alignment: str = "left"  # left, center, right, justify
    margin_top: int = 0
    margin_bottom: int = 0
    margin_left: int = 0
    line_height: float = 1.0
    indent_level: int = 0
    list_style: Optional[str] = None  # bullet, number, none
    heading_level: Optional[int] = None  # 1-6 for headings
    
    def to_dict(self):
        data = asdict(self)
        data['type'] = self.type.value
        return data
    
    @classmethod
    def from_dict(cls, data):
        data['type'] = BlockType(data['type'])
        return cls(**data)

@dataclass
class FormattedBlock:
    """A block of text with its formatting"""
    text: str
    block_format: BlockFormat
    char_formats: List[TextFormat] = field(default_factory=list)
    
    def to_dict(self):
        return {
            'text': self.text,
            'block_format': self.block_format.to_dict(),
            'char_formats': [cf.to_dict() for cf in self.char_formats]
        }
    
    @classmethod
    def from_dict(cls, data):
        return cls(
            text=data['text'],
            block_format=BlockFormat.from_dict(data['block_format']),
            char_formats=[TextFormat.from_dict(cf) for cf in data['char_formats']]
        )

@dataclass
class FormatTemplate:
    """Complete format template extracted from document"""
    blocks: List[FormattedBlock] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    def to_dict(self):
        return {
            'blocks': [block.to_dict() for block in self.blocks],
            'metadata': self.metadata
        }
    
    @classmethod
    def from_dict(cls, data):
        return cls(
            blocks=[FormattedBlock.from_dict(b) for b in data['blocks']],
            metadata=data.get('metadata', {})
        )
    
    def save(self, filepath: str):
        """Save template to JSON file"""
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(self.to_dict(), f, indent=2, ensure_ascii=False)
    
    @classmethod
    def load(cls, filepath: str):
        """Load template from JSON file"""
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return cls.from_dict(data)

# ============================================================================
# FORMAT EXTRACTOR (From plain text)
# ============================================================================

class TextFormatExtractor:
    """Extract formatting from plain text"""
    
    def extract_from_text_patterns(self, text: str) -> FormatTemplate:
        """
        Extract format by analyzing text patterns
        """
        template = FormatTemplate()
        lines = text.split('\n')
        
        for line_num, line in enumerate(lines):
            if not line.strip():
                # Preserve empty lines
                template.blocks.append(FormattedBlock(
                    text="",
                    block_format=BlockFormat(
                        type=BlockType.PARAGRAPH,
                        margin_bottom=10
                    )
                ))
                continue
            
            block = self._analyze_line_format(line, line_num)
            template.blocks.append(block)
        
        return template
    
    def _analyze_line_format(self, line: str, line_num: int = 0) -> FormattedBlock:
        """Analyze a line and guess its formatting"""
        
        # Check if it's a heading
        if self._is_heading(line):
            level = self._get_heading_level(line)
            return FormattedBlock(
                text=line.strip(),
                block_format=BlockFormat(
                    type=BlockType.HEADING,
                    heading_level=level,
                    margin_top=15,
                    margin_bottom=10
                ),
                char_formats=[TextFormat(
                    start=0,
                    end=len(line.strip()),
                    bold=True,
                    font_size=24 - (level * 2)
                )]
            )
        
        # Check if it's a list item
        if self._is_list_item(line):
            return FormattedBlock(
                text=line.strip(),
                block_format=BlockFormat(
                    type=BlockType.LIST_ITEM,
                    margin_left=20,
                    list_style="bullet"
                )
            )
        
        # Check for special markers
        if "<<<PAGE_BREAK>>>" in line:
            # Handle page breaks
            return FormattedBlock(
                text=line.strip(),
                block_format=BlockFormat(
                    type=BlockType.PARAGRAPH,
                    margin_bottom=20
                )
            )
        
        # Default: paragraph
        return FormattedBlock(
            text=line.strip(),
            block_format=BlockFormat(
                type=BlockType.PARAGRAPH,
                margin_bottom=10
            )
        )
    
    def _is_heading(self, line: str) -> bool:
        """Detect if line is a heading"""
        line = line.strip()
        
        # All caps
        if line.isupper() and len(line.split()) <= 10:
            return True
        
        # Title case and short
        if line and line[0].isupper() and len(line.split()) <= 8:
            words = line.split()
            if sum(1 for w in words if w[0].isupper()) >= len(words) * 0.7:
                return True
        
        # Ends without punctuation
        if line and line[-1] not in '.!?,:;':
            if len(line.split()) <= 10:
                return True
        
        return False
    
    def _get_heading_level(self, line: str) -> int:
        """Determine heading level (1-6)"""
        if line.isupper():
            return 1
        if len(line.split()) <= 4:
            return 2
        return 3
    
    def _is_list_item(self, line: str) -> bool:
        """Detect if line is a list item"""
        line = line.strip()
        # Bullet points
        if re.match(r'^[-•●○▪▫■□*+]\s', line):
            return True
        # Numbered lists
        if re.match(r'^\d+[\.)]\s', line):
            return True
        return False

# ============================================================================
# FORMAT APPLIER (Apply format to new text)
# ============================================================================

class FormatApplier:
    """Apply formatting template to new text from LLM"""
    
    def apply_format(self, new_text: str, template: FormatTemplate) -> FormatTemplate:
        """
        Apply the formatting from template to new text
        Maps new text to old formatting structure
        """
        new_template = FormatTemplate(metadata=template.metadata.copy())
        
        # Split new text into blocks (paragraphs)
        new_blocks = self._split_into_blocks(new_text)
        
        # Map new blocks to old format blocks
        for i, new_block_text in enumerate(new_blocks):
            if i < len(template.blocks):
                # Use existing format
                old_block = template.blocks[i]
                new_block = self._apply_block_format(new_block_text, old_block)
            else:
                # Create new block with default format from last block
                if template.blocks:
                    last_format = template.blocks[-1].block_format
                else:
                    last_format = BlockFormat(type=BlockType.PARAGRAPH)
                
                new_block = FormattedBlock(
                    text=new_block_text,
                    block_format=last_format
                )
            
            new_template.blocks.append(new_block)
        
        return new_template
    
    def apply_format_smart(self, new_text: str, template: FormatTemplate) -> FormatTemplate:
        """
        Smart format application - tries to match semantic structure
        Better for when LLM changes content structure
        """
        new_template = FormatTemplate(metadata=template.metadata.copy())
        
        # Split new text into blocks preserving line structure
        new_lines = new_text.split('\n')
        template_lines = []
        for block in template.blocks:
            template_lines.append(block.text)
        
        # Map new lines to template preserving structure
        for i, new_line in enumerate(new_lines):
            if i < len(template.blocks):
                # Use existing format
                old_block = template.blocks[i]
                new_block = self._apply_block_format(new_line, old_block)
            else:
                # Create new block with default format from last block
                if template.blocks:
                    last_format = template.blocks[-1].block_format
                else:
                    last_format = BlockFormat(type=BlockType.PARAGRAPH)
                
                new_block = FormattedBlock(
                    text=new_line,
                    block_format=last_format
                )
            
            new_template.blocks.append(new_block)
        
        return new_template
    
    def _split_into_blocks(self, text: str) -> List[str]:
        """Split text into logical blocks"""
        # Split by double newlines or single newlines
        blocks = []
        current_block = []
        
        for line in text.split('\n'):
            line = line.strip()
            if not line:
                if current_block:
                    blocks.append(' '.join(current_block))
                    current_block = []
            else:
                current_block.append(line)
        
        if current_block:
            blocks.append(' '.join(current_block))
        
        return blocks
    
    def _apply_block_format(self, text: str, old_block: FormattedBlock) -> FormattedBlock:
        """Apply old block's format to new text"""
        new_block = FormattedBlock(
            text=text,
            block_format=old_block.block_format
        )
        
        # Map character formats proportionally
        if old_block.char_formats:
            old_len = len(old_block.text)
            new_len = len(text)
            
            for old_format in old_block.char_formats:
                # Calculate proportional positions
                start_ratio = old_format.start / old_len if old_len > 0 else 0
                end_ratio = old_format.end / old_len if old_len > 0 else 1
                
                new_start = int(start_ratio * new_len)
                new_end = int(end_ratio * new_len)
                
                new_format = TextFormat(
                    start=new_start,
                    end=new_end,
                    bold=old_format.bold,
                    italic=old_format.italic,
                    underline=old_format.underline,
                    font_size=old_format.font_size,
                    font_family=old_format.font_family,
                    color=old_format.color
                )
                new_block.char_formats.append(new_format)
        
        return new_block
    
    def _analyze_structure(self, template: FormatTemplate) -> Dict[str, int]:
        """Analyze document structure"""
        structure = defaultdict(int)
        
        for block in template.blocks:
            block_type = block.block_format.type.value
            structure[block_type] += 1
            
            if block.block_format.heading_level:
                structure[f'heading_{block.block_format.heading_level}'] += 1
        
        return dict(structure)
    
    def _classify_block(self, text: str, structure: Dict[str, int]) -> BlockType:
        """Classify what type of block this text should be"""
        text = text.strip()
        
        # Check for heading indicators
        if len(text.split()) <= 10 and text[0].isupper():
            if text.isupper() or not text[-1] in '.!?,:;':
                return BlockType.HEADING
        
        # Check for list indicators
        if re.match(r'^[-•●○▪▫■□*+]\s', text):
            return BlockType.LIST_ITEM
        if re.match(r'^\d+[\.)]\s', text):
            return BlockType.LIST_ITEM
        
        # Check for page breaks
        if "<<<PAGE_BREAK>>>" in text:
            return BlockType.PARAGRAPH  # Treat as special paragraph
        
        # Default: paragraph
        return BlockType.PARAGRAPH
    
    def _find_matching_format(self, block_type: BlockType, template: FormatTemplate) -> FormattedBlock:
        """Find a matching format from template"""
        for block in template.blocks:
            if block.block_format.type == block_type:
                return block
        
        # Default: paragraph
        return FormattedBlock(
            text="",
            block_format=BlockFormat(type=BlockType.PARAGRAPH)
        )

# ============================================================================
# MAIN PROCESSOR
# ============================================================================

class DocumentProcessor:
    """Main document processing pipeline"""
    
    def __init__(self):
        self.extractor = TextFormatExtractor()
        self.applier = FormatApplier()
    
    def process_document(self, original_text: str, enhanced_text: str) -> FormatTemplate:
        """
        Process document: extract format from original, apply to enhanced text
        """
        # Extract format from original text
        template = self.extractor.extract_from_text_patterns(original_text)
        
        # Apply format to enhanced text
        formatted_result = self.applier.apply_format(enhanced_text, template)
        
        return formatted_result
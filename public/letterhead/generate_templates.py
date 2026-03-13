#!/usr/bin/env python3
"""
Generate high-resolution letterhead templates for Infuse AI
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Colors
GOLD = "#F4B400"
ORANGE = "#FF6B35"
DARK_BLUE = "#1E3A8A"
DARK_GRAY = "#333333"
GRAY = "#666666"
WHITE = "#FFFFFF"

# Output directory
OUTPUT_DIR = "/app/frontend/public/letterhead"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def hex_to_rgba(hex_color, alpha=255):
    """Convert hex color to RGBA tuple"""
    rgb = hex_to_rgb(hex_color)
    return (*rgb, alpha)

def draw_logo(draw, center_x, center_y, size, opacity=255):
    """Draw the Infuse AI logo (hexagon with F)"""
    # Calculate hexagon points
    import math
    
    hex_size = size // 2
    points = []
    for i in range(6):
        angle = math.radians(60 * i - 30)
        x = center_x + hex_size * math.cos(angle)
        y = center_y + hex_size * math.sin(angle)
        points.append((x, y))
    
    # Draw outer hexagon (gold)
    draw.polygon(points, fill=hex_to_rgba(GOLD, opacity))
    
    # Inner hexagon (orange)
    inner_points = []
    inner_size = hex_size * 0.75
    for i in range(6):
        angle = math.radians(60 * i - 30)
        x = center_x + inner_size * math.cos(angle)
        y = center_y + inner_size * math.sin(angle)
        inner_points.append((x, y))
    draw.polygon(inner_points, fill=hex_to_rgba(ORANGE, opacity))
    
    return hex_size

def draw_gradient_line(draw, y, width, height, start_x, colors):
    """Draw a horizontal gradient line"""
    segment_width = width // len(colors)
    for i, color in enumerate(colors):
        x1 = start_x + i * segment_width
        x2 = x1 + segment_width
        draw.rectangle([x1, y, x2, y + height], fill=hex_to_rgb(color))

def create_main_letterhead():
    """Create the main letterhead template"""
    # A4 at 300 DPI: 2480 x 3508 pixels
    width, height = 2480, 3508
    
    # Create image with white background
    img = Image.new('RGBA', (width, height), hex_to_rgba(WHITE))
    draw = ImageDraw.Draw(img)
    
    # Margins (approximately 1cm at 300 DPI = 118 pixels)
    margin = 118
    
    # Try to load a nice font, fallback to default
    try:
        font_bold_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 84)  # ~28pt at 300dpi
        font_regular_medium = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 42)  # ~14pt
        font_regular_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 30)  # ~10pt
    except:
        font_bold_large = ImageFont.load_default()
        font_regular_medium = ImageFont.load_default()
        font_regular_small = ImageFont.load_default()
    
    # CENTER WATERMARK (15% opacity)
    watermark_opacity = int(255 * 0.15)
    center_x, center_y = width // 2, height // 2
    watermark_size = 800
    
    # Draw watermark hexagon
    import math
    hex_size = watermark_size // 2
    points = []
    for i in range(6):
        angle = math.radians(60 * i - 30)
        x = center_x + hex_size * math.cos(angle)
        y = center_y + hex_size * math.sin(angle)
        points.append((x, y))
    draw.polygon(points, fill=hex_to_rgba(GOLD, watermark_opacity))
    
    inner_points = []
    inner_size = hex_size * 0.75
    for i in range(6):
        angle = math.radians(60 * i - 30)
        x = center_x + inner_size * math.cos(angle)
        y = center_y + inner_size * math.sin(angle)
        inner_points.append((x, y))
    draw.polygon(inner_points, fill=hex_to_rgba(ORANGE, watermark_opacity))
    
    # Draw F in watermark
    try:
        font_watermark = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 300)
        bbox = draw.textbbox((0, 0), "F", font=font_watermark)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        draw.text((center_x - text_width//2, center_y - text_height//2 - 50), "F", 
                  fill=hex_to_rgba(WHITE, watermark_opacity), font=font_watermark)
    except:
        pass
    
    # TOP LEFT HEADER (2cm from top = 236px)
    header_y = 236
    
    # Company name "INFUSE AI"
    draw.text((margin * 2, header_y), "INFUSE AI", fill=hex_to_rgb(GOLD), font=font_bold_large)
    
    # Tagline
    draw.text((margin * 2, header_y + 100), "Healthcare Intelligence Platform", 
              fill=hex_to_rgb(DARK_GRAY), font=font_regular_medium)
    
    # Right side - contact info
    contact_text = "Delhi, India | infuse.net.in"
    try:
        bbox = draw.textbbox((0, 0), contact_text, font=font_regular_small)
        text_width = bbox[2] - bbox[0]
    except:
        text_width = 400
    draw.text((width - margin * 2 - text_width, header_y + 30), contact_text, 
              fill=hex_to_rgb(GRAY), font=font_regular_small)
    
    # BOTTOM GRADIENT LINES (2cm from bottom = 236px from bottom)
    line_y_start = height - 236 - 60  # 3 lines with spacing
    line_width = int(width * 0.95)
    line_start_x = (width - line_width) // 2
    line_height = 8
    line_spacing = 20
    
    # Three gradient lines
    colors = [GOLD, ORANGE, DARK_BLUE]
    for i, color in enumerate(colors):
        y = line_y_start + i * (line_height + line_spacing)
        draw.rectangle([line_start_x, y, line_start_x + line_width, y + line_height], 
                      fill=hex_to_rgb(color))
    
    # Save
    output_path = os.path.join(OUTPUT_DIR, "infuse-letterhead.png")
    img.save(output_path, "PNG", dpi=(300, 300))
    print(f"Created: {output_path}")
    return output_path

def create_continuation_sheet():
    """Create the continuation sheet template"""
    # A4 at 300 DPI: 2480 x 3508 pixels
    width, height = 2480, 3508
    
    # Create image with white background
    img = Image.new('RGBA', (width, height), hex_to_rgba(WHITE))
    draw = ImageDraw.Draw(img)
    
    margin = 118
    
    try:
        font_medium = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 48)  # ~16pt
    except:
        font_medium = ImageFont.load_default()
    
    # CENTER WATERMARK (12% opacity)
    watermark_opacity = int(255 * 0.12)
    center_x, center_y = width // 2, height // 2
    
    import math
    hex_size = 400
    points = []
    for i in range(6):
        angle = math.radians(60 * i - 30)
        x = center_x + hex_size * math.cos(angle)
        y = center_y + hex_size * math.sin(angle)
        points.append((x, y))
    draw.polygon(points, fill=hex_to_rgba(GOLD, watermark_opacity))
    
    inner_points = []
    inner_size = hex_size * 0.75
    for i in range(6):
        angle = math.radians(60 * i - 30)
        x = center_x + inner_size * math.cos(angle)
        y = center_y + inner_size * math.sin(angle)
        inner_points.append((x, y))
    draw.polygon(inner_points, fill=hex_to_rgba(ORANGE, watermark_opacity))
    
    # Draw F in watermark
    try:
        font_watermark = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 250)
        bbox = draw.textbbox((0, 0), "F", font=font_watermark)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        draw.text((center_x - text_width//2, center_y - text_height//2 - 40), "F", 
                  fill=hex_to_rgba(WHITE, watermark_opacity), font=font_watermark)
    except:
        pass
    
    # TOP LEFT HEADER (2.5cm from top = 295px)
    header_y = 295
    draw.text((margin * 2, header_y), "INFUSE AI | Continuation", 
              fill=hex_to_rgb(GOLD), font=font_medium)
    
    # BOTTOM GRADIENT LINES
    line_y_start = height - 236 - 60
    line_width = int(width * 0.95)
    line_start_x = (width - line_width) // 2
    line_height = 8
    line_spacing = 20
    
    colors = [GOLD, ORANGE, DARK_BLUE]
    for i, color in enumerate(colors):
        y = line_y_start + i * (line_height + line_spacing)
        draw.rectangle([line_start_x, y, line_start_x + line_width, y + line_height], 
                      fill=hex_to_rgb(color))
    
    # Save
    output_path = os.path.join(OUTPUT_DIR, "infuse-continuation.png")
    img.save(output_path, "PNG", dpi=(300, 300))
    print(f"Created: {output_path}")
    return output_path

def create_ppt_master():
    """Create the PowerPoint master slide preview"""
    # 16:9 at 1920x1080
    width, height = 1920, 1080
    
    # Create image with white background
    img = Image.new('RGBA', (width, height), hex_to_rgba(WHITE))
    draw = ImageDraw.Draw(img)
    
    try:
        font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 48)
        font_body = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
        font_footer = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 12)
    except:
        font_title = ImageFont.load_default()
        font_body = ImageFont.load_default()
        font_footer = ImageFont.load_default()
    
    # CENTER WATERMARK (10% opacity)
    watermark_opacity = int(255 * 0.10)
    center_x, center_y = width // 2, height // 2
    
    import math
    hex_size = 200
    points = []
    for i in range(6):
        angle = math.radians(60 * i - 30)
        x = center_x + hex_size * math.cos(angle)
        y = center_y + hex_size * math.sin(angle)
        points.append((x, y))
    draw.polygon(points, fill=hex_to_rgba(GOLD, watermark_opacity))
    
    inner_points = []
    inner_size = hex_size * 0.75
    for i in range(6):
        angle = math.radians(60 * i - 30)
        x = center_x + inner_size * math.cos(angle)
        y = center_y + inner_size * math.sin(angle)
        inner_points.append((x, y))
    draw.polygon(inner_points, fill=hex_to_rgba(ORANGE, watermark_opacity))
    
    # Draw F in watermark
    try:
        font_watermark = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 120)
        bbox = draw.textbbox((0, 0), "F", font=font_watermark)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        draw.text((center_x - text_width//2, center_y - text_height//2 - 20), "F", 
                  fill=hex_to_rgba(WHITE, watermark_opacity), font=font_watermark)
    except:
        pass
    
    # TITLE AREA
    draw.text((80, 80), "Your Title Here", fill=hex_to_rgb(GOLD), font=font_title)
    
    # Sample bullet points
    bullet_y = 180
    bullets = [
        "First key point for your presentation",
        "Second important insight",
        "Third strategic element",
        "Fourth actionable item"
    ]
    
    for i, bullet in enumerate(bullets):
        # Orange bullet
        draw.ellipse([80, bullet_y + i*50 + 8, 92, bullet_y + i*50 + 20], fill=hex_to_rgb(ORANGE))
        # Dark blue text
        draw.text((110, bullet_y + i*50), bullet, fill=hex_to_rgb(DARK_BLUE), font=font_body)
    
    # FOOTER GRADIENT LINES
    line_y_start = height - 60
    line_width = int(width * 0.95)
    line_start_x = (width - line_width) // 2
    line_height = 4
    line_spacing = 8
    
    colors = [GOLD, ORANGE, DARK_BLUE]
    for i, color in enumerate(colors):
        y = line_y_start + i * (line_height + line_spacing)
        draw.rectangle([line_start_x, y, line_start_x + line_width, y + line_height], 
                      fill=hex_to_rgb(color))
    
    # Footer text
    footer_text = "infuse.net.in | Delhi, India"
    try:
        bbox = draw.textbbox((0, 0), footer_text, font=font_footer)
        text_width = bbox[2] - bbox[0]
    except:
        text_width = 200
    draw.text((width//2 - text_width//2, line_y_start - 25), footer_text, 
              fill=hex_to_rgb(GRAY), font=font_footer)
    
    # Save
    output_path = os.path.join(OUTPUT_DIR, "infuse-ppt-master.png")
    img.save(output_path, "PNG")
    print(f"Created: {output_path}")
    return output_path

if __name__ == "__main__":
    print("Generating Infuse AI templates...")
    create_main_letterhead()
    create_continuation_sheet()
    create_ppt_master()
    print("\nAll templates generated successfully!")

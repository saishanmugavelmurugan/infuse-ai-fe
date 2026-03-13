#!/usr/bin/env python3
"""
Generate EXACT letterhead templates matching the Infuse-AI design
"""

from PIL import Image, ImageDraw, ImageFont
import os
import math

# Brand Colors from the logo
RED = "#E53935"
ORANGE = "#F4511E" 
AMBER = "#FFB300"
DARK_GRAY = "#333333"
WHITE = "#FFFFFF"

# Output directory
OUTPUT_DIR = "/app/frontend/public/letterhead"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def hex_to_rgba(hex_color, alpha=255):
    rgb = hex_to_rgb(hex_color)
    return (*rgb, alpha)

def draw_hexagon_logo(draw, center_x, center_y, size, opacity=255):
    """Draw the Infuse-AI hexagon logo with F"""
    # Outer hexagon (amber/gold)
    hex_size = size
    points = []
    for i in range(6):
        angle = math.radians(60 * i - 90)  # Start from top
        x = center_x + hex_size * math.cos(angle)
        y = center_y + hex_size * math.sin(angle)
        points.append((x, y))
    draw.polygon(points, fill=hex_to_rgba(AMBER, opacity))
    
    # Inner hexagon (orange)
    inner_size = hex_size * 0.7
    inner_points = []
    for i in range(6):
        angle = math.radians(60 * i - 90)
        x = center_x + inner_size * math.cos(angle)
        y = center_y + inner_size * math.sin(angle)
        inner_points.append((x, y))
    draw.polygon(inner_points, fill=hex_to_rgba(ORANGE, opacity))
    
    return hex_size

def create_main_letterhead():
    """Create the main letterhead exactly matching the reference"""
    # A4 at 300 DPI: 2480 x 3508 pixels
    width, height = 2480, 3508
    
    img = Image.new('RGBA', (width, height), hex_to_rgba(WHITE))
    draw = ImageDraw.Draw(img)
    
    # Load fonts
    try:
        font_company = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 90)
        font_details = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 36)
        font_address = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 32)
        font_watermark = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 400)
    except:
        font_company = ImageFont.load_default()
        font_details = ImageFont.load_default()
        font_address = ImageFont.load_default()
        font_watermark = ImageFont.load_default()
    
    # ========== CENTER WATERMARK (8% opacity) ==========
    watermark_opacity = int(255 * 0.08)
    center_x, center_y = width // 2, height // 2
    
    # Draw watermark hexagon
    draw_hexagon_logo(draw, center_x, center_y, 500, watermark_opacity)
    
    # Draw F letter in watermark
    try:
        bbox = draw.textbbox((0, 0), "F", font=font_watermark)
        text_w = bbox[2] - bbox[0]
        text_h = bbox[3] - bbox[1]
        draw.text((center_x - text_w//2, center_y - text_h//2 - 60), "F", 
                  fill=hex_to_rgba(WHITE, watermark_opacity + 20), font=font_watermark)
    except:
        pass
    
    # ========== HEADER SECTION ==========
    header_y = 80
    
    # Logo at top center
    logo_center_x = width // 2
    logo_center_y = header_y + 80
    draw_hexagon_logo(draw, logo_center_x, logo_center_y, 70, 255)
    
    # F letter in logo
    try:
        small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 60)
        bbox = draw.textbbox((0, 0), "F", font=small_font)
        f_w = bbox[2] - bbox[0]
        f_h = bbox[3] - bbox[1]
        draw.text((logo_center_x - f_w//2, logo_center_y - f_h//2 - 8), "F", 
                  fill=hex_to_rgba(WHITE), font=small_font)
    except:
        pass
    
    # Company name "INFUSE-AI PRIVATE LIMITED" (gradient effect with red-orange)
    company_name = "INFUSE-AI PRIVATE LIMITED"
    company_y = logo_center_y + 100
    
    # Draw company name
    try:
        bbox = draw.textbbox((0, 0), company_name, font=font_company)
        name_w = bbox[2] - bbox[0]
        name_x = (width - name_w) // 2
        # Red-orange gradient text (simplified as red)
        draw.text((name_x, company_y), company_name, fill=hex_to_rgb(RED), font=font_company)
    except:
        pass
    
    # Identity Number
    identity_text = "Identity Number: U62011HR2026PTC140177"
    identity_y = company_y + 100
    try:
        bbox = draw.textbbox((0, 0), identity_text, font=font_details)
        id_w = bbox[2] - bbox[0]
        draw.text(((width - id_w) // 2, identity_y), identity_text, 
                  fill=hex_to_rgb(DARK_GRAY), font=font_details)
    except:
        pass
    
    # PAN and TAN
    pan_tan_text = "Pan No.: AAICI6135M / Tan No.: RTKI06194G"
    pan_tan_y = identity_y + 50
    try:
        bbox = draw.textbbox((0, 0), pan_tan_text, font=font_details)
        pt_w = bbox[2] - bbox[0]
        draw.text(((width - pt_w) // 2, pan_tan_y), pan_tan_text, 
                  fill=hex_to_rgb(DARK_GRAY), font=font_details)
    except:
        pass
    
    # Horizontal line below header
    line_y = pan_tan_y + 70
    line_margin = 100
    draw.rectangle([line_margin, line_y, width - line_margin, line_y + 3], 
                   fill=hex_to_rgb(DARK_GRAY))
    
    # ========== FOOTER SECTION ==========
    footer_bottom = height - 40
    
    # Three straight horizontal lines (brand colors: amber, orange, red)
    line_height = 25
    line_spacing = 8
    line_margin = 0  # Full width
    
    # Red line (bottom)
    red_line_y = footer_bottom - line_height
    draw.rectangle([line_margin, red_line_y, width - line_margin, red_line_y + line_height], 
                   fill=hex_to_rgb(RED))
    
    # Orange line (middle)
    orange_line_y = red_line_y - line_spacing - line_height
    draw.rectangle([line_margin, orange_line_y, width - line_margin, orange_line_y + line_height], 
                   fill=hex_to_rgb(ORANGE))
    
    # Amber/Yellow line (top)
    amber_line_y = orange_line_y - line_spacing - line_height
    draw.rectangle([line_margin, amber_line_y, width - line_margin, amber_line_y + line_height], 
                   fill=hex_to_rgb(AMBER))
    
    # Address (right-aligned, above the lines)
    address_lines = [
        "1 G-Floor Tower P1 Sec 65,",
        "Emaar Emerald Estate, Badshahpur,",
        "Gurgaon- 122101, Haryana"
    ]
    
    address_y = amber_line_y - 130
    address_margin = 120
    
    for i, line in enumerate(address_lines):
        try:
            bbox = draw.textbbox((0, 0), line, font=font_address)
            line_w = bbox[2] - bbox[0]
            draw.text((width - address_margin - line_w, address_y + i * 45), line, 
                      fill=hex_to_rgb(DARK_GRAY), font=font_address)
        except:
            pass
    
    # Save
    output_path = os.path.join(OUTPUT_DIR, "infuse-main-letterhead.png")
    img.save(output_path, "PNG", dpi=(300, 300))
    print(f"Created: {output_path}")
    return output_path

def create_continuation_sheet():
    """Create the continuation sheet"""
    # A4 at 300 DPI: 2480 x 3508 pixels
    width, height = 2480, 3508
    
    img = Image.new('RGBA', (width, height), hex_to_rgba(WHITE))
    draw = ImageDraw.Draw(img)
    
    try:
        font_watermark = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 400)
    except:
        font_watermark = ImageFont.load_default()
    
    # ========== CENTER WATERMARK (8% opacity) ==========
    watermark_opacity = int(255 * 0.08)
    center_x, center_y = width // 2, height // 2
    
    # Draw watermark hexagon
    draw_hexagon_logo(draw, center_x, center_y, 500, watermark_opacity)
    
    # Draw F letter in watermark
    try:
        bbox = draw.textbbox((0, 0), "F", font=font_watermark)
        text_w = bbox[2] - bbox[0]
        text_h = bbox[3] - bbox[1]
        draw.text((center_x - text_w//2, center_y - text_h//2 - 60), "F", 
                  fill=hex_to_rgba(WHITE, watermark_opacity + 20), font=font_watermark)
    except:
        pass
    
    # Top line only
    line_margin = 100
    draw.rectangle([line_margin, 100, width - line_margin, 103], 
                   fill=hex_to_rgb(DARK_GRAY))
    
    # ========== FOOTER SECTION ==========
    footer_bottom = height - 40
    
    # Three straight horizontal lines
    line_height = 25
    line_spacing = 8
    line_margin = 0
    
    # Red line (bottom)
    red_line_y = footer_bottom - line_height
    draw.rectangle([line_margin, red_line_y, width - line_margin, red_line_y + line_height], 
                   fill=hex_to_rgb(RED))
    
    # Orange line (middle)
    orange_line_y = red_line_y - line_spacing - line_height
    draw.rectangle([line_margin, orange_line_y, width - line_margin, orange_line_y + line_height], 
                   fill=hex_to_rgb(ORANGE))
    
    # Amber/Yellow line (top)
    amber_line_y = orange_line_y - line_spacing - line_height
    draw.rectangle([line_margin, amber_line_y, width - line_margin, amber_line_y + line_height], 
                   fill=hex_to_rgb(AMBER))
    
    # Save
    output_path = os.path.join(OUTPUT_DIR, "infuse-continuation-sheet.png")
    img.save(output_path, "PNG", dpi=(300, 300))
    print(f"Created: {output_path}")
    return output_path

if __name__ == "__main__":
    print("Generating Infuse-AI letterhead templates...")
    create_main_letterhead()
    create_continuation_sheet()
    print("\nAll templates generated successfully!")

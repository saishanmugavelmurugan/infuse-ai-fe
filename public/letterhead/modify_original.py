#!/usr/bin/env python3
"""
Modify the EXACT original letterhead:
1. Add center watermark of logo
2. Replace wavy bottom with straight lines
"""

from PIL import Image, ImageDraw, ImageFont
import os
import math

OUTPUT_DIR = "/app/frontend/public/letterhead"

# Brand colors from the original
AMBER = "#F9A825"  # Yellow/Gold
ORANGE = "#F57C00" 
RED = "#E53935"
WHITE = "#FFFFFF"

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def hex_to_rgba(hex_color, alpha=255):
    rgb = hex_to_rgb(hex_color)
    return (*rgb, alpha)

def draw_hexagon_logo(draw, center_x, center_y, size, opacity=255):
    """Draw the Infuse-AI hexagon logo"""
    # Outer hexagon (amber/gold)
    hex_size = size
    points = []
    for i in range(6):
        angle = math.radians(60 * i - 90)
        x = center_x + hex_size * math.cos(angle)
        y = center_y + hex_size * math.sin(angle)
        points.append((x, y))
    draw.polygon(points, fill=hex_to_rgba(AMBER, opacity))
    
    # Inner hexagon (orange)
    inner_size = hex_size * 0.72
    inner_points = []
    for i in range(6):
        angle = math.radians(60 * i - 90)
        x = center_x + inner_size * math.cos(angle)
        y = center_y + inner_size * math.sin(angle)
        inner_points.append((x, y))
    draw.polygon(inner_points, fill=hex_to_rgba(ORANGE, opacity))

def create_modified_letterhead():
    """Load original and modify it"""
    # Load original image
    original_path = os.path.join(OUTPUT_DIR, "original-letterhead.png")
    img = Image.open(original_path).convert('RGBA')
    width, height = img.size
    print(f"Original size: {width}x{height}")
    
    draw = ImageDraw.Draw(img)
    
    # ========== ADD CENTER WATERMARK (10% opacity) ==========
    watermark_opacity = int(255 * 0.10)
    center_x, center_y = width // 2, height // 2 - 50  # Slightly above center
    
    # Draw watermark hexagon
    logo_size = min(width, height) // 4
    draw_hexagon_logo(draw, center_x, center_y, logo_size, watermark_opacity)
    
    # Draw F letter in watermark
    try:
        font_size = int(logo_size * 1.2)
        font_watermark = ImageFont.truetype("/usr/share/fonts/truetype/freefont/FreeSansBold.ttf", font_size)
        bbox = draw.textbbox((0, 0), "F", font=font_watermark)
        text_w = bbox[2] - bbox[0]
        text_h = bbox[3] - bbox[1]
        draw.text((center_x - text_w//2, center_y - text_h//2 - font_size//6), "F", 
                  fill=hex_to_rgba(WHITE, watermark_opacity + 30), font=font_watermark)
    except Exception as e:
        print(f"Font error: {e}")
    
    # ========== REPLACE BOTTOM WAVY WITH STRAIGHT LINES ==========
    # Cover the wavy area with white first
    wavy_start_y = int(height * 0.87)  # Where wavy design starts
    draw.rectangle([0, wavy_start_y, width, height], fill=hex_to_rgba(WHITE))
    
    # Redraw the address (right-aligned)
    try:
        font_address = ImageFont.truetype("/usr/share/fonts/truetype/freefont/FreeSansBold.ttf", 28)
        address_lines = [
            "1 G-Floor Tower P1 Sec 65,",
            "Emaar Emerald Estate, Badshahpur,",
            "Gurgaon- 122101, Haryana"
        ]
        
        address_y = wavy_start_y + 20
        address_margin = 60
        
        for i, line in enumerate(address_lines):
            bbox = draw.textbbox((0, 0), line, font=font_address)
            line_w = bbox[2] - bbox[0]
            draw.text((width - address_margin - line_w, address_y + i * 38), line, 
                      fill=hex_to_rgb("#333333"), font=font_address)
    except Exception as e:
        print(f"Address font error: {e}")
    
    # Draw THREE STRAIGHT LINES at bottom
    line_height = 22
    line_spacing = 0
    bottom_margin = 10
    
    # Calculate line positions from bottom
    line_y_red = height - bottom_margin - line_height
    line_y_orange = line_y_red - line_spacing - line_height
    line_y_amber = line_y_orange - line_spacing - line_height
    
    # Draw lines (full width)
    draw.rectangle([0, line_y_amber, width, line_y_amber + line_height], fill=hex_to_rgb(AMBER))
    draw.rectangle([0, line_y_orange, width, line_y_orange + line_height], fill=hex_to_rgb(ORANGE))
    draw.rectangle([0, line_y_red, width, line_y_red + line_height], fill=hex_to_rgb(RED))
    
    # Save main letterhead
    output_path = os.path.join(OUTPUT_DIR, "letterhead-final.png")
    img.save(output_path, "PNG")
    print(f"Created: {output_path}")
    
    # ========== CREATE CONTINUATION SHEET ==========
    cont_img = Image.new('RGBA', (width, height), hex_to_rgba(WHITE))
    cont_draw = ImageDraw.Draw(cont_img)
    
    # Add watermark
    draw_hexagon_logo(cont_draw, center_x, center_y, logo_size, watermark_opacity)
    try:
        cont_draw.text((center_x - text_w//2, center_y - text_h//2 - font_size//6), "F", 
                      fill=hex_to_rgba(WHITE, watermark_opacity + 30), font=font_watermark)
    except:
        pass
    
    # Add straight lines at bottom
    cont_draw.rectangle([0, line_y_amber, width, line_y_amber + line_height], fill=hex_to_rgb(AMBER))
    cont_draw.rectangle([0, line_y_orange, width, line_y_orange + line_height], fill=hex_to_rgb(ORANGE))
    cont_draw.rectangle([0, line_y_red, width, line_y_red + line_height], fill=hex_to_rgb(RED))
    
    cont_output = os.path.join(OUTPUT_DIR, "continuation-final.png")
    cont_img.save(cont_output, "PNG")
    print(f"Created: {cont_output}")

if __name__ == "__main__":
    create_modified_letterhead()
    print("\nDone!")

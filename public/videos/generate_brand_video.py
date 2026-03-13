#!/usr/bin/env python3
"""Generate polished INFUSE AI video with proper closing"""

import os
from dotenv import load_dotenv
load_dotenv('/app/backend/.env')

from emergentintegrations.llm.openai.video_generation import OpenAIVideoGeneration

OUTPUT_DIR = "/app/frontend/public/videos"

print("🎬 Generating INFUSE AI Polished Marketing Video...")
print("⏳ Please wait 3-5 minutes...")

# Polished single video with proper opening and closing
prompt = """Elegant technology company brand video for INFUSE AI:

Open with abstract golden and amber light particles forming a beautiful hexagonal logo shape 
that glows warmly. The logo pulses gently with life. Smooth transition to a modern software 
dashboard interface with amber and orange accent colors showing analytics and data visualizations.

Beautiful abstract representation of AI intelligence - glowing neural pathways and data streams 
in warm orange and gold tones flowing gracefully. Floating holographic data cards displaying 
health metrics in a clean, modern design.

Transition to abstract global connectivity - a stylized world map with glowing amber connection 
points and flowing light streams representing worldwide reach. Multiple device screens showing 
the platform interface.

Graceful closing: All elements converge back into the glowing hexagonal INFUSE AI logo centered 
on screen. Logo pulses warmly and elegantly fades to a soft amber gradient background. 
Smooth, satisfying ending.

High-end corporate brand video style. Warm amber, orange, and gold color palette throughout. 
Cinematic smooth movements, elegant transitions, professional technology aesthetic. 
Abstract and artistic rather than literal. Suitable for brand marketing and investor presentations."""

video_gen = OpenAIVideoGeneration(api_key=os.environ['EMERGENT_LLM_KEY'])

video_bytes = video_gen.text_to_video(
    prompt=prompt,
    model="sora-2",
    size="1280x720",
    duration=12,
    max_wait_time=900
)

if video_bytes:
    output_path = os.path.join(OUTPUT_DIR, "InfuseAI_Brand_Video.mp4")
    video_gen.save_video(video_bytes, output_path)
    print(f"\n✅ Video saved: {output_path}")
else:
    print("\n❌ Video generation failed")

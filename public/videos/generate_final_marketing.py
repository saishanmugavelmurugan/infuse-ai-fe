#!/usr/bin/env python3
"""Generate video with INFUSE AI specific logo - hexagon with F"""

import os
from dotenv import load_dotenv
load_dotenv('/app/backend/.env')

from emergentintegrations.llm.openai.video_generation import OpenAIVideoGeneration

OUTPUT_DIR = "/app/frontend/public/videos"

print("🎬 Generating INFUSE AI Marketing Video with Logo...")
print("⏳ Please wait 3-5 minutes...")

# Video with specific INFUSE AI logo description (hexagon with F)
prompt = """Corporate technology marketing video featuring the INFUSE AI brand:

Opening: The INFUSE AI logo emerges from golden particles - a hexagonal shape with 
amber gold outer layer, orange inner hexagon, and a bold white letter F in the center. 
The logo rotates elegantly and glows with warm amber and orange light.

Transition to modern software dashboard interface with amber and orange UI accent colors 
showing data analytics, charts, and metrics. Clean professional SaaS product interface 
with the hexagonal F logo visible in the corner.

Abstract AI visualization - flowing streams of amber and orange light representing 
intelligent data processing. The hexagonal F logo appears integrated into the data flow, 
glowing at connection points.

Global connectivity scene - stylized representation of worldwide reach with glowing 
amber connection points. The INFUSE AI hexagonal F logo pulses at the center.

Elegant closing: All elements converge back to the central INFUSE AI hexagonal logo 
with the F letter. The logo glows warmly, pulses gently three times, then smoothly 
fades to an amber-orange gradient. Professional, satisfying ending.

High-end corporate brand video. Warm amber, orange, and gold color palette. 
Cinematic smooth camera movements. Professional technology aesthetic."""

video_gen = OpenAIVideoGeneration(api_key=os.environ['EMERGENT_LLM_KEY'])

video_bytes = video_gen.text_to_video(
    prompt=prompt,
    model="sora-2",
    size="1280x720",
    duration=12,
    max_wait_time=900
)

if video_bytes:
    output_path = os.path.join(OUTPUT_DIR, "InfuseAI_Marketing_Final.mp4")
    video_gen.save_video(video_bytes, output_path)
    print(f"\n✅ Video saved: {output_path}")
else:
    print("\n❌ Video generation failed")

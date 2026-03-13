#!/usr/bin/env python3
"""Generate simple abstract logo animation video"""

import os
from dotenv import load_dotenv
load_dotenv('/app/backend/.env')

from emergentintegrations.llm.openai.video_generation import OpenAIVideoGeneration

OUTPUT_DIR = "/app/frontend/public/videos"

print("🎬 Generating abstract logo animation...")

# Simple abstract animation
prompt = """Cinematic abstract logo animation video:

Golden light particles floating in dark space slowly converge and form a beautiful 
glowing hexagonal geometric shape. The hexagon rotates elegantly, pulsing with warm 
amber and orange light energy.

Smooth camera movement around the glowing hexagon as streams of golden particles 
orbit around it. The hexagon transforms, revealing intricate geometric patterns 
inside, all in warm amber and gold tones.

Abstract flowing ribbons of orange and gold light dance around the central hexagon. 
Beautiful bokeh light effects in the background. The hexagon pulses three times 
with warm light.

Final shot: The hexagon settles in center frame, glowing warmly, then gently fades 
to a soft gradient background of amber and orange. Elegant, satisfying conclusion.

High quality 3D motion graphics style. Warm color palette of amber, orange, and gold. 
Dark background with glowing elements. Smooth cinematic camera movements. 
Professional corporate logo animation aesthetic."""

video_gen = OpenAIVideoGeneration(api_key=os.environ['EMERGENT_LLM_KEY'])

video_bytes = video_gen.text_to_video(
    prompt=prompt,
    model="sora-2",
    size="1280x720",
    duration=12,
    max_wait_time=900
)

if video_bytes:
    output_path = os.path.join(OUTPUT_DIR, "InfuseAI_Logo_Animation.mp4")
    video_gen.save_video(video_bytes, output_path)
    print(f"\n✅ Video saved: {output_path}")
else:
    print("\n❌ Video generation failed")

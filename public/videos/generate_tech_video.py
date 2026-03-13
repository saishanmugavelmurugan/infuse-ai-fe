#!/usr/bin/env python3
"""Generate abstract INFUSE AI technology video"""

import os
from dotenv import load_dotenv
load_dotenv('/app/backend/.env')

from emergentintegrations.llm.openai.video_generation import OpenAIVideoGeneration

OUTPUT_DIR = "/app/frontend/public/videos"

print("🎬 Generating INFUSE AI Technology Video...")

# Pure abstract technology video - no healthcare references
prompt = """Abstract technology brand video:

Beautiful opening with golden and amber particles of light swirling and converging to form 
a glowing hexagonal shape. The hexagon pulses with warm orange and gold energy, rotating 
slowly in space.

Transition to flowing streams of golden light representing data and connectivity. Abstract 
neural network visualization with glowing amber nodes and connections pulsing with energy. 
Futuristic holographic interface elements floating in space with warm orange accents.

Global connectivity visualization - abstract globe made of glowing amber light points 
connected by flowing golden streams. Multiple floating screens showing abstract dashboard 
interfaces with charts and data visualizations in orange and gold colors.

Elegant closing sequence: All visual elements gracefully converge back to the central 
glowing hexagonal logo. The logo pulses warmly three times, then gently fades into a 
soft amber to orange gradient background. Peaceful, satisfying ending.

High-end corporate technology brand video. Warm amber, orange, and gold color palette. 
Cinematic quality, smooth elegant transitions, abstract and artistic. Dark background 
with warm glowing elements. Professional and inspiring mood."""

video_gen = OpenAIVideoGeneration(api_key=os.environ['EMERGENT_LLM_KEY'])

video_bytes = video_gen.text_to_video(
    prompt=prompt,
    model="sora-2",
    size="1280x720",
    duration=12,
    max_wait_time=900
)

if video_bytes:
    output_path = os.path.join(OUTPUT_DIR, "InfuseAI_Technology_Video.mp4")
    video_gen.save_video(video_bytes, output_path)
    print(f"\n✅ Video saved: {output_path}")
else:
    print("\n❌ Video generation failed")

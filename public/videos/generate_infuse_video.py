#!/usr/bin/env python3
"""Generate INFUSE AI HealthTrack Pro Marketing Video - Correct Branding"""

import os
from dotenv import load_dotenv
load_dotenv('/app/backend/.env')

from emergentintegrations.llm.openai.video_generation import OpenAIVideoGeneration

OUTPUT_DIR = "/app/frontend/public/videos"

print("🎬 Generating INFUSE AI HealthTrack Pro Video...")
print("⏳ Please wait 3-5 minutes...")

prompt = """Professional healthcare technology marketing video for INFUSE AI company:

Opening with the INFUSE AI hexagonal logo in golden amber and orange gradient colors 
emerging elegantly. Modern healthcare dashboard interface with warm orange and amber 
color scheme displaying health analytics, charts, and AI-powered insights.

Show AI analyzing medical lab reports with glowing neural network visualization in 
orange tones. A professional doctor reviewing patient data on sleek tablet interface. 
A happy patient checking personalized health recommendations on smartphone.

Security visualization with digital shields protecting health data. Wearable devices 
like smartwatches syncing health metrics. Global healthcare connectivity represented 
by flowing amber light streams connecting diverse patients and healthcare providers.

High-end corporate SaaS product commercial style. Warm amber, orange, and gold color 
palette throughout matching INFUSE AI brand identity. Cinematic smooth camera movements, 
professional healthcare technology aesthetic conveying innovation, trust, and accessibility."""

video_gen = OpenAIVideoGeneration(api_key=os.environ['EMERGENT_LLM_KEY'])

video_bytes = video_gen.text_to_video(
    prompt=prompt,
    model="sora-2",
    size="1280x720",
    duration=12,
    max_wait_time=900
)

if video_bytes:
    output_path = os.path.join(OUTPUT_DIR, "InfuseAI_HealthTrackPro_Video.mp4")
    video_gen.save_video(video_bytes, output_path)
    print(f"\n✅ Video saved: {output_path}")
else:
    print("\n❌ Video generation failed")

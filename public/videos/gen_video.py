#!/usr/bin/env python3
"""Generate HealthTrack Pro marketing video"""

import os
from dotenv import load_dotenv
load_dotenv('/app/backend/.env')

from emergentintegrations.llm.openai.video_generation import OpenAIVideoGeneration

OUTPUT_DIR = "/app/frontend/public/videos"

print("🎬 Generating HealthTrack Pro Marketing Video...")
print("⏳ Please wait 2-4 minutes...")

prompt = """Professional healthcare technology marketing video:

A sleek modern healthcare dashboard interface glowing with amber and orange colors appears on screen. 
AI neural network visualization analyzing medical lab reports with flowing data particles. 
Split screen showing a doctor in white coat reviewing patient analytics on tablet, 
and a happy patient checking health insights on smartphone app.

Digital security shield with hexagonal pattern protecting medical data streams. 
Compliance badges (HIPAA, DHA) appearing verified. Wearable devices syncing health data.
Diverse patients and doctors connected through glowing amber light streams representing 
digital healthcare connectivity.

High-end corporate SaaS product video style, warm amber and orange brand colors throughout,
cinematic lighting, smooth transitions, professional healthcare technology aesthetic.
Conveys innovation, trust, security, and accessibility in modern healthcare."""

video_gen = OpenAIVideoGeneration(api_key=os.environ['EMERGENT_LLM_KEY'])

video_bytes = video_gen.text_to_video(
    prompt=prompt,
    model="sora-2",
    size="1280x720",
    duration=8,
    max_wait_time=600
)

if video_bytes:
    output_path = os.path.join(OUTPUT_DIR, "HealthTrackPro_Marketing.mp4")
    video_gen.save_video(video_bytes, output_path)
    print(f"\n✅ Video saved: {output_path}")
else:
    print("\n❌ Video generation failed - please check credits")

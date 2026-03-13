#!/usr/bin/env python3
"""
HealthTrack Pro - Single Comprehensive Pitch Video
"""

import os
from dotenv import load_dotenv

load_dotenv('/app/backend/.env')

from emergentintegrations.llm.openai.video_generation import OpenAIVideoGeneration

OUTPUT_DIR = "/app/frontend/public/videos"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def main():
    print("🎬 Generating HealthTrack Pro Comprehensive Pitch Video...")
    print("⏳ This may take 3-5 minutes...")
    
    # Comprehensive single video prompt covering all aspects
    prompt = """Professional healthcare technology pitch video: 

Opening with modern hospital environment showing the challenge - patients waiting, scattered records, 
complex lab reports. Smooth transition to the solution: a sleek glowing hexagonal logo in amber and 
orange colors materializing. 

Then showcase: Beautiful AI-powered dashboard interface analyzing medical data with flowing neural 
network visualizations in orange/amber tones. Split screen showing a doctor reviewing patient analytics 
on one side, and a happy patient receiving personalized health insights on their phone. 

Security visualization with digital shields and encryption symbols protecting data streams. 
End with inspiring global healthcare connectivity - diverse patients, wearable devices syncing data, 
doctors consulting remotely, all connected by flowing amber light streams.

Cinematic corporate video style, warm amber and orange color palette throughout, professional healthcare 
aesthetic, smooth camera movements, conveying innovation, trust, and accessibility. High-end SaaS 
product demonstration quality."""

    video_gen = OpenAIVideoGeneration(api_key=os.environ['EMERGENT_LLM_KEY'])
    
    video_bytes = video_gen.text_to_video(
        prompt=prompt,
        model="sora-2",
        size="1280x720",  # HD Widescreen
        duration=12,  # Maximum duration for comprehensive content
        max_wait_time=900  # 15 minutes max wait
    )
    
    if video_bytes:
        output_path = os.path.join(OUTPUT_DIR, "HealthTrackPro_Pitch_Video.mp4")
        video_gen.save_video(video_bytes, output_path)
        print(f"\n✅ Video saved: {output_path}")
        return output_path
    else:
        print("\n❌ Video generation failed")
        return None

if __name__ == "__main__":
    main()

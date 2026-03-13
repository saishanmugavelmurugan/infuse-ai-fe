#!/usr/bin/env python3
"""Generate additional marketing video segments"""

import os
from dotenv import load_dotenv
load_dotenv('/app/backend/.env')

from emergentintegrations.llm.openai.video_generation import OpenAIVideoGeneration

OUTPUT_DIR = "/app/frontend/public/videos"

def generate_video(prompt, filename):
    print(f"\n🎬 Generating: {filename}")
    video_gen = OpenAIVideoGeneration(api_key=os.environ['EMERGENT_LLM_KEY'])
    
    video_bytes = video_gen.text_to_video(
        prompt=prompt,
        model="sora-2",
        size="1280x720",
        duration=8,
        max_wait_time=600
    )
    
    if video_bytes:
        output_path = os.path.join(OUTPUT_DIR, filename)
        video_gen.save_video(video_bytes, output_path)
        print(f"✅ Saved: {output_path}")
        return output_path
    return None

# Security & Compliance Video
security_prompt = """Professional healthcare cybersecurity visualization: 

A glowing digital shield with hexagonal pattern in amber and orange colors materializes, 
protecting streams of medical data represented as flowing particles. AES-256 encryption 
keys appear as golden locks around patient records. Multi-factor authentication shown 
on smartphone with fingerprint scan glowing amber.

Security dashboard interface appears showing login history, active sessions, and security 
score meter climbing to 100. HIPAA, DHA, NABIDH compliance badges glowing and verified.

Corporate security video style, dark background with warm amber/orange highlights, 
conveying trust, protection, and regulatory compliance in healthcare data security.
Professional, reassuring, trustworthy atmosphere."""

print("Generating Security & Compliance video...")
generate_video(security_prompt, "HealthTrackPro_Security.mp4")

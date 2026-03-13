#!/usr/bin/env python3
"""
Generate complete INFUSE AI marketing video series
Multiple segments to create a full video
"""

import os
from dotenv import load_dotenv
load_dotenv('/app/backend/.env')

from emergentintegrations.llm.openai.video_generation import OpenAIVideoGeneration

OUTPUT_DIR = "/app/frontend/public/videos"

def generate_video(prompt, filename, duration=12):
    print(f"\n🎬 Generating: {filename}")
    print(f"⏳ Please wait...")
    
    video_gen = OpenAIVideoGeneration(api_key=os.environ['EMERGENT_LLM_KEY'])
    
    video_bytes = video_gen.text_to_video(
        prompt=prompt,
        model="sora-2",
        size="1280x720",
        duration=duration,
        max_wait_time=900
    )
    
    if video_bytes:
        output_path = os.path.join(OUTPUT_DIR, filename)
        video_gen.save_video(video_bytes, output_path)
        print(f"✅ Saved: {output_path}")
        return output_path
    else:
        print(f"❌ Failed: {filename}")
        return None

# Segment 1: Opening - Problem & Logo Reveal
segment1_prompt = """Cinematic opening for INFUSE AI healthcare company video:

Start with glimpses of healthcare challenges - patients looking confused at medical reports, 
busy hospital waiting rooms, scattered paper records. Mood shifts as golden light appears.

The INFUSE AI hexagonal logo in beautiful amber and orange gradient elegantly materializes 
from particles of light, rotating slowly and glowing warmly. Text "INFUSE AI" appears below 
the logo in golden letters. Tagline "Healthcare Intelligence Platform" fades in.

Professional corporate intro style, smooth transitions, warm amber and orange color palette, 
cinematic lighting with lens flares, inspiring and hopeful mood. Clean ending with logo centered."""

# Segment 2: Product Features - Dashboard & AI
segment2_prompt = """INFUSE AI product demonstration video:

Sleek healthcare dashboard interface with amber and orange UI elements displaying patient 
health metrics, interactive charts, and real-time analytics. Smooth UI animations showing 
data updating live.

AI visualization with glowing neural network in orange tones analyzing a medical lab report, 
extracting key health insights displayed as floating data cards. Beautiful data visualization 
with flowing particles.

Modern SaaS product demo style, clean interface shots, warm brand colors (amber, orange, gold), 
professional technology aesthetic, smooth camera movements through the interface."""

# Segment 3: Security & Trust
segment3_prompt = """INFUSE AI security features visualization:

Digital security shield with hexagonal pattern in amber and gold colors protecting flowing 
streams of medical data represented as glowing particles. AES-256 encryption visualization 
with golden lock icons.

Multi-factor authentication shown on smartphone with amber glow. Compliance badges (HIPAA, 
DHA, NABIDH) appearing with checkmarks in gold. Security dashboard showing protected status.

Corporate cybersecurity video style, dark background with warm amber/orange highlights, 
conveying trust and protection, professional and reassuring atmosphere."""

# Segment 4: Closing - Global Impact
segment4_prompt = """INFUSE AI inspiring closing sequence:

Happy diverse patients and doctors using healthcare technology - doctor on tablet reviewing 
patient data with smile, patient checking health app on phone looking relieved, family 
celebrating good health news.

Transition to global connectivity visualization - world map with glowing amber connection 
points, representing worldwide healthcare accessibility. Flowing golden light streams 
connecting people.

Final shot: INFUSE AI hexagonal logo glowing warmly in center, "Transforming Healthcare 
Through AI" tagline appears below. Gentle fade to amber/orange gradient background.

Inspiring corporate closing style, uplifting mood, warm amber and orange colors, 
smooth graceful ending suitable for marketing video conclusion."""

print("=" * 50)
print("🏥 INFUSE AI - Complete Marketing Video Generation")
print("=" * 50)

# Generate all segments
segments = [
    (segment1_prompt, "InfuseAI_01_Opening.mp4", 12),
    (segment2_prompt, "InfuseAI_02_Features.mp4", 12),
    (segment3_prompt, "InfuseAI_03_Security.mp4", 12),
    (segment4_prompt, "InfuseAI_04_Closing.mp4", 12),
]

results = []
for prompt, filename, duration in segments:
    result = generate_video(prompt, filename, duration)
    results.append((filename, result))

print("\n" + "=" * 50)
print("📊 GENERATION COMPLETE")
print("=" * 50)
for filename, result in results:
    status = "✅" if result else "❌"
    print(f"{status} {filename}")

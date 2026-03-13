#!/usr/bin/env python3
"""
HealthTrack Pro - Comprehensive Marketing & Investor Pitch Video Generation
Using Sora 2 AI Video Generation
"""

import os
import sys
from dotenv import load_dotenv

load_dotenv('/app/backend/.env')

from emergentintegrations.llm.openai.video_generation import OpenAIVideoGeneration

OUTPUT_DIR = "/app/frontend/public/videos"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def generate_video(prompt, filename, duration=8):
    """Generate a single video segment"""
    print(f"\n🎬 Generating: {filename}")
    print(f"📝 Prompt: {prompt[:100]}...")
    
    video_gen = OpenAIVideoGeneration(api_key=os.environ['EMERGENT_LLM_KEY'])
    
    video_bytes = video_gen.text_to_video(
        prompt=prompt,
        model="sora-2",
        size="1792x1024",  # Widescreen for professional presentation
        duration=duration,
        max_wait_time=600
    )
    
    if video_bytes:
        output_path = os.path.join(OUTPUT_DIR, filename)
        video_gen.save_video(video_bytes, output_path)
        print(f"✅ Saved: {output_path}")
        return output_path
    else:
        print(f"❌ Failed to generate: {filename}")
        return None

def main():
    """Generate comprehensive marketing video for HealthTrack Pro"""
    
    print("=" * 60)
    print("🏥 HealthTrack Pro - Marketing & Pitch Video Generation")
    print("=" * 60)
    
    # Video 1: Opening - The Healthcare Problem
    video1_prompt = """Cinematic corporate video opening: A modern hospital corridor with soft lighting, 
    transitioning to frustrated patients waiting in long queues, then showing scattered paper medical records 
    and confused elderly patients trying to read lab reports. Professional healthcare documentary style, 
    warm amber and orange color grading, smooth camera movements, text overlay ready format. 
    The scene conveys the challenge of healthcare data management and accessibility in today's world."""
    
    # Video 2: The Solution - HealthTrack Pro Introduction  
    video2_prompt = """Sleek technology product reveal: A glowing holographic hexagonal logo (amber/orange gradient) 
    materializes in a dark space, then transitions to a beautiful modern healthcare dashboard interface 
    on multiple devices - laptop, tablet, smartphone. Clean UI with amber and orange accent colors. 
    Professional SaaS product video style, cinematic lighting, the interface shows health metrics, 
    charts, and AI analysis results. Conveys innovation and accessibility in healthcare technology."""
    
    # Video 3: AI-Powered Lab Analysis Feature
    video3_prompt = """Healthcare technology demonstration: Close-up of a medical lab report being uploaded 
    to a tablet interface, then AI visualization with glowing neural network patterns analyzing the document, 
    extracting data points that transform into beautiful charts and health insights. Orange and amber 
    data visualization elements, futuristic but warm healthcare aesthetic. Shows the power of AI 
    in making complex medical data understandable."""
    
    # Video 4: Security & Compliance
    video4_prompt = """Cybersecurity visualization for healthcare: Digital shield icon with hexagonal pattern 
    (amber/orange colors) protecting flowing medical data streams. Encryption keys and lock symbols 
    appearing around patient records, MFA authentication on smartphone, secure biometric verification. 
    Professional corporate security video style, conveying trust and HIPAA/DHA compliance. 
    Blue and orange color scheme representing security and healthcare."""
    
    # Video 5: Doctor & Patient Experience
    video5_prompt = """Split screen healthcare interaction: On one side, a professional doctor in white coat 
    reviewing patient analytics on a modern dashboard with amber highlights, making informed decisions. 
    On the other side, a patient at home receiving personalized health recommendations on their phone, 
    smiling with relief. Warm, hopeful lighting, diverse representation, showing the connection 
    between healthcare providers and patients through technology."""
    
    # Video 6: Closing - Future of Healthcare
    video6_prompt = """Inspiring healthcare future vision: Aerial view of a modern smart city transitioning 
    to happy families, diverse patients using health apps, doctors consulting remotely, wearable devices 
    syncing health data. All connected by flowing orange/amber light streams representing data connectivity. 
    Uplifting corporate video style, sunrise lighting, conveying hope and innovation in global healthcare. 
    End with abstract representation of global health connectivity."""
    
    videos = [
        (video1_prompt, "01_healthcare_challenge.mp4", 8),
        (video2_prompt, "02_healthtrack_intro.mp4", 8),
        (video3_prompt, "03_ai_lab_analysis.mp4", 8),
        (video4_prompt, "04_security_compliance.mp4", 8),
        (video5_prompt, "05_doctor_patient_experience.mp4", 8),
        (video6_prompt, "06_future_healthcare.mp4", 8),
    ]
    
    generated = []
    for prompt, filename, duration in videos:
        result = generate_video(prompt, filename, duration)
        if result:
            generated.append(result)
    
    print("\n" + "=" * 60)
    print(f"📊 Video Generation Complete: {len(generated)}/{len(videos)} videos")
    print("=" * 60)
    
    return generated

if __name__ == "__main__":
    main()

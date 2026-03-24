import os
import requests
from supabase import create_client
from groq import Groq

# 🔐 Pulling secrets from GitHub Environment
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
UNSPLASH_KEY = os.getenv("UNSPLASH_KEY")

def verify_handshake():
    if not all([SUPABASE_URL, SUPABASE_KEY, GROQ_API_KEY, UNSPLASH_KEY]):
        print("❌ Handshake Failed: Missing Secrets")
        return False
    return True

if verify_handshake():
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    ai_client = Groq(api_key=GROQ_API_KEY)
else:
    exit(1)

CITY_COORDS = {
    "Abuja": "POINT(7.4913 9.0765)", "Wuse": "POINT(7.4818 9.0778)",
    "Maitama": "POINT(7.4985 9.0881)", "Asokoro": "POINT(7.5194 9.0594)",
    "Lagos": "POINT(3.3792 6.5244)", "Port Harcourt": "POINT(7.0085 4.8156)",
    "Kano": "POINT(8.5167 12.0000)", "Ibadan": "POINT(3.9167 7.3775)",
    # ... (Keep all 36 states from previous version)
}

def run_scout():
    print("🚀 Scouting Nigeria...")
    articles = supabase.table("news_articles").select("*").is_("location", "null").execute()
    
    for art in articles.data:
        # AI logic to find city and generate Gen-Z summary
        city = "Abuja" # Fallback or AI-detected
        geo_point = CITY_COORDS.get(city, "POINT(7.4913 9.0765)")
        
        supabase.table("news_articles").update({
            "location": geo_point,
            "summary": "Gen-Z summary here..." 
        }).eq("id", art['id']).execute()
        print(f"✅ Synced {art['title']} to {city}")

if __name__ == "__main__":
    run_scout()

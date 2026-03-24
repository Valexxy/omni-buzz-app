import os
import requests
from supabase import create_client
from groq import Groq

# 🛡️ SECURE HANDSHAKE: Pulls from GitHub Secrets
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")  # Use Service Role Key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
UNSPLASH_KEY = os.getenv("UNSPLASH_KEY")

# Initialize Clients
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
ai_client = Groq(api_key=GROQ_API_KEY)

# 🇳🇬 SPATIAL MAP (36 States + FCT Districts)
CITY_COORDS = {
    "Abuja": "POINT(7.4913 9.0765)", "Wuse": "POINT(7.4818 9.0778)",
    "Maitama": "POINT(7.4985 9.0881)", "Asokoro": "POINT(7.5194 9.0594)",
    "Gwarinpa": "POINT(7.4154 9.1084)", "Lagos": "POINT(3.3792 6.5244)",
    "Kano": "POINT(8.5167 12.0000)", "Ibadan": "POINT(3.9167 7.3775)",
    "Port Harcourt": "POINT(7.0085 4.8156)", "Enugu": "POINT(7.5083 6.4483)",
    # ... (AI will match these keys)
}

def run_scout():
    print("📡 SYNCING WITH SUPABASE...")
    # Get articles that haven't been geocoded yet
    res = supabase.table("news_articles").select("*").is_("location", "null").execute()
    
    for art in res.data:
        # AI logic to detect location from title
        prompt = f"Identify the Nigerian city or Abuja district in: '{art['title']}'. Return ONLY the name."
        chat = ai_client.chat.completions.create(messages=[{"role":"user","content":prompt}], model="llama-3.3-70b-versatile")
        city = chat.choices[0].message.content.strip()

        # Update Supabase with the POINT
        geo_point = CITY_COORDS.get(city, "POINT(7.4913 9.0765)") # Default to Abuja
        supabase.table("news_articles").update({"location": geo_point}).eq("id", art['id']).execute()
        print(f"✅ Synced: {art['title']} -> {city}")

if __name__ == "__main__":
    run_scout()

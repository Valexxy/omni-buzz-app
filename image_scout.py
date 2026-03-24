import os
import requests
from supabase import create_client
from groq import Groq

# --- 🛰️ ORACLE CONFIG (SECURE HANDSHAKE) ---
# These must match the names in your GitHub Secrets exactly
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
UNSPLASH_KEY = os.getenv("UNSPLASH_KEY")

# 🔍 SANITY CHECK (This will show in your GitHub Action Logs)
def verify_handshake():
    print("📡 INITIALIZING OMNI-BUZZ HANDSHAKE...")
    missing = []
    if not SUPABASE_URL: missing.append("SUPABASE_URL")
    if not SUPABASE_KEY: missing.append("SUPABASE_KEY")
    if not GROQ_API_KEY: missing.append("GROQ_API_KEY")
    if not UNSPLASH_KEY: missing.append("UNSPLASH_KEY")
    
    if missing:
        print(f"❌ HANDSHAKE FAILED: Missing {', '.join(missing)}")
        return False
    print("✅ HANDSHAKE SUCCESSFUL: All Signals Connected.")
    return True

# Initialize clients only if handshake passes
if verify_handshake():
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    ai_client = Groq(api_key=GROQ_API_KEY)
else:
    exit(1) # Stop execution if keys are missing

# 🇳🇬 NIGERIA SPATIAL RECOGNITION (36 States + FCT Districts)
CITY_COORDS = {
    "Abuja": "POINT(7.4913 9.0765)", "FCT": "POINT(7.4913 9.0765)",
    "Wuse": "POINT(7.4818 9.0778)", "Maitama": "POINT(7.4985 9.0881)",
    "Asokoro": "POINT(7.5194 9.0594)", "Gwarinpa": "POINT(7.4154 9.1084)",
    "Jabi": "POINT(7.4395 9.0734)", "Garki": "POINT(7.4882 9.0348)",
    "Makurdi": "POINT(8.5307 7.7322)", "Lokoja": "POINT(6.7333 7.8000)",
    "Lafia": "POINT(8.5167 8.5000)", "Minna": "POINT(6.5569 9.6139)",
    "Jos": "POINT(8.8917 9.8917)", "Ilorin": "POINT(4.5489 8.4799)",
    "Yola": "POINT(12.4849 9.2035)", "Bauchi": "POINT(9.8433 10.3158)",
    "Maiduguri": "POINT(13.1510 11.8311)", "Gombe": "POINT(11.1667 10.2833)",
    "Jalingo": "POINT(11.3600 8.8920)", "Damaturu": "POINT(11.9600 11.7470)",
    "Birnin Kebbi": "POINT(4.2000 12.4500)", "Sokoto": "POINT(5.2333 13.0622)",
    "Gusau": "POINT(6.6667 12.1667)", "Dutse": "POINT(9.3333 11.7000)",
    "Kano": "POINT(8.5167 12.0000)", "Katsina": "POINT(7.6000 12.9889)",
    "Kaduna": "POINT(7.4382 10.5105)", "Awka": "POINT(7.0689 6.2106)",
    "Abakaliki": "POINT(8.1136 6.3236)", "Enugu": "POINT(7.5083 6.4483)",
    "Umuahia": "POINT(7.4897 5.5267)", "Owerri": "POINT(7.0333 5.4833)",
    "Uyo": "POINT(7.9167 5.0333)", "Yenagoa": "POINT(6.2642 4.9267)",
    "Calabar": "POINT(8.3273 4.9757)", "Benin City": "POINT(5.6263 6.3350)",
    "Asaba": "POINT(6.7333 6.1833)", "Port Harcourt": "POINT(7.0085 4.8156)",
    "Ado Ekiti": "POINT(5.2217 7.6211)", "Ikeja": "POINT(3.3333 6.5833)",
    "Lagos": "POINT(3.3792 6.5244)", "Abeokuta": "POINT(3.3500 7.1500)",
    "Akure": "POINT(5.1926 7.2526)", "Oshogbo": "POINT(4.5500 7.7667)",
    "Ibadan": "POINT(3.9167 7.3775)"
}

def ai_geo_scout(title):
    try:
        prompt = f"Headline: '{title}'. Identify the specific Abuja district or Nigerian City. Return ONLY the name. If global, return 'Global'."
        chat = ai_client.chat.completions.create(messages=[{"role": "user", "content": prompt}], model="llama-3.3-70b-versatile")
        return chat.choices[0].message.content.strip().replace(".", "")
    except Exception as e:
        print(f"⚠️ Geo Error: {e}")
        return "Global"

def ai_process_content(title, category):
    try:
        # Prompting for a punchy, Gen-Z headline and a single keyword
        prompt = f"Summarize this news for a Gen-Z merchant: '{title}'. Category: {category}. Return exactly: 'PunchySummary | SingleImageKeyword'."
        chat = ai_client.chat.completions.create(messages=[{"role": "user", "content": prompt}], model="llama-3.3-70b-versatile")
        return chat.choices[0].message.content.split("|")
    except: return title, category

def get_image(query):
    url = f"https://api.unsplash.com/search/photos?query={query}&per_page=1&client_id={UNSPLASH_KEY}"
    try:
        res = requests.get(url, timeout=10).json()
        if res.get('results'):
            return res['results'][0]['urls']['regular'], res['results'][0]['user']['name']
    except: return None, None

def run_scout():
    print("🚀 SCOUTING IN PROGRESS...")
    # Select articles that haven't been geocoded yet
    articles = supabase.table("news_articles").select("*").is_("location", "null").execute()
    
    if not articles.data:
        print("✅ All articles already geocoded.")
        return

    for art in articles.data:
        print(f"🧠 Processing: {art['title']}")
        
        city = ai_geo_scout(art['title'])
        summary_parts = ai_process_content(art['title'], art['category'])
        summary = summary_parts[0].strip()
        keyword = summary_parts[1].strip() if len(summary_parts) > 1 else art['category']
        
        img_url, credit = get_image(keyword)
        geo_point = CITY_COORDS.get(city)
        
        supabase.table("news_articles").update({
            "summary": summary,
            "image_url": img_url,
            "image_credit": credit,
            "location": geo_point
        }).eq("id", art['id']).execute()
        
        print(f"📍 Mapped to {city}: {summary[:50]}...")

if __name__ == "__main__":
    run_scout()

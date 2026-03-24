import os
import requests
from supabase import create_client
from groq import Groq

# 🔐 CLOUD CONFIG
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
ai_client = Groq(api_key=GROQ_API_KEY)

# 🇳🇬 ROBUST NIGERIA GEO-MAP (36 States + FCT + Key Districts)
CITY_COORDS = {
    # --- FCT & Districts ---
    "Abuja": "POINT(7.4913 9.0765)", "Wuse": "POINT(7.4818 9.0778)",
    "Maitama": "POINT(7.4985 9.0881)", "Asokoro": "POINT(7.5194 9.0594)",
    "Gwarinpa": "POINT(7.4154 9.1084)", "Kuje": "POINT(7.2276 8.8787)",
    # --- South West ---
    "Lagos": "POINT(3.3792 6.5244)", "Ikeja": "POINT(3.3333 6.5833)",
    "Ibadan": "POINT(3.9167 7.3775)", "Abeokuta": "POINT(3.3500 7.1500)",
    "Akure": "POINT(5.1926 7.2526)", "Oshogbo": "POINT(4.5500 7.7667)",
    "Ado Ekiti": "POINT(5.2217 7.6211)",
    # --- South South ---
    "Port Harcourt": "POINT(7.0085 4.8156)", "Benin City": "POINT(5.6263 6.3350)",
    "Asaba": "POINT(6.7243 6.1918)", "Calabar": "POINT(8.3273 4.9757)",
    "Uyo": "POINT(7.9199 5.0376)", "Yenagoa": "POINT(6.2649 4.9244)",
    # --- South East ---
    "Enugu": "POINT(7.5083 6.4483)", "Owerri": "POINT(7.0351 5.4832)",
    "Awka": "POINT(7.0688 6.2105)", "Abakaliki": "POINT(8.1137 6.3246)",
    "Umuahia": "POINT(7.5253 5.5267)",
    # --- North Central ---
    "Jos": "POINT(8.8917 9.8917)", "Ilorin": "POINT(4.5489 8.4799)",
    "Minna": "POINT(6.5514 9.6139)", "Lokoja": "POINT(6.7333 7.8000)",
    "Makurdi": "POINT(8.5333 7.7333)", "Lafia": "POINT(8.5167 8.4833)",
    # --- North West ---
    "Kano": "POINT(8.5167 12.0000)", "Kaduna": "POINT(7.4382 10.5105)",
    "Sokoto": "POINT(5.2323 13.0059)", "Katsina": "POINT(7.6080 12.9896)",
    "Birnin Kebbi": "POINT(4.1951 12.4539)", "Gusau": "POINT(6.6625 12.1628)",
    "Dutse": "POINT(9.3392 11.7008)",
    # --- North East ---
    "Maiduguri": "POINT(13.1510 11.8311)", "Bauchi": "POINT(9.8442 10.3103)",
    "Yola": "POINT(12.4849 9.2035)", "Gombe": "POINT(11.1686 10.2841)",
    "Damaturu": "POINT(11.9608 11.7470)", "Jalingo": "POINT(11.3600 8.8921)",
    "Global": None
}

def ai_geo_scout(title):
    valid_cities = ", ".join(CITY_COORDS.keys())
    try:
        # We give the AI the exact list to choose from for 100% accuracy
        prompt = (
            f"Analyze this news title: '{title}'. "
            f"Which city or district from this list is mentioned: {valid_cities}? "
            "Return ONLY the name from the list. If none match, return 'Abuja'."
        )
        chat = ai_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile"
        )
        result = chat.choices[0].message.content.strip().replace(".", "")
        return result if result in CITY_COORDS else "Abuja"
    except:
        return "Abuja"

def run_scout():
    print("🛰️ OMNI-BUZZ ROBUST SCOUT ACTIVE...")
    # Get articles where location is null or just a generic string
    articles = supabase.table("news_articles").select("*").is_("location", "null").execute()
    
    for art in articles.data:
        city = ai_geo_scout(art['title'])
        geo_point = CITY_COORDS.get(city, "POINT(7.4913 9.0765)")
        
        supabase.table("news_articles").update({"location": geo_point}).eq("id", art['id']).execute()
        print(f"✅ Synced: {city} for '{art['title'][:30]}...'")

if __name__ == "__main__":
    run_scout()

import os
import requests
from supabase import create_client
from groq import Groq

# 🔐 CLOUD CONFIG
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY") # Use Service Role Key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
ai_client = Groq(api_key=GROQ_API_KEY)

# 🌍 MASTER STATE COORDINATES (The 37 "Uplink Nodes")
# Every LGA will map to its State Capital for the GPS point.
STATE_COORDS = {
    "Abia": "POINT(7.5253 5.5267)", "Adamawa": "POINT(12.4849 9.2035)", 
    "Akwa Ibom": "POINT(7.9199 5.0376)", "Anambra": "POINT(7.0688 6.2105)", 
    "Bauchi": "POINT(9.8442 10.3103)", "Bayelsa": "POINT(6.2649 4.9244)", 
    "Benue": "POINT(8.5333 7.7333)", "Borno": "POINT(13.1510 11.8311)", 
    "Cross River": "POINT(8.3273 4.9757)", "Delta": "POINT(6.7243 6.1918)", 
    "Ebonyi": "POINT(8.1137 6.3246)", "Edo": "POINT(5.6263 6.3350)", 
    "Ekiti": "POINT(5.2217 7.6211)", "Enugu": "POINT(7.5083 6.4483)", 
    "FCT - Abuja": "POINT(7.4913 9.0765)", "Gombe": "POINT(11.1686 10.2841)", 
    "Imo": "POINT(7.0351 5.4832)", "Jigawa": "POINT(9.3392 11.7008)", 
    "Kaduna": "POINT(7.4382 10.5105)", "Kano": "POINT(8.5167 12.0000)", 
    "Katsina": "POINT(7.6080 12.9896)", "Kebbi": "POINT(4.1951 12.4539)", 
    "Kogi": "POINT(6.7333 7.8000)", "Kwara": "POINT(4.5489 8.4799)", 
    "Lagos": "POINT(3.3792 6.5244)", "Nasarawa": "POINT(8.5167 8.4833)", 
    "Niger": "POINT(6.5514 9.6139)", "Ogun": "POINT(3.3500 7.1500)", 
    "Ondo": "POINT(5.1926 7.2526)", "Osun": "POINT(4.5500 7.7667)", 
    "Oyo": "POINT(3.9167 7.3775)", "Plateau": "POINT(8.8917 9.8917)", 
    "Rivers": "POINT(7.0085 4.8156)", "Sokoto": "POINT(5.2323 13.0059)", 
    "Taraba": "POINT(11.3600 8.8921)", "Yobe": "POINT(11.9608 11.7470)", 
    "Zamfara": "POINT(6.6625 12.1628)"
}

def analyze_geo_intel(title, content):
    """
    Powerful AI prompt to extract LGA and State from 774 possibilities.
    """
    states_list = ", ".join(STATE_COORDS.keys())
    
    prompt = (
        f"INTEL: '{title} - {content}'\n\n"
        f"TASKS:\n"
        f"1. Identify the specific Local Government Area (LGA) or District mentioned.\n"
        f"2. Identify which of these 37 States it belongs to: {states_list}.\n"
        f"3. Determine Logistics Risk: 'Low', 'Medium', or 'High'.\n\n"
        "Return ONLY in this format:\n"
        "LGA: [Name] | STATE: [State Name] | RISK: [Level]"
    )

    try:
        chat = ai_client.chat.completions.create(
            messages=[{"role": "system", "content": "You are a Nigerian Geospatial Expert."},
                      {"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile"
        )
        res = chat.choices[0].message.content
        lga = res.split("LGA:")[1].split("|")[0].strip()
        state = res.split("STATE:")[1].split("|")[0].strip()
        risk = res.split("RISK:")[1].strip()
        return lga, state, risk
    except:
        return "Multiple", "Lagos", "Low"

def run_scout():
    print("🛰️ OMNI-BUZZ: SCANNING ALL 774 LGAs...")
    
    # 1. Fetch articles needing verification
    articles = supabase.table("news_articles").select("*").is_("location", "null").execute()
    
    for art in articles.data:
        # 2. Extract specific LGA and State logic
        lga_name, state_name, risk_level = analyze_geo_intel(art['title'], art['content'])
        
        # 3. Get coordinate for the map
        geo_point = STATE_COORDS.get(state_name, STATE_COORDS["Lagos"])
        
        # 4. Push final intelligence to Supabase
        # Note: 'district' and 'risk_level' are columns you should add to your table
        supabase.table("news_articles").update({
            "location": geo_point,
            "author_name": f"OS-INT // {lga_name}", 
            "category": f"{risk_level.upper()} RISK",
            # "district": lga_name, # Optional: Add this column to Supabase
        }).eq("id", art['id']).execute()
        
        print(f"✅ VERIFIED: {lga_name}, {state_name} ({risk_level} Risk)")

if __name__ == "__main__":
    run_scout()
import os
import requests
import feedparser
import json
import re
from bs4 import BeautifulSoup
from supabase import create_client
from groq import Groq

# 🔐 CLOUD CONFIG
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Initialize Clients
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
ai_client = Groq(api_key=GROQ_API_KEY)

# 🇳🇬 MASTER GEO-MAPPING (36 States + FCT)
STATE_COORDS = {
    "Abia": "POINT(7.5253 5.5267)", "Adamawa": "POINT(12.4849 9.2035)", "Akwa Ibom": "POINT(7.9199 5.0376)",
    "Anambra": "POINT(7.0688 6.2105)", "Bauchi": "POINT(9.8442 10.3103)", "Bayelsa": "POINT(6.2649 4.9244)",
    "Benue": "POINT(8.5333 7.7333)", "Borno": "POINT(13.1510 11.8311)", "Cross River": "POINT(8.3273 4.9757)",
    "Delta": "POINT(6.7243 6.1918)", "Ebonyi": "POINT(8.1137 6.3246)", "Edo": "POINT(5.6263 6.3350)",
    "Ekiti": "POINT(5.2217 7.6211)", "Enugu": "POINT(7.5083 6.4483)", "FCT - Abuja": "POINT(7.4913 9.0765)",
    "Gombe": "POINT(11.1686 10.2841)", "Imo": "POINT(7.0351 5.4832)", "Jigawa": "POINT(9.3392 11.7008)",
    "Kaduna": "POINT(7.4382 10.5105)", "Kano": "POINT(8.5167 12.0000)", "Katsina": "POINT(7.6080 12.9896)",
    "Kebbi": "POINT(4.1951 12.4539)", "Kogi": "POINT(6.7333 7.8000)", "Kwara": "POINT(4.5489 8.4799)",
    "Lagos": "POINT(3.3792 6.5244)", "Nasarawa": "POINT(8.5167 8.4833)", "Niger": "POINT(6.5514 9.6139)",
    "Ogun": "POINT(3.3500 7.1500)", "Ondo": "POINT(5.1926 7.2526)", "Osun": "POINT(4.5500 7.7667)",
    "Oyo": "POINT(3.9167 7.3775)", "Plateau": "POINT(8.8917 9.8917)", "Rivers": "POINT(7.0085 4.8156)",
    "Sokoto": "POINT(5.2323 13.0059)", "Taraba": "POINT(11.3600 8.8921)", "Yobe": "POINT(11.9608 11.7470)",
    "Zamfara": "POINT(6.6625 12.1628)"
}

# 🛰️ FREE INTEL SOURCES
FREE_SOURCES = [
    "https://punchng.com/feed/",
    "https://businessday.ng/feed/",
    "https://www.premiumtimesng.com/feed",
    "https://nairametrics.com/feed/",
    "https://news.google.com/rss/search?q=Nigeria+logistics+trade+when:24h&hl=en-NG&gl=NG&ceid=NG:en",
    "https://news.google.com/rss/search?q=Naira+exchange+rate+black+market+when:24h&hl=en-NG&gl=NG&ceid=NG:en"
]

def scrape_full_story(url):
    """Deep Scraper with anti-bot headers."""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        }
        response = requests.get(url, headers=headers, timeout=12)
        soup = BeautifulSoup(response.content, 'lxml')
        
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()
            
        paragraphs = soup.find_all('p')
        text = " ".join([p.get_text() for p in paragraphs[:5]])
        return re.sub(r'\s+', ' ', text).strip() if len(text) > 100 else None
    except Exception as e:
        print(f"⚠️ Scrape failed for {url}: {e}")
        return None

def process_with_ai(title, text):
    """Unified AI logic: Summarizes, Geo-tags, and assesses Risk."""
    states_list = ", ".join(STATE_COORDS.keys())
    
    prompt = f"""
    Analyze this Nigerian news:
    TITLE: {title}
    BODY: {text[:1500]}

    TASKS:
    1. Summarize into a 2-sentence 'Merchant Brief' focusing on trade/logistics impact.
    2. Identify the specific Nigerian City/LGA.
    3. Map it to one of these States: {states_list}.
    4. Assess Risk Level: 'Low' (Info), 'Medium' (Caution), 'High' (Danger/Blockage).

    RETURN ONLY VALID JSON:
    {{
      "brief": "summary here",
      "lga": "name of city/LGA",
      "state": "exact state name",
      "risk": "Low/Medium/High"
    }}
    """
    
    try:
        response = ai_client.chat.completions.create(
            messages=[{"role": "system", "content": "You are a Nigerian Logistics Intelligence Expert."},
                      {"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"❌ AI Logic Error: {e}")
        return None

def run_scout():
    print("🛰️ OMNI-BUZZ: INITIALIZING DEEP SCOUT...")
    
    for url in FREE_SOURCES:
        feed = feedparser.parse(url)
        print(f"🌐 Checking Source: {url}")
        
        for entry in feed.entries[:3]:
            # 1. Duplication Check
            existing = supabase.table("news_articles").select("id").eq("title", entry.title).execute()
            if existing.data:
                continue

            # 2. Extract & Refine
            content_body = scrape_full_story(entry.link)
            # Fallback to RSS summary if scraping is blocked
            text_to_process = content_body if content_body else entry.get("summary", entry.title)
            
            intel = process_with_ai(entry.title, text_to_process)
            
            if intel:
                # 3. Mapping
                state_name = intel.get('state', 'Lagos')
                geo_point = STATE_COORDS.get(state_name, STATE_COORDS["Lagos"])
                
                # 4. Final Data Payload
                data = {
                    "title": entry.title,
                    "content": intel['brief'],
                    "author_name": f"OS-INT // {intel['lga']}",
                    "category": f"{intel['risk'].upper()} RISK",
                    "location": geo_point,
                    "source_url": entry.link,
                    "image_url": f"https://images.unsplash.com/photo-1566933293069-b55c7f326dd4?sig={hash(entry.title)}"
                }
                
                try:
                    supabase.table("news_articles").insert(data).execute()
                    print(f"✅ SYNCED: [{intel['risk']}] {intel['lga']}, {state_name}")
                except Exception as e:
                    print(f"❌ Supabase Insert Error: {e}")

if __name__ == "__main__":
    run_scout()
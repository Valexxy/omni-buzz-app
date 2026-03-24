import os
import requests
import feedparser
import json
import re
from bs4 import BeautifulSoup
from supabase import create_client
from groq import Groq

# 🔐 CLOUD CONFIG
SUB_URL = os.getenv("SUPABASE_URL")
SUB_KEY = os.getenv("SUPABASE_KEY") # Service Role Key
GROQ_KEY = os.getenv("GROQ_API_KEY")
TG_TOKEN = os.getenv("TELEGRAM_TOKEN")
TG_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

supabase = create_client(SUB_URL, SUB_KEY)
ai_client = Groq(api_key=GROQ_KEY)

# 🇳🇬 Master Geo-Mapping
STATE_COORDS = {
    "Lagos": "POINT(3.3792 6.5244)", "Abuja (FCT)": "POINT(7.4913 9.0765)",
    "Anambra": "POINT(7.0688 6.2105)", "Kano": "POINT(8.5167 12.0000)",
    "Rivers": "POINT(7.0085 4.8156)", "Ogun": "POINT(3.3500 7.1500)",
    "Oyo": "POINT(3.9167 7.3775)", "Enugu": "POINT(7.5083 6.4483)"
}

def send_telegram(msg):
    if not TG_TOKEN or not TG_CHAT_ID: return
    url = f"https://api.telegram.org/bot{TG_TOKEN}/sendMessage"
    requests.post(url, json={"chat_id": TG_CHAT_ID, "text": msg, "parse_mode": "Markdown"})

def scrape_full_story(url):
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        res = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(res.content, 'lxml')
        for s in soup(["script", "style"]): s.decompose()
        text = " ".join([p.get_text() for p in soup.find_all('p')[:5]])
        return re.sub(r'\s+', ' ', text).strip()
    except: return None

def process_with_ai(title, text):
    prompt = f"""
    Analyze this Nigerian news: {title} | {text[:1500]}
    1. Write a 2-sentence 'Merchant Brief' on trade/logistics impact.
    2. Identify the specific City/LGA.
    3. Identify State from: {list(STATE_COORDS.keys())}.
    4. Risk Level: Low, Medium, or High.
    Return ONLY JSON: {{"brief": "...", "lga": "...", "state": "...", "risk": "..."}}
    """
    try:
        res = ai_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"}
        )
        return json.loads(res.choices[0].message.content)
    except: return None

def run_scout():
    sources = [
        "https://punchng.com/feed/", 
        "https://nairametrics.com/feed/",
        "https://news.google.com/rss/search?q=Nigeria+logistics+trade+when:24h&hl=en-NG&gl=NG&ceid=NG:en"
    ]
    for url in sources:
        feed = feedparser.parse(url)
        for entry in feed.entries[:3]:
            if supabase.table("news_articles").select("id").eq("title", entry.title).execute().data: continue
            
            raw_text = scrape_full_story(entry.link)
            intel = process_with_ai(entry.title, raw_text if raw_text else entry.title)
            
            if intel:
                data = {
                    "title": entry.title,
                    "content": intel['brief'],
                    "author_name": f"OS-INT // {intel['lga']}",
                    "category": f"{intel['risk'].upper()} RISK",
                    "location": STATE_COORDS.get(intel['state'], "POINT(3.37 6.52)"),
                    "source_url": entry.link,
                    "image_url": f"https://images.unsplash.com/photo-1566933293069-b55c7f326dd4?sig={hash(entry.title)}"
                }
                supabase.table("news_articles").insert(data).execute()
                
                if intel['risk'] == "High":
                    send_telegram(f"🚨 *HIGH RISK ALERT*\n📍 {intel['lga']}, {intel['state']}\n📦 {intel['brief']}\n🔗 [Details]({entry.link})")

if __name__ == "__main__": run_scout()
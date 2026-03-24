import os
import feedparser
from supabase import create_client
from groq import Groq

# 🔐 CLOUD CONFIG
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
ai_client = Groq(api_key=GROQ_API_KEY)

# 🛰️ THE 50 SOURCE LIST (RSS & Google News Search Feeds)
FREE_SOURCES = [
    # --- Major Nigerian Outlets ---
    "https://punchng.com/feed/",
    "https://businessday.ng/feed/",
    "https://www.premiumtimesng.com/feed",
    "https://guardian.ng/feed/",
    "https://vanguardngr.com/feed/",
    "https://dailypost.ng/feed/",
    "https://thenationonlineng.net/feed/",
    "https://nairametrics.com/feed/",
    # --- Logistics & Trade Search Feeds (Google News RSS Hack) ---
    "https://news.google.com/rss/search?q=Nigeria+Port+Logistics+when:24h&hl=en-NG&gl=NG&ceid=NG:en",
    "https://news.google.com/rss/search?q=Naira+Exchange+Rate+Business+when:24h&hl=en-NG&gl=NG&ceid=NG:en",
    "https://news.google.com/rss/search?q=Apapa+Port+Congestion+when:24h&hl=en-NG&gl=NG&ceid=NG:en",
    "https://news.google.com/rss/search?q=Dangote+Refinery+Trade+when:24h&hl=en-NG&gl=NG&ceid=NG:en",
    "https://news.google.com/rss/search?q=Nigeria+Customs+Duty+Updates+when:24h&hl=en-NG&gl=NG&ceid=NG:en",
    # [You can add up to 50 URLs here following this pattern]
]

def process_and_save():
    print("🛰️ OMNI-BUZZ: SCANNING 50+ SOURCES...")
    
    for url in FREE_SOURCES:
        feed = feedparser.parse(url)
        for entry in feed.entries[:3]: # Grab top 3 from each source to avoid spam
            title = entry.title
            link = entry.link
            
            # 1. Check if we already have this story
            exists = supabase.table("news_articles").select("id").eq("title", title).execute()
            if exists.data: continue 

            # 2. Use AI to refine and geo-tag
            # (Insert your previous AI risk and LGA extraction logic here)
            # For brevity, let's assume we create a basic record first
            data = {
                "title": title,
                "content": entry.get("summary", "New report from " + url),
                "author_name": "OMNI-SCOUT",
                "category": "Trade & Logistics",
                "location": None # This triggers the Scout's next phase
            }
            
            supabase.table("news_articles").insert(data).execute()
            print(f"📥 Saved: {title[:50]}...")

if __name__ == "__main__":
    process_and_save()
import feedparser
import os
from supabase import create_client

# 🔐 CLOUD CONFIG
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def collect_free_intel():
    # 📝 50+ RSS Source List (Examples - you can expand this to 50)
    rss_feeds = [
        "https://businessday.ng/feed/",
        "https://www.premiumtimesng.com/feed",
        "https://punchng.com/feed/",
        # Google News RSS Strategy (The "Search Hack")
        "https://news.google.com/rss/search?q=Lagos+logistics+when:24h&hl=en-NG&gl=NG&ceid=NG:en",
        "https://news.google.com/rss/search?q=Naira+exchange+rate+when:24h&hl=en-NG&gl=NG&ceid=NG:en",
        "https://news.google.com/rss/search?q=Onitsha+Market+news+when:7d&hl=en-NG&gl=NG&ceid=NG:en"
    ]

    all_entries = []
    
    for url in rss_feeds:
        feed = feedparser.parse(url)
        for entry in feed.entries[:5]: # Get top 5 from each
            all_entries.append({
                "title": entry.title,
                "content": entry.get('summary', entry.title),
                "source_url": entry.link,
                "author_name": "OMNI-COLLECTOR"
            })
            
    # 📤 Push to Supabase news_articles
    # Note: AI will process these in the NEXT step (the image_scout logic)
    for item in all_entries:
        # Check if already exists to avoid duplicates
        exists = supabase.table("news_articles").select("id").eq("title", item['title']).execute()
        if not exists.data:
            supabase.table("news_articles").insert(item).execute()
            print(f"📥 Saved: {item['title'][:50]}...")

if __name__ == "__main__":
    collect_free_intel()
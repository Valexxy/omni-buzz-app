import os
from datetime import datetime, timedelta
from supabase import create_client

# 🔐 CLOUD CONFIG
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY") # Use Service Role Key

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def purge_old_intel():
    print("🧹 OMNI-BUZZ: STARTING DATABASE CLEANUP...")
    
    # 1. Calculate the cutoff date (3 days ago)
    cutoff_date = (datetime.now() - timedelta(days=3)).isoformat()
    
    try:
        # 2. Delete rows where created_at is older than the cutoff
        # Ensure your table has a 'created_at' column (Supabase adds this by default)
        response = supabase.table("news_articles") \
            .delete() \
            .lt("created_at", cutoff_date) \
            .execute()
        
        count = len(response.data) if response.data else 0
        print(f"✅ CLEANUP COMPLETE: Removed {count} old intelligence reports.")
        
    except Exception as e:
        print(f"❌ CLEANUP FAILED: {str(e)}")

if __name__ == "__main__":
    purge_old_intel()
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import SmartHeader from '@/components/Header';
import NewsCard from '@/components/NewsCard';

export default function HomePage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [city, setCity] = useState("SYNCING...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 📍 STEP 1: Get User GPS
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      try {
        // 🏙️ STEP 2: Identify Neighborhood/City
        const geoRes = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        const geoData = await geoRes.json();
        const detectedCity = (geoData.locality || geoData.city || "ABUJA").toUpperCase();
        setCity(detectedCity);

        // 🛰️ STEP 3: Fetch News (Filtered by latest)
        const { data } = await supabase
          .from('news_articles')
          .select('*')
          .order('created_at', { ascending: false });
        
        setArticles(data || []);
      } catch (err) {
        console.error("Signal Lost:", err);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  if (loading) return (
    <div className="h-screen bg-black flex items-center justify-center font-mono text-green-500 animate-pulse text-xs tracking-[0.5em]">
      🛰️ ESTABLISHING GEOFENCE...
    </div>
  );

  return (
    <main className="min-h-screen bg-black pb-20">
      <SmartHeader locationName={city} />
      
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
        {articles.map((art) => (
          <NewsCard key={art.id} article={art} variant="premium" />
        ))}
      </div>
    </main>
  );
}

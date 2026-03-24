'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import SmartHeader from '@/components/Header';
import NewsCard from '@/components/NewsCard';

export default function HomePage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [city, setCity] = useState("ABUJA");
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    // 📍 1. Access Local GPS
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          // 🏙️ 2. Identify City/District
          const geoRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const geoData = await geoRes.json();
          const currentCity = (geoData.locality || geoData.city || "ABUJA").toUpperCase();
          setCity(currentCity);

          // 🛰️ 3. Fetch News Articles
          const { data } = await supabase
            .from('news_articles')
            .select('*')
            .order('created_at', { ascending: false });

          setArticles(data || []);
        } catch (err) {
          console.error("Signal Sync Error:", err);
        } finally {
          setIsSyncing(false);
        }
      },
      (error) => {
        console.error("GPS Denied", error);
        setIsSyncing(false); // Fallback to Abuja default
      }
    );
  }, []);

  if (isSyncing) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-2 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
        <p className="font-mono text-[10px] text-green-500 tracking-[0.5em] animate-pulse">
          ESTABLISHING GEOFENCE...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black pb-32">
      <SmartHeader locationName={city} />
      
      <section className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.length > 0 ? (
            articles.map((art) => (
              <NewsCard key={art.id} article={art} variant="premium" />
            ))
          ) : (
            <div className="col-span-full py-20 border border-dashed border-white/5 rounded-3xl text-center">
              <p className="text-gray-600 font-mono text-xs tracking-widest uppercase">
                Zero news signals detected in this sector.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import NewsCard from '@/components/NewsCard';
import MarketTicker from '@/components/MarketTicker';

export default function GenZNewsDeck() {
  const [localNews, setLocalNews] = useState([]);
  const [globalNews, setGlobalNews] = useState([]);
  const [locationName, setLocationName] = useState("Your Area");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      // 1. Get the City Name for the "Special" feel
      const geo = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`);
      const geoData = await geo.json();
      setLocationName(geoData.city || "Nearby");

      // 2. Fetch News with "Local First" Logic
      const { data, error } = await supabase.rpc('get_prioritized_news', {
        user_lat: latitude,
        user_long: longitude
      });

      if (!error) {
        // Segmenting: Top 3 are "Local/Priority", rest are "Global"
        setLocalNews(data.slice(0, 3));
        setGlobalNews(data.slice(3));
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center text-green-500 font-mono animate-pulse">📡 SYNCING YOUR NODE...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 pb-20">
      
      {/* 📍 SECTION 1: THE LOCAL VIBE */}
      <section className="mt-8">
        <div className="flex items-center gap-2 mb-6">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <h2 className="text-2xl font-black uppercase tracking-tighter italic">
            Live in {locationName} <span className="text-green-500 text-sm ml-2">#YourBlock</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {localNews.map(art => <NewsCard key={art.id} article={art} variant="premium" />)}
        </div>
      </section>

      {/* 📊 SECTION 2: THE MARKET PULSE (Inserted between news) */}
      <div className="my-12 py-4 border-y border-white/10">
        <p className="text-[10px] text-gray-500 font-mono mb-2 text-center uppercase">Real-Time Merchant Liquidity</p>
        <MarketTicker />
      </div>

      {/* 🌍 SECTION 3: THE GLOBAL FEED */}
      <section>
        <h2 className="text-xl font-bold mb-6 text-gray-400 uppercase tracking-widest flex items-center gap-4">
          Global Signals <div className="h-[1px] flex-1 bg-white/10"></div>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 opacity-80 hover:opacity-100 transition-opacity">
          {globalNews.map(art => <NewsCard key={art.id} article={art} variant="compact" />)}
        </div>
      </section>

    </div>
  );
}

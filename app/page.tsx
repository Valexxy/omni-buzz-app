'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import NewsCard from '@/components/NewsCard';
import MarketTicker from '@/components/MarketTicker';

export default function GenZNewsDeck() {
  const [localNews, setLocalNews] = useState([]);
  const [globalNews, setGlobalNews] = useState([]);
  const [locationName, setLocationName] = useState("YOUR NODE");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🌍 1. Request GPS Access
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      try {
        // 🏙️ 2. Reverse Geocode: Get the Neighborhood Name (e.g., Wuse II)
        const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
        const geoData = await geoRes.json();
        setLocationName((geoData.locality || geoData.city || "Abuja").toUpperCase());

        // 🛰️ 3. Fetch Prioritized News via Supabase RPC
        const { data, error } = await supabase.rpc('get_prioritized_news', {
          user_lat: latitude,
          user_long: longitude
        });

        if (!error && data) {
          // Segmenting: Top 3 are Local/Premium, the rest are Global/Compact
          setLocalNews(data.slice(0, 3));
          setGlobalNews(data.slice(3));
        }
      } catch (err) {
        console.error("Sync Error:", err);
      } finally {
        setLoading(false);
      }
    }, (err) => {
      console.warn("GPS Denied");
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
      <p className="text-green-500 font-mono text-xs tracking-widest animate-pulse">🛰️ SYNCING GPS NODE...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 pb-20 bg-black">
      
      {/* 📍 ROW 1: THE HYPER-LOCAL VIBE */}
      <section className="mt-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-black italic tracking-tighter text-white">
              LIVE IN <span className="text-green-500 underline decoration-green-500/30 underline-offset-8">{locationName}</span>
            </h2>
            <p className="text-[10px] text-gray-500 font-mono mt-2 uppercase tracking-[0.3em]">Priority Intelligence Feed</p>
          </div>
          <div className="hidden md:block h-[1px] flex-1 bg-white/10 mx-10" />
          <div className="text-right">
             <span className="text-xs font-bold text-white/40 italic">#YourBlock</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {localNews.map(art => (
            <NewsCard key={art.id} article={art} variant="premium" />
          ))}
        </div>
      </section>

      {/* 📊 ROW 2: THE MARKET BRIDGE */}
      <div className="my-16 relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-white/5"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-black px-4 text-[10px] font-mono text-gray-600 uppercase tracking-[0.5em]">Market Pulse</span>
        </div>
        <div className="mt-8">
          <MarketTicker />
        </div>
      </div>

      {/* 🌍 ROW 3: GLOBAL SIGNALS */}
      <section>
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-[0.4em]">Global Signals</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {globalNews.map(art => (
            <NewsCard key={art.id} article={art} variant="compact" />
          ))}
        </div>
      </section>

    </div>
  );
}

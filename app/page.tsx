'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import NewsCard from '@/components/NewsCard';
import MarketTicker from '@/components/MarketTicker';

export default function GenZNewsDeck() {
  const [localNews, setLocalNews] = useState([]);
  const [regionalNews, setRegionalNews] = useState([]);
  const [globalNews, setGlobalNews] = useState([]);
  const [locationName, setLocationName] = useState("YOUR NODE");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🌍 1. Request GPS Access
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      try {
        // 🏙️ 2. Reverse Geocode: Identify the Neighborhood
        const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
        const geoData = await geoRes.json();
        
        // Priority: Neighborhood (Locality) > City
        const currentLoc = geoData.locality || geoData.city || "Abuja";
        setLocationName(currentLoc.toUpperCase());

        // 🛰️ 3. Fetch Prioritized News via our Supabase SQL Function
        const { data, error } = await supabase.rpc('get_prioritized_news', {
          user_lat: latitude,
          user_long: longitude
        });

        if (!error && data) {
          // 📊 SMART SEGMENTATION:
          // Row 1: Top 3 (Hyper-Local)
          setLocalNews(data.slice(0, 3));
          // Row 2: Next 4 (Regional/National)
          setRegionalNews(data.slice(3, 7));
          // Row 3: Everything else (Global)
          setGlobalNews(data.slice(7));
        }
      } catch (err) {
        console.error("Sync Error:", err);
      } finally {
        setLoading(false);
      }
    }, (err) => {
      console.warn("GPS Access Denied. Falling back to general feed.");
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
      <p className="text-green-500 font-mono text-[10px] tracking-[0.4em] animate-pulse uppercase">Syncing GPS Node...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 pb-20 bg-black min-h-screen">
      
      {/* 📍 ROW 1: HYPER-LOCAL (The Special "Premium" Vibe) */}
      <section className="mt-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white">
              LIVE IN <span className="text-green-500 underline decoration-green-500/20 underline-offset-8 uppercase">{locationName}</span>
            </h2>
            <p className="text-[10px] text-gray-500 font-mono mt-3 uppercase tracking-[0.5em]">Priority Intelligence Stream</p>
          </div>
          <div className="hidden lg:block h-[1px] flex-1 bg-white/5 mx-12" />
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Active Node</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {localNews.map(art => (
            <NewsCard key={art.id} article={art} variant="premium" />
          ))}
        </div>
      </section>

      {/* 📊 ROW 2: THE TICKERS (The "Merchant Bridge") */}
      <div className="my-16 py-8 border-y border-white/5 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-4">
          <span className="text-[9px] font-mono text-gray-600 uppercase tracking-[0.6em]">Market Liquidity Pulse</span>
        </div>
        <MarketTicker />
      </div>

      {/* 🏙️ ROW 3: REGIONAL NODES (States & Country) */}
      <section className="mb-16">
        <h2 className="text-[11px] font-black text-gray-500 mb-8 tracking-[0.4em] uppercase flex items-center gap-4">
          Regional Signals <div className="h-[1px] flex-1 bg-white/5" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {regionalNews.map(art => (
            <NewsCard key={art.id} article={art} variant="compact" />
          ))}
        </div>
      </section>

      {/* 🌍 ROW 4: GLOBAL FEED */}
      <section>
        <h2 className="text-[11px] font-black text-gray-500 mb-8 tracking-[0.4em] uppercase flex items-center gap-4">
          Global Stream <div className="h-[1px] flex-1 bg-white/5" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 opacity-60 hover:opacity-100 transition-opacity duration-500">
          {globalNews.map(art => (
            <NewsCard key={art.id} article={art} variant="compact" />
          ))}
        </div>
      </section>

    </div>
  );
}

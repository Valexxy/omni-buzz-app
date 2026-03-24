'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import NewsCard from '@/components/NewsCard';

export default function OmniBuzz() {
  const [news, setNews] = useState([]);
  const [location, setLocation] = useState("ABUJA");

  useEffect(() => {
    // 1. Get User GPS
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      
      // 2. Fetch News from Supabase
      const { data } = await supabase.from('news_articles').select('*').order('created_at', { ascending: false });
      setNews(data || []);
      
      // 3. Simple Reverse Geocode for Header
      const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
      const geo = await res.json();
      setLocation(geo.locality || "ABUJA");
    });
  }, []);

  return (
    <div className="bg-black min-h-screen text-white p-6">
      <header className="mb-12">
        <h1 className="text-6xl font-black italic italic tracking-tighter">
          LIVE IN <span className="text-green-500 underline">{location.toUpperCase()}</span>
        </h1>
        <p className="text-gray-500 font-mono text-[10px] mt-2 tracking-[0.5em]">GEOFENCED INTELLIGENCE FEED</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {news.map((art: any) => (
          <NewsCard key={art.id} article={art} variant="premium" />
        ))}
      </div>
    </div>
  );
}

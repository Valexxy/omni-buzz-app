'use client';

import React, { useState, useEffect } from 'react';

export default function MarketTicker() {
  const [marketData, setMarketData] = useState({
    rate: "Fetching...",
    city: "Detecting...",
    temp: "--",
  });

  useEffect(() => {
    // 🌍 Get GPS and Local Info
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      
      // Fetch City Name and Weather based on GPS
      const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
      const geoData = await geoRes.json();
      
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
      const weatherData = await weatherRes.json();

      // Fetch Live USD/NGN Rate
      const rateRes = await fetch('https://open.er-api.com/v6/latest/USD');
      const rateData = await rateRes.json();

      setMarketData({
        rate: `₦${rateData.rates.NGN.toFixed(2)}`,
        city: geoData.city || geoData.locality || "Unknown",
        temp: `${Math.round(weatherData.current_weather.temperature)}°C`,
      });
    });
  }, []);

  const tickerItems = [
    { label: "💵 USD/NGN", value: marketData.rate },
    { label: "📍 NODE", value: marketData.city.toUpperCase() },
    { label: "🌡️ LOCAL", value: marketData.temp },
    { label: "🕒 SYSTEM", value: new Date().toLocaleTimeString('en-NG') },
  ];

  return (
    <div className="w-full bg-black border-b border-green-900/40 py-1.5 overflow-hidden flex items-center z-[100] sticky top-0 backdrop-blur-md">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...tickerItems, ...tickerItems].map((item, i) => (
          <div key={i} className="flex items-center px-12 font-mono text-[10px]">
            <span className="text-gray-500 mr-2">{item.label}:</span>
            <span className="text-green-400 font-bold">{item.value}</span>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { display: flex; animation: marquee 25s linear infinite; }
      `}</style>
    </div>
  );
}

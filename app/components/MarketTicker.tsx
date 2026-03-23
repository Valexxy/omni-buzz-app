'use client'; // 👈 Essential for GPS and State

import React, { useState, useEffect } from 'react';

export default function MarketTicker() {
  const [data, setData] = useState({
    usdNgn: "Fetching...",
    weather: "Detecting...",
    location: "Abuja",
    fuel: "₦1,150", // Fuel APIs are often private; kept as "Static Reference"
  });

  useEffect(() => {
    // 🌍 1. Get GPS Location & Weather
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
          const weatherData = await res.json();
          setData(prev => ({ 
            ...prev, 
            weather: `${Math.round(weatherData.current_weather.temperature)}°C`,
            location: "LOCAL NODE" 
          }));
        } catch (err) { console.error("Weather failed"); }
      });
    }

    // 💵 2. Get Exchange Rate (Using a public exchange API)
    const fetchRates = async () => {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        const rateData = await res.json();
        const ngnRate = rateData.rates.NGN.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
        setData(prev => ({ ...prev, usdNgn: ngnRate }));
      } catch (err) { console.error("Rates failed"); }
    };

    fetchRates();
  }, []);

  const items = [
    { label: "💵 USD/NGN", value: data.usdNgn, trend: "up" },
    { label: "⛽ FUEL/L", value: data.fuel, trend: "stable" },
    { label: "🌍 GPS LOC", value: data.location, trend: "up" },
    { label: "🌡️ TEMP", value: data.weather, trend: "sunny" },
    { label: "⚡ OMNI-BUZZ", value: "LIVE", trend: "up" },
  ];

  return (
    <div className="w-full bg-black border-b border-green-900/40 py-1.5 overflow-hidden flex items-center shadow-lg z-[100] sticky top-0 backdrop-blur-md">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items].map((item, index) => (
          <div key={index} className="flex items-center px-10 font-mono text-[10px] md:text-xs">
            <span className="text-gray-500 mr-2 uppercase tracking-tighter">{item.label}:</span>
            <span className={`font-bold ${item.trend === 'up' ? 'text-green-400' : 'text-yellow-400'}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee { display: flex; animation: marquee 35s linear infinite; }
      `}</style>
    </div>
  );
}

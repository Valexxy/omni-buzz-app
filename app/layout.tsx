import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// 1. Import your Ticker component if you moved it to a separate file
// import MarketTicker from "@/components/MarketTicker"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OMNI-BUZZ | Abuja Merchant Intelligence",
  description: "Real-time news and market scouting for the modern merchant.",
};

// --- PASTE THE TICKER COMPONENT HERE IF NOT IMPORTED ---
const MarketTicker = () => {
  const rates = [
    { label: "💵 USD/NGN", value: "₦1,645.20", trend: "down" },
    { label: "📉 BTC/USD", value: "$64,210", trend: "up" },
    { label: "⛽ FUEL/L", value: "₦1,150", trend: "stable" },
    { label: "🌍 ABUJA", value: "32°C", trend: "sunny" },
    { label: "⚡ OMNI-SYSTEM", value: "SYNCED", trend: "up" },
  ];

  return (
    <div className="w-full bg-black border-b border-green-900/40 py-1.5 overflow-hidden flex items-center shadow-lg z-[100] sticky top-0 backdrop-blur-md">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...rates, ...rates].map((item, index) => (
          <div key={index} className="flex items-center px-10 font-mono text-[10px] md:text-xs">
            <span className="text-gray-500 mr-2 uppercase tracking-tighter">{item.label}:</span>
            <span className={`font-bold ${
              item.trend === 'up' ? 'text-green-400' : 
              item.trend === 'down' ? 'text-red-400' : 'text-yellow-400'
            }`}>
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
        .animate-marquee {
          display: flex;
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        {/* 🚀 TICKER SITS AT THE VERY TOP */}
        <MarketTicker />
        
        {/* 🏠 REST OF YOUR SITE CONTENT */}
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}

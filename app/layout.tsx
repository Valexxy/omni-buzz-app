import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StyledJsxRegistry from "./registry";
import MarketTicker from "@/components/MarketTicker"; // 👈 Import your new dynamic ticker

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OMNI-BUZZ | Abuja Merchant Intelligence",
  description: "Real-time news and market scouting for the modern merchant.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <StyledJsxRegistry>
          {/* 🚀 NOW FULLY DYNAMIC & GPS ENABLED */}
          <MarketTicker />
          <main className="min-h-screen">
            {children}
          </main>
        </StyledJsxRegistry>
      </body>
    </html>
  );
}

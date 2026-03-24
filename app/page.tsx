'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '@/lib/supabase';
import SmartHeader from '@/components/Header';
import NewsCard from '@/components/NewsCard';
import { Zap, RefreshCcw } from 'lucide-react';

export default function HomePage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function fetchMarketIntelligence() {
    setLoading(true);
    setErrorMsg(null);

    // Safeguard: Exit if keys aren't configured yet
    if (!supabaseConfig.url || !supabaseConfig.anonKey || supabaseConfig.url.includes('your-project')) {
      setErrorMsg("Uplink Offline: Configure Supabase Keys in Vercel.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);
      
      // Targeting your 11-column table
      const { data, error } = await supabase
        .from('news_articles') 
        .select('*')
        .order('created_at', { ascending: false })
        .limit(12);

      if (error) throw error;
      setArticles(data || []);
    } catch (err: any) {
      console.error('Data Fetch Error:', err);
      setErrorMsg(err.message || "Failed to sync with local node.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMarketIntelligence();
  }, []);

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-yellow-500/30">
      {/* Top Navigation & Status */}
      <SmartHeader locationName="Lagos, NG" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Dashboard Control Bar */}
        <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Zap className="text-yellow-500 fill-yellow-500 size-5" />
              Intelligence Feed
            </h1>
            <p className="text-gray-500 text-sm mt-1">Real-time logistics & merchant alerts</p>
          </div>
          
          <button 
            onClick={fetchMarketIntelligence}
            disabled={loading}
            className="flex items-center gap-2 text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 rounded-lg transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCcw className={`size-3 ${loading ? 'animate-spin' : ''}`} />
            Sync Node
          </button>
        </div>

        {/* Main Content Area */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-white/5 rounded-2xl border border-white/10" />
            ))}
          </div>
        ) : errorMsg ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-red-500/20 rounded-3xl bg-red-500/5">
            <p className="text-red-400 font-mono text-sm">{errorMsg}</p>
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-gray-500 italic">No activity detected in news_articles table.</p>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <footer className="mt-20 py-8 border-t border-white/5 text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600">
          Omni-Buzz System // {new Date().getFullYear()} // Secure Uplink
        </p>
      </footer>
    </main>
  );
}
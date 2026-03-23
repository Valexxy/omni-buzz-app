'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const CATEGORIES = ['ALL', 'NATIONAL', 'TECH', 'ECONOMY', 'SPORTS', 'CELEBRITY'];

export default function NewsDeck() {
  const [news, setNews] = useState<any[]>([]);
  const [filteredNews, setFilteredNews] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error) {
        setNews(data || []);
        setFilteredNews(data || []);
      }
      setLoading(false);
    };
    fetchNews();

    const subscription = supabase
      .channel('news_updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'news_articles' }, (payload) => {
        setNews((prev) => [payload.new, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(subscription); };
  }, []);

  // Handle Filtering Logic
  useEffect(() => {
    if (activeCategory === 'ALL') {
      setFilteredNews(news);
    } else {
      setFilteredNews(news.filter(item => item.category === activeCategory));
    }
  }, [activeCategory, news]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 animate-pulse">
      <div className="w-10 h-10 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4" />
      <span className="font-mono text-[10px] text-cyan-500 tracking-[0.5em] uppercase">Initialising Intelligence...</span>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 pb-20">
      
      {/* 🧭 CATEGORY FILTER BAR */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12 sticky top-6 z-40">
        <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/5 p-1.5 rounded-full flex gap-1 shadow-2xl">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-widest transition-all duration-300 ${
                activeCategory === cat 
                ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]' 
                : 'text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 📱 NEWS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredNews.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setSelectedArticle(item)}
            className="group relative bg-zinc-900/40 border border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-2xl hover:border-cyan-500/30 transition-all duration-500 cursor-pointer shadow-xl"
          >
            {item.image_url && (
              <div className="h-44 w-full overflow-hidden relative">
                <img src={item.image_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
              </div>
            )}
            
            <div className="p-7">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[8px] font-black tracking-[0.2em] text-cyan-500 uppercase px-2 py-0.5 border border-cyan-500/20 rounded">
                  {item.category}
                </span>
                <span className="h-px flex-1 bg-white/5" />
              </div>
              
              <h2 className="text-xl font-bold text-zinc-100 leading-tight mb-4 group-hover:text-white line-clamp-2">
                {item.title}
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2 font-light">
                {item.summary}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 🔍 MODAL VIEW */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl transition-all">
          <div className="relative bg-zinc-900 border border-white/10 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setSelectedArticle(null)}
              className="absolute top-8 right-8 z-10 text-zinc-500 hover:text-white font-mono text-[10px] uppercase"
            >
              [ Close ]
            </button>

            <div className="p-12">
              <span className="text-cyan-500 font-mono text-[10px] tracking-[0.4em] uppercase block mb-4">
                {selectedArticle.category} • Verified Signal
              </span>
              <h2 className="text-3xl font-black text-white leading-tight mb-8">
                {selectedArticle.title}
              </h2>
              <p className="text-zinc-400 text-lg leading-relaxed font-light mb-8">
                {selectedArticle.content || selectedArticle.summary}
              </p>
              <div className="pt-8 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-zinc-600">
                <span>ORACLE_NODE_ABUJA</span>
                <span>{new Date(selectedArticle.created_at).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
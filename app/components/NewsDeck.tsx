'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const CATEGORIES = ['ALL', 'NATIONAL', 'TECH', 'ECONOMY', 'SPORTS', 'CELEBRITY'];

// Helper for high-tech placeholder gradients
const getCategoryGradient = (cat: string) => {
  const gradients: Record<string, string> = {
    TECH: 'from-blue-600 to-cyan-500',
    ECONOMY: 'from-emerald-600 to-teal-400',
    NATIONAL: 'from-red-600 to-orange-500',
    SPORTS: 'from-purple-600 to-indigo-500',
    CELEBRITY: 'from-pink-600 to-rose-400',
  };
  return gradients[cat] || 'from-zinc-700 to-zinc-900';
};

export default function NewsDeck() {
  const [news, setNews] = useState<any[]>([]);
  const [filteredNews, setFilteredNews] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

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
    const interval = setInterval(fetchNews, 30000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setFilteredNews(activeCategory === 'ALL' ? news : news.filter(item => item.category === activeCategory));
  }, [activeCategory, news]);

  const unlockAdmin = () => {
    if (prompt("ENTER ORACLE ACCESS CODE:") === "ABUJA-2026") {
      setIsAdmin(true);
      alert("ADMIN MODE ACTIVE");
    }
  };

  const deleteArticle = async (id: string) => {
    if (confirm("Permanently delete this signal?")) {
      const { error } = await supabase.from('news_articles').delete().eq('id', id);
      if (!error) {
        setNews(news.filter(n => n.id !== id));
        setSelectedArticle(null);
      }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 animate-pulse">
      <div className="w-10 h-10 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4" />
      <span className="font-mono text-[10px] text-cyan-500 tracking-[0.5em] uppercase">Syncing Oracle Node...</span>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 pb-20">
      
      {/* 🧭 CATEGORY BAR */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12 sticky top-6 z-40">
        <div className="bg-zinc-900/80 backdrop-blur-2xl border border-white/5 p-1.5 rounded-full flex gap-1 shadow-2xl">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-widest transition-all duration-300 ${
                activeCategory === cat 
                ? 'bg-cyan-500 text-black' 
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
        {filteredNews.length > 0 ? (
          filteredNews.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setSelectedArticle(item)}
              className="group relative bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-2xl hover:border-cyan-500/40 transition-all duration-500 cursor-pointer"
            >
              {/* Image OR Smart Gradient Placeholder */}
              <div className="h-48 w-full relative overflow-hidden">
                {item.image_url ? (
                  <img src={item.image_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70" alt="" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${getCategoryGradient(item.category)} opacity-30 flex items-center justify-center`}>
                     <span className="text-[40px] font-black text-white/10 italic tracking-tighter">{item.category}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
              </div>
              
              <div className="p-8 -mt-12 relative z-10">
                <span className="text-[8px] font-black tracking-[0.3em] text-cyan-500 uppercase mb-4 block">{item.category}</span>
                <h2 className="text-xl font-bold text-white leading-tight mb-4 group-hover:text-cyan-400 transition-colors">
                  {item.title}
                </h2>
                <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">{item.summary}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 border border-dashed border-white/10 rounded-[3rem]">
            <p className="text-zinc-700 font-mono text-[10px] uppercase tracking-[0.5em]">Waiting for Intelligence Feed...</p>
          </div>
        )}
      </div>

      {/* 🔍 MODAL VIEW */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300">
          <div className="relative bg-zinc-900 border border-white/10 w-full max-w-2xl rounded-[3.5rem] overflow-hidden shadow-2xl">
            <button onClick={() => setSelectedArticle(null)} className="absolute top-8 right-8 z-10 text-zinc-600 hover:text-white font-mono text-[10px]">[ CLOSE ]</button>
            <div className="p-12">
              <span className="text-cyan-500 font-mono text-[10px] tracking-[0.4em] uppercase block mb-4">{selectedArticle.category} // SIGNAL_DETECTED</span>
              <h2 className="text-3xl font-black text-white leading-tight mb-8">{selectedArticle.title}</h2>
              <p className="text-zinc-400 text-lg leading-relaxed font-light mb-10">{selectedArticle.content || selectedArticle.summary}</p>
              
              <div className="pt-8 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-zinc-600">
                <button onClick={unlockAdmin} className="hover:text-cyan-400">ORACLE_NODE_ABUJA</button>
                <div className="flex gap-4 items-center">
                   {isAdmin && <button onClick={() => deleteArticle(selectedArticle.id)} className="text-red-500 font-bold">[ DELETE ]</button>}
                   <span>{new Date(selectedArticle.created_at).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

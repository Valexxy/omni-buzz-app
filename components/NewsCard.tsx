import React from 'react';

export default function NewsCard({ article }: { article: any }) {
  const isHighRisk = article.category?.includes("HIGH");

  return (
    <div className={`group relative bg-zinc-900/40 backdrop-blur-xl border ${isHighRisk ? 'border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 'border-white/10'} rounded-3xl p-6 transition-all duration-300 hover:bg-zinc-900/60 hover:border-white/20`}>
      {/* Dynamic Image with Gray-to-Color hover effect */}
      <div className="relative h-44 w-full overflow-hidden rounded-2xl mb-5">
        <img 
          src={article.image_url} 
          alt="Trade Intel"
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
        />
        {isHighRisk && (
           <div className="absolute top-3 right-3 bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded-md animate-pulse">
             CRITICAL_HUB
           </div>
        )}
      </div>
      
      <div className="flex justify-between items-center mb-3">
        <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-lg tracking-tighter ${isHighRisk ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
          {article.category || "GENERAL"}
        </span>
        <span className="text-[10px] text-zinc-600 font-mono">
          {new Date(article.created_at).toLocaleDateString('en-NG')}
        </span>
      </div>

      <h3 className="text-white font-extrabold text-xl leading-[1.1] uppercase tracking-tighter mb-3 group-hover:text-yellow-500 transition-colors">
        {article.title}
      </h3>
      
      <p className="text-zinc-400 text-xs font-light leading-relaxed line-clamp-3 mb-6">
        {article.content}
      </p>

      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[8px] text-zinc-500 uppercase tracking-widest">Surveillance Node</span>
          <span className="text-[10px] text-zinc-200 font-mono font-bold">{article.author_name}</span>
        </div>
        <a 
          href={article.source_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-white/5 hover:bg-white text-white hover:text-black text-[10px] font-bold px-4 py-2 rounded-full transition-all tracking-tighter"
        >
          VIEW_INTEL →
        </a>
      </div>
    </div>
  );
}
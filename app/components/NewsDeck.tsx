import React from 'react';

/**
 * 🛡️ OMNI-BUZZ INTELLIGENCE CARD
 * Optimized for 2026: AI-summaries and legal image credits.
 */
const NewsCard = ({ article }: { article: any }) => {
  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden hover:border-green-500/30 transition-all duration-300 group shadow-2xl">
      {/* 🖼️ Visual Signal Section */}
      <div className="relative h-56 w-full overflow-hidden">
        <img 
          src={article.image_url || 'https://images.unsplash.com/photo-1504711432869-efd597cdd045?q=80&w=2070'} 
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
        />
        
        {/* Floating Category Tag */}
        <div className="absolute top-4 left-4 bg-green-500/90 backdrop-blur-sm text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
          {article.category || "General"}
        </div>

        {/* 🛡️ Legal "Anti-Sue" Attribution */}
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-[8px] text-gray-400 px-2 py-1 rounded-md border border-white/10 italic">
          📸 via {article.image_credit || 'Global Oracle'}
        </div>
      </div>

      {/* 📝 Intelligence Section */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-white leading-snug mb-3 group-hover:text-green-400 transition-colors">
          {article.title}
        </h3>
        
        {/* 🧠 The AI-Generated Executive Summary */}
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 font-medium">
          {article.summary || "Processing intelligence signal..."}
        </p>

        {/* Card Footer */}
        <div className="mt-5 pt-4 border-t border-white/5 flex justify-between items-center">
          <span className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">
            {article.created_at ? new Date(article.created_at).toLocaleDateString('en-NG') : 'Recent'}
          </span>
          <button className="text-[10px] text-green-500 font-bold uppercase tracking-widest hover:underline">
            Read Intel →
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * 🛰️ MAIN NEWSDECK CONTAINER
 * Replace your existing NewsDeck component with this grid logic.
 */
const NewsDeck = ({ articles }: { articles: any[] }) => {
  if (!articles || articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-pulse text-green-500 font-mono">📡 SEARCHING FOR SIGNALS...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Grid Layout: 1 col on mobile, 2 on tablet, 3 on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default NewsDeck;

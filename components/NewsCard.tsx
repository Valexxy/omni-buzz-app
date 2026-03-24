{/* The Title */}
<h3 className="text-white font-bold leading-tight line-clamp-2 uppercase tracking-tighter text-lg mb-2">
  {article.title}
</h3>

{/* The Summary/Content */}
<p className="text-zinc-400 text-xs line-clamp-3 font-light leading-relaxed">
  {article.content} 
</p>
export default function NewsCard({ article }: { article: any }) {
  // Extract the Risk Level from the category or a dedicated column
  const isHighRisk = article.category?.includes("HIGH");

  return (
    <div className={`group relative bg-zinc-900/50 border ${isHighRisk ? 'border-red-500/50' : 'border-white/10'} rounded-3xl p-4 overflow-hidden`}>
      {/* 🖼️ Real Image from Supabase or Fallback */}
      <img 
        src={article.image_url || 'https://source.unsplash.com/featured/?lagos,logistics'} 
        className="w-full h-48 object-cover rounded-2xl grayscale group-hover:grayscale-0 transition-all"
      />
      
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${isHighRisk ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
            {article.category || "GENERAL"}
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">{new Date(article.created_at).toLocaleDateString()}</span>
        </div>

        {/* 🚨 This is the Fix for "PunchySummary" */}
        <h3 className="text-white font-bold leading-tight line-clamp-2 uppercase tracking-tighter text-lg">
          {article.title}
        </h3>
        
        <p className="text-zinc-400 text-xs mt-2 line-clamp-3 font-light">
          {article.content}
        </p>

        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
          <span className="text-[9px] text-zinc-500 tracking-widest uppercase">
            {article.author_name || "SYSTEM_NODE"}
          </span>
          <button className="text-white text-[10px] font-bold hover:text-yellow-500 transition-colors">
            INTEL_DETAILS →
          </button>
        </div>
      </div>
    </div>
  );
}
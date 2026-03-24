/**
 * 🛰️ OMNI-BUZZ "ORACLE-VIBE" CARD
 * Features: Visual hierarchy, glassmorphism, and dynamic sizing.
 */
const NewsCard = ({ article, variant = "compact" }: { article: any, variant?: "premium" | "compact" }) => {
  const isPremium = variant === "premium";

  return (
    <div className={`
      group relative bg-[#0a0a0a] rounded-[2rem] overflow-hidden transition-all duration-500
      ${isPremium ? 'border-2 border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.1)]' : 'border border-white/5 opacity-80 hover:opacity-100'}
      hover:translate-y-[-4px] hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)]
    `}>
      
      {/* 🖼️ Image Container */}
      <div className={`relative w-full overflow-hidden ${isPremium ? 'h-72' : 'h-44'}`}>
        <img 
          src={article.image_url || 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070'} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
          alt="Signal"
        />
        
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />

        {/* 🏷️ Status Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {isPremium && (
            <span className="bg-green-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">
              Local Intel
            </span>
          )}
          <span className="bg-white/10 backdrop-blur-md text-white/70 text-[9px] px-2 py-1 rounded-full uppercase font-bold border border-white/10">
            {article.category || 'Signal'}
          </span>
        </div>
      </div>

      {/* 📝 Content Area */}
      <div className={`p-6 ${isPremium ? 'pt-2' : 'pt-4'}`}>
        <h3 className={`font-black tracking-tight leading-tight mb-3 group-hover:text-green-400 transition-colors duration-300 ${isPremium ? 'text-2xl italic' : 'text-base'}`}>
          {article.title}
        </h3>
        
        <p className={`text-gray-400 font-medium leading-relaxed line-clamp-2 ${isPremium ? 'text-sm mb-6' : 'text-[11px] mb-4'}`}>
          {article.summary || "Decrypting incoming signal..."}
        </p>

        {/* 🛰️ Meta Info */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-green-500 to-emerald-900 border border-white/10" />
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
              {article.image_credit || 'Oracle Node'}
            </span>
          </div>
          <span className="text-[9px] font-bold text-gray-700 bg-white/5 px-2 py-1 rounded">
            {new Date(article.created_at).toLocaleDateString('en-NG')}
          </span>
        </div>
      </div>

      {/* 🎯 Interactive Glow (Hidden by default, shows on hover) */}
      <div className="absolute inset-0 border-2 border-green-500/0 group-hover:border-green-500/20 rounded-[2rem] pointer-events-none transition-all duration-500" />
    </div>
  );
};

export default NewsCard;

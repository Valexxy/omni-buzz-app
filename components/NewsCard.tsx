import { ArrowUpRight, Zap, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GenZPremiumCard({ article }: { article: any }) {
  // 💡 Safe Mapping logic for your news_articles table
  const title = article.title || article.headline || 'INTEL ALERT';
  const content = article.content || article.body || article.summary || '';
  const author = article.author_name || 'System';
  
  // Create an encrypted-style timestamp
  const date = article.created_at 
    ? new Date(article.created_at).toISOString().substring(11, 16) + 'z' // e.g., "14:09z"
    : 'SYS';

  // Define dynamic gradients based on common category keywords
  const categoryGradients = {
    Logistics: 'from-orange-500/20 via-yellow-500/5 to-transparent',
    Trade: 'from-emerald-500/20 via-blue-500/5 to-transparent',
    Security: 'from-red-500/20 via-zinc-500/5 to-transparent',
    Default: 'from-zinc-500/20 via-zinc-500/5 to-transparent',
  };

  const categoryLabel = article.category || 'General';
  const backgroundGradient = categoryGradients[categoryLabel] || categoryGradients.Default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5 }}
      className="group relative bg-[#0A0A0A] border border-white/[0.03] rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-white/10 hover:shadow-yellow-500/5"
    >
      {/* 🔮 GenZ Glassmorphism Hover Glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${backgroundGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

    
      {/* 🛑 Corner "Secure" Indicator */}
      <div className="absolute top-4 right-5 flex items-center gap-1.5 text-white/20 group-hover:text-yellow-500 transition-colors">
        <Zap className="size-3 fill-white/20 group-hover:fill-yellow-500 group-hover:animate-pulse transition-colors" />
        <span className="text-[10px] font-mono tracking-[0.2em]">{date}</span>
      </div>

      <div className="relative p-7 pt-12">
        {/* 1. Specialized Author Line (Monospace, Premium Feel) */}
        <div className="flex items-center gap-3 mb-6">
          <div className="size-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[11px] font-mono text-gray-500 group-hover:border-yellow-500 group-hover:text-white transition-colors">
            {author.substring(0, 3).toUpperCase()}
          </div>
          <p className="text-xs font-mono text-gray-400 tracking-wide">{author}</p>
        </div>

        {/* 2. Headline (Bold, tracking-tight, GenZ preference) */}
        <h3 className="text-xl md:text-2xl font-bold text-white leading-[1.2] tracking-tighter">
          {title}
        </h3>

        {/* 3. Content Body (Minimalism, line-clamp) */}
        <p className="text-gray-400 text-sm md:text-base mt-4 font-light leading-relaxed line-clamp-2 group-hover:text-white transition-colors">
          {content}
        </p>

        {/* 4. Action Area (Premium transitions, subtle details) */}
        <div className="mt-8 pt-6 border-t border-white/[0.04] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 group-hover:animate-pulse">
            <Target className="size-4 text-emerald-500" />
            <span className="text-[10px] uppercase font-semibold tracking-[0.15em] text-emerald-500">
              Verified Source
            </span>
          </div>

          <div className="relative">
            <button className="text-[11px] uppercase font-bold tracking-[0.25em] text-gray-500 transition-all duration-300 flex items-center gap-2 group-hover:tracking-[0.3em] group-hover:text-white">
              OPEN_FEED
            </button>
            <ArrowUpRight className="absolute -top-3 -right-4 size-3 text-yellow-500 scale-75 group-hover:scale-100 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
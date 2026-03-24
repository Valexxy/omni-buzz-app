'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase';
import SmartHeader from '@/components/Header';
import NewsCard from '@/components/NewsCard';

export default function HomePage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getNews() {
      const supabase = getSupabase();
      
      // If supabase isn't ready (build time), just stop here
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) setArticles(data);
      } catch (err) {
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    }
    getNews();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-4">
      <SmartHeader locationName="Lagos, NG" />
      
      {loading ? (
        <div className="flex justify-center mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-yellow-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {articles.length > 0 ? (
            articles.map((item) => (
              <NewsCard key={item.id} article={item} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'No news updates available yet.' : 'Configuration in progress...'}
            </p>
          )}
        </div>
      )}
    </main>
  );
}
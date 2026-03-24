'use client';

// This tells Vercel: "Don't try to load the database during the build."
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '@/lib/supabase';
import SmartHeader from '@/components/Header';
import NewsCard from '@/components/NewsCard';

export default function HomePage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getNews() {
      // Check if keys exist in the environment
      if (!supabaseConfig.url || !supabaseConfig.anonKey) {
        setLoading(false);
        return;
      }

      try {
        const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);
        
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
              {supabaseConfig.url ? 'No news updates available yet.' : 'Please add your Supabase keys to Vercel.'}
            </p>
          )}
        </div>
      )}
    </main>
  );
}
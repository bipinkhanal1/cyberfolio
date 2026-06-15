'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import { getPosts } from '@/lib/api';
import Link from 'next/link';
import { Clock, Calendar, Tag, Search } from 'lucide-react';
import { format } from 'date-fns';

export default function BlogPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const { data, isLoading } = useSWR(['blog', search, category], () =>
    getPosts({ search: search || undefined, category: category || undefined, limit: 12 })
  );

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-px bg-cyber-green" />
            <span className="font-mono text-xs text-cyber-green tracking-widest">KNOWLEDGE BASE</span>
          </div>
          <h1 className="font-display text-5xl font-bold text-white mb-4">
            Security <span className="gradient-text">Blog</span>
          </h1>
          <p className="text-gray-400 max-w-2xl">Deep dives into penetration testing techniques, vulnerability research, CTF writeups, and cybersecurity best practices.</p>
        </motion.div>

        {/* Search */}
        <div className="relative max-w-md mb-12">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-cyber pl-10"
          />
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass cyber-border rounded-xl h-72 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.posts?.map((post: any, i: number) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link href={`/blog/${post.slug}`} className="block project-card glass cyber-border rounded-xl overflow-hidden h-full hover:border-cyber-green/30">
                  {post.coverImage && (
                    <div className="h-44 overflow-hidden">
                      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover opacity-75 hover:opacity-90 transition-opacity" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-0.5 rounded text-xs font-mono bg-cyber-green/5 text-cyber-green border border-cyber-green/15">{post.category}</span>
                      {post.featured && <span className="text-xs font-mono text-yellow-400">★ Featured</span>}
                    </div>
                    <h3 className="font-bold text-white mb-2 leading-tight line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.publishedAt && format(new Date(post.publishedAt), 'MMM d, yyyy')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readingTime} min read
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {data?.posts?.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 font-mono">No articles found. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}

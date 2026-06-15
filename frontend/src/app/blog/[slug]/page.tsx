'use client';
import { use } from 'react';
import useSWR from 'swr';
import { getPost } from '@/lib/api';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Eye, Tag } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: post, isLoading } = useSWR(`post-${slug}`, () => getPost(slug));

  if (isLoading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-cyber-green/30 border-t-cyber-green rounded-full animate-spin" />
    </div>
  );

  if (!post) return (
    <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4">
      <h1 className="font-display text-4xl text-white">Post Not Found</h1>
      <Link href="/blog" className="btn-cyber">← Back to Blog</Link>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.article initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-mono text-gray-400 hover:text-cyber-green transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          {post.coverImage && (
            <div className="relative h-72 rounded-2xl overflow-hidden mb-8 glass border border-cyber-green/10">
              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover opacity-80" />
            </div>
          )}

          <div className="mb-8">
            <span className="px-3 py-1 rounded font-mono text-xs bg-cyber-green/5 text-cyber-green border border-cyber-green/15 mb-4 inline-block">
              {post.category}
            </span>
            <h1 className="font-display text-4xl font-bold text-white mb-4 leading-tight">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-mono">
              {post.publishedAt && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.readingTime} min read
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                {post.views} views
              </div>
            </div>
          </div>

          <div className="glass cyber-border rounded-2xl p-8 mb-8 prose prose-invert prose-sm max-w-none
            prose-headings:font-display prose-headings:text-white
            prose-a:text-cyber-green prose-a:no-underline hover:prose-a:underline
            prose-code:text-cyber-green prose-code:bg-cyber-dark-3 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-cyber-dark-3 prose-pre:border prose-pre:border-cyber-green/10"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags?.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Tag className="w-4 h-4 text-gray-500" />
              {post.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 rounded font-mono text-xs bg-cyber-green/5 text-cyber-green/70 border border-cyber-green/10">{tag}</span>
              ))}
            </div>
          )}
        </motion.article>
      </div>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Github, ExternalLink, Eye, Filter } from 'lucide-react';
import useSWR from 'swr';
import { getProjects } from '@/lib/api';
import Link from 'next/link';

const CATEGORIES = ['all', 'web-security', 'network', 'malware-analysis', 'ctf', 'tool', 'research', 'other'];

export default function PortfolioPage() {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useSWR(
    ['projects', category, search],
    () => getProjects({ category: category !== 'all' ? category : undefined, search: search || undefined, limit: 20 })
  );

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-px bg-cyber-green" />
            <span className="font-mono text-xs text-cyber-green tracking-widest">MY WORK</span>
          </div>
          <h1 className="font-display text-5xl font-bold text-white mb-4">
            Security <span className="gradient-text">Portfolio</span>
          </h1>
          <p className="text-gray-400 max-w-2xl">Research, tools, CVEs, and CTF writeups showcasing hands-on security expertise across multiple domains.</p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-cyber pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded font-mono text-xs transition-all ${
                  category === cat
                    ? 'bg-cyber-green text-cyber-dark font-bold'
                    : 'glass cyber-border text-gray-400 hover:text-white hover:border-cyber-green/30'
                }`}
              >
                {cat === 'all' ? 'All' : cat.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass cyber-border rounded-xl p-6 h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.projects?.map((project: any, i: number) => (
                <motion.div
                  key={project._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/portfolio/${project.slug}`} className="block project-card glass cyber-border rounded-xl overflow-hidden h-full hover:border-cyber-green/30">
                    {project.coverImage && (
                      <div className="h-40 bg-cyber-dark-3 overflow-hidden">
                        <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover opacity-70 hover:opacity-90 transition-opacity" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-mono ${
                          project.difficulty === 'expert' ? 'bg-red-500/15 text-red-400' :
                          project.difficulty === 'advanced' ? 'bg-orange-500/15 text-orange-400' :
                          project.difficulty === 'intermediate' ? 'bg-cyber-blue/10 text-cyber-blue' :
                          'bg-cyber-green/10 text-cyber-green'
                        }`}>{project.difficulty}</span>
                        <div className="flex gap-2">
                          {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="w-7 h-7 flex items-center justify-center glass rounded hover:border-cyber-green/40 transition-all">
                              <Github className="w-3 h-3 text-gray-400" />
                            </a>
                          )}
                          {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="w-7 h-7 flex items-center justify-center glass rounded hover:border-cyber-green/40 transition-all">
                              <ExternalLink className="w-3 h-3 text-gray-400" />
                            </a>
                          )}
                        </div>
                      </div>
                      <h3 className="font-bold text-white mb-2 leading-tight">{project.title}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-3">{project.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags?.slice(0, 4).map((tag: string) => (
                          <span key={tag} className="px-2 py-0.5 rounded text-xs font-mono bg-cyber-green/5 text-cyber-green/70 border border-cyber-green/10">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 mt-4 text-xs text-gray-500 font-mono">
                        <Eye className="w-3 h-3" /> {project.views} views
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {data?.projects?.length === 0 && (
          <div className="text-center py-20">
            <Filter className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 font-mono">No projects found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

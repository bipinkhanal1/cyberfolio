'use client';
import { use } from 'react';
import useSWR from 'swr';
import { getProject } from '@/lib/api';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Calendar, Tag, ArrowLeft, Eye } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: project, isLoading } = useSWR(`project-${slug}`, () => getProject(slug));

  if (isLoading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-cyber-green/30 border-t-cyber-green rounded-full animate-spin" />
    </div>
  );

  if (!project) return (
    <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4">
      <h1 className="font-display text-4xl text-white">Project Not Found</h1>
      <Link href="/portfolio" className="btn-cyber">← Back to Portfolio</Link>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/portfolio" className="inline-flex items-center gap-2 text-sm font-mono text-gray-400 hover:text-cyber-green transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Portfolio
          </Link>

          {/* Cover */}
          {project.coverImage && (
            <div className="relative h-64 rounded-2xl overflow-hidden mb-8 glass border border-cyber-green/10">
              <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover opacity-80" />
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded font-mono text-xs ${
                project.difficulty === 'expert' ? 'bg-red-500/15 text-red-400' :
                project.difficulty === 'advanced' ? 'bg-orange-500/15 text-orange-400' :
                'bg-cyber-blue/10 text-cyber-blue'
              }`}>{project.difficulty?.toUpperCase()}</span>
              <span className="px-3 py-1 rounded font-mono text-xs bg-cyber-green/5 text-cyber-green/70 border border-cyber-green/10">{project.category}</span>
              <div className="flex items-center gap-1 text-xs font-mono text-gray-500">
                <Eye className="w-3 h-3" /> {project.views} views
              </div>
            </div>

            <h1 className="font-display text-4xl font-bold text-white mb-4">{project.title}</h1>
            <p className="text-gray-300 text-lg leading-relaxed">{project.description}</p>
          </div>

          {/* Meta */}
          <div className="glass cyber-border rounded-xl p-6 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {project.completedAt && (
                <div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <Calendar className="w-3 h-3" /> Completed
                  </div>
                  <div className="text-sm text-white font-mono">{format(new Date(project.completedAt), 'MMM yyyy')}</div>
                </div>
              )}
              {project.technologies?.length > 0 && (
                <div className="col-span-2">
                  <div className="text-xs text-gray-500 mb-2">Technologies</div>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((t: string) => (
                      <span key={t} className="px-2 py-0.5 rounded text-xs font-mono bg-cyber-purple/10 text-cyber-purple border border-cyber-purple/20">{t}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-2">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-cyber-green hover:text-white transition-colors font-mono">
                    <Github className="w-4 h-4" /> Source Code
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-cyber-blue hover:text-white transition-colors font-mono">
                    <ExternalLink className="w-4 h-4" /> Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Long description */}
          {project.longDescription && (
            <div className="glass cyber-border rounded-xl p-8 mb-8 prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: project.longDescription }} />
          )}

          {/* Tags */}
          {project.tags?.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Tag className="w-4 h-4 text-gray-500" />
              {project.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 rounded font-mono text-xs bg-cyber-green/5 text-cyber-green/70 border border-cyber-green/10">{tag}</span>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

'use client';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import { getTestimonials } from '@/lib/api';

export default function TestimonialsPage() {
  const { data: testimonials } = useSWR('testimonials', () => getTestimonials());

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-px bg-cyber-green" />
            <span className="font-mono text-xs text-cyber-green tracking-widest">SOCIAL PROOF</span>
          </div>
          <h1 className="font-display text-5xl font-bold text-white mb-4">
            Client <span className="gradient-text">Testimonials</span>
          </h1>
          <p className="text-gray-400 max-w-2xl">What clients say about working with me on their security engagements.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials?.map((t: any, i: number) => (
            <motion.div key={t._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="glass cyber-border rounded-2xl p-7 hover:border-cyber-green/30 transition-all flex flex-col">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <span key={j} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-gray-300 leading-relaxed italic flex-1 mb-6">"{t.content}"</p>
              <div className="flex items-center gap-3 border-t border-cyber-green/10 pt-4">
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-cyber-green/20" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-cyber-dark-3 border border-cyber-green/20 flex items-center justify-center text-cyber-green font-bold text-sm">
                    {t.name[0]}
                  </div>
                )}
                <div>
                  <div className="font-bold text-white text-sm">{t.name}</div>
                  <div className="text-xs text-cyber-green">{t.title}{t.company && `, ${t.company}`}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

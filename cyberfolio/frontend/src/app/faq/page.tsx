'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';
import { getFAQs } from '@/lib/api';
import { ChevronDown } from 'lucide-react';

export default function FAQPage() {
  const { data: faqs } = useSWR('faqs', () => getFAQs());
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-px bg-cyber-green" />
            <span className="font-mono text-xs text-cyber-green tracking-widest">COMMON QUESTIONS</span>
          </div>
          <h1 className="font-display text-5xl font-bold text-white mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h1>
        </motion.div>
        <div className="space-y-3">
          {faqs?.map((faq: any, i: number) => (
            <motion.div key={faq._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <button onClick={() => setOpen(open === faq._id ? null : faq._id)}
                className={`w-full glass rounded-xl p-5 text-left flex items-start justify-between gap-4 transition-all ${open === faq._id ? 'border border-cyber-green/30' : 'cyber-border hover:border-cyber-green/20'}`}>
                <span className="font-medium text-white">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-cyber-green flex-shrink-0 transition-transform ${open === faq._id ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {open === faq._id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="px-5 py-4 text-gray-400 leading-relaxed text-sm border-l border-cyber-green/20 ml-5 mt-2">{faq.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

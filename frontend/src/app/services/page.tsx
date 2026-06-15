'use client';
import { motion } from 'framer-motion';
import { Shield, Globe, Network, Code, Lock, Eye, ChevronRight, Check } from 'lucide-react';
import useSWR from 'swr';
import { getServices } from '@/lib/api';
import Link from 'next/link';

const iconMap: Record<string, any> = {
  globe: Globe, network: Network, code: Code,
  'shield-x': Shield, lock: Lock, eye: Eye, shield: Shield,
};

export default function ServicesPage() {
  const { data: services } = useSWR('services', () => getServices());

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-8 h-px bg-cyber-green" />
            <span className="font-mono text-xs text-cyber-green tracking-widest">WHAT I OFFER</span>
            <span className="w-8 h-px bg-cyber-green" />
          </div>
          <h1 className="font-display text-5xl font-bold text-white mb-4">
            Security <span className="gradient-text">Services</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Comprehensive cybersecurity services tailored to protect your organization from evolving threats. All engagements include detailed reporting and remediation guidance.
          </p>
        </motion.div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {services?.map((service: any, i: number) => {
            const Icon = iconMap[service.icon] || Shield;
            return (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass cyber-border rounded-2xl p-8 hover:border-cyber-green/30 transition-all group"
              >
                <div className="flex items-start gap-5 mb-6">
                  <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-cyber-green/10 border border-cyber-green/20 flex-shrink-0 group-hover:bg-cyber-green/15 transition-colors">
                    <Icon className="w-7 h-7 text-cyber-green" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-white mb-1">{service.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{service.description}</p>
                  </div>
                </div>

                {service.features?.length > 0 && (
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feat: string, j: number) => (
                      <li key={j} className="flex items-center gap-3 text-sm text-gray-300">
                        <Check className="w-4 h-4 text-cyber-green flex-shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                )}

                <Link href="/contact" className="btn-cyber text-xs inline-flex items-center gap-2 mt-2">
                  Request Service <ChevronRight className="w-3 h-3" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Pricing */}
        {services?.some((s: any) => s.pricing?.basic?.price) && (
          <div className="mb-24">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl font-bold text-white mb-4">
                Transparent <span className="gradient-text">Pricing</span>
              </h2>
              <p className="text-gray-400">Select the package that best fits your security needs</p>
            </div>

            {services?.filter((s: any) => s.pricing?.standard?.price).slice(0, 1).map((service: any) => (
              <div key={service._id} className="grid md:grid-cols-3 gap-6">
                {['basic', 'standard', 'premium'].map(tier => {
                  const plan = service.pricing[tier];
                  if (!plan?.price) return null;
                  return (
                    <motion.div
                      key={tier}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className={`glass rounded-2xl p-8 relative ${plan.highlighted ? 'border border-cyber-green/40' : 'cyber-border'}`}
                    >
                      {plan.highlighted && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyber-green text-cyber-dark text-xs font-bold font-mono rounded-full">
                          MOST POPULAR
                        </div>
                      )}
                      <div className="mb-6">
                        <h3 className="font-display text-lg font-bold text-white mb-2">{plan.name}</h3>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold text-cyber-green">${plan.price?.toLocaleString()}</span>
                          <span className="text-gray-500 text-sm">/{plan.period}</span>
                        </div>
                      </div>
                      <ul className="space-y-3 mb-8">
                        {plan.features?.map((f: string, i: number) => (
                          <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                            <Check className="w-4 h-4 text-cyber-green flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <Link href="/contact" className={`block text-center py-3 px-6 rounded font-mono text-sm transition-all ${plan.highlighted ? 'btn-cyber-filled btn-cyber' : 'btn-cyber'}`}>
                        Get Started
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass border border-cyber-green/20 rounded-2xl p-12 text-center"
        >
          <h2 className="font-display text-3xl font-bold text-white mb-4">Need a Custom Solution?</h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">Every organization has unique security requirements. Let's discuss a tailored engagement that fits your specific needs and budget.</p>
          <Link href="/contact" className="btn-cyber-filled btn-cyber inline-flex items-center gap-2">
            Schedule a Consultation <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

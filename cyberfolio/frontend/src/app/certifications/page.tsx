'use client';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import { getCertifications } from '@/lib/api';
import { Award, ExternalLink, Calendar, Shield } from 'lucide-react';
import { format } from 'date-fns';

export default function CertificationsPage() {
  const { data: certs } = useSWR('certifications', () => getCertifications());

  const categoryColors: Record<string, string> = {
    offensive: 'text-red-400 border-red-400/20 bg-red-400/5',
    defensive: 'text-cyber-blue border-cyber-blue/20 bg-cyber-blue/5',
    cloud: 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5',
    network: 'text-cyber-green border-cyber-green/20 bg-cyber-green/5',
    compliance: 'text-cyber-purple border-cyber-purple/20 bg-cyber-purple/5',
    other: 'text-gray-400 border-gray-400/20 bg-gray-400/5',
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-px bg-cyber-green" />
            <span className="font-mono text-xs text-cyber-green tracking-widest">CREDENTIALS</span>
          </div>
          <h1 className="font-display text-5xl font-bold text-white mb-4">
            Certifications & <span className="gradient-text">Credentials</span>
          </h1>
          <p className="text-gray-400 max-w-2xl">Industry-recognized certifications validating expertise across offensive security, defensive operations, and cloud security domains.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs?.map((cert: any, i: number) => (
            <motion.div
              key={cert._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass cyber-border rounded-2xl p-6 hover:border-cyber-green/30 transition-all group relative overflow-hidden"
            >
              {cert.featured && (
                <div className="absolute top-4 right-4">
                  <span className="px-2 py-0.5 rounded text-xs font-mono bg-cyber-green/10 text-cyber-green border border-cyber-green/20">Featured</span>
                </div>
              )}

              <div className="w-16 h-16 flex items-center justify-center rounded-xl glass border border-cyber-green/20 mb-5 group-hover:border-cyber-green/40 transition-colors">
                {cert.image ? (
                  <img src={cert.image} alt={cert.name} className="w-12 h-12 object-contain" />
                ) : (
                  <Award className="w-8 h-8 text-cyber-green" />
                )}
              </div>

              <h3 className="font-bold text-white mb-1 leading-tight">{cert.name}</h3>
              <p className="text-cyber-green text-sm font-mono mb-3">{cert.issuer}</p>

              <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono border mb-4 ${categoryColors[cert.category] || categoryColors.other}`}>
                <Shield className="w-3 h-3" />
                {cert.category}
              </div>

              <div className="space-y-1.5 text-xs text-gray-500 font-mono">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  Issued: {format(new Date(cert.issueDate), 'MMM yyyy')}
                </div>
                {cert.expiryDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    Expires: {format(new Date(cert.expiryDate), 'MMM yyyy')}
                  </div>
                )}
                {cert.credentialId && (
                  <div className="text-gray-600">ID: {cert.credentialId}</div>
                )}
              </div>

              {cert.credentialUrl && (
                <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer"
                  className="mt-4 flex items-center gap-2 text-xs font-mono text-cyber-blue hover:text-white transition-colors">
                  <ExternalLink className="w-3 h-3" /> Verify Credential
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

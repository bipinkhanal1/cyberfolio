'use client';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import { getProfile, getCertifications, getSkills } from '@/lib/api';
import { Download, Shield } from 'lucide-react';

export default function ResumePage() {
  const { data: profile } = useSWR('profile', () => getProfile());
  const { data: certs } = useSWR('certifications', () => getCertifications());
  const { data: skillsData } = useSWR('skills', () => getSkills());

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-display text-4xl font-bold text-white">Resume</h1>
            {profile?.resumeUrl && (
              <a href={profile.resumeUrl} download className="btn-cyber inline-flex items-center gap-2">
                <Download className="w-4 h-4" /> Download PDF
              </a>
            )}
          </div>
        </motion.div>

        <div className="glass cyber-border rounded-2xl p-10 space-y-10">
          <div className="border-b border-cyber-green/10 pb-8">
            <h2 className="font-display text-3xl font-bold text-white mb-1">{profile?.name}</h2>
            <p className="text-cyber-green font-mono mb-3">{profile?.title}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-400 font-mono">
              {profile?.email && <span>{profile.email}</span>}
              {profile?.location && <span>{profile.location}</span>}
            </div>
          </div>

          {profile?.bio && (
            <div>
              <h3 className="font-display text-lg font-bold text-white mb-3">Professional Summary</h3>
              <p className="text-gray-300 leading-relaxed text-sm">{profile.bio}</p>
            </div>
          )}

          {skillsData?.grouped && (
            <div>
              <h3 className="font-display text-lg font-bold text-white mb-4">Technical Skills</h3>
              <div className="space-y-3">
                {Object.entries(skillsData.grouped).map(([cat, skills]: [string, any]) => (
                  <div key={cat} className="flex gap-4 text-sm">
                    <span className="text-cyber-green font-mono flex-shrink-0 w-44">{cat}:</span>
                    <span className="text-gray-300">{skills.map((s: any) => s.name).join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {certs && certs.length > 0 && (
            <div>
              <h3 className="font-display text-lg font-bold text-white mb-4">Certifications</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {certs.map((cert: any) => (
                  <div key={cert._id} className="flex items-center gap-3 text-sm">
                    <Shield className="w-4 h-4 text-cyber-green flex-shrink-0" />
                    <span className="text-white">{cert.name}</span>
                    <span className="text-gray-500">— {cert.issuer}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

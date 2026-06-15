'use client';
import { motion } from 'framer-motion';
import { Shield, Terminal, MapPin, Mail, Calendar, Briefcase, Award, Code } from 'lucide-react';
import useSWR from 'swr';
import { getProfile, getSkills, getCertifications } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  const { data: profile } = useSWR('profile', () => getProfile());
  const { data: skillsData } = useSWR('skills', () => getSkills());
  const { data: certs } = useSWR('certifications', () => getCertifications());

  const timeline = [
    { year: '2023–Now', role: 'Senior Penetration Tester', company: 'Independent / Bug Bounty', desc: 'Leading complex red team engagements and discovering critical vulnerabilities across Fortune 500 clients.' },
    { year: '2021–2023', role: 'Penetration Tester', company: 'CyberSec Agency', desc: 'Conducted 100+ web application and network penetration tests. Disclosed multiple high-severity CVEs.' },
    { year: '2019–2021', role: 'Junior Security Analyst', company: 'Tech Corp', desc: 'Started career in defensive security, threat hunting, and SIEM management before pivoting to offensive.' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-20">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-px bg-cyber-green" />
            <span className="font-mono text-xs text-cyber-green tracking-widest">ABOUT ME</span>
          </div>
          <h1 className="font-display text-5xl font-bold text-white mb-6">
            The <span className="gradient-text">Hacker</span> Behind the Screen
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12 mb-24">
          {/* Avatar */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-1">
            <div className="glass cyber-border rounded-2xl p-8 text-center mb-6">
              <div className="relative w-32 h-32 mx-auto mb-5">
                {profile?.avatar ? (
                  <Image src={profile.avatar} alt={profile.name} fill className="rounded-full object-cover border-2 border-cyber-green/30" />
                ) : (
                  <div className="w-full h-full rounded-full bg-cyber-dark-3 border-2 border-cyber-green/30 flex items-center justify-center">
                    <Shield className="w-16 h-16 text-cyber-green/40" />
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-cyber-green rounded-full border-2 border-cyber-dark animate-pulse" />
              </div>
              <h2 className="font-display text-xl font-bold text-white mb-1">{profile?.name}</h2>
              <p className="text-cyber-green text-sm font-mono mb-4">{profile?.title}</p>

              <div className="space-y-3 text-left mt-6">
                {profile?.location && (
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <MapPin className="w-4 h-4 text-cyber-green flex-shrink-0" />
                    {profile.location}
                  </div>
                )}
                {profile?.email && (
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <Mail className="w-4 h-4 text-cyber-green flex-shrink-0" />
                    <a href={`mailto:${profile.email}`} className="hover:text-white transition-colors">{profile.email}</a>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Briefcase className="w-4 h-4 text-cyber-green flex-shrink-0" />
                  <span className={`${profile?.availability === 'available' ? 'text-cyber-green' : 'text-red-400'}`}>
                    {profile?.availability === 'available' ? 'Available for work' : 'Not currently available'}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link href="/contact" className="btn-cyber w-full text-center block">
                  Get In Touch
                </Link>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Years Exp.', value: profile?.yearsExperience || '7+', color: 'text-cyber-green' },
                { label: 'Projects', value: `${profile?.projectsCompleted || 150}+`, color: 'text-cyber-blue' },
                { label: 'Clients', value: `${profile?.clientsSatisfied || 80}+`, color: 'text-cyber-purple' },
                { label: 'Certs', value: `${certs?.length || 8}`, color: 'text-yellow-400' },
              ].map(stat => (
                <div key={stat.label} className="glass cyber-border rounded-xl p-4 text-center">
                  <div className={`font-display text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                  <div className="text-xs text-gray-500 font-mono">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bio + timeline */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="lg:col-span-2">
            <div className="glass cyber-border rounded-2xl p-8 mb-8">
              <div className="flex items-center gap-2 mb-6">
                <Terminal className="w-5 h-5 text-cyber-green" />
                <h3 className="font-display text-lg font-bold text-white">Biography</h3>
              </div>
              <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed">
                {profile?.bio?.split('\n').map((p: string, i: number) => (
                  <p key={i} className="mb-4 last:mb-0">{p}</p>
                )) || (
                  <>
                    <p className="mb-4">I'm a passionate cybersecurity professional with {profile?.yearsExperience || '7'}+ years of experience specializing in offensive security, vulnerability research, and red team operations. My journey began in defensive security before I discovered my true calling in breaking systems.</p>
                    <p className="mb-4">I've had the privilege of working with organizations across fintech, healthcare, e-commerce, and government sectors to identify and remediate critical security vulnerabilities before malicious actors can exploit them.</p>
                    <p>When I'm not pentesting, I contribute to the security community through CTF competitions, bug bounty programs, and publishing research on emerging attack techniques.</p>
                  </>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="glass cyber-border rounded-2xl p-8">
              <div className="flex items-center gap-2 mb-8">
                <Calendar className="w-5 h-5 text-cyber-green" />
                <h3 className="font-display text-lg font-bold text-white">Experience Timeline</h3>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-cyber-green/20" />
                <div className="space-y-8">
                  {timeline.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="relative pl-12"
                    >
                      <div className="absolute left-2 top-1 w-4 h-4 rounded-full border-2 border-cyber-green bg-cyber-dark" />
                      <div className="font-mono text-xs text-cyber-green mb-1">{item.year}</div>
                      <h4 className="font-bold text-white mb-0.5">{item.role}</h4>
                      <div className="text-sm text-cyber-blue mb-2">{item.company}</div>
                      <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Top Skills Preview */}
        {skillsData?.skills?.length > 0 && (
          <div className="mb-24">
            <div className="flex items-end justify-between mb-10">
              <h2 className="font-display text-3xl font-bold text-white">Core <span className="gradient-text">Expertise</span></h2>
              <Link href="/skills" className="text-sm font-mono text-cyber-green hover:text-white transition-colors">View all →</Link>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {skillsData.skills.slice(0, 8).map((skill: any, i: number) => (
                <motion.div
                  key={skill._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="glass cyber-border rounded-xl p-4"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-white">{skill.name}</span>
                    <span className="font-mono text-xs text-cyber-green">{skill.proficiency}%</span>
                  </div>
                  <div className="skill-bar">
                    <motion.div
                      className="skill-fill"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.proficiency}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: i * 0.05 }}
                    />
                  </div>
                  <div className="mt-2 text-xs font-mono text-gray-500">{skill.category}</div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

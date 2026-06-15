'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Terminal, ChevronRight, ArrowRight, Download, Github, Linkedin,
         Globe, Award, Code, Users, Zap, Lock, Eye, AlertTriangle } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import useSWR from 'swr';
import { getProfile, getProjects, getServices, getTestimonials } from '@/lib/api';
import LoadingScreen from '@/components/animations/LoadingScreen';

const fetcher = (fn: () => Promise<any>) => fn();

// Typing animation hook
function useTyping(words: string[], speed = 80, pause = 2000) {
  const [displayed, setDisplayed] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (charIdx < current.length) {
          setDisplayed(current.slice(0, charIdx + 1));
          setCharIdx(c => c + 1);
        } else {
          setTimeout(() => setDeleting(true), pause);
        }
      } else {
        if (charIdx > 0) {
          setDisplayed(current.slice(0, charIdx - 1));
          setCharIdx(c => c - 1);
        } else {
          setDeleting(false);
          setWordIdx(w => (w + 1) % words.length);
        }
      }
    }, deleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return displayed;
}

// Counter animation
function AnimatedCounter({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setCount(value); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value, duration]);

  return <span ref={ref}>{count}</span>;
}

export default function HomePage() {
  const { data: profile } = useSWR('profile', () => getProfile());
  const { data: projectsData } = useSWR('projects-featured', () => getProjects({ featured: 'true', limit: 3 }));
  const { data: services } = useSWR('services', () => getServices());
  const { data: testimonials } = useSWR('testimonials', () => getTestimonials());

  const titles = [
    'Penetration Tester',
    'Security Researcher',
    'Red Team Operator',
    'Bug Hunter',
    'CTF Player',
  ];
  const typedTitle = useTyping(titles);

  const stats = [
    { icon: Shield, label: 'CVEs Discovered', value: 12, suffix: '+', color: 'text-cyber-green' },
    { icon: Code, label: 'Projects Completed', value: profile?.projectsCompleted || 150, suffix: '+', color: 'text-cyber-blue' },
    { icon: Users, label: 'Clients Satisfied', value: profile?.clientsSatisfied || 80, suffix: '+', color: 'text-cyber-purple' },
    { icon: Award, label: 'Certifications', value: 8, suffix: '', color: 'text-yellow-400' },
  ];

  return (
    <>
      <LoadingScreen />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Grid */}
        <div className="absolute inset-0 bg-grid opacity-20" />

        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyber-green/3 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - text */}
            <div>
              {/* Status badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass cyber-border mb-8"
              >
                <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
                <span className="font-mono text-xs text-cyber-green tracking-wider">
                  {profile?.availability === 'available' ? 'AVAILABLE FOR HIRE' : 'CURRENTLY BUSY'}
                </span>
              </motion.div>

              {/* Name */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 leading-tight"
              >
                <span className="text-white">{profile?.name || 'Alex Cipher'}</span>
              </motion.h1>

              {/* Typing title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl sm:text-3xl font-mono mb-6 h-12 flex items-center"
              >
                <span className="text-cyber-green">&gt;</span>
                <span className="ml-2 text-gray-300">{typedTitle}</span>
                <span className="ml-1 text-cyber-green animate-blink">_</span>
              </motion.div>

              {/* Bio */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-400 text-lg leading-relaxed mb-8 max-w-lg"
              >
                {profile?.shortBio || 'Passionate about breaking systems to make them stronger. Specializing in penetration testing, vulnerability research, and red team operations.'}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4 mb-10"
              >
                <Link href="/contact" className="btn-cyber-filled btn-cyber inline-flex items-center gap-2">
                  <span>Hire Me</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/portfolio" className="btn-cyber inline-flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>View Work</span>
                </Link>
                {profile?.resumeUrl && (
                  <a href={profile.resumeUrl} download className="btn-cyber inline-flex items-center gap-2 border-cyber-blue/50 text-cyber-blue hover:border-cyber-blue">
                    <Download className="w-4 h-4" />
                    <span>Resume</span>
                  </a>
                )}
              </motion.div>

              {/* Socials */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex items-center gap-4"
              >
                {profile?.socialLinks?.github && (
                  <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center glass cyber-border rounded hover:border-cyber-green/50 transition-all group">
                    <Github className="w-4 h-4 text-gray-400 group-hover:text-cyber-green transition-colors" />
                  </a>
                )}
                {profile?.socialLinks?.linkedin && (
                  <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center glass cyber-border rounded hover:border-cyber-blue/50 transition-all group">
                    <Linkedin className="w-4 h-4 text-gray-400 group-hover:text-cyber-blue transition-colors" />
                  </a>
                )}
                {profile?.socialLinks?.hackerone && (
                  <a href={profile.socialLinks.hackerone} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center glass cyber-border rounded hover:border-red-500/50 transition-all group">
                    <AlertTriangle className="w-4 h-4 text-gray-400 group-hover:text-red-400 transition-colors" />
                  </a>
                )}
                {profile?.socialLinks?.website && (
                  <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center glass cyber-border rounded hover:border-cyber-purple/50 transition-all group">
                    <Globe className="w-4 h-4 text-gray-400 group-hover:text-cyber-purple transition-colors" />
                  </a>
                )}
              </motion.div>
            </div>

            {/* Right - hex avatar / visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative w-80 h-80">
                {/* Rotating rings */}
                {[280, 320, 360].map((size, i) => (
                  <motion.div
                    key={size}
                    animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                    transition={{ duration: 20 + i * 5, repeat: Infinity, ease: 'linear' }}
                    className="absolute top-1/2 left-1/2 rounded-full border border-cyber-green/10"
                    style={{ width: size, height: size, marginLeft: -size/2, marginTop: -size/2 }}
                  >
                    <div
                      className="absolute top-0 left-1/2 w-3 h-3 rounded-full bg-cyber-green"
                      style={{ marginLeft: -6, marginTop: -6 }}
                    />
                  </motion.div>
                ))}

                {/* Central badge */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-48 h-48 glass border border-cyber-green/20 rounded-2xl flex flex-col items-center justify-center p-6 animate-float"
                    style={{ boxShadow: '0 0 40px rgba(0,255,136,0.1)' }}>
                    <Terminal className="w-16 h-16 text-cyber-green mb-3" />
                    <div className="font-mono text-xs text-cyber-green/70 text-center">
                      <div>root@cyberfolio:~$</div>
                      <div className="text-cyber-green">whoami</div>
                      <motion.div
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >{profile?.title?.split(' ')[0] || 'Hacker'}</motion.div>
                    </div>
                  </div>
                </div>

                {/* Corner badges */}
                {[
                  { label: 'OSCP', top: '5%', right: '5%', color: 'text-cyber-green' },
                  { label: 'CEH', bottom: '15%', left: '0%', color: 'text-cyber-blue' },
                  { label: 'AWS', top: '40%', right: '-5%', color: 'text-yellow-400' },
                ].map(badge => (
                  <div
                    key={badge.label}
                    className={`absolute glass border border-current/20 rounded px-2 py-1 font-mono text-xs font-bold ${badge.color}`}
                    style={{ top: badge.top, right: badge.right, bottom: badge.bottom, left: badge.left }}
                  >
                    {badge.label}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col items-center gap-2 mt-16"
          >
            <span className="font-mono text-xs text-gray-500 tracking-wider">SCROLL DOWN</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-px h-12 bg-gradient-to-b from-cyber-green/50 to-transparent"
            />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 border-t border-b border-cyber-green/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl glass cyber-border mb-4 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={`font-display text-4xl font-bold mb-1 ${stat.color}`}>
                  <AnimatedCounter value={stat.value} />
                  {stat.suffix}
                </div>
                <div className="text-sm text-gray-500 font-mono">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {projectsData?.projects?.length > 0 && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-16">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-px bg-cyber-green" />
                  <span className="font-mono text-xs text-cyber-green tracking-widest uppercase">Featured Work</span>
                </div>
                <h2 className="font-display text-4xl font-bold text-white">
                  Recent <span className="gradient-text">Projects</span>
                </h2>
              </div>
              <Link href="/portfolio" className="hidden md:flex items-center gap-2 text-sm font-mono text-cyber-green hover:text-white transition-colors">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {projectsData.projects.map((project: any, i: number) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={`/portfolio/${project.slug}`} className="block project-card glass cyber-border rounded-xl p-6 h-full hover:border-cyber-green/40">
                    <div className="flex items-start justify-between mb-4">
                      <span className={`px-2 py-1 rounded text-xs font-mono ${
                        project.difficulty === 'expert' ? 'bg-red-500/15 text-red-400' :
                        project.difficulty === 'advanced' ? 'bg-orange-500/15 text-orange-400' :
                        'bg-cyber-blue/10 text-cyber-blue'
                      }`}>
                        {project.difficulty?.toUpperCase()}
                      </span>
                      <span className="text-xs font-mono text-gray-500">{project.category}</span>
                    </div>
                    <h3 className="font-bold text-white mb-3 leading-tight">{project.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-3">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags?.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="px-2 py-0.5 rounded text-xs font-mono bg-cyber-green/5 text-cyber-green/70 border border-cyber-green/10">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services preview */}
      {services?.length > 0 && (
        <section className="py-24 bg-cyber-dark-2/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="w-8 h-px bg-cyber-green" />
                <span className="font-mono text-xs text-cyber-green tracking-widest uppercase">What I Do</span>
                <span className="w-8 h-px bg-cyber-green" />
              </div>
              <h2 className="font-display text-4xl font-bold text-white">
                Security <span className="gradient-text">Services</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.slice(0, 4).map((service: any, i: number) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass cyber-border rounded-xl p-6 hover:border-cyber-green/30 transition-all group"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-cyber-green/10 border border-cyber-green/20 mb-5 group-hover:bg-cyber-green/15 transition-colors">
                    <Lock className="w-6 h-6 text-cyber-green" />
                  </div>
                  <h3 className="font-bold text-white mb-2">{service.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{service.description.slice(0, 100)}...</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/services" className="btn-cyber inline-flex items-center gap-2">
                View All Services <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials?.length > 0 && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl font-bold text-white">
                Client <span className="gradient-text">Testimonials</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.slice(0, 3).map((t: any, i: number) => (
                <motion.div
                  key={t._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass cyber-border rounded-xl p-6"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <span key={j} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-gray-300 leading-relaxed mb-6 italic">"{t.content}"</p>
                  <div>
                    <div className="font-bold text-white">{t.name}</div>
                    <div className="text-sm text-cyber-green">{t.title}{t.company && `, ${t.company}`}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass border border-cyber-green/20 rounded-2xl p-12 text-center relative overflow-hidden"
            style={{ boxShadow: '0 0 80px rgba(0,255,136,0.05)' }}
          >
            <div className="absolute inset-0 bg-grid opacity-10" />
            <div className="relative z-10">
              <Shield className="w-16 h-16 text-cyber-green mx-auto mb-6 animate-float" />
              <h2 className="font-display text-4xl font-bold text-white mb-4">
                Ready to Secure Your <span className="gradient-text">Digital Assets?</span>
              </h2>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                Let's discuss your security requirements and how I can help protect your organization from evolving threats.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/contact" className="btn-cyber-filled btn-cyber inline-flex items-center gap-2">
                  Start a Project <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/services" className="btn-cyber inline-flex items-center gap-2">
                  View Services
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

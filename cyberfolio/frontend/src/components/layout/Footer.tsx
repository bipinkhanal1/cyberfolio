'use client';
import Link from 'next/link';
import { Shield, Github, Linkedin, Twitter, Globe, Terminal, Mail, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import { getProfile } from '@/lib/api';

export default function Footer() {
  const { data: profile } = useSWR('profile', () => getProfile());
  const year = new Date().getFullYear();

  const links = {
    Navigation: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Services', href: '/services' },
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' },
    ],
    Resources: [
      { label: 'Certifications', href: '/certifications' },
      { label: 'Skills', href: '/skills' },
      { label: 'Testimonials', href: '/testimonials' },
      { label: 'Resume', href: '/resume' },
      { label: 'FAQ', href: '/faq' },
    ],
  };

  const socials = [
    { icon: Github, href: profile?.socialLinks?.github, label: 'GitHub' },
    { icon: Linkedin, href: profile?.socialLinks?.linkedin, label: 'LinkedIn' },
    { icon: Twitter, href: profile?.socialLinks?.twitter, label: 'Twitter' },
    { icon: Globe, href: profile?.socialLinks?.hackerone, label: 'HackerOne' },
  ].filter(s => s.href);

  return (
    <footer className="relative border-t border-cyber-green/10 bg-cyber-dark-2/50 mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 flex items-center justify-center border border-cyber-green/40 rounded-lg bg-cyber-dark">
                <Shield className="w-5 h-5 text-cyber-green" />
              </div>
              <span className="font-display text-xl font-bold text-white tracking-wider">
                CYBER<span className="text-cyber-green">FOLIO</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              {profile?.shortBio || 'Professional cybersecurity portfolio showcasing penetration testing, security research, and red team operations.'}
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
              <Mail className="w-4 h-4 text-cyber-green" />
              <a href={`mailto:${profile?.email}`} className="hover:text-cyber-green transition-colors font-mono">
                {profile?.email || 'contact@cyberfolio.dev'}
              </a>
            </div>
            {profile?.location && (
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <MapPin className="w-4 h-4 text-cyber-green" />
                <span>{profile.location}</span>
              </div>
            )}
            <div className="flex items-center gap-3 mt-6">
              {socials.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center glass cyber-border rounded hover:border-cyber-green/40 transition-all group">
                  <s.icon className="w-4 h-4 text-gray-400 group-hover:text-cyber-green transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4 className="font-mono text-xs text-cyber-green tracking-widest uppercase mb-5">{group}</h4>
              <ul className="space-y-3">
                {items.map(item => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                      <span className="w-0 h-px bg-cyber-green transition-all group-hover:w-4" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-cyber-green/8 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-gray-600">
            © {year} {profile?.name || 'CyberFolio'}. All rights reserved.
          </p>
          <div className="flex items-center gap-2 font-mono text-xs text-gray-600">
            <Terminal className="w-3 h-3 text-cyber-green" />
            <span>Built with <span className="text-cyber-green">Next.js</span> + <span className="text-cyber-blue">Node.js</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
}

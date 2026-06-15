'use client';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import { getSkills } from '@/lib/api';

export default function SkillsPage() {
  const { data } = useSWR('skills', () => getSkills());

  const categoryColors: Record<string, string> = {
    'Offensive Security': 'from-cyber-green to-cyber-blue',
    'Defensive Security': 'from-cyber-blue to-cyber-purple',
    'Programming': 'from-cyber-purple to-cyber-green',
    'Cloud Security': 'from-yellow-400 to-cyber-green',
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-px bg-cyber-green" />
            <span className="font-mono text-xs text-cyber-green tracking-widest">TECHNICAL ARSENAL</span>
          </div>
          <h1 className="font-display text-5xl font-bold text-white mb-4">
            Skills & <span className="gradient-text">Expertise</span>
          </h1>
          <p className="text-gray-400 max-w-2xl">A comprehensive overview of my technical skill set across offensive security, defensive operations, programming, and cloud security.</p>
        </motion.div>

        {data?.grouped && Object.entries(data.grouped).map(([category, skills]: [string, any], ci: number) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: ci * 0.1 }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className={`h-0.5 w-12 bg-gradient-to-r ${categoryColors[category] || 'from-cyber-green to-cyber-blue'}`} />
              <h2 className="font-display text-2xl font-bold text-white">{category}</h2>
              <div className={`h-0.5 flex-1 bg-gradient-to-r ${categoryColors[category] || 'from-cyber-green to-cyber-blue'} opacity-20`} />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {skills.map((skill: any, i: number) => (
                <motion.div
                  key={skill._id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="glass cyber-border rounded-xl p-5 hover:border-cyber-green/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: skill.color || 'var(--cyber-green)', boxShadow: `0 0 6px ${skill.color || 'var(--cyber-green)'}` }} />
                      <span className="font-medium text-white">{skill.name}</span>
                      {skill.years && <span className="text-xs text-gray-500 font-mono">{skill.years}y exp</span>}
                    </div>
                    <span className="font-mono text-sm font-bold" style={{ color: skill.color || 'var(--cyber-green)' }}>
                      {skill.proficiency}%
                    </span>
                  </div>
                  <div className="skill-bar">
                    <motion.div
                      className="skill-fill"
                      style={{ background: skill.color ? `linear-gradient(90deg, ${skill.color}, ${skill.color}99)` : undefined }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.proficiency}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: i * 0.05, ease: 'easeOut' }}
                    />
                  </div>
                  <div className="mt-2 flex justify-end">
                    <span className="text-xs text-gray-600 font-mono">
                      {skill.proficiency >= 90 ? 'Expert' : skill.proficiency >= 75 ? 'Advanced' : skill.proficiency >= 60 ? 'Intermediate' : 'Beginner'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing...');

  const steps = [
    { pct: 15, msg: 'Loading modules...' },
    { pct: 35, msg: 'Establishing connection...' },
    { pct: 55, msg: 'Decrypting payload...' },
    { pct: 75, msg: 'Verifying signatures...' },
    { pct: 90, msg: 'Rendering interface...' },
    { pct: 100, msg: 'Access granted.' },
  ];

  useEffect(() => {
    let i = 0;
    const run = () => {
      if (i >= steps.length) {
        setTimeout(() => setLoading(false), 400);
        return;
      }
      setProgress(steps[i].pct);
      setStatus(steps[i].msg);
      i++;
      setTimeout(run, 250 + Math.random() * 200);
    };
    run();
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] bg-cyber-dark flex flex-col items-center justify-center"
        >
          {/* Grid bg */}
          <div className="absolute inset-0 bg-grid opacity-30" />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative flex flex-col items-center gap-8"
          >
            {/* Logo */}
            <div className="relative w-24 h-24">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border border-cyber-green/30"
                style={{ borderTopColor: 'var(--cyber-green)' }}
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-3 rounded-full border border-cyber-blue/20"
                style={{ borderBottomColor: 'var(--cyber-blue)' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Shield className="w-10 h-10 text-cyber-green" />
                </motion.div>
              </div>
            </div>

            <div className="text-center">
              <h1 className="font-display text-3xl font-bold tracking-wider text-white mb-1">
                CYBER<span className="text-cyber-green">FOLIO</span>
              </h1>
              <p className="font-mono text-xs text-cyber-green/60 tracking-widest">[SECURITY PORTFOLIO SYSTEM]</p>
            </div>

            {/* Progress */}
            <div className="w-64">
              <div className="flex justify-between text-xs font-mono text-cyber-green/60 mb-2">
                <span>{status}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1 bg-cyber-dark-3 rounded overflow-hidden">
                <motion.div
                  className="h-full rounded"
                  style={{ background: 'linear-gradient(90deg, var(--cyber-green), var(--cyber-blue))' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Matrix-style chars */}
            <div className="font-mono text-xs text-cyber-green/20 text-center leading-5 w-64 overflow-hidden">
              {Array.from({ length: 3 }, (_, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
                >
                  {Array.from({ length: 32 }, () =>
                    Math.random() > 0.5 ? Math.floor(Math.random() * 2) : String.fromCharCode(0x30A0 + Math.random() * 96)
                  ).join('')}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

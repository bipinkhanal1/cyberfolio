'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Terminal, Eye, EyeOff, Lock } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Access granted');
      router.push('/admin/dashboard');
    } catch {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyber-green/3 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 glass border border-cyber-green/30 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-cyber-green animate-glow-pulse" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white tracking-wider">ADMIN ACCESS</h1>
          <p className="font-mono text-xs text-cyber-green/60 mt-1 tracking-widest">CYBERFOLIO CMS</p>
        </div>

        {/* Scanning line animation */}
        <div className="relative glass-strong border border-cyber-green/15 rounded-2xl p-8 overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-cyber-green to-transparent opacity-60 animate-scan-line" />

          <div className="flex items-center gap-2 mb-6">
            <Terminal className="w-4 h-4 text-cyber-green" />
            <span className="font-mono text-sm text-cyber-green">Authentication Required</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-2 tracking-wider">EMAIL ADDRESS</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-cyber font-mono"
                placeholder="admin@cyberfolio.dev"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 mb-2 tracking-wider">PASSWORD</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-cyber font-mono pr-10"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyber-green transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-cyber-filled btn-cyber flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-cyber-dark/30 border-t-cyber-dark rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Access Dashboard
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-cyber-green/10">
            <p className="font-mono text-xs text-gray-600 text-center">
              Protected by JWT Authentication • Rate Limited
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

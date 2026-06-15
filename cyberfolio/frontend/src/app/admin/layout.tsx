'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, LayoutDashboard, FolderOpen, FileText, Award, Zap,
  Briefcase, MessageSquare, Settings, Image, LogOut, Menu, X,
  ChevronRight, Terminal, Users, HelpCircle, User, Bell
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/profile', label: 'Profile', icon: User },
  { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { href: '/admin/blog', label: 'Blog Posts', icon: FileText },
  { href: '/admin/certifications', label: 'Certifications', icon: Award },
  { href: '/admin/skills', label: 'Skills', icon: Zap },
  { href: '/admin/services', label: 'Services', icon: Briefcase },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Users },
  { href: '/admin/contacts', label: 'Contacts', icon: MessageSquare },
  { href: '/admin/faq', label: 'FAQ', icon: HelpCircle },
  { href: '/admin/media', label: 'Media Library', icon: Image },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLogin = pathname === '/admin/login';

  useEffect(() => {
    if (!isLogin && !user) {
      router.push('/admin/login');
    }
  }, [user, isLogin, router]);

  if (isLogin) return <>{children}</>;
  if (!user) return (
    <div className="min-h-screen bg-cyber-dark flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-cyber-green/30 border-t-cyber-green rounded-full animate-spin" />
    </div>
  );

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-cyber-dark flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 glass-strong border-r border-cyber-green/10 flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b border-cyber-green/10">
          <div className="w-9 h-9 flex items-center justify-center glass border border-cyber-green/30 rounded-lg">
            <Shield className="w-5 h-5 text-cyber-green" />
          </div>
          <div>
            <div className="font-display text-sm font-bold text-white tracking-wider">ADMIN</div>
            <div className="flex items-center gap-1">
              <Terminal className="w-2.5 h-2.5 text-cyber-green" />
              <span className="font-mono text-xs text-cyber-green/60">CyberFolio CMS</span>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {navItems.map(item => {
              const active = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-cyber-green/10 text-cyber-green border border-cyber-green/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}>
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                  {active && <ChevronRight className="w-3 h-3 ml-auto" />}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User */}
        <div className="p-4 border-t border-cyber-green/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-cyber-dark-3 border border-cyber-green/20 flex items-center justify-center text-cyber-green text-sm font-bold">
              {user.username[0].toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-medium text-white">{user.username}</div>
              <div className="text-xs text-gray-500 font-mono">{user.role}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/" target="_blank" className="flex items-center justify-center gap-1.5 px-3 py-1.5 glass cyber-border rounded text-xs text-gray-400 hover:text-white transition-colors font-mono">
              View Site
            </Link>
            <button onClick={handleLogout} className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-400 hover:text-red-300 hover:border-red-400/30 transition-all font-mono">
              <LogOut className="w-3 h-3" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-30 glass-strong border-b border-cyber-green/10 px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 lg:hidden">
            <Shield className="w-5 h-5 text-cyber-green" />
            <span className="font-display text-sm font-bold text-white">ADMIN</span>
          </div>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
              <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
              System Online
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

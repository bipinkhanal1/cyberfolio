'use client';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import { getAnalyticsSummary, getContacts } from '@/lib/api';
import { FolderOpen, FileText, MessageSquare, Eye, TrendingUp, Users, Bell, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const { data: analytics } = useSWR('analytics', () => getAnalyticsSummary());
  const { data: contactsData } = useSWR('admin-contacts', () => getContacts({ status: 'unread', limit: 5 }));

  const stats = [
    { label: 'Published Projects', value: analytics?.totalProjects ?? '—', icon: FolderOpen, color: 'text-cyber-green', bg: 'bg-cyber-green/10', border: 'border-cyber-green/20', href: '/admin/projects' },
    { label: 'Blog Posts', value: analytics?.totalPosts ?? '—', icon: FileText, color: 'text-cyber-blue', bg: 'bg-cyber-blue/10', border: 'border-cyber-blue/20', href: '/admin/blog' },
    { label: 'Total Contacts', value: analytics?.totalContacts ?? '—', icon: MessageSquare, color: 'text-cyber-purple', bg: 'bg-cyber-purple/10', border: 'border-cyber-purple/20', href: '/admin/contacts' },
    { label: 'Unread Messages', value: analytics?.unreadContacts ?? '—', icon: Bell, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', href: '/admin/contacts' },
    { label: 'Page Views (30d)', value: analytics?.totalViews?.toLocaleString() ?? '—', icon: Eye, color: 'text-cyber-green', bg: 'bg-cyber-green/10', border: 'border-cyber-green/20', href: '#' },
    { label: 'Unique Visitors (30d)', value: analytics?.totalVisitors?.toLocaleString() ?? '—', icon: Users, color: 'text-cyber-blue', bg: 'bg-cyber-blue/10', border: 'border-cyber-blue/20', href: '#' },
  ];

  const quickActions = [
    { label: 'New Project', href: '/admin/projects?new=1', color: 'border-cyber-green/30 text-cyber-green hover:bg-cyber-green/5' },
    { label: 'New Blog Post', href: '/admin/blog?new=1', color: 'border-cyber-blue/30 text-cyber-blue hover:bg-cyber-blue/5' },
    { label: 'Upload Media', href: '/admin/media', color: 'border-cyber-purple/30 text-cyber-purple hover:bg-cyber-purple/5' },
    { label: 'View Site', href: '/', color: 'border-gray-600/30 text-gray-400 hover:bg-white/5' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-gray-400 text-sm font-mono">Welcome back. Here's what's happening with your portfolio.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Link href={stat.href} className={`block glass border ${stat.border} rounded-xl p-4 hover:opacity-90 transition-opacity`}>
              <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${stat.bg} border ${stat.border} mb-3`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className={`font-display text-2xl font-bold ${stat.color} mb-0.5`}>{stat.value}</div>
              <div className="text-xs text-gray-500 font-mono leading-tight">{stat.label}</div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Contacts */}
        <div className="lg:col-span-2">
          <div className="glass cyber-border rounded-xl">
            <div className="flex items-center justify-between p-5 border-b border-cyber-green/10">
              <h2 className="font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyber-green" /> Unread Messages
              </h2>
              <Link href="/admin/contacts" className="text-xs font-mono text-cyber-green hover:text-white transition-colors">View all →</Link>
            </div>
            <div className="divide-y divide-cyber-green/5">
              {contactsData?.contacts?.length === 0 && (
                <div className="p-8 text-center">
                  <CheckCircle className="w-8 h-8 text-cyber-green/30 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm font-mono">No unread messages</p>
                </div>
              )}
              {contactsData?.contacts?.map((contact: any) => (
                <div key={contact._id} className="p-4 hover:bg-cyber-green/3 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-medium text-white text-sm">{contact.name}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-cyber-green" />
                      </div>
                      <div className="text-xs text-gray-500 font-mono truncate">{contact.subject}</div>
                      <div className="text-xs text-gray-400 mt-1 line-clamp-1">{contact.message}</div>
                    </div>
                    <div className="text-xs text-gray-600 font-mono flex-shrink-0">
                      {format(new Date(contact.createdAt), 'MMM d')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="glass cyber-border rounded-xl p-5">
            <h2 className="font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyber-green" /> Quick Actions
            </h2>
            <div className="space-y-2">
              {quickActions.map(action => (
                <Link key={action.label} href={action.href}
                  className={`block px-4 py-3 rounded-lg border font-mono text-sm transition-all ${action.color}`}>
                  {action.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Analytics chart placeholder */}
          <div className="glass cyber-border rounded-xl p-5 mt-4">
            <h2 className="font-bold text-white mb-4">Page Views (30d)</h2>
            <div className="flex items-end gap-1 h-24">
              {analytics?.recentAnalytics?.slice(-14).map((day: any, i: number) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div
                    className="w-full rounded-t"
                    style={{
                      height: `${Math.max(4, (day.pageViews / Math.max(...(analytics.recentAnalytics.map((d: any) => d.pageViews)), 1)) * 100)}%`,
                      background: 'linear-gradient(to top, var(--cyber-green), var(--cyber-blue))',
                      opacity: 0.7
                    }}
                  />
                </div>
              )) || (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-xs text-gray-600 font-mono">No data yet</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

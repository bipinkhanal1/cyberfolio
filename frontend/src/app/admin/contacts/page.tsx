'use client';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { getContacts, updateContactStatus, deleteContact } from '@/lib/api';
import { format } from 'date-fns';
import { Mail, Trash2, Eye, Check, Archive, Loader2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_COLORS: Record<string, string> = {
  unread: 'bg-cyber-green/10 text-cyber-green border-cyber-green/20',
  read: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  replied: 'bg-cyber-blue/10 text-cyber-blue border-cyber-blue/20',
  archived: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
};

export default function AdminContactsPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const { data, isLoading } = useSWR(['admin-contacts', statusFilter], () =>
    getContacts({ status: statusFilter || undefined, limit: 50 })
  );

  const handleStatus = async (id: string, status: string) => {
    setActionLoading(id + status);
    try {
      await updateContactStatus(id, status);
      mutate(['admin-contacts', statusFilter]);
      if (selected?._id === id) setSelected({ ...selected, status });
      toast.success(`Marked as ${status}`);
    } catch { toast.error('Failed to update'); }
    finally { setActionLoading(null); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    setActionLoading(id + 'delete');
    try {
      await deleteContact(id);
      mutate(['admin-contacts', statusFilter]);
      if (selected?._id === id) setSelected(null);
      toast.success('Deleted');
    } catch { toast.error('Failed to delete'); }
    finally { setActionLoading(null); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-white">Contact Messages</h1>
        <div className="flex gap-2">
          {['', 'unread', 'read', 'replied', 'archived'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded font-mono text-xs transition-all ${statusFilter === s ? 'bg-cyber-green text-cyber-dark font-bold' : 'glass cyber-border text-gray-400 hover:text-white'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* List */}
        <div className="lg:col-span-2">
          <div className="glass cyber-border rounded-xl overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center p-12"><Loader2 className="w-6 h-6 text-cyber-green animate-spin" /></div>
            ) : data?.contacts?.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-gray-500">
                <Mail className="w-8 h-8 mb-3 opacity-30" />
                <p className="font-mono text-sm">No messages found</p>
              </div>
            ) : (
              <div className="divide-y divide-cyber-green/5 max-h-[70vh] overflow-y-auto">
                {data?.contacts?.map((contact: any) => (
                  <button key={contact._id} onClick={() => setSelected(contact)}
                    className={`w-full text-left p-4 hover:bg-cyber-green/3 transition-colors ${selected?._id === contact._id ? 'bg-cyber-green/5 border-l-2 border-cyber-green' : ''}`}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-medium text-white text-sm truncate">{contact.name}</span>
                      <span className={`flex-shrink-0 px-1.5 py-0.5 rounded text-xs font-mono border ${STATUS_COLORS[contact.status]}`}>{contact.status}</span>
                    </div>
                    <div className="text-xs text-gray-400 truncate mb-1">{contact.subject}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 truncate">{contact.email}</span>
                      <span className="text-xs text-gray-600 font-mono flex-shrink-0">{format(new Date(contact.createdAt), 'MMM d')}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Detail */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="glass cyber-border rounded-xl p-6">
              {/* Actions */}
              <div className="flex flex-wrap gap-2 mb-6 pb-5 border-b border-cyber-green/10">
                {['read', 'replied', 'archived'].map(s => (
                  <button key={s} onClick={() => handleStatus(selected._id, s)} disabled={selected.status === s || !!actionLoading}
                    className={`px-3 py-1.5 rounded glass text-xs font-mono flex items-center gap-1.5 transition-all ${selected.status === s ? 'opacity-40 cursor-not-allowed' : 'cyber-border hover:border-cyber-green/30'} text-gray-300`}>
                    {actionLoading === selected._id + s ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                    {s}
                  </button>
                ))}
                <button onClick={() => handleDelete(selected._id)} className="ml-auto px-3 py-1.5 rounded glass border border-red-500/20 text-xs font-mono text-red-400 hover:border-red-400/40 flex items-center gap-1.5">
                  {actionLoading === selected._id + 'delete' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />} Delete
                </button>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div>
                  <h2 className="font-bold text-white text-lg mb-1">{selected.subject}</h2>
                  <div className={`inline-flex px-2 py-0.5 rounded text-xs font-mono border ${STATUS_COLORS[selected.status]}`}>{selected.status}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'From', value: selected.name },
                    { label: 'Email', value: selected.email, href: `mailto:${selected.email}` },
                    { label: 'Company', value: selected.company || '—' },
                    { label: 'Service', value: selected.service || '—' },
                    { label: 'Budget', value: selected.budget || '—' },
                    { label: 'Date', value: format(new Date(selected.createdAt), 'PPp') },
                  ].map(row => (
                    <div key={row.label}>
                      <div className="text-xs text-gray-500 font-mono mb-0.5">{row.label}</div>
                      {row.href ? (
                        <a href={row.href} className="text-sm text-cyber-green hover:underline flex items-center gap-1">
                          {row.value} <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <div className="text-sm text-gray-300">{row.value}</div>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <div className="text-xs text-gray-500 font-mono mb-2">Message</div>
                  <div className="glass border border-cyber-green/5 rounded-lg p-4 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {selected.message}
                  </div>
                </div>

                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                  className="btn-cyber inline-flex items-center gap-2 text-xs">
                  <Mail className="w-3.5 h-3.5" /> Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="glass cyber-border rounded-xl h-full min-h-48 flex flex-col items-center justify-center p-12 text-gray-500">
              <Eye className="w-10 h-10 mb-3 opacity-20" />
              <p className="font-mono text-sm">Select a message to view</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

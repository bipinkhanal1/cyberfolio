'use client';
import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, X, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => ReactNode;
}

interface AdminTableProps {
  title: string;
  data: any[];
  columns: Column[];
  onDelete: (id: string) => Promise<void>;
  onEdit: (item: any) => void;
  onNew: () => void;
  isLoading?: boolean;
  searchKey?: string;
}

export function AdminTable({ title, data, columns, onDelete, onEdit, onNew, isLoading, searchKey }: AdminTableProps) {
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = searchKey
    ? data?.filter((item: any) => item[searchKey]?.toLowerCase().includes(search.toLowerCase()))
    : data;

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    setDeleting(id);
    try {
      await onDelete(id);
      toast.success('Deleted successfully');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="font-display text-2xl font-bold text-white">{title}</h1>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {searchKey && (
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search..." className="input-cyber pl-9 py-2 text-sm" />
            </div>
          )}
          <button onClick={onNew} className="btn-cyber inline-flex items-center gap-2 text-xs whitespace-nowrap">
            <Plus className="w-4 h-4" /> Add New
          </button>
        </div>
      </div>

      <div className="glass cyber-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center p-20">
            <Loader2 className="w-8 h-8 text-cyber-green animate-spin" />
          </div>
        ) : filtered?.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-gray-500">
            <div className="w-16 h-16 glass border border-cyber-green/10 rounded-xl flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-cyber-green/30" />
            </div>
            <p className="font-mono text-sm">No items found. Add your first one!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyber-green/10">
                  {columns.map(col => (
                    <th key={col.key} className="px-4 py-3 text-left text-xs font-mono text-gray-500 tracking-wider">
                      {col.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right text-xs font-mono text-gray-500 tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-green/5">
                {filtered?.map((item: any) => (
                  <tr key={item._id} className="hover:bg-cyber-green/3 transition-colors group">
                    {columns.map(col => (
                      <td key={col.key} className="px-4 py-3 text-sm text-gray-300">
                        {col.render ? col.render(item[col.key], item) : item[col.key] ?? '—'}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEdit(item)}
                          className="w-7 h-7 flex items-center justify-center glass border border-cyber-blue/20 rounded hover:border-cyber-blue/50 text-cyber-blue transition-all">
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button onClick={() => handleDelete(item._id)} disabled={deleting === item._id}
                          className="w-7 h-7 flex items-center justify-center glass border border-red-500/20 rounded hover:border-red-500/50 text-red-400 transition-all">
                          {deleting === item._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Modal component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onSave: () => void;
  saving?: boolean;
}

export function AdminModal({ isOpen, onClose, title, children, onSave, saving }: ModalProps) {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={e => e.target === e.currentTarget && onClose()}
      >
        <div className="absolute inset-0 bg-black/70" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative glass-strong border border-cyber-green/15 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-cyber-green/10">
            <h2 className="font-display text-lg font-bold text-white">{title}</h2>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center glass cyber-border rounded hover:border-cyber-green/30 transition-all text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {children}
          </div>
          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-cyber-green/10">
            <button onClick={onClose} className="btn-cyber text-xs">Cancel</button>
            <button onClick={onSave} disabled={saving}
              className="btn-cyber-filled btn-cyber text-xs inline-flex items-center gap-2">
              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
              Save Changes
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Form field components
export function FormField({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-mono text-gray-400 mb-1.5 tracking-wider">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className="input-cyber" {...props} />;
}

export function Textarea({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="input-cyber resize-none" {...props} />;
}

export function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className="input-cyber bg-cyber-dark-2" {...props}>
      {children}
    </select>
  );
}

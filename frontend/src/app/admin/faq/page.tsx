'use client';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { getFAQs, createFAQ, updateFAQ, deleteFAQ } from '@/lib/api';
import { AdminTable, AdminModal, FormField, Input, Textarea, Select } from '@/components/admin/AdminTable';
import toast from 'react-hot-toast';

const EMPTY = { question: '', answer: '', category: 'general', order: 0, published: true };

export default function AdminFAQPage() {
  const { data: faqs, isLoading } = useSWR('admin-faqs', () => getFAQs());
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);

  const openNew = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (item: any) => { setEditing(item); setForm({ ...item }); setModal(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, order: Number(form.order) };
      if (editing) { await updateFAQ(editing._id, payload); toast.success('FAQ updated'); }
      else { await createFAQ(payload); toast.success('FAQ added'); }
      mutate('admin-faqs');
      setModal(false);
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => { await deleteFAQ(id); mutate('admin-faqs'); };
  const f = (k: string) => (e: any) => setForm((p: any) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const columns = [
    { key: 'question', label: 'Question', render: (v: string) => <span className="font-medium text-white line-clamp-1">{v}</span> },
    { key: 'category', label: 'Category', render: (v: string) => <span className="font-mono text-xs text-cyber-blue">{v}</span> },
    { key: 'order', label: 'Order', render: (v: number) => <span className="font-mono text-xs text-gray-500">{v}</span> },
    { key: 'published', label: 'Published', render: (v: boolean) => <span className={`px-2 py-0.5 rounded text-xs font-mono ${v ? 'bg-cyber-green/10 text-cyber-green' : 'bg-gray-500/10 text-gray-400'}`}>{v ? 'Yes' : 'No'}</span> },
  ];

  return (
    <>
      <AdminTable title="FAQ" data={faqs || []} columns={columns} onDelete={handleDelete} onEdit={openEdit} onNew={openNew} isLoading={isLoading} searchKey="question" />
      <AdminModal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit FAQ' : 'Add FAQ'} onSave={handleSave} saving={saving}>
        <FormField label="Question *"><Input value={form.question} onChange={f('question')} placeholder="What types of testing do you offer?" /></FormField>
        <FormField label="Answer *">
          <Textarea value={form.answer} onChange={f('answer')} rows={5} placeholder="Detailed answer to the question..." />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Category">
            <Select value={form.category} onChange={f('category')}>
              {['general', 'services', 'pricing', 'process', 'technical'].map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </FormField>
          <FormField label="Order"><Input type="number" value={form.order} onChange={f('order')} /></FormField>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
          <input type="checkbox" checked={form.published} onChange={f('published')} className="w-4 h-4 accent-cyber-green" /> Published
        </label>
      </AdminModal>
    </>
  );
}

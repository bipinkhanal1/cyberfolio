'use client';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { getAdminTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '@/lib/api';
import { AdminTable, AdminModal, FormField, Input, Textarea, Select } from '@/components/admin/AdminTable';
import toast from 'react-hot-toast';

const EMPTY = { name: '', title: '', company: '', avatar: '', content: '', rating: 5, featured: false, approved: false, order: 0 };

export default function AdminTestimonialsPage() {
  const { data: testimonials, isLoading } = useSWR('admin-testimonials', () => getAdminTestimonials());
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);

  const openNew = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (item: any) => { setEditing(item); setForm({ ...item }); setModal(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, rating: Number(form.rating), order: Number(form.order) };
      if (editing) { await updateTestimonial(editing._id, payload); toast.success('Testimonial updated'); }
      else { await createTestimonial(payload); toast.success('Testimonial added'); }
      mutate('admin-testimonials');
      setModal(false);
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => { await deleteTestimonial(id); mutate('admin-testimonials'); };
  const f = (k: string) => (e: any) => setForm((p: any) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const columns = [
    { key: 'name', label: 'Name', render: (v: string) => <span className="font-medium text-white">{v}</span> },
    { key: 'company', label: 'Company', render: (v: string) => <span className="text-sm text-gray-400">{v || '—'}</span> },
    { key: 'rating', label: 'Rating', render: (v: number) => <span className="text-yellow-400">{'★'.repeat(v)}</span> },
    { key: 'approved', label: 'Approved', render: (v: boolean) => <span className={`px-2 py-0.5 rounded text-xs font-mono ${v ? 'bg-cyber-green/10 text-cyber-green' : 'bg-red-500/10 text-red-400'}`}>{v ? 'Yes' : 'No'}</span> },
    { key: 'featured', label: 'Featured', render: (v: boolean) => <span className={v ? 'text-yellow-400 text-xs' : 'text-gray-600 text-xs'}>{v ? '★' : '—'}</span> },
  ];

  return (
    <>
      <AdminTable title="Testimonials" data={testimonials || []} columns={columns} onDelete={handleDelete} onEdit={openEdit} onNew={openNew} isLoading={isLoading} searchKey="name" />
      <AdminModal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Testimonial' : 'Add Testimonial'} onSave={handleSave} saving={saving}>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Client Name *"><Input value={form.name} onChange={f('name')} placeholder="Jane Doe" /></FormField>
          <FormField label="Job Title"><Input value={form.title} onChange={f('title')} placeholder="CTO" /></FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Company"><Input value={form.company} onChange={f('company')} placeholder="Acme Corp" /></FormField>
          <FormField label="Avatar URL"><Input value={form.avatar} onChange={f('avatar')} placeholder="https://..." /></FormField>
        </div>
        <FormField label="Testimonial Content *">
          <Textarea value={form.content} onChange={f('content')} rows={4} placeholder="What did the client say about your work?" />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label={`Rating: ${'★'.repeat(Number(form.rating))}`}>
            <input type="range" min="1" max="5" value={form.rating} onChange={f('rating')} className="w-full" style={{ accentColor: '#f59e0b' }} />
          </FormField>
          <FormField label="Order"><Input type="number" value={form.order} onChange={f('order')} /></FormField>
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
            <input type="checkbox" checked={form.approved} onChange={f('approved')} className="w-4 h-4 accent-cyber-green" /> Approved
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={f('featured')} className="w-4 h-4 accent-cyber-green" /> Featured
          </label>
        </div>
      </AdminModal>
    </>
  );
}

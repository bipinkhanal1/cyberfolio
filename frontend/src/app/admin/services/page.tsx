'use client';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { getServices, createService, updateService, deleteService } from '@/lib/api';
import { AdminTable, AdminModal, FormField, Input, Textarea, Select } from '@/components/admin/AdminTable';
import toast from 'react-hot-toast';

const EMPTY = { title: '', description: '', longDescription: '', icon: 'shield', features: '', featured: false, order: 0 };

export default function AdminServicesPage() {
  const { data: services, isLoading } = useSWR('admin-services', () => getServices());
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);

  const openNew = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (item: any) => {
    setEditing(item);
    setForm({ ...item, features: item.features?.join('\n') || '' });
    setModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, features: form.features?.split('\n').map((f: string) => f.trim()).filter(Boolean), order: Number(form.order) };
      if (editing) { await updateService(editing._id, payload); toast.success('Service updated'); }
      else { await createService(payload); toast.success('Service created'); }
      mutate('admin-services');
      setModal(false);
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => { await deleteService(id); mutate('admin-services'); };
  const f = (k: string) => (e: any) => setForm((p: any) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const ICONS = ['shield', 'globe', 'network', 'code', 'lock', 'eye', 'shield-x', 'zap', 'server'];

  const columns = [
    { key: 'title', label: 'Service', render: (v: string) => <span className="font-medium text-white">{v}</span> },
    { key: 'icon', label: 'Icon', render: (v: string) => <span className="font-mono text-xs text-cyber-blue">{v}</span> },
    { key: 'featured', label: 'Featured', render: (v: boolean) => <span className={v ? 'text-yellow-400 text-xs' : 'text-gray-600 text-xs'}>{v ? '★' : '—'}</span> },
    { key: 'order', label: 'Order', render: (v: number) => <span className="font-mono text-xs text-gray-500">{v}</span> },
    { key: 'features', label: 'Features', render: (_: any, row: any) => <span className="font-mono text-xs text-gray-400">{row.features?.length ?? 0} items</span> },
  ];

  return (
    <>
      <AdminTable title="Services" data={services || []} columns={columns} onDelete={handleDelete} onEdit={openEdit} onNew={openNew} isLoading={isLoading} searchKey="title" />
      <AdminModal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Service' : 'New Service'} onSave={handleSave} saving={saving}>
        <FormField label="Service Title *"><Input value={form.title} onChange={f('title')} placeholder="Web Application Penetration Testing" /></FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Icon">
            <Select value={form.icon} onChange={f('icon')}>
              {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
            </Select>
          </FormField>
          <FormField label="Order"><Input type="number" value={form.order} onChange={f('order')} /></FormField>
        </div>
        <FormField label="Short Description *">
          <Textarea value={form.description} onChange={f('description')} rows={3} placeholder="Brief service description shown in listings..." />
        </FormField>
        <FormField label="Features (one per line)">
          <Textarea value={form.features} onChange={f('features')} rows={6}
            placeholder={"OWASP Top 10 testing\nAPI security assessment\nBusiness logic testing\nDetailed remediation report"} />
        </FormField>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="svc-featured" checked={form.featured} onChange={f('featured')} className="w-4 h-4 accent-cyber-green" />
          <label htmlFor="svc-featured" className="text-sm text-gray-300">Featured service</label>
        </div>
      </AdminModal>
    </>
  );
}

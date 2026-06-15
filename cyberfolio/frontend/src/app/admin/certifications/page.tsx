'use client';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { getCertifications, createCertification, updateCertification, deleteCertification } from '@/lib/api';
import { AdminTable, AdminModal, FormField, Input, Select } from '@/components/admin/AdminTable';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const EMPTY = { name: '', issuer: '', credentialId: '', credentialUrl: '', issueDate: '', expiryDate: '', image: '', category: 'offensive', featured: false, order: 0 };

export default function AdminCertificationsPage() {
  const { data: certs, isLoading } = useSWR('admin-certs', () => getCertifications());
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);

  const openNew = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (item: any) => {
    setEditing(item);
    setForm({
      ...item,
      issueDate: item.issueDate ? format(new Date(item.issueDate), 'yyyy-MM-dd') : '',
      expiryDate: item.expiryDate ? format(new Date(item.expiryDate), 'yyyy-MM-dd') : '',
    });
    setModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) { await updateCertification(editing._id, form); toast.success('Certification updated'); }
      else { await createCertification(form); toast.success('Certification added'); }
      mutate('admin-certs');
      setModal(false);
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => { await deleteCertification(id); mutate('admin-certs'); };
  const f = (k: string) => (e: any) => setForm((p: any) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const columns = [
    { key: 'name', label: 'Certification', render: (v: string) => <span className="font-medium text-white">{v}</span> },
    { key: 'issuer', label: 'Issuer', render: (v: string) => <span className="text-sm text-gray-300">{v}</span> },
    { key: 'category', label: 'Category', render: (v: string) => <span className="font-mono text-xs text-cyber-blue">{v}</span> },
    { key: 'issueDate', label: 'Issued', render: (v: string) => <span className="font-mono text-xs text-gray-500">{v ? format(new Date(v), 'MMM yyyy') : '—'}</span> },
    { key: 'featured', label: 'Featured', render: (v: boolean) => <span className={v ? 'text-yellow-400 text-xs' : 'text-gray-600 text-xs'}>{v ? '★' : '—'}</span> },
  ];

  return (
    <>
      <AdminTable title="Certifications" data={certs || []} columns={columns} onDelete={handleDelete} onEdit={openEdit} onNew={openNew} isLoading={isLoading} searchKey="name" />
      <AdminModal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Certification' : 'Add Certification'} onSave={handleSave} saving={saving}>
        <FormField label="Certification Name *"><Input value={form.name} onChange={f('name')} placeholder="OSCP" /></FormField>
        <FormField label="Issuing Organization *"><Input value={form.issuer} onChange={f('issuer')} placeholder="Offensive Security" /></FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Category">
            <Select value={form.category} onChange={f('category')}>
              {['offensive','defensive','cloud','network','compliance','other'].map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </FormField>
          <FormField label="Order"><Input type="number" value={form.order} onChange={f('order')} /></FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Issue Date *"><Input type="date" value={form.issueDate} onChange={f('issueDate')} /></FormField>
          <FormField label="Expiry Date"><Input type="date" value={form.expiryDate} onChange={f('expiryDate')} /></FormField>
        </div>
        <FormField label="Credential ID"><Input value={form.credentialId} onChange={f('credentialId')} placeholder="OS-101-XXXXX" /></FormField>
        <FormField label="Verify URL"><Input value={form.credentialUrl} onChange={f('credentialUrl')} placeholder="https://verify.offensive-security.com/..." /></FormField>
        <FormField label="Badge Image URL"><Input value={form.image} onChange={f('image')} placeholder="https://..." /></FormField>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="cert-featured" checked={form.featured} onChange={f('featured')} className="w-4 h-4 accent-cyber-green" />
          <label htmlFor="cert-featured" className="text-sm text-gray-300">Featured certification</label>
        </div>
      </AdminModal>
    </>
  );
}

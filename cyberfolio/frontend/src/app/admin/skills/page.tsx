'use client';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { getSkills, createSkill, updateSkill, deleteSkill } from '@/lib/api';
import { AdminTable, AdminModal, FormField, Input, Select } from '@/components/admin/AdminTable';
import toast from 'react-hot-toast';

const EMPTY = { name: '', category: 'Offensive Security', proficiency: 80, color: '#00ff88', years: 0, order: 0 };
const CATEGORIES = ['Offensive Security', 'Defensive Security', 'Programming', 'Cloud Security', 'Networking', 'Forensics', 'Other'];

export default function AdminSkillsPage() {
  const { data, isLoading } = useSWR('admin-skills', () => getSkills());
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);

  const openNew = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (item: any) => { setEditing(item); setForm({ ...item }); setModal(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, proficiency: Number(form.proficiency), years: Number(form.years), order: Number(form.order) };
      if (editing) { await updateSkill(editing._id, payload); toast.success('Skill updated'); }
      else { await createSkill(payload); toast.success('Skill added'); }
      mutate('admin-skills');
      setModal(false);
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => { await deleteSkill(id); mutate('admin-skills'); };
  const f = (k: string) => (e: any) => setForm((p: any) => ({ ...p, [k]: e.target.value }));

  const columns = [
    { key: 'name', label: 'Skill', render: (v: string, row: any) => (
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: row.color, boxShadow: `0 0 6px ${row.color}` }} />
        <span className="font-medium text-white">{v}</span>
      </div>
    )},
    { key: 'category', label: 'Category', render: (v: string) => <span className="font-mono text-xs text-cyber-blue">{v}</span> },
    { key: 'proficiency', label: 'Level', render: (v: number) => (
      <div className="flex items-center gap-2">
        <div className="w-20 h-1.5 bg-cyber-dark-3 rounded overflow-hidden">
          <div className="h-full rounded" style={{ width: `${v}%`, background: 'linear-gradient(90deg, var(--cyber-green), var(--cyber-blue))' }} />
        </div>
        <span className="font-mono text-xs text-cyber-green">{v}%</span>
      </div>
    )},
    { key: 'years', label: 'Exp', render: (v: number) => <span className="font-mono text-xs text-gray-400">{v ? `${v}y` : '—'}</span> },
    { key: 'order', label: 'Order', render: (v: number) => <span className="font-mono text-xs text-gray-500">{v}</span> },
  ];

  return (
    <>
      <AdminTable title="Skills" data={data?.skills || []} columns={columns} onDelete={handleDelete} onEdit={openEdit} onNew={openNew} isLoading={isLoading} searchKey="name" />
      <AdminModal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Skill' : 'Add Skill'} onSave={handleSave} saving={saving}>
        <FormField label="Skill Name *"><Input value={form.name} onChange={f('name')} placeholder="Web Application Pentesting" /></FormField>
        <FormField label="Category">
          <Select value={form.category} onChange={f('category')}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
        </FormField>
        <FormField label={`Proficiency: ${form.proficiency}%`}>
          <input type="range" min="0" max="100" value={form.proficiency} onChange={f('proficiency')}
            className="w-full h-2 rounded appearance-none cursor-pointer" style={{ accentColor: '#00ff88' }} />
        </FormField>
        <div className="grid grid-cols-3 gap-4">
          <FormField label="Color">
            <div className="flex items-center gap-2">
              <input type="color" value={form.color} onChange={f('color')} className="w-10 h-10 rounded cursor-pointer bg-transparent border-0" />
              <Input value={form.color} onChange={f('color')} placeholder="#00ff88" />
            </div>
          </FormField>
          <FormField label="Years Exp"><Input type="number" value={form.years} onChange={f('years')} min="0" /></FormField>
          <FormField label="Order"><Input type="number" value={form.order} onChange={f('order')} /></FormField>
        </div>
      </AdminModal>
    </>
  );
}

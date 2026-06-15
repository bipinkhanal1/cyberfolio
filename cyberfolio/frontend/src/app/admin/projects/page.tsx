'use client';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { getAdminProjects, createProject, updateProject, deleteProject } from '@/lib/api';
import { AdminTable, AdminModal, FormField, Input, Textarea, Select } from '@/components/admin/AdminTable';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const EMPTY = {
  title: '', description: '', longDescription: '', category: 'web-security',
  tags: '', technologies: '', githubUrl: '', liveUrl: '', difficulty: 'intermediate',
  status: 'published', featured: false, order: 0
};

export default function AdminProjectsPage() {
  const { data: projects, isLoading } = useSWR('admin-projects', () => getAdminProjects());
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);

  const openNew = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (item: any) => {
    setEditing(item);
    setForm({
      ...item,
      tags: item.tags?.join(', ') || '',
      technologies: item.technologies?.join(', ') || '',
    });
    setModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags?.split(',').map((t: string) => t.trim()).filter(Boolean),
        technologies: form.technologies?.split(',').map((t: string) => t.trim()).filter(Boolean),
      };
      if (editing) {
        await updateProject(editing._id, payload);
        toast.success('Project updated');
      } else {
        await createProject(payload);
        toast.success('Project created');
      }
      mutate('admin-projects');
      setModal(false);
    } catch {
      toast.error('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteProject(id);
    mutate('admin-projects');
  };

  const f = (k: string) => (e: any) => setForm((p: any) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const columns = [
    { key: 'title', label: 'Title', render: (v: string) => <span className="font-medium text-white">{v}</span> },
    { key: 'category', label: 'Category', render: (v: string) => <span className="font-mono text-xs text-cyber-blue">{v}</span> },
    { key: 'difficulty', label: 'Difficulty', render: (v: string) => <span className={`font-mono text-xs ${v === 'expert' ? 'text-red-400' : v === 'advanced' ? 'text-orange-400' : 'text-cyber-green'}`}>{v}</span> },
    { key: 'status', label: 'Status', render: (v: string) => <span className={`px-2 py-0.5 rounded text-xs font-mono ${v === 'published' ? 'bg-cyber-green/10 text-cyber-green' : 'bg-gray-500/10 text-gray-400'}`}>{v}</span> },
    { key: 'featured', label: 'Featured', render: (v: boolean) => <span className={`text-xs font-mono ${v ? 'text-yellow-400' : 'text-gray-600'}`}>{v ? '★ Yes' : 'No'}</span> },
    { key: 'views', label: 'Views', render: (v: number) => <span className="font-mono text-xs text-gray-400">{v ?? 0}</span> },
    { key: 'createdAt', label: 'Created', render: (v: string) => <span className="font-mono text-xs text-gray-500">{v ? format(new Date(v), 'MMM d, yy') : '—'}</span> },
  ];

  return (
    <>
      <AdminTable
        title="Projects"
        data={projects || []}
        columns={columns}
        onDelete={handleDelete}
        onEdit={openEdit}
        onNew={openNew}
        isLoading={isLoading}
        searchKey="title"
      />

      <AdminModal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Project' : 'New Project'} onSave={handleSave} saving={saving}>
        <FormField label="Title *">
          <Input value={form.title} onChange={f('title')} placeholder="Project title" />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Category">
            <Select value={form.category} onChange={f('category')}>
              {['web-security','network','malware-analysis','ctf','tool','research','other'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Difficulty">
            <Select value={form.difficulty} onChange={f('difficulty')}>
              {['beginner','intermediate','advanced','expert'].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </Select>
          </FormField>
        </div>
        <FormField label="Short Description *">
          <Textarea value={form.description} onChange={f('description')} rows={3} placeholder="Brief description..." />
        </FormField>
        <FormField label="Tags (comma separated)">
          <Input value={form.tags} onChange={f('tags')} placeholder="CVE, RCE, Python..." />
        </FormField>
        <FormField label="Technologies (comma separated)">
          <Input value={form.technologies} onChange={f('technologies')} placeholder="Python, Burp Suite, Metasploit..." />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="GitHub URL">
            <Input value={form.githubUrl} onChange={f('githubUrl')} placeholder="https://github.com/..." />
          </FormField>
          <FormField label="Live URL">
            <Input value={form.liveUrl} onChange={f('liveUrl')} placeholder="https://..." />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Status">
            <Select value={form.status} onChange={f('status')}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </Select>
          </FormField>
          <FormField label="Order">
            <Input type="number" value={form.order} onChange={f('order')} placeholder="0" />
          </FormField>
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="featured" checked={form.featured} onChange={f('featured')}
            className="w-4 h-4 accent-cyber-green" />
          <label htmlFor="featured" className="text-sm text-gray-300">Featured project</label>
        </div>
        <FormField label="Cover Image URL">
          <Input value={form.coverImage || ''} onChange={f('coverImage')} placeholder="https://..." />
        </FormField>
      </AdminModal>
    </>
  );
}

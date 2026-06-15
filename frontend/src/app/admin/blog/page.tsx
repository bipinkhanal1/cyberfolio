'use client';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { getAdminPosts, createPost, updatePost, deletePost } from '@/lib/api';
import { AdminTable, AdminModal, FormField, Input, Textarea, Select } from '@/components/admin/AdminTable';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const EMPTY = {
  title: '', excerpt: '', content: '', category: 'Web Security',
  tags: '', status: 'draft', featured: false, seoTitle: '', seoDescription: '',
};

export default function AdminBlogPage() {
  const { data: posts, isLoading } = useSWR('admin-posts', () => getAdminPosts());
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);

  const openNew = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (item: any) => {
    setEditing(item);
    setForm({ ...item, tags: item.tags?.join(', ') || '' });
    setModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags?.split(',').map((t: string) => t.trim()).filter(Boolean),
      };
      if (editing) {
        await updatePost(editing._id, payload);
        toast.success('Post updated');
      } else {
        await createPost(payload);
        toast.success('Post created');
      }
      mutate('admin-posts');
      setModal(false);
    } catch {
      toast.error('Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deletePost(id);
    mutate('admin-posts');
  };

  const f = (k: string) => (e: any) => setForm((p: any) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const columns = [
    { key: 'title', label: 'Title', render: (v: string) => <span className="font-medium text-white line-clamp-1">{v}</span> },
    { key: 'category', label: 'Category', render: (v: string) => <span className="font-mono text-xs text-cyber-blue">{v}</span> },
    { key: 'status', label: 'Status', render: (v: string) => (
      <span className={`px-2 py-0.5 rounded text-xs font-mono ${v === 'published' ? 'bg-cyber-green/10 text-cyber-green' : v === 'draft' ? 'bg-gray-500/10 text-gray-400' : 'bg-yellow-400/10 text-yellow-400'}`}>{v}</span>
    )},
    { key: 'featured', label: 'Featured', render: (v: boolean) => <span className={`text-xs ${v ? 'text-yellow-400' : 'text-gray-600'}`}>{v ? '★' : '—'}</span> },
    { key: 'readingTime', label: 'Read', render: (v: number) => <span className="font-mono text-xs text-gray-500">{v ? `${v}m` : '—'}</span> },
    { key: 'views', label: 'Views', render: (v: number) => <span className="font-mono text-xs text-gray-400">{v ?? 0}</span> },
    { key: 'publishedAt', label: 'Published', render: (v: string) => <span className="font-mono text-xs text-gray-500">{v ? format(new Date(v), 'MMM d, yy') : '—'}</span> },
  ];

  const categories = ['Web Security', 'Network Security', 'Active Directory', 'Malware Analysis', 'Bug Bounty', 'CTF', 'Tools', 'Career', 'Other'];

  return (
    <>
      <AdminTable
        title="Blog Posts"
        data={posts || []}
        columns={columns}
        onDelete={handleDelete}
        onEdit={openEdit}
        onNew={openNew}
        isLoading={isLoading}
        searchKey="title"
      />

      <AdminModal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Post' : 'New Post'} onSave={handleSave} saving={saving}>
        <FormField label="Title *">
          <Input value={form.title} onChange={f('title')} placeholder="Article title" />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Category">
            <Select value={form.category} onChange={f('category')}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </FormField>
          <FormField label="Status">
            <Select value={form.status} onChange={f('status')}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
            </Select>
          </FormField>
        </div>
        <FormField label="Excerpt *">
          <Textarea value={form.excerpt} onChange={f('excerpt')} rows={2} placeholder="Brief summary for listings..." />
        </FormField>
        <FormField label="Content (HTML supported)">
          <Textarea value={form.content} onChange={f('content')} rows={10}
            placeholder="<p>Your article content here. You can use HTML tags for formatting.</p><h2>Section Title</h2><p>More content...</p>"
            className="font-mono text-xs" />
        </FormField>
        <FormField label="Cover Image URL">
          <Input value={form.coverImage || ''} onChange={f('coverImage')} placeholder="https://..." />
        </FormField>
        <FormField label="Tags (comma separated)">
          <Input value={form.tags} onChange={f('tags')} placeholder="SSRF, Web Security, Bug Bounty..." />
        </FormField>
        <div className="border-t border-cyber-green/10 pt-4">
          <p className="text-xs font-mono text-gray-500 mb-3 tracking-wider">SEO SETTINGS</p>
          <div className="space-y-3">
            <FormField label="SEO Title">
              <Input value={form.seoTitle || ''} onChange={f('seoTitle')} placeholder="Custom SEO title (optional)" />
            </FormField>
            <FormField label="SEO Description">
              <Textarea value={form.seoDescription || ''} onChange={f('seoDescription')} rows={2} placeholder="Meta description..." />
            </FormField>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="blog-featured" checked={form.featured} onChange={f('featured')} className="w-4 h-4 accent-cyber-green" />
          <label htmlFor="blog-featured" className="text-sm text-gray-300">Featured post</label>
        </div>
      </AdminModal>
    </>
  );
}

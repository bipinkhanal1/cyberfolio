'use client';
import { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import { getProfile, updateProfile } from '@/lib/api';
import { FormField, Input, Textarea, Select } from '@/components/admin/AdminTable';
import toast from 'react-hot-toast';
import { Save, Loader2, User } from 'lucide-react';

export default function AdminProfilePage() {
  const { data: profile, isLoading } = useSWR('profile', () => getProfile());
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => { if (profile) setForm(profile); }, [profile]);

  const f = (k: string) => (e: any) => setForm((p: any) => ({ ...p, [k]: e.target.value }));
  const fNested = (parent: string, k: string) => (e: any) =>
    setForm((p: any) => ({ ...p, [parent]: { ...(p[parent] || {}), [k]: e.target.value } }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(form);
      mutate('profile');
      toast.success('Profile updated successfully');
    } catch { toast.error('Failed to save profile'); }
    finally { setSaving(false); }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'social', label: 'Social Links' },
    { id: 'seo', label: 'SEO' },
    { id: 'contact', label: 'Contact Info' },
  ];

  if (isLoading) return (
    <div className="flex items-center justify-center p-20">
      <Loader2 className="w-8 h-8 text-cyber-green animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center glass border border-cyber-green/20 rounded-xl">
            <User className="w-5 h-5 text-cyber-green" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Profile Settings</h1>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-cyber-filled btn-cyber text-xs inline-flex items-center gap-2">
          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
          Save Changes
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 glass cyber-border rounded-xl p-1 w-fit">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-mono transition-all ${activeTab === tab.id ? 'bg-cyber-green/15 text-cyber-green border border-cyber-green/20' : 'text-gray-400 hover:text-white'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="glass cyber-border rounded-2xl p-8">
        {activeTab === 'basic' && (
          <div className="grid md:grid-cols-2 gap-6">
            <FormField label="Full Name *"><Input value={form.name || ''} onChange={f('name')} placeholder="Alex Cipher" /></FormField>
            <FormField label="Professional Title"><Input value={form.title || ''} onChange={f('title')} placeholder="Senior Penetration Tester" /></FormField>
            <FormField label="Tagline"><Input value={form.tagline || ''} onChange={f('tagline')} placeholder="Breaking systems to make them stronger." /></FormField>
            <FormField label="Location"><Input value={form.location || ''} onChange={f('location')} placeholder="Remote / Worldwide" /></FormField>
            <FormField label="Email Address"><Input type="email" value={form.email || ''} onChange={f('email')} /></FormField>
            <FormField label="Phone"><Input value={form.phone || ''} onChange={f('phone')} placeholder="+1 (555) 000-0000" /></FormField>
            <div className="md:col-span-2">
              <FormField label="Short Bio (for hero section)">
                <Textarea value={form.shortBio || ''} onChange={f('shortBio')} rows={2} placeholder="One-liner bio for the homepage..." />
              </FormField>
            </div>
            <div className="md:col-span-2">
              <FormField label="Full Bio">
                <Textarea value={form.bio || ''} onChange={f('bio')} rows={6} placeholder="Full biography for the About page..." />
              </FormField>
            </div>
            <FormField label="Avatar Image URL"><Input value={form.avatar || ''} onChange={f('avatar')} placeholder="https://..." /></FormField>
            <FormField label="Resume PDF URL"><Input value={form.resumeUrl || ''} onChange={f('resumeUrl')} placeholder="https://..." /></FormField>
            <FormField label="Availability">
              <Select value={form.availability || 'available'} onChange={f('availability')}>
                <option value="available">Available for work</option>
                <option value="busy">Currently busy</option>
                <option value="not-available">Not available</option>
              </Select>
            </FormField>
            <div className="grid grid-cols-3 gap-3">
              <FormField label="Years Exp."><Input type="number" value={form.yearsExperience || ''} onChange={f('yearsExperience')} /></FormField>
              <FormField label="Projects"><Input type="number" value={form.projectsCompleted || ''} onChange={f('projectsCompleted')} /></FormField>
              <FormField label="Clients"><Input type="number" value={form.clientsSatisfied || ''} onChange={f('clientsSatisfied')} /></FormField>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="grid md:grid-cols-2 gap-6">
            {['github', 'linkedin', 'twitter', 'hackerone', 'bugcrowd', 'tryhackme', 'hackthebox', 'youtube', 'instagram', 'website'].map(platform => (
              <FormField key={platform} label={platform.charAt(0).toUpperCase() + platform.slice(1)}>
                <Input value={form.socialLinks?.[platform] || ''} onChange={fNested('socialLinks', platform)} placeholder={`https://${platform}.com/...`} />
              </FormField>
            ))}
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-5">
            <FormField label="SEO Title"><Input value={form.seo?.title || ''} onChange={fNested('seo', 'title')} placeholder="Your Name - Cybersecurity Expert" /></FormField>
            <FormField label="SEO Description">
              <Textarea value={form.seo?.description || ''} onChange={fNested('seo', 'description')} rows={3} placeholder="Meta description for search engines..." />
            </FormField>
            <FormField label="SEO Keywords (comma separated)">
              <Input value={form.seo?.keywords?.join(', ') || ''} onChange={(e) => setForm((p: any) => ({ ...p, seo: { ...p.seo, keywords: e.target.value.split(',').map((k: string) => k.trim()) } }))} placeholder="cybersecurity, penetration testing, ethical hacking" />
            </FormField>
            <FormField label="OG Image URL"><Input value={form.seo?.ogImage || ''} onChange={fNested('seo', 'ogImage')} placeholder="https://..." /></FormField>
            <div className="border-t border-cyber-green/10 pt-5">
              <p className="text-xs font-mono text-gray-500 mb-4 tracking-wider">ANALYTICS</p>
              <div className="grid md:grid-cols-2 gap-5">
                <FormField label="Google Analytics ID"><Input value={form.analytics?.googleAnalyticsId || ''} onChange={fNested('analytics', 'googleAnalyticsId')} placeholder="G-XXXXXXXXXX" /></FormField>
                <FormField label="Microsoft Clarity ID"><Input value={form.analytics?.clarityId || ''} onChange={fNested('analytics', 'clarityId')} placeholder="xxxxxxxxxx" /></FormField>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-5">
            <FormField label="Office Address"><Textarea value={form.contact?.address || ''} onChange={fNested('contact', 'address')} rows={2} placeholder="123 Cyber Street, Digital City" /></FormField>
            <FormField label="Working Hours"><Input value={form.contact?.workingHours || ''} onChange={fNested('contact', 'workingHours')} placeholder="Mon–Fri, 9AM–6PM UTC" /></FormField>
            <FormField label="Google Maps Embed URL">
              <Textarea value={form.contact?.mapEmbedUrl || ''} onChange={fNested('contact', 'mapEmbedUrl')} rows={3} placeholder="https://www.google.com/maps/embed?pb=..." />
            </FormField>
          </div>
        )}
      </div>
    </div>
  );
}

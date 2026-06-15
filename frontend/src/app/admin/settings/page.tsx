'use client';
import { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import { getSettings, updateSettings } from '@/lib/api';
import { FormField, Input, Textarea, Select } from '@/components/admin/AdminTable';
import { Save, Loader2, Settings as SettingsIcon, Shield, Mail, Globe, Code } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const { data: settings, isLoading } = useSWR('settings-all', () => getSettings());
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => { if (settings) setForm(settings); }, [settings]);

  const f = (k: string) => (e: any) => setForm((p: any) => ({ ...p, [k]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(form);
      mutate('settings-all');
      toast.success('Settings saved');
    } catch { toast.error('Failed to save settings'); }
    finally { setSaving(false); }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'advanced', label: 'Advanced', icon: Code },
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
            <SettingsIcon className="w-5 h-5 text-cyber-green" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Settings</h1>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-cyber-filled btn-cyber text-xs inline-flex items-center gap-2">
          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
          Save Settings
        </button>
      </div>

      <div className="flex gap-1 mb-6 glass cyber-border rounded-xl p-1 w-fit">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-mono flex items-center gap-2 transition-all ${activeTab === tab.id ? 'bg-cyber-green/15 text-cyber-green border border-cyber-green/20' : 'text-gray-400 hover:text-white'}`}>
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="glass cyber-border rounded-2xl p-8">
        {activeTab === 'general' && (
          <div className="space-y-5">
            <p className="text-xs font-mono text-gray-500 tracking-wider mb-6">SITE SETTINGS</p>
            <FormField label="Site Name"><Input value={form.site_name || ''} onChange={f('site_name')} placeholder="CyberFolio" /></FormField>
            <FormField label="Site URL"><Input value={form.site_url || ''} onChange={f('site_url')} placeholder="https://yourdomain.com" /></FormField>
            <FormField label="Site Tagline"><Input value={form.site_tagline || ''} onChange={f('site_tagline')} placeholder="Your Security, Our Priority" /></FormField>
            <FormField label="Maintenance Mode">
              <Select value={form.maintenance_mode || 'off'} onChange={f('maintenance_mode')}>
                <option value="off">Off — Site is live</option>
                <option value="on">On — Show maintenance page</option>
              </Select>
            </FormField>
            <FormField label="Footer Text"><Input value={form.footer_text || ''} onChange={f('footer_text')} placeholder="© 2025 CyberFolio. All rights reserved." /></FormField>
          </div>
        )}

        {activeTab === 'email' && (
          <div className="space-y-5">
            <p className="text-xs font-mono text-gray-500 tracking-wider mb-6">EMAIL CONFIGURATION</p>
            <div className="glass border border-yellow-400/20 rounded-xl p-4 mb-5">
              <p className="text-xs text-yellow-400 font-mono">⚠ SMTP settings are configured via environment variables in the backend (.env file). These UI settings are for frontend display only.</p>
            </div>
            <FormField label="Admin Notification Email"><Input type="email" value={form.admin_email || ''} onChange={f('admin_email')} placeholder="admin@yourdomain.com" /></FormField>
            <FormField label="Contact Form Subject Prefix"><Input value={form.contact_subject_prefix || ''} onChange={f('contact_subject_prefix')} placeholder="[CyberFolio Contact]" /></FormField>
            <FormField label="Auto-Reply Message">
              <Textarea value={form.contact_auto_reply || ''} onChange={f('contact_auto_reply')} rows={4}
                placeholder="Thank you for reaching out. I'll review your message and get back to you within 24 hours." />
            </FormField>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-5">
            <p className="text-xs font-mono text-gray-500 tracking-wider mb-6">SECURITY SETTINGS</p>
            <div className="glass border border-cyber-green/20 rounded-xl p-4 mb-5">
              <p className="text-xs text-cyber-green font-mono">ℹ Rate limiting, CORS, JWT, and other security settings are configured server-side in the backend environment.</p>
            </div>
            <FormField label="reCAPTCHA Site Key"><Input value={form.recaptcha_site_key || ''} onChange={f('recaptcha_site_key')} placeholder="6Le..." /></FormField>
            <FormField label="Content Security Policy">
              <Textarea value={form.csp_policy || ''} onChange={f('csp_policy')} rows={3} placeholder="default-src 'self';" />
            </FormField>
            <FormField label="Allowed Referrers (one per line)">
              <Textarea value={form.allowed_referrers || ''} onChange={f('allowed_referrers')} rows={3} placeholder={"https://yourdomain.com\nhttps://www.yourdomain.com"} />
            </FormField>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-5">
            <p className="text-xs font-mono text-gray-500 tracking-wider mb-6">ADVANCED SETTINGS</p>
            <FormField label="Custom CSS (injected into head)">
              <Textarea value={form.custom_css || ''} onChange={f('custom_css')} rows={6} className="font-mono text-xs"
                placeholder="/* Custom CSS */" />
            </FormField>
            <FormField label="Custom JS (injected before </body>)">
              <Textarea value={form.custom_js || ''} onChange={f('custom_js')} rows={4} className="font-mono text-xs"
                placeholder="// Custom JavaScript" />
            </FormField>
            <FormField label="Robots.txt content">
              <Textarea value={form.robots_txt || ''} onChange={f('robots_txt')} rows={4} className="font-mono text-xs"
                placeholder={"User-agent: *\nAllow: /"} />
            </FormField>
          </div>
        )}
      </div>
    </div>
  );
}

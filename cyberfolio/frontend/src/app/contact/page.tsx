'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { sendContact, getProfile } from '@/lib/api';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import { Mail, MapPin, Clock, Send, Github, Linkedin, Shield } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
  company: z.string().optional(),
  service: z.string().optional(),
  budget: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { data: profile } = useSWR('profile', () => getProfile());

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setSending(true);
    try {
      await sendContact(data);
      setSent(true);
      reset();
      toast.success('Message sent! I\'ll get back to you soon.');
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const services = ['Web Application Pentest', 'Network Pentest', 'Red Team Operations', 'Code Review', 'Security Consulting', 'Other'];
  const budgets = ['< $1,000', '$1,000 – $5,000', '$5,000 – $20,000', '$20,000+', 'Discuss'];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-px bg-cyber-green" />
            <span className="font-mono text-xs text-cyber-green tracking-widest">GET IN TOUCH</span>
          </div>
          <h1 className="font-display text-5xl font-bold text-white mb-4">
            Start a <span className="gradient-text">Conversation</span>
          </h1>
          <p className="text-gray-400 max-w-2xl">Have a security challenge? Let's discuss how I can help protect your organization. All inquiries are treated with complete confidentiality.</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Info sidebar */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-6">

            <div className="glass cyber-border rounded-2xl p-6">
              <h3 className="font-display text-lg font-bold text-white mb-5">Contact Info</h3>
              <div className="space-y-4">
                {profile?.email && (
                  <a href={`mailto:${profile.email}`} className="flex items-start gap-3 group">
                    <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded glass border border-cyber-green/20 group-hover:border-cyber-green/40 transition-colors">
                      <Mail className="w-4 h-4 text-cyber-green" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-mono mb-0.5">Email</div>
                      <div className="text-sm text-gray-300 group-hover:text-white transition-colors">{profile.email}</div>
                    </div>
                  </a>
                )}
                {profile?.location && (
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded glass border border-cyber-green/20">
                      <MapPin className="w-4 h-4 text-cyber-green" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-mono mb-0.5">Location</div>
                      <div className="text-sm text-gray-300">{profile.location}</div>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded glass border border-cyber-green/20">
                    <Clock className="w-4 h-4 text-cyber-green" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-mono mb-0.5">Response Time</div>
                    <div className="text-sm text-gray-300">{profile?.contact?.workingHours || 'Within 24 hours'}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded glass border border-cyber-green/20">
                    <Shield className="w-4 h-4 text-cyber-green" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-mono mb-0.5">Availability</div>
                    <div className={`text-sm ${profile?.availability === 'available' ? 'text-cyber-green' : 'text-red-400'}`}>
                      {profile?.availability === 'available' ? '● Currently accepting clients' : '● Not currently available'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Socials */}
            <div className="glass cyber-border rounded-2xl p-6">
              <h3 className="font-display text-base font-bold text-white mb-4">Find Me Online</h3>
              <div className="grid grid-cols-2 gap-2">
                {profile?.socialLinks && Object.entries(profile.socialLinks).filter(([, v]) => v).slice(0, 6).map(([platform, url]) => (
                  <a key={platform} href={url as string} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 glass cyber-border rounded hover:border-cyber-green/30 transition-all group text-sm font-mono capitalize">
                    <div className="w-2 h-2 rounded-full bg-cyber-green" />
                    <span className="text-gray-400 group-hover:text-white transition-colors">{platform}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Map */}
            {profile?.contact?.mapEmbedUrl && (
              <div className="glass cyber-border rounded-2xl overflow-hidden h-48">
                <iframe src={profile.contact.mapEmbedUrl} className="w-full h-full border-0 opacity-70" loading="lazy" />
              </div>
            )}
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="lg:col-span-2">
            {sent ? (
              <div className="glass cyber-border rounded-2xl p-12 text-center">
                <div className="w-20 h-20 flex items-center justify-center glass border border-cyber-green/30 rounded-full mx-auto mb-6">
                  <Shield className="w-10 h-10 text-cyber-green animate-float" />
                </div>
                <h3 className="font-display text-2xl font-bold text-white mb-3">Message Received!</h3>
                <p className="text-gray-400 mb-6">Thank you for reaching out. I'll review your inquiry and respond within 24 hours.</p>
                <button onClick={() => setSent(false)} className="btn-cyber">Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="glass cyber-border rounded-2xl p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-2">Full Name *</label>
                    <input {...register('name')} className="input-cyber" placeholder="John Doe" />
                    {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-2">Email Address *</label>
                    <input {...register('email')} type="email" className="input-cyber" placeholder="john@company.com" />
                    {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-2">Company</label>
                    <input {...register('company')} className="input-cyber" placeholder="Your Company" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-2">Service Required</label>
                    <select {...register('service')} className="input-cyber bg-cyber-dark-2">
                      <option value="">Select a service...</option>
                      {services.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-2">Subject *</label>
                    <input {...register('subject')} className="input-cyber" placeholder="Security Assessment Request" />
                    {errors.subject && <p className="mt-1 text-xs text-red-400">{errors.subject.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-2">Budget Range</label>
                    <select {...register('budget')} className="input-cyber bg-cyber-dark-2">
                      <option value="">Select budget...</option>
                      {budgets.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-2">Message *</label>
                  <textarea {...register('message')} rows={6} className="input-cyber resize-none"
                    placeholder="Describe your security requirements, target scope, timeline, and any specific concerns..." />
                  {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 font-mono">* Required fields. All inquiries are strictly confidential.</p>
                  <button type="submit" disabled={sending} className="btn-cyber-filled btn-cyber inline-flex items-center gap-2">
                    {sending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-cyber-dark/30 border-t-cyber-dark rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

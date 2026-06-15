'use client';
import { useState, useRef } from 'react';
import useSWR, { mutate } from 'swr';
import { getMedia, uploadMedia, deleteMedia } from '@/lib/api';
import { Upload, Trash2, Copy, Image as ImageIcon, FileText, Loader2, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminMediaPage() {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [folder, setFolder] = useState('general');
  const [preview, setPreview] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useSWR(['admin-media', folder], () => getMedia({ folder, limit: 50 }));

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('folder', folder);
        await uploadMedia(fd);
      }
      mutate(['admin-media', folder]);
      toast.success(`${files.length} file(s) uploaded`);
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this file?')) return;
    setDeleting(id);
    try {
      await deleteMedia(id);
      mutate(['admin-media', folder]);
      if (preview?._id === id) setPreview(null);
      toast.success('File deleted');
    } catch { toast.error('Failed to delete'); }
    finally { setDeleting(null); }
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
    toast.success('URL copied!');
  };

  const folders = ['general', 'projects', 'blog', 'certificates', 'avatars', 'misc'];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-white">Media Library</h1>
        <div className="flex items-center gap-3">
          <input ref={fileInputRef} type="file" multiple accept="image/*,application/pdf" onChange={handleUpload} className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
            className="btn-cyber inline-flex items-center gap-2 text-xs">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'Uploading...' : 'Upload Files'}
          </button>
        </div>
      </div>

      {/* Folder tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {folders.map(f => (
          <button key={f} onClick={() => setFolder(f)}
            className={`px-3 py-1.5 rounded font-mono text-xs capitalize transition-all ${folder === f ? 'bg-cyber-green text-cyber-dark font-bold' : 'glass cyber-border text-gray-400 hover:text-white'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={e => { e.preventDefault(); }}
        onDrop={async e => {
          e.preventDefault();
          const files = e.dataTransfer.files;
          if (!files.length) return;
          setUploading(true);
          try {
            for (const file of Array.from(files)) {
              const fd = new FormData();
              fd.append('file', file);
              fd.append('folder', folder);
              await uploadMedia(fd);
            }
            mutate(['admin-media', folder]);
            toast.success('Files uploaded');
          } catch { toast.error('Upload failed'); }
          finally { setUploading(false); }
        }}
        className="glass cyber-border border-dashed rounded-xl p-8 text-center mb-6 hover:border-cyber-green/30 transition-all cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-cyber-green animate-spin" />
            <p className="text-sm text-gray-400 font-mono">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-cyber-green/40" />
            <p className="text-sm text-gray-400">Drag & drop files here, or click to select</p>
            <p className="text-xs text-gray-600 font-mono">Images (JPG, PNG, WebP) and PDFs up to 10MB</p>
          </div>
        )}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center p-16"><Loader2 className="w-8 h-8 text-cyber-green animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {data?.media?.map((item: any) => (
            <div key={item._id}
              className={`group relative glass rounded-xl overflow-hidden cursor-pointer transition-all hover:border-cyber-green/30 cyber-border ${preview?._id === item._id ? 'border-cyber-green/40' : ''}`}
              onClick={() => setPreview(preview?._id === item._id ? null : item)}
            >
              {/* Thumbnail */}
              <div className="aspect-square bg-cyber-dark-3 flex items-center justify-center overflow-hidden">
                {item.type === 'image' ? (
                  <img src={item.url} alt={item.alt || item.filename} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <FileText className="w-8 h-8 text-gray-500" />
                )}
              </div>
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={e => { e.stopPropagation(); copyUrl(item.url, item._id); }}
                  className="w-7 h-7 flex items-center justify-center bg-cyber-dark/80 rounded text-cyber-green hover:bg-cyber-dark transition-colors">
                  {copied === item._id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </button>
                <button onClick={e => { e.stopPropagation(); handleDelete(item._id); }}
                  className="w-7 h-7 flex items-center justify-center bg-cyber-dark/80 rounded text-red-400 hover:bg-cyber-dark transition-colors">
                  {deleting === item._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                </button>
              </div>
              <div className="p-1.5">
                <p className="text-xs text-gray-500 truncate font-mono">{item.originalName || item.filename}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {data?.media?.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center p-16 text-gray-500">
          <ImageIcon className="w-12 h-12 mb-3 opacity-20" />
          <p className="font-mono text-sm">No files in "{folder}" folder</p>
        </div>
      )}

      {/* Preview panel */}
      {preview && (
        <div className="fixed inset-y-0 right-0 w-80 glass-strong border-l border-cyber-green/10 p-6 z-40 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">File Details</h3>
            <button onClick={() => setPreview(null)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          {preview.type === 'image' && (
            <div className="rounded-lg overflow-hidden bg-cyber-dark-3 mb-4">
              <img src={preview.url} alt={preview.alt} className="w-full object-contain max-h-48" />
            </div>
          )}
          <div className="space-y-3 text-sm">
            {[
              { label: 'Filename', value: preview.originalName || preview.filename },
              { label: 'Type', value: preview.mimeType },
              { label: 'Size', value: preview.size ? `${(preview.size / 1024).toFixed(1)} KB` : '—' },
              { label: 'Folder', value: preview.folder },
            ].map(row => (
              <div key={row.label}>
                <div className="text-xs font-mono text-gray-500 mb-0.5">{row.label}</div>
                <div className="text-gray-300 break-all">{row.value}</div>
              </div>
            ))}
            <div>
              <div className="text-xs font-mono text-gray-500 mb-1">URL</div>
              <div className="flex gap-2">
                <input value={preview.url} readOnly className="input-cyber text-xs py-1.5 flex-1 min-w-0" />
                <button onClick={() => copyUrl(preview.url, preview._id)} className="flex-shrink-0 w-8 h-8 flex items-center justify-center glass cyber-border rounded text-cyber-green hover:border-cyber-green/40">
                  {copied === preview._id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

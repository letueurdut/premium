'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onUpload: (url: string) => void;
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
}

export default function FileUpload({ onUpload, multiple = false, maxFiles = 1, className }: FileUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);

    try {
      const fileArray = Array.from(files).slice(0, maxFiles - previews.length);
      const urls: string[] = [];

      for (const file of fileArray) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (!res.ok) { setError(data.error || 'Upload failed.'); continue; }
        urls.push(data.url);
        onUpload(data.url);
      }

      setPreviews(prev => [...prev, ...urls]);
    } catch {
      setError('Upload failed.');
    } finally {
      setUploading(false);
    }
  }, [onUpload, maxFiles, previews.length]);

  const removePreview = (index: number) => setPreviews(prev => prev.filter((_, i) => i !== index));

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  return (
    <div className={cn('space-y-3', className)}>
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        className={cn(
          'relative flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all',
          uploading ? 'border-roulette-red bg-red-900/10' : 'border-roulette-border hover:border-roulette-red hover:bg-roulette-card/50'
        )}
      >
        {uploading ? (
          <>
            <svg className="animate-spin h-8 w-8 text-roulette-red" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-sm text-roulette-muted">Uploading...</span>
          </>
        ) : (
          <>
            <Upload className="w-8 h-8 text-roulette-muted" />
            <div className="text-center">
              <p className="text-sm text-white font-medium">Click or drag & drop</p>
              <p className="text-xs text-roulette-muted mt-1">JPEG, PNG, WebP or GIF</p>
            </div>
          </>
        )}
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple={multiple} onChange={e => handleFiles(e.target.files)} className="hidden" />
      </div>

      {previews.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {previews.map((url, i) => (
            <div key={i} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-roulette-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button onClick={() => removePreview(i)} className="absolute top-0.5 right-0.5 p-0.5 bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <X size={12} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
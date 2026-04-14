'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Loader2, ImageIcon, Film, AlertCircle } from 'lucide-react';
import { storage } from '@/lib/supabase/storage';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import Image from 'next/image';

export default function FileUploader({ 
  value, 
  onChange, 
  label = "رفع ملف", 
  accept = "image/*", 
  aspectRatio = "1/1" 
}: { 
  value: string; 
  onChange: (url: string) => void; 
  label?: string;
  accept?: string;
  aspectRatio?: string;
}) {

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const isVideo = accept?.includes('video');

  const handleUpload = async (file: File) => {
    // Vercel limit is 4.5MB, MongoDB document limit is 16MB (Base64 adds 33% overhead)
    // If not using Supabase, we must stay under Vercel's limit
    const VERCEL_LIMIT = 4 * 1024 * 1024; // 4MB safe limit
    const maxSizeBytes = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    
    if (file.size > maxSizeBytes) {
      alert(`حجم الملف كبير جداً. الحد الأقصى هو ${maxSizeBytes / (1024 * 1024)}MB`);
      return;
    }

    if (!isSupabaseConfigured && file.size > VERCEL_LIMIT) {
      alert('نظراً لقيود الخادم، لا يمكن رفع ملفات أكبر من 4.5 ميجابايت بدون إعداد Supabase. يرجى إعداد Supabase للملفات الكبيرة أو تقليل حجم الملف.');
      return;
    }

    setIsUploading(true);
    try {
      let url = '';

      // 1. Try Supabase Storage if configured
      if (isSupabaseConfigured) {
        const bucket = isVideo ? 'videos' : 'website-images';
        const uploadedUrl = await storage.uploadFile(file, bucket);
        if (uploadedUrl) {
          url = uploadedUrl;
          
          // Also register in local Media library
          try {
            await fetch('/api/upload', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('admin_token')}` 
              },
              body: JSON.stringify({ url, name: file.name, skipSave: true })
            });
          } catch (e) {
            console.error('Failed to register media in DB:', e);
          }
        }
      } 
      
      // 2. Fallback to API upload (Base64)
      if (!url) {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` },
          body: formData
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || `Server responded with ${res.status}`);
        }

        const data = await res.json();
        url = data.url;
      }

      if (url) {
        onChange(url);
      } else {
        throw new Error('فشل في الحصول على رابط الملف');
      }
    } catch (err: any) {
      console.error('Upload Error Details:', err);
      if (err.message.includes('413') || err.message.toLowerCase().includes('large')) {
        alert('حجم الملف كبير جداً بالنسبة للخادم. يرجى استخدام ملف أصغر (أقل من 4MB) أو تفعيل Supabase.');
      } else {
        alert(err.message || 'حدث خطأ أثناء الاتصال بالخادم. تأكد من حجم الملف والاتصال بالإنترنت.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <label className="admin-label" style={{ marginBottom: '0' }}>{label}</label>

      <div
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => document.getElementById(`upload-${label}`)?.click()}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio,
          background: isDragging ? 'rgba(14, 165, 233, 0.08)' : 'rgba(255, 255, 255, 0.03)',
          border: `2px dashed ${isDragging ? 'var(--color-primary)' : 'var(--color-border)'}`,
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isUploading ? 'not-allowed' : 'pointer',
          overflow: 'hidden',
          transition: 'all 0.2s ease',
          minHeight: '140px'
        }}
      >
        {isUploading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', color: 'var(--color-primary)' }}>
            <Loader2 className="animate-spin" size={32} />
            <span style={{ fontSize: '13px', fontWeight: 700 }}>جاري الرفع...</span>
          </div>
        ) : value ? (
          <>
            {isVideo ? (
              <video src={value} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Image src={value} alt="preview" fill style={{ objectFit: 'cover' }} />
            )}
            {/* Overlay to re-upload */}
            <div style={{ 
              position: 'absolute', inset: 0, 
              background: 'rgba(0,0,0,0.4)', opacity: 0, 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: '0.2s'
            }} onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = '0'}>
               <Upload size={24} color="white" />
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onChange(''); }}
              style={{ position: 'absolute', top: '10px', left: '10px', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', color: 'var(--color-text-muted)' }}>
            {isVideo ? <Film size={32} /> : <ImageIcon size={32} />}
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, display: 'block', color: 'var(--color-text-secondary)' }}>اسحب الملف هنا</span>
              <span style={{ fontSize: '11px' }}>أو انقر للاختيار</span>
            </div>
          </div>
        )}

        <input
          id={`upload-${label}`}
          hidden
          type="file"
          accept={accept}
          disabled={isUploading}
          onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])}
        />
      </div>
    </div>
  );
}

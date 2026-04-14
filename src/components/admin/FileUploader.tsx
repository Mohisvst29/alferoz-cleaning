'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Loader2, ImageIcon, Film } from 'lucide-react';
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
    const maxSizeBytes = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    
    if (file.size > maxSizeBytes) {
      alert(`حجم الملف كبير جداً. الحد الأقصى هو ${maxSizeBytes / (1024 * 1024)}MB`);
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` },
        body: formData
      });

      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
      } else {
        alert(data.error || 'فشل في رفع الملف');
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الاتصال بالخادم');
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

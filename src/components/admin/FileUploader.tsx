'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function FileUploader({ 
  value, 
  onChange, 
  label, 
  accept = "image/*", 
  aspectRatio = "1/1" 
}: { 
  value: string; 
  onChange: (url: string) => void; 
  label: string;
  accept?: string;
  aspectRatio?: string;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const isVideo = accept?.includes('video');
  const maxSizeBytes = isVideo ? 100 * 1024 * 1024 : 5 * 1024 * 1024; // 100MB for video, 5MB for images

  const handleUpload = async (file: File) => {
    if (file.size > maxSizeBytes) {
      alert(`حجم الملف كبير جداً. الحد الأقصى ${isVideo ? '100' : '5'} ميجابايت.`);
      return;
    }
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (res.ok && data.url) {
        onChange(data.url);
      } else {
        alert(data.error || 'فشل في رفع الملف');
      }
    } catch (err) {
      console.error('Upload Error:', err);
      alert('حدث خطأ أثناء الاتصال بالسيرفر');
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{label}</label>
      
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: aspectRatio,
          borderRadius: '16px',
          border: '2px dashed',
          borderColor: isDragging ? 'var(--color-primary)' : 'var(--color-border)',
          background: isDragging ? 'rgba(14, 165, 233, 0.05)' : 'rgba(15, 23, 42, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: '0.3s',
          overflow: 'hidden'
        }}
        onClick={() => !value && document.getElementById(`upload-${label}`)?.click()}
      >
        {value ? (
          <>
            {isVideo ? (
              <video src={value} style={{ width: '100%', height: '100%', objectFit: 'contain' }} muted loop autoPlay playsInline />
            ) : (
              <Image src={value} alt="Preview" fill style={{ objectFit: 'contain', padding: '10px' }} />
            )}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', opacity: 0, transition: '0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="hover-overlay">
               <button 
                  onClick={(e) => { e.stopPropagation(); document.getElementById(`upload-${label}`)?.click(); }}
                  style={{ background: 'white', color: 'black', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                >
                  تغيير {isVideo ? 'الفيديو' : 'الصورة'}
                </button>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onChange(''); }}
              style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(239, 68, 68, 0.8)', border: 'none', color: 'white', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            {isUploading ? (
              <Loader2 className="animate-spin" size={32} color="var(--color-primary)" />
            ) : (
              <>
                <Upload size={32} color="var(--color-text-muted)" style={{ marginBottom: '12px' }} />
                <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>اسحب {isVideo ? 'الفيديو' : 'الصورة'} هنا أو اضغط للرفع</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  {isVideo ? 'MP4, WEBM (Max 100MB)' : 'PNG, JPG, WEBP, SVG (Max 5MB)'}
                </div>
              </>
            )}
          </div>
        )}
        <input 
          id={`upload-${label}`} 
          type="file" 
          hidden 
          accept={accept} 
          onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} 
        />
      </div>

      <style jsx>{`
        .hover-overlay:hover { opacity: 1 !important; }
      `}</style>
    </div>
  );
}

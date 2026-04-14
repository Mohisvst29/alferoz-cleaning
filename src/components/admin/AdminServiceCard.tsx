'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Edit, Trash2, Upload, CheckCircle, XCircle, ImageIcon } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  active: boolean;
}

export default function AdminServiceCard({ 
  service, 
  onEdit, 
  onDelete, 
  onToggleStatus, 
  onUploadImage 
}: { 
  service: Service; 
  onEdit: () => void; 
  onDelete: () => void;
  onToggleStatus: () => void;
  onUploadImage: (file: File) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      await onUploadImage(file);
      setUploading(false);
    }
  };

  return (
    <div className="admin-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Image Preview */}
      <div style={{ position: 'relative', height: '180px', width: '100%', background: '#1e293b' }}>
        {service.image ? (
          <Image src={service.image} alt={service.title} fill style={{ objectFit: 'cover' }} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-muted)' }}>
            <ImageIcon size={48} />
            <span style={{ fontSize: '12px', marginTop: '8px' }}>لا توجد صورة</span>
          </div>
        )}
        
        {/* Status Badge */}
        <div style={{ 
          position: 'absolute', top: '12px', right: '12px', 
          padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700,
          background: service.active ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
          color: 'white', display: 'flex', alignItems: 'center', gap: '4px'
        }}>
          {service.active ? <CheckCircle size={12} /> : <XCircle size={12} />}
          {service.active ? 'نشط' : 'غير نشط'}
        </div>
      </div>

      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '8px', color: 'white' }}>{service.title}</h3>
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '20px', flex: 1 }}>
          {service.description.substring(0, 80)}...
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
          <button onClick={onEdit} className="admin-btn-secondary">
            <Edit size={14} /> تعديل
          </button>
          <button onClick={onToggleStatus} className="admin-btn-secondary">
            {service.active ? 'إيقاف' : 'تنشيط'}
          </button>
        </div>

        <label style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          padding: '10px', borderRadius: '8px', background: 'var(--color-primary)', color: 'white',
          fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: '0.3s'
        }} className="hover-opacity">
          <Upload size={14} /> {uploading ? 'جاري الرفع...' : 'رفع صورة'}
          <input type="file" hidden accept="image/*" onChange={handleFileChange} disabled={uploading} />
        </label>

        <button onClick={onDelete} style={{ 
          marginTop: '8px', background: 'transparent', border: 'none', color: '#ef4444', 
          fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
        }}>
          <Trash2 size={12} /> حذف الخدمة
        </button>
      </div>

      <style jsx>{`
        .admin-btn-secondary {
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 8px;
          color: white;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: 0.3s;
        }
        .admin-btn-secondary:hover {
          background: rgba(255,255,255,0.1);
        }
        .hover-opacity:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}

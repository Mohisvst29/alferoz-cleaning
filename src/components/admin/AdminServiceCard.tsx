'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Edit, Trash2, Upload, CheckCircle, XCircle, ImageIcon, Loader2 } from 'lucide-react';

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
      <div style={{ position: 'relative', height: '160px', width: '100%', background: '#1e293b' }}>
        {service.image ? (
          <Image src={service.image} alt={service.title} fill style={{ objectFit: 'cover' }} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-muted)' }}>
            <ImageIcon size={40} />
            <span style={{ fontSize: '11px', marginTop: '6px' }}>بدون صورة</span>
          </div>
        )}
        
        {/* Status Badge */}
        <div style={{ 
          position: 'absolute', top: '10px', right: '10px', 
          padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 800,
          background: service.active ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)',
          backdropFilter: 'blur(4px)',
          color: 'white', display: 'flex', alignItems: 'center', gap: '4px'
        }}>
          {service.active ? <CheckCircle size={10} /> : <XCircle size={10} />}
          {service.active ? 'نشط' : 'معطل'}
        </div>
      </div>

      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 900, marginBottom: '6px', color: 'white' }}>{service.title}</h3>
        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '16px', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {service.description}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
          <button onClick={onEdit} className="btn-secondary btn-sm" style={{ width: '100%' }}>
            <Edit size={14} /> تعديل
          </button>
          <button onClick={onToggleStatus} className="btn-secondary btn-sm" style={{ width: '100%' }}>
            {service.active ? 'إيقاف' : 'تبديل'}
          </button>
        </div>

        <button 
          onClick={onDelete} 
          className="btn-danger btn-sm" 
          style={{ width: '100%', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)' }}
        >
          <Trash2 size={13} /> حذف الخدمة
        </button>
      </div>
    </div>
  );
}

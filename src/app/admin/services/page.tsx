'use client';

import { useState, useEffect } from 'react';
import AdminServiceCard from '@/components/admin/AdminServiceCard';
import FileUploader from '@/components/admin/FileUploader';
import { Plus, Search, Loader2, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    image: '',
    active: true,
    sort_order: 0
  });

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    setLoading(true);
    const res = await fetch('/api/services');
    const data = await res.json();
    setServices(data || []);
    setLoading(false);
  };

  const handleOpenModal = (service: any = null) => {
    if (service) {
      setFormData(service);
    } else {
      setFormData({ id: '', title: '', description: '', image: '', active: true, sort_order: services.length });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const method = formData.id ? 'PUT' : 'POST';
    const url = '/api/services';
    
    const payload = formData.id
      ? formData
      : {
          title: formData.title,
          description: formData.description,
          image: formData.image,
          active: formData.active
        };

    await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
      },
      body: JSON.stringify(payload),
    });
    
    setSaving(false);
    setIsModalOpen(false);
    fetchServices();
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    await fetch('/api/services', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
      },
      body: JSON.stringify({ id, active: !currentStatus }),
    });
    fetchServices();
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
      await fetch(`/api/services?id=${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
      });
      fetchServices();
    }
  };

  const filteredServices = services.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '8px' }}>إدارة الخدمات</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>تحكم في الخدمات المعروضة لعملائك على الموقع.</p>
        </div>
        <button className="btn-saas btn-saas-primary" onClick={() => handleOpenModal()}>
          <Plus size={20} /> إضافة خدمة جديدة
        </button>
      </div>

      <div className="admin-card" style={{ marginBottom: '32px', padding: '16px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input 
            type="text" 
            placeholder="البحث عن خدمة..." 
            className="input-saas" 
            style={{ width: '100%', paddingRight: '48px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
          <Loader2 className="animate-spin" size={48} color="var(--color-primary)" />
        </div>
      ) : (
        <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {filteredServices.map((service) => (
            <AdminServiceCard 
              key={service.id} 
              service={service}
              onToggleStatus={() => handleToggleStatus(service.id, service.active)}
              onDelete={() => handleDelete(service.id)}
              onEdit={() => handleOpenModal(service)}
              onUploadImage={() => {}} // Now handled via edit modal for consistency
            />
          ))}
        </div>
      )}

      {/* Service Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(8px)' }} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="admin-card" style={{ position: 'relative', width: '100%', maxWidth: '600px', padding: '40px', zIndex: 1001, background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 900 }}>{formData.id ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}</h2>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X size={24} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--color-text-secondary)' }}>اسم الخدمة</label>
                  <input className="input-saas" style={{ width: '100%' }} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="مثال: تنظيف الفلل" />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--color-text-secondary)' }}>وصف الخدمة</label>
                  <textarea className="input-saas" style={{ width: '100%' }} rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="اكتب وصفاً مختصراً للخدمة..." />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 200px', gap: '24px', alignItems: 'end' }}>
                  <FileUploader 
                    label="صورة الخدمة" 
                    value={formData.image} 
                    onChange={url => setFormData({...formData, image: url})}
                    aspectRatio="16/9"
                  />
                  <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)' }}>
                     <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontWeight: 700 }}>
                        <input type="checkbox" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} style={{ width: '20px', height: '20px' }} />
                        خدمة نشطة
                     </label>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                   <button className="btn-saas btn-saas-primary" style={{ flex: 1 }} onClick={handleSave} disabled={saving}>
                     {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} حفظ الخدمة
                   </button>
                   <button className="btn-saas" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'white' }} onClick={() => setIsModalOpen(false)}>إلغاء</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @media (max-width: 600px) {
          .services-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

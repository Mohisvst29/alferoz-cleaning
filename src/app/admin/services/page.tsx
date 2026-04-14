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
    const payload = formData.id
      ? formData
      : { title: formData.title, description: formData.description, image: formData.image, active: formData.active };

    await fetch('/api/services', {
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
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontWeight: 900, marginBottom: '6px' }}>إدارة الخدمات</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>تحكم في الخدمات المعروضة لعملائك على الموقع.</p>
        </div>
        <button className="btn-saas btn-saas-primary" style={{ flexShrink: 0 }} onClick={() => handleOpenModal()}>
          <Plus size={18} /> إضافة خدمة
        </button>
      </div>

      {/* Search */}
      <div className="admin-card" style={{ marginBottom: '24px', padding: '16px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input 
            type="text" 
            placeholder="البحث عن خدمة..." 
            className="input-saas" 
            style={{ paddingRight: '44px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
          <Loader2 className="animate-spin" size={40} color="var(--color-primary)" />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {filteredServices.map((service) => (
            <AdminServiceCard 
              key={service.id} 
              service={service}
              onToggleStatus={() => handleToggleStatus(service.id, service.active)}
              onDelete={() => handleDelete(service.id)}
              onEdit={() => handleOpenModal(service)}
              onUploadImage={() => {}}
            />
          ))}
        </div>
      )}

      {/* Service Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="admin-modal-overlay">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsModalOpen(false)} 
              style={{ position: 'absolute', inset: 0 }} 
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              style={{ 
                position: 'relative', 
                width: '100%', 
                maxWidth: '580px', 
                zIndex: 1001,
                background: '#0f172a',
                border: '1px solid var(--color-border)',
                borderRadius: '20px',
                overflow: 'hidden',
                maxHeight: '92vh',
                overflowY: 'auto'
              }}
            >
              {/* Header */}
              <div style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '20px 24px', borderBottom: '1px solid var(--color-border)',
                position: 'sticky', top: 0, background: '#0f172a', zIndex: 2
              }}>
                <h2 style={{ fontSize: '20px', fontWeight: 900 }}>
                  {formData.id ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  style={{ 
                    background: 'rgba(255,255,255,0.06)', border: '1px solid var(--color-border)',
                    color: 'white', cursor: 'pointer', width: '36px', height: '36px',
                    borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label className="admin-label">اسم الخدمة</label>
                  <input 
                    className="input-saas" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    placeholder="مثال: تنظيف الفلل" 
                  />
                </div>
                
                <div>
                  <label className="admin-label">وصف الخدمة</label>
                  <textarea 
                    className="input-saas" 
                    rows={3} 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    placeholder="اكتب وصفاً مختصراً للخدمة..."
                  />
                </div>

                <FileUploader 
                  label="صورة الخدمة" 
                  value={formData.image} 
                  onChange={url => setFormData({...formData, image: url})}
                  aspectRatio="16/9"
                />

                <label style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
                  padding: '14px 16px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)'
                }}>
                  <input 
                    type="checkbox" 
                    checked={formData.active} 
                    onChange={e => setFormData({...formData, active: e.target.checked})} 
                    style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }} 
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px' }}>خدمة نشطة</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>ستظهر هذه الخدمة للزوار على الموقع</div>
                  </div>
                </label>

                <div style={{ display: 'flex', gap: '12px', paddingTop: '4px' }}>
                  <button 
                    className="btn-saas btn-saas-primary" 
                    style={{ flex: 1 }} 
                    onClick={handleSave} 
                    disabled={saving}
                  >
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {saving ? 'جاري الحفظ...' : 'حفظ الخدمة'}
                  </button>
                  <button 
                    className="btn-saas" 
                    style={{ flex: 1, background: 'rgba(255,255,255,0.04)' }} 
                    onClick={() => setIsModalOpen(false)}
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Star, Plus, Trash2, Edit2, CheckCircle, X, Loader2, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  city: string;
  active: boolean;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', text: '', rating: 5, city: '', active: true });
  const [saving, setSaving] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';

  const fetchTestimonials = useCallback(async () => {
    try {
      const res = await fetch('/api/testimonials');
      const data = await res.json();
      if (Array.isArray(data)) setTestimonials(data);
    } catch { /* empty */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchTestimonials(); }, [fetchTestimonials]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const method = editingId ? 'PUT' : 'POST';
    const body = editingId ? { id: editingId, ...formData } : formData;

    await fetch('/api/testimonials', {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });

    setSaving(false);
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', text: '', rating: 5, city: '', active: true });
    fetchTestimonials();
  };

  const editTestimonial = (t: Testimonial) => {
    setFormData({ name: t.name, text: t.text, rating: t.rating, city: t.city, active: t.active });
    setEditingId(t.id);
    setShowForm(true);
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التقييم؟')) return;
    await fetch(`/api/testimonials?id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTestimonials();
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontWeight: 900, marginBottom: '6px' }}>آراء العملاء</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>إدارة التقييمات التي تظهر في الصفحة الرئيسية</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ name: '', text: '', rating: 5, city: '', active: true }); }}
          className="btn-saas btn-saas-primary"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'إغلاق النموذج' : 'إضافة تقييم جديد'}
        </button>
      </div>

      {/* Form Overlay */}
      <AnimatePresence>
        {showForm && (
          <div className="admin-modal-overlay" style={{ zIndex: 200 }}>
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }} 
               animate={{ opacity: 1, scale: 1, y: 0 }} 
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="admin-modal-content"
               style={{ maxWidth: '600px' }}
             >
                <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between' }}>
                   <h2 style={{ fontSize: '18px', fontWeight: 800 }}>{editingId ? 'تعديل التقييم' : 'إضافة تقييم جديد'}</h2>
                   <button onClick={() => setShowForm(false)} style={{ background: 'transparent', border: 'none', color: 'white' }}><X size={20} /></button>
                </div>
                
                <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="stats-grid">
                      <div>
                        <label className="form-label">اسم العميل</label>
                        <input type="text" required className="input-saas" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
                      </div>
                      <div>
                        <label className="form-label">المدينة</label>
                        <input type="text" className="input-saas" value={formData.city} onChange={e => setFormData(p => ({ ...p, city: e.target.value }))} />
                      </div>
                   </div>
                   
                   <div>
                      <label className="form-label">التقييم (عدد النجوم)</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {[1,2,3,4,5].map(nu => (
                          <button 
                            key={nu} type="button" 
                            onClick={() => setFormData(p => ({...p, rating: nu}))}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: nu <= formData.rating ? 'var(--color-gold)' : 'rgba(255,255,255,0.1)' }}
                          >
                            <Star size={24} fill={nu <= formData.rating ? 'currentColor' : 'none'} />
                          </button>
                        ))}
                      </div>
                   </div>

                   <div>
                      <label className="form-label">نص التقييم</label>
                      <textarea required className="input-saas" rows={4} value={formData.text} onChange={e => setFormData(p => ({ ...p, text: e.target.value }))} />
                   </div>

                   <button type="submit" className="btn-saas btn-saas-primary" style={{ width: '100%', marginTop: '8px' }} disabled={saving}>
                      {saving ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                      {saving ? 'جاري الحفظ...' : 'حفظ التقييم'}
                   </button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
          <Loader2 className="animate-spin" size={40} color="var(--color-primary)" />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <MessageSquare size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '16px', opacity: 0.5 }} />
          <p style={{ color: 'var(--color-text-secondary)' }}>لا توجد تقييمات مضافة حالياً</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {testimonials.map((t, i) => (
            <motion.div 
              key={t.id} 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="admin-card" 
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ display: 'flex', gap: '2px', marginBottom: '12px' }}>
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={14} fill={s <= t.rating ? 'var(--color-gold)' : 'none'} color={s <= t.rating ? 'var(--color-gold)' : 'rgba(255,255,255,0.1)'} />
                ))}
              </div>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '20px', flex: 1 }}>
                « {t.text} »
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: 'white' }}>{t.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{t.city}</div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                   <button onClick={() => editTestimonial(t)} className="btn-secondary btn-sm" style={{ padding: '6px' }} title="تعديل"><Edit2 size={14} /></button>
                   <button onClick={() => deleteTestimonial(t.id)} className="btn-danger btn-sm" style={{ padding: '6px' }} title="حذف"><Trash2 size={14} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

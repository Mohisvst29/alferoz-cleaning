'use client';

import { useState, useEffect, useCallback } from 'react';

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
    const method = editingId ? 'PUT' : 'POST';
    const body = editingId ? { id: editingId, ...formData } : formData;

    await fetch('/api/testimonials', {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '4px' }}>إدارة التقييمات</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>{testimonials.length} تقييم</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ name: '', text: '', rating: 5, city: '', active: true }); }}
          className="btn-primary btn-sm"
        >
          <span>{showForm ? 'إغلاق' : 'إضافة تقييم +'}</span>
        </button>
      </div>

      {showForm && (
        <div className="glass-section" style={{ padding: '32px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>
            {editingId ? 'تعديل التقييم' : 'إضافة تقييم جديد'}
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <label className="form-label">اسم العميل</label>
                <input type="text" required className="form-input" value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} />
              </div>
              <div>
                <label className="form-label">المدينة</label>
                <input type="text" className="form-input" value={formData.city} onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))} />
              </div>
              <div>
                <label className="form-label">التقييم (1-5)</label>
                <input type="number" min={1} max={5} className="form-input" value={formData.rating} onChange={e => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) || 5 }))} />
              </div>
            </div>
            <div>
              <label className="form-label">نص التقييم</label>
              <textarea required className="form-input" rows={3} value={formData.text} onChange={e => setFormData(prev => ({ ...prev, text: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn-primary btn-sm"><span>{editingId ? 'تحديث' : 'إضافة'}</span></button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary btn-sm">إلغاء</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}><div className="spinner" /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {testimonials.map(t => (
            <div key={t.id} className="glass-card" style={{ padding: '24px' }}>
              <div className="stars" style={{ marginBottom: '12px' }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <span key={s} className={`star ${s <= t.rating ? '' : 'empty'}`}>★</span>
                ))}
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: 1.8, marginBottom: '16px', minHeight: '60px' }}>{t.text}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>{t.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{t.city}</div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => editTestimonial(t)} className="btn-secondary btn-sm" style={{ padding: '4px 10px', fontSize: '12px' }}>تعديل</button>
                  <button onClick={() => deleteTestimonial(t.id)} className="btn-danger" style={{ padding: '4px 10px', fontSize: '12px' }}>حذف</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

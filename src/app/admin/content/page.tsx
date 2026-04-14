'use client';

import { useState, useEffect } from 'react';
import FileUploader from '@/components/admin/FileUploader';
import { Plus, Search, Loader2, X, Save, FileText, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    image: '',
    status: 'published'
  });

  useEffect(() => { fetchArticles(); }, []);

  const fetchArticles = async () => {
    setLoading(true);
    const res = await fetch('/api/articles');
    const data = await res.json();
    setArticles(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleOpenModal = (article: any = null) => {
    if (article) {
      setFormData(article);
    } else {
      setFormData({ id: '', title: '', slug: '', content: '', excerpt: '', image: '', status: 'published' });
    }
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    const slug = val.toLowerCase().replace(/[\s\W-]+/g, '-');
    setFormData({ ...formData, title: val, slug: formData.id ? formData.slug : slug });
  };

  const handleSave = async () => {
    setSaving(true);
    const method = formData.id ? 'PUT' : 'POST';
    const payload = { ...formData };
    if (!payload.id) delete payload.id;

    await fetch('/api/articles', {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
      },
      body: JSON.stringify(payload),
    });
    
    setSaving(false);
    setIsModalOpen(false);
    fetchArticles();
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    await fetch('/api/articles', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
      },
      body: JSON.stringify({ id, status: newStatus }),
    });
    fetchArticles();
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المقال؟')) {
      await fetch(`/api/articles?id=${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
      });
      fetchArticles();
    }
  };

  const filteredArticles = articles.filter(a => 
    a?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '8px' }}>المدونة والمقالات</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>إدارة المحتوى المكتوب والمقالات في الموقع.</p>
        </div>
        <button className="btn-saas btn-saas-primary" onClick={() => handleOpenModal()}>
          <Plus size={20} /> إضافة مقال جديد
        </button>
      </div>

      <div className="admin-card" style={{ marginBottom: '32px', padding: '16px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input 
            type="text" 
            placeholder="البحث عن مقال..." 
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {filteredArticles.map((article) => (
            <div key={article.id} className="admin-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {article.image && (
                  <div style={{ width: '100%', height: '160px', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                      <img src={article.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800 }}>{article.title}</h3>
                  <button onClick={() => handleToggleStatus(article.id, article.status)} className="btn-saas" style={{ padding: '6px 12px', fontSize: '12px', background: article.status === 'published' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: article.status === 'published' ? '#10b981' : '#ef4444' }}>
                    {article.status === 'published' ? 'منشور' : 'مسودة'}
                  </button>
                </div>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', flex: 1 }}>{article.excerpt}</p>
                
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
                    <button className="btn-saas btn-saas-secondary" style={{ flex: 1, padding: '8px' }} onClick={() => handleOpenModal(article)}>تعديل</button>
                    <button className="btn-saas" style={{ flex: 1, padding: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444' }} onClick={() => handleDelete(article.id)}>حذف</button>
                </div>
            </div>
          ))}
        </div>
      )}

      {/* Article Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(8px)' }} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="admin-card" style={{ position: 'relative', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '40px', zIndex: 1001, background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 900 }}>{formData.id ? 'تعديل المقال' : 'إضافة مقال جديد'}</h2>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X size={24} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--color-text-secondary)' }}>عنوان المقال</label>
                      <input className="input-saas" style={{ width: '100%' }} value={formData.title} onChange={e => handleTitleChange(e.target.value)} placeholder="مثال: أفضل طرق تنظيف الكنب" />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--color-text-secondary)' }}>الرابط (Slug)</label>
                      <input className="input-saas" style={{ width: '100%' }} value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} placeholder="best-cleaning-tips" />
                    </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--color-text-secondary)' }}>مقتطف قصير (يظهر في القائمة)</label>
                  <textarea className="input-saas" style={{ width: '100%' }} rows={2} value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} placeholder="ملخص قصير للمقال..." />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--color-text-secondary)' }}>محتوى المقال (HTML مدعوم)</label>
                  <textarea className="input-saas" style={{ width: '100%' }} rows={8} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} placeholder="<p>اكتب هنا...</p>" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 200px', gap: '24px', alignItems: 'end' }}>
                  <FileUploader 
                    label="صورة الغلاف (Cover Image)" 
                    value={formData.image} 
                    onChange={url => setFormData({...formData, image: url})}
                    aspectRatio="16/9"
                  />
                  <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)' }}>
                     <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontWeight: 700 }}>
                        <input type="checkbox" checked={formData.status === 'published'} onChange={e => setFormData({...formData, status: e.target.checked ? 'published' : 'draft'})} style={{ width: '20px', height: '20px' }} />
                        مقال منشور
                     </label>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                   <button className="btn-saas btn-saas-primary" style={{ flex: 1 }} onClick={handleSave} disabled={saving}>
                     {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} حفظ المقال
                   </button>
                   <button className="btn-saas" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'white' }} onClick={() => setIsModalOpen(false)}>إلغاء</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

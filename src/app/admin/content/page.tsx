'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, FileText, Loader2, X, Eye } from 'lucide-react';
import FileUploader from '@/components/admin/FileUploader';
import Link from 'next/link';

export default function ContentAdmin() {
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

  useEffect(() => {
    fetchArticles();
  }, []);

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
      setFormData({
        id: '',
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        image: '',
        status: 'published'
      });
    }
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    // Supports Arabic, English, Numbers and simple spaces -> dashes
    const slug = val.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u0621-\u064A0-9-]/g, '');

    setFormData({
      ...formData,
      title: val,
      slug: formData.id ? formData.slug : slug
    });
  };

  const handleSave = async () => {
    setSaving(true);

    const method = formData.id ? 'PUT' : 'POST';

    // Construct payload without id if it's a new article to satisfy TypeScript
    const payload = formData.id
      ? formData
      : {
          title: formData.title,
          slug: formData.slug,
          content: formData.content,
          excerpt: formData.excerpt,
          image: formData.image,
          status: formData.status
        };

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
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return;

    await fetch(`/api/articles?id=${id}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
      }
    });

    fetchArticles();
  };

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '8px' }}>المدونة والمقالات</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>إدارة المقالات والمحتوى النصي في الموقع</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-saas btn-saas-primary"
          style={{ gap: '8px' }}
        >
          <Plus size={20} /> إضافة مقال
        </button>
      </div>

      <div className="admin-card" style={{ marginBottom: '32px' }}>
        <div style={{ position: 'relative' }}>
          <Search style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} size={20} />
          <input 
            className="input-saas" 
            style={{ width: '100%', paddingRight: '48px' }} 
            placeholder="ابحث عن مقال..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
          <Loader2 className="animate-spin" size={48} color="var(--color-primary)" />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {filteredArticles.map((article) => (
            <div key={article.id} className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ height: '180px', borderRadius: '10px', overflow: 'hidden', background: article.image ? 'transparent' : 'rgba(255,255,255,0.05)', position: 'relative' }}>
                {article.image ? (
                  <img src={article.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                    <FileText size={48} />
                  </div>
                )}
                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                  <span style={{ 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    fontSize: '12px', 
                    fontWeight: 700,
                    background: article.status === 'published' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(249, 115, 22, 0.2)',
                    color: article.status === 'published' ? '#22c55e' : '#f97316',
                    backdropFilter: 'blur(8px)'
                  }}>
                    {article.status === 'published' ? 'منشور' : 'مسودة'}
                  </span>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>{article.title}</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineBreak: 'anywhere', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {article.excerpt}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                <Link href={`/blog/${article.slug}`} target="_blank" className="btn-saas" style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.05)' }}>
                  <Eye size={18} />
                </Link>
                <button 
                  onClick={() => handleOpenModal(article)}
                  className="btn-saas" 
                  style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.05)' }}
                >
                  تعديل
                </button>
                <button 
                  onClick={() => handleDelete(article.id)}
                  className="btn-saas" 
                  style={{ flex: 1, padding: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Article Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="admin-modal-overlay">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                inset: 0
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="admin-modal-content"
              style={{ padding: '40px', zIndex: 1001, display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 900 }}>{formData.id ? 'تعديل المقال' : 'مقال جديد'}</h2>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X size={24} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label className="admin-label">عنوان المقال</label>
                  <input className="input-saas" placeholder="عنوان المقال" value={formData.title} onChange={e => handleTitleChange(e.target.value)} />
                </div>

                <div>
                  <label className="admin-label">وصف مختصر</label>
                  <textarea className="input-saas" placeholder="وصف مختصر يظهر في قائمة المقالات" value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} />
                </div>

                <div>
                  <label className="admin-label">المحتوى</label>
                  <textarea className="input-saas" rows={10} placeholder="اكتب محتوى المقال هنا..." value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} />
                </div>

                <FileUploader label="صورة المقال" value={formData.image} onChange={url => setFormData({ ...formData, image: url })} />

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button className="btn-saas btn-saas-primary" style={{ flex: 1 }} onClick={handleSave} disabled={saving}>
                    {saving ? 'جاري الحفظ...' : 'حفظ المقال'}
                  </button>
                  <button className="btn-saas" style={{ flex: 1, background: 'rgba(255,255,255,0.05)' }} onClick={() => setIsModalOpen(false)}>إلغاء</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

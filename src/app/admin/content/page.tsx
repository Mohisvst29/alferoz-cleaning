'use client';

import { useState, useEffect } from 'react';
import FileUploader from '@/components/admin/FileUploader';
import { Plus, Search, Loader2, X, Save } from 'lucide-react';
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
    const slug = val.toLowerCase().replace(/[\s\W-]+/g, '-');

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
      body: JSON.stringify({
        id,
        status: newStatus
      }),
    });

    fetchArticles();
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المقال؟')) {
      await fetch(`/api/articles?id=${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      });

      fetchArticles();
    }
  };

  const filteredArticles = articles.filter(a =>
    a?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px'
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 900,
              marginBottom: '8px'
            }}
          >
            المدونة والمقالات
          </h1>

          <p style={{ color: 'var(--color-text-secondary)' }}>
            إدارة المقالات والمحتوى النصي في الموقع
          </p>
        </div>

        <button
          className="btn-saas btn-saas-primary"
          onClick={() => handleOpenModal()}
        >
          <Plus size={20} /> إضافة مقال
        </button>

      </div>


      <div
        className="admin-card"
        style={{
          marginBottom: '32px',
          padding: '16px'
        }}
      >

        <div style={{ position: 'relative' }}>

          <Search
            size={18}
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          />

          <input
            type="text"
            placeholder="ابحث عن مقال"
            className="input-saas"
            style={{
              width: '100%',
              paddingRight: '48px'
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

        </div>

      </div>


      {loading ? (

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '100px'
          }}
        >
          <Loader2
            className="animate-spin"
            size={40}
          />
        </div>

      ) : (

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fill,minmax(300px,1fr))',
            gap: '24px'
          }}
        >

          {filteredArticles.map(article => (

            <div
              key={article.id}
              className="admin-card"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >

              {article.image && (

                <div
                  style={{
                    width: '100%',
                    height: '160px',
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}
                >

                  <img
                    src={article.image}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />

                </div>

              )}


              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 800
                }}
              >
                {article.title}
              </h3>


              <p
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: '14px'
                }}
              >
                {article.excerpt}
              </p>


              <div
                style={{
                  display: 'flex',
                  gap: '10px'
                }}
              >

                <button
                  className="btn-saas"
                  onClick={() =>
                    handleOpenModal(article)
                  }
                >
                  تعديل
                </button>


                <button
                  className="btn-saas"
                  onClick={() =>
                    handleDelete(article.id)
                  }
                >
                  حذف
                </button>

              </div>

            </div>

          ))}

        </div>

      )}



      <AnimatePresence>

        {isModalOpen && (

          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'rgba(0,0,0,0.6)'
              }}
            />



            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9
              }}

              animate={{
                opacity: 1,
                scale: 1
              }}

              exit={{
                opacity: 0,
                scale: 0.9
              }}

              className="admin-card"

              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '700px',
                padding: '40px',
                zIndex: 1001
              }}
            >

              <h2
                style={{
                  fontSize: '22px',
                  fontWeight: 900,
                  marginBottom: '20px'
                }}
              >

                {formData.id
                  ? 'تعديل المقال'
                  : 'مقال جديد'}

              </h2>



              <input
                className="input-saas"
                placeholder="عنوان المقال"
                value={formData.title}
                onChange={e =>
                  handleTitleChange(
                    e.target.value
                  )
                }
              />


              <textarea
                className="input-saas"
                placeholder="وصف مختصر"
                value={formData.excerpt}
                onChange={e =>
                  setFormData({
                    ...formData,
                    excerpt:
                      e.target.value
                  })
                }
              />


              <textarea
                className="input-saas"
                rows={6}
                placeholder="المحتوى"
                value={formData.content}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content:
                      e.target.value
                  })
                }
              />


              <FileUploader label="صورة المقال" value={formData.image} onChange={url => setFormData({...formData, image: url})} />


              <button
                className="btn-saas btn-saas-primary"
                onClick={handleSave}
                disabled={saving}
              >

                {saving
                  ? 'جاري الحفظ'
                  : 'حفظ'}

              </button>


            </motion.div>

          </div>

        )}

      </AnimatePresence>


    </div>
  );
}

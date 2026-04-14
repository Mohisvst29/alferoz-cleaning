'use client';

import { useState, useEffect } from 'react';
import FileUploader from '@/components/admin/FileUploader';
import { Plus, Search, Loader2 } from 'lucide-react';
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

    const slug =
      val
        .toLowerCase()
        .replace(/[\s\W-]+/g, '-');

    setFormData({

      ...formData,

      title: val,

      slug:
        formData.id
          ? formData.slug
          : slug

    });

  };

  const handleSave = async () => {

    setSaving(true);

    const method =
      formData.id
        ? 'PUT'
        : 'POST';

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

        Authorization:
          `Bearer ${
            localStorage.getItem('admin_token')
          }`

      },

      body: JSON.stringify(payload),

    });

    setSaving(false);

    setIsModalOpen(false);

    fetchArticles();

  };

  const handleDelete = async (id: string) => {

    if (confirm('هل تريد حذف المقال؟')) {

      await fetch(`/api/articles?id=${id}`, {

        method: 'DELETE',

        headers: {

          Authorization:
            `Bearer ${
              localStorage.getItem('admin_token')
            }`

        }

      });

      fetchArticles();

    }

  };

  const filteredArticles =
    articles.filter(a =>
      a?.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
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

        <h1
          style={{
            fontSize: '28px',
            fontWeight: 800
          }}
        >

          المقالات

        </h1>

        <button
          className="btn-saas btn-saas-primary"
          onClick={() => handleOpenModal()}
        >

          <Plus size={18} />
          مقال جديد

        </button>

      </div>

      <div
        className="admin-card"
        style={{
          padding: '20px',
          marginBottom: '30px'
        }}
      >

        <Search size={18} />

        <input
          className="input-saas"
          placeholder="بحث"
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />

      </div>

      {loading ? (

        <Loader2 className="animate-spin" />

      ) : (

        <div
          style={{
            display: 'grid',
            gap: '20px'
          }}
        >

          {filteredArticles.map(a => (

            <div
              key={a.id}
              className="admin-card"
            >

              <h3>{a.title}</h3>

              <button
                onClick={() =>
                  handleOpenModal(a)
                }
              >

                تعديل

              </button>

              <button
                onClick={() =>
                  handleDelete(a.id)
                }
              >

                حذف

              </button>

            </div>

          ))}

        </div>

      )}

      <AnimatePresence>

        {isModalOpen && (

          <div>

            <motion.div>

              <input
                placeholder="عنوان المقال"
                value={formData.title}
                onChange={(e) =>
                  handleTitleChange(
                    e.target.value
                  )
                }
              />

              <textarea
                placeholder="المحتوى"
                value={formData.content}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    content:
                      e.target.value
                  })
                }
              />

              <FileUploader
                label="صورة المقال"
                value={formData.image}
                onChange={(url: string) =>
                  setFormData({
                    ...formData,
                    image: url
                  })
                }
              />

              <button
                onClick={handleSave}
              >

                حفظ

              </button>

            </motion.div>

          </div>

        )}

      </AnimatePresence>

    </div>

  );

}

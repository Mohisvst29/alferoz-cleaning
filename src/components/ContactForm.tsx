'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'حدث خطأ');
      }

      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في إرسال الرسالة');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {success && (
        <div style={{
          padding: '16px 20px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-success)',
          fontSize: '15px',
          fontWeight: 600,
          textAlign: 'center',
        }}>
          ✅ تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.
        </div>
      )}

      {error && (
        <div style={{
          padding: '16px 20px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-error)',
          fontSize: '15px',
          fontWeight: 600,
          textAlign: 'center',
        }}>
          ❌ {error}
        </div>
      )}

      <div>
        <label className="form-label" htmlFor="contact-name">الاسم *</label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          className="form-input"
          placeholder="أدخل اسمك"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <div>
          <label className="form-label" htmlFor="contact-email">البريد الإلكتروني</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            className="form-input"
            placeholder="example@email.com"
            value={formData.email}
            onChange={handleChange}
            style={{ direction: 'ltr', textAlign: 'right' }}
          />
        </div>
        <div>
          <label className="form-label" htmlFor="contact-phone">رقم الجوال</label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            className="form-input"
            placeholder="05xxxxxxxx"
            value={formData.phone}
            onChange={handleChange}
            style={{ direction: 'ltr', textAlign: 'right' }}
          />
        </div>
      </div>

      <div>
        <label className="form-label" htmlFor="contact-message">الرسالة *</label>
        <textarea
          id="contact-message"
          name="message"
          required
          className="form-input"
          placeholder="اكتب رسالتك هنا..."
          value={formData.message}
          onChange={handleChange}
          rows={5}
        />
      </div>

      <button
        type="submit"
        className="btn-primary"
        disabled={loading}
        style={{ fontSize: '18px', padding: '16px 40px', alignSelf: 'stretch', opacity: loading ? 0.7 : 1 }}
      >
        <span>{loading ? 'جاري الإرسال...' : 'إرسال الرسالة'}</span>
      </button>
    </form>
  );
}

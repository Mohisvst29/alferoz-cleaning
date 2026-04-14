'use client';

import { useState, useEffect } from 'react';

interface ServiceOption {
  id: string;
  title: string;
}

const cities = [
  'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام',
  'الخبر', 'الظهران', 'تبوك', 'أبها', 'الطائف', 'بريدة', 'خميس مشيط',
  'حائل', 'نجران', 'جازان', 'ينبع', 'القصيم', 'أخرى',
];

export default function BookingForm() {
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    service_type: '',
    booking_date: '',
    notes: '',
  });

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setServices(data.map((s: ServiceOption) => ({ id: s.id, title: s.title })));
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'حدث خطأ');
      }

      setSuccess(true);
      setFormData({ name: '', phone: '', city: '', service_type: '', booking_date: '', notes: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في إرسال الحجز');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
          ✅ تم إرسال حجزك بنجاح! سنتواصل معك قريباً.
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <div>
          <label className="form-label" htmlFor="name">الاسم الكامل *</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="form-input"
            placeholder="أدخل اسمك الكامل"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="form-label" htmlFor="phone">رقم الجوال *</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            className="form-input"
            placeholder="05xxxxxxxx"
            value={formData.phone}
            onChange={handleChange}
            style={{ direction: 'ltr', textAlign: 'right' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <div>
          <label className="form-label" htmlFor="city">المدينة *</label>
          <select
            id="city"
            name="city"
            required
            className="form-select"
            value={formData.city}
            onChange={handleChange}
          >
            <option value="">اختر المدينة</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label" htmlFor="service_type">نوع الخدمة *</label>
          <select
            id="service_type"
            name="service_type"
            required
            className="form-select"
            value={formData.service_type}
            onChange={handleChange}
          >
            <option value="">اختر الخدمة</option>
            {services.map(s => (
              <option key={s.id} value={s.title}>{s.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="form-label" htmlFor="booking_date">التاريخ المفضل *</label>
        <input
          id="booking_date"
          name="booking_date"
          type="date"
          required
          className="form-input"
          value={formData.booking_date}
          onChange={handleChange}
          style={{ direction: 'ltr', textAlign: 'right' }}
        />
      </div>

      <div>
        <label className="form-label" htmlFor="notes">ملاحظات إضافية</label>
        <textarea
          id="notes"
          name="notes"
          className="form-input"
          placeholder="أي تفاصيل أو متطلبات إضافية..."
          value={formData.notes}
          onChange={handleChange}
          rows={4}
        />
      </div>

      <button
        type="submit"
        className="btn-primary"
        disabled={loading}
        style={{ fontSize: '18px', padding: '16px 40px', alignSelf: 'stretch', opacity: loading ? 0.7 : 1 }}
      >
        <span>{loading ? 'جاري الإرسال...' : 'إرسال الحجز'}</span>
      </button>
    </form>
  );
}

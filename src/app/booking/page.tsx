'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShieldCheck, Gem, Send, CheckCircle2, MapPin, Calendar as CalendarIcon, Phone } from 'lucide-react';

export default function BookingPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    service_type: '',
    booking_date: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setSuccess(true);
      } else {
        const err = await res.json();
        alert(err.error || 'حدث خطأ ما أثناء إرسال الطلب');
      }
    } catch (error) {
      console.error('Submit Error:', error);
      alert('تعذر الاتصال بالخادم. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: '140px', minHeight: '100vh', position: 'relative' }}>
      <div className="container">
        <div className="booking-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '80px', alignItems: 'start', marginBottom: '80px' }}>
          
          {/* Info Side */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="heading-gradient" style={{ fontSize: '4rem', marginBottom: '24px' }}>احجز <span style={{ color: 'var(--color-primary)' }}>موعدك</span></h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.2rem', marginBottom: '48px', lineHeight: 1.8 }}>
              أنت على بعد دقائق من الحصول على تجربة تنظيف استثنائية. املأ البيانات وسيقوم فريقنا بالتنسيق معك فوراً لتأكيد الموعد المفضل لديك.
            </p>

            <div style={{ display: 'grid', gap: '24px', marginBottom: '48px' }}>
              <div className="glass-card" style={{ padding: '24px', background: 'rgba(255,255,255,0.03)' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ color: 'var(--color-primary)' }}><ShieldCheck size={32} /></div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800 }}>تأمين كامل</h3>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>نحن نتحمل المسؤولية الكاملة عن منزلك.</p>
                  </div>
                </div>
              </div>
              <div className="glass-card" style={{ padding: '24px', background: 'rgba(255,255,255,0.03)' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ color: 'var(--color-primary)' }}><Gem size={32} /></div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800 }}>جودة النخبة</h3>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>أعلى المعايير العالمية في كل زيارة.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="img-wrap" style={{ height: '350px', display: 'block' }} id="booking-img">
              <Image src="/images/home-cleaning.png" alt="Cleaning" fill style={{ objectFit: 'cover' }} />
              <div className="img-overlay" />
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="glass-card" style={{ padding: '48px' }}>
              {success ? (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <div style={{ color: '#10b981', marginBottom: '24px' }}><CheckCircle2 size={80} style={{ margin: '0 auto' }} /></div>
                  <h2 style={{ fontSize: '28px', marginBottom: '16px' }}>تم استلام طلبك بنجاح</h2>
                  <p style={{ color: 'var(--color-text-secondary)', marginBottom: '40px' }}>سيقوم فريق خدمة العملاء بالتواصل معك خلال 30 دقيقة لتأكيد الموعد.</p>
                  <button onClick={() => setSuccess(false)} className="btn-saas btn-saas-primary">طلب حجز آخر</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px' }}>
                  <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>الاسم الكامل</label>
                      <input className="input-saas" placeholder="أدخل اسمك" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>رقم الجوال</label>
                      <input className="input-saas" placeholder="05xxxxxxxx" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>
                  </div>

                  <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>المدينة</label>
                      <select className="input-saas" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}>
                        <option value="">اختر المدينة</option>
                        <option value="الرياض">الرياض</option>
                        <option value="جدة">جدة</option>
                        <option value="الدمام">الدمام</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>نوع الخدمة</label>
                      <select className="input-saas" required value={formData.service_type} onChange={e => setFormData({...formData, service_type: e.target.value})}>
                        <option value="">اختر الخدمة</option>
                        <option value="منازل">تنظيف منازل</option>
                        <option value="شركات">تنظيف شركات</option>
                        <option value="سجاد">غسيل سجاد</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>تاريخ الحجز المفضل</label>
                    <input type="date" className="input-saas" required value={formData.booking_date} onChange={e => setFormData({...formData, booking_date: e.target.value})} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>ملاحظات إضافية</label>
                    <textarea className="input-saas" rows={3} placeholder="هل هناك تفاصيل إضافية تود إخبارنا بها؟" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
                  </div>

                  <button type="submit" className="btn-saas btn-saas-primary" style={{ padding: '18px', fontSize: '16px' }} disabled={loading}>
                    {loading ? 'جاري الإرسال...' : 'تأكيد طلب الحجز ومتابعة'} <Send size={20} />
                  </button>
                </form>
              )}
            </div>
          </motion.div>

        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .booking-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          #booking-img { display: none !important; }
        }
        @media (max-width: 600px) {
          .form-row { grid-template-columns: 1fr !important; gap: 24px !important; }
          .glass-card { padding: 32px !important; }
        }
      `}</style>
    </div>
  );
}

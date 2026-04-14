import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'تواصل معنا | الفيروز لخدمات النظافة',
  description: 'تواصل مع شركة الفيروز لخدمات النظافة - اتصل بنا أو أرسل رسالة واتساب أو عبر النموذج',
};

export default function ContactPage() {
  return (
    <div style={{ paddingTop: '100px' }}>
      {/* Page Header */}
      <section style={{ padding: '40px 0 60px', textAlign: 'center' }}>
        <div className="container">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            background: 'rgba(6, 182, 212, 0.1)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            borderRadius: 'var(--radius-full)',
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--color-accent)',
            marginBottom: '24px',
          }}>
            <span>📬</span>
            <span>نسعد بتواصلكم</span>
          </div>
          <h1 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>تواصل معنا</h1>
          <p className="section-subtitle">نحن هنا لخدمتكم ومساعدتكم في أي وقت</p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '32px',
          }}>
            {/* Contact Form */}
            <div className="glass-section" style={{ padding: '40px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>أرسل لنا رسالة</h2>
              <ContactForm />
            </div>

            {/* Contact Info & Map */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Contact Cards */}
              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>معلومات التواصل</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <a href="tel:+966500000000" style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none', color: 'var(--color-text)' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'rgba(6, 182, 212, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px',
                      border: '1px solid rgba(6, 182, 212, 0.2)',
                      flexShrink: 0,
                    }}>📞</div>
                    <div>
                      <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>هاتف</div>
                      <div style={{ fontSize: '16px', fontWeight: 600, direction: 'ltr' }}>+966 50 000 0000</div>
                    </div>
                  </a>

                  <a href="https://wa.me/966500000000" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none', color: 'var(--color-text)' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'rgba(37, 211, 102, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px',
                      border: '1px solid rgba(37, 211, 102, 0.2)',
                      flexShrink: 0,
                    }}>💬</div>
                    <div>
                      <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>واتساب</div>
                      <div style={{ fontSize: '16px', fontWeight: 600 }}>تواصل عبر واتساب</div>
                    </div>
                  </a>

                  <a href="mailto:info@alferoz.sa" style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none', color: 'var(--color-text)' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'rgba(6, 182, 212, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px',
                      border: '1px solid rgba(6, 182, 212, 0.2)',
                      flexShrink: 0,
                    }}>📧</div>
                    <div>
                      <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>بريد إلكتروني</div>
                      <div style={{ fontSize: '16px', fontWeight: 600 }}>info@alferoz.sa</div>
                    </div>
                  </a>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'rgba(6, 182, 212, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px',
                      border: '1px solid rgba(6, 182, 212, 0.2)',
                      flexShrink: 0,
                    }}>📍</div>
                    <div>
                      <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>العنوان</div>
                      <div style={{ fontSize: '16px', fontWeight: 600 }}>الرياض، المملكة العربية السعودية</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Map */}
              <div className="glass-card" style={{ padding: '4px', overflow: 'hidden' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d463902.7926563108!2d46.36152084053807!3d24.725492654907963!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0xba974d1c98e79fd5!2sRiyadh%20Saudi%20Arabia!5e0!3m2!1sar!2s!4v1234567890"
                  width="100%"
                  height="300"
                  style={{ border: 'none', borderRadius: 'var(--radius-lg)', display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="موقعنا على الخريطة"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

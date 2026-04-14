import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';

export default async function CTASection() {
  const settings = await db.settings.get();
  const ctaImage = settings?.ctaImage || '/images/home-cleaning.png';

  return (
    <section className="section-lux" style={{ overflow: 'hidden' }}>
      <div className="container">
        <div className="glass-card" style={{
          position: 'relative', overflow: 'hidden', padding: '100px 40px', textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(6, 182, 212, 0.1))'
        }}>
          {/* Background Image Abstract Overlay */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.15, pointerEvents: 'none' }}>
            <Image src={ctaImage} alt="Background" fill style={{ objectFit: 'cover' }} />
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '24px' }}>
              هل أنت جاهز لتجربة <span className="text-gradient">نظافة لا تشوبها شائبة</span>؟
            </h2>
            <p style={{ fontSize: '1.25rem', color: '#cbd5e1', maxWidth: '700px', margin: '0 auto 40px', lineHeight: 1.6 }}>
              انضم إلى مئات العملاء الراضين الذين اختاروا الفيروز كشريك لراحتهم. احجز موعدك اليوم بخطوات بسيطة.
            </p>

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/booking" className="btn-saas btn-saas-primary" style={{ padding: '18px 48px', fontSize: '18px' }}>
                احجز موعدك الآن
              </Link>
              <Link href="/contact" className="btn-saas" style={{ padding: '16px 48px', fontSize: '18px', background: 'rgba(255,255,255,0.05)', color: 'white' }}>
                تواصل معنا
              </Link>
            </div>

            <div style={{ marginTop: '50px', display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center', color: '#94a3b8', fontSize: '14px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>✔️ ضمان استرداد الأموال</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>✔️ فريق عمل موثوق</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>✔️ خدمة عملاء 24/7</span>
            </div>
          </div>

          {/* Glowing Orbs */}
          <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '200px', height: '200px', background: 'var(--color-accent)', filter: 'blur(100px)', opacity: 0.2 }} />
          <div style={{ position: 'absolute', bottom: '-80px', right: '-50px', width: '300px', height: '300px', background: 'var(--color-accent)', filter: 'blur(120px)', opacity: 0.2 }} />
        </div>
      </div>
    </section>
  );
}

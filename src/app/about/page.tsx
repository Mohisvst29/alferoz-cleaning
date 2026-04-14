import { db } from '@/lib/db';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const settings = await db.settings.get();

  const aboutImage = settings?.aboutImage || '/images/team.png';
  const teamImages = [
    settings?.teamImage1 || '/images/office-cleaning.png',
    settings?.teamImage2 || '/images/home-cleaning.png',
    settings?.teamImage3 || '/images/team.png',
  ];

  return (
    <div style={{ paddingTop: '120px', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="about-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '4rem', marginBottom: '24px', fontWeight: 900 }}>قصة <span style={{ color: 'var(--color-primary)' }}>الفيروز</span></h1>
              <p style={{ fontSize: '1.2rem', color: '#94a3b8', lineHeight: 1.8, marginBottom: '30px' }}>
                بدأت رحلتنا في مدينة الرياض برؤية واضحة: إعادة تعريف مفهوم التنظيف من مجرد خدمة عادية إلى تجربة رفاهية متكاملة تليق بتطلعات المجتمع السعودي الراقي.
              </p>
              <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 1.8 }}>
                اليوم، نفخر بكوننا الشريك الموثوق لآلاف العائلات والشركات الكبرى، متمسكين بقيمنا الأساسية: الإتقان، الأمانة، والابتكار المستمر.
              </p>
            </div>
            <div className="about-hero-img" style={{ borderRadius: '32px', overflow: 'hidden', height: '500px', position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Image src={aboutImage} alt="Our Team" fill style={{ objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(2,6,23,0.3), transparent)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={{ padding: '80px 0', background: 'rgba(15,23,42,0.3)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
            {[
              { emoji: '🎯', title: 'رسالتنا', text: 'تقديم خدمات تنظيف وتعقيم استثنائية تجمع بين الدقة المتناهية والسرعة في الإنجاز، مع الحفاظ على أعلى معايير السلامة والخصوصية لعملائنا.' },
              { emoji: '👁️', title: 'رؤيتنا', text: 'أن نكون الخيار الأول والاسم الأكثر ثقة في قطاع خدمات النظافة الفاخرة على مستوى المملكة العربية السعودية والخليج العربي.' },
              { emoji: '💎', title: 'قيمنا', text: 'التميز في كل تفصيلة، الشفافية المطلقة، والالتزام بتقديم قيمة حقيقية تفوق توقعات العملاء في كل زيارة.' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px', padding: '48px' }}>
                <div style={{ fontSize: '40px', marginBottom: '20px' }}>{item.emoji}</div>
                <h2 style={{ fontSize: '24px', marginBottom: '16px', fontWeight: 800 }}>{item.title}</h2>
                <p style={{ color: '#94a3b8', lineHeight: 1.8 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Images */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 900 }}>فريقنا <span style={{ color: 'var(--color-primary)' }}>المحترف</span></h2>
          </div>
          <div className="team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {teamImages.map((src, i) => (
              <div key={i} style={{ borderRadius: '24px', overflow: 'hidden', height: '320px', position: 'relative', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Image src={src} alt={`Team member ${i + 1}`} fill style={{ objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(2,6,23,0.5), transparent)' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

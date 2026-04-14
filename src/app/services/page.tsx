import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const services = await db.services.getActive();

  // Static fallback services if DB is empty
  const displayServices = services.length > 0 ? services : [
    {
      id: 'house', title: 'تنظيف المنازل والفلل',
      description: 'خدمة غسيل وتنظيف شاملة لكل ركن في منزلك مع عناية خاصة بالأثاث الفاخر.',
      image: '/images/home-cleaning.png',
    },
    {
      id: 'office', title: 'تنظيف المكاتب والشركات',
      description: 'فرق عمل متخصصة لتنظيف المكاتب والمجمعات التجارية بأوقات مرنة.',
      image: '/images/office-cleaning.png',
    },
    {
      id: 'furniture', title: 'غسيل الكنب والسجاد',
      description: 'تقنية البخار لإزالة البقع والروائح مع الحفاظ على الأنسجة.',
      image: '/images/equipment.png',
    },
  ];

  return (
    <div style={{ paddingTop: '120px', minHeight: '100vh' }}>
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h1 style={{ fontSize: '4rem', marginBottom: '20px', fontWeight: 900 }}>
              خدماتنا <span style={{ color: 'var(--color-primary)' }}>الاحترافية</span>
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
              نضع بين يديك خبرة سنوات في مجال النظافة والتعقيم، مقدمة بنظام يضمن أعلى مستويات الجودة والرفاهية.
            </p>
          </div>

          <div style={{ display: 'grid', gap: '80px' }}>
            {displayServices.map((service: any, index: number) => (
              <div
                key={service.id}
                className="service-item"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '60px',
                  alignItems: 'center',
                }}
              >
                <div className={`service-img ${index % 2 !== 0 ? 'order-last-mobile' : ''}`}
                  style={{ order: index % 2 === 0 ? 1 : 2 }}
                >
                  <div style={{ borderRadius: '28px', overflow: 'hidden', height: '420px', position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <Image src={service.image} alt={service.title} fill style={{ objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(2,6,23,0.3), transparent)' }} />
                  </div>
                </div>

                <div style={{ order: index % 2 === 0 ? 2 : 1 }}>
                  <h2 style={{ fontSize: '2.2rem', marginBottom: '20px', fontWeight: 900 }}>{service.title}</h2>
                  <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '40px' }}>
                    {service.description}
                  </p>
                  <Link href="/booking" className="btn-saas btn-saas-primary" style={{ padding: '14px 36px', fontSize: '16px' }}>
                    احجز هذه الخدمة
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}


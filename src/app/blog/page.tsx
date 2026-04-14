import Link from 'next/link';
import { db } from '@/lib/db';
import { Sparkles, Calendar, ChevronLeft, ArrowRight, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const seo = await db.seo.get();
  return {
    title: `المدونة | ${seo.metaTitle}`,
    description: seo.metaDescription,
  };
}

export default async function BlogPage() {
  const articles = await db.articles.getPublished();

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '80px', minHeight: '100vh' }}>
      <div className="container">
        
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '40px' }}>
          <Link href="/" className="btn-saas" style={{ background: 'transparent', padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <ArrowRight size={18} /> العودة للرئيسية
          </Link>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px', 
            padding: '8px 16px', borderRadius: '100px', 
            background: 'rgba(14, 165, 233, 0.1)', color: 'var(--color-primary)',
            fontWeight: 800, fontSize: '14px', marginBottom: '16px'
          }}>
            <Sparkles size={16} /> مدونة الفيروز
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: 900, marginBottom: '24px', letterSpacing: '-1px' }}>
            آخر المقالات والنصائح
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '18px', maxWidth: '600px', margin: '0 auto', lineHeight: 1.8 }}>
            اكتشف أفضل الطرق للحفاظ على نظافة منزلك، ونصائح الخبراء في التعقيم ومكافحة الحشرات.
          </p>
        </div>

        {/* Articles Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '32px' }}>
          {articles.map((article: any) => (
            <Link key={article.id} href={`/blog/${article.slug}`} style={{ textDecoration: 'none' }}>
              <div 
                className="glass admin-card" 
                style={{ 
                  borderRadius: '24px', overflow: 'hidden', transition: '0.3s', 
                  display: 'flex', flexDirection: 'column', height: '100%', 
                  padding: 0, border: '1px solid rgba(255,255,255,0.05)'
                }}
              >
                {/* Image */}
                <div style={{ width: '100%', height: '240px', background: 'rgba(255,255,255,0.02)', position: 'relative' }}>
                  {article.image ? (
                    <img src={article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                      <Sparkles size={48} opacity={0.2} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', fontSize: '13px', marginBottom: '16px' }}>
                    <Calendar size={14} /> {new Date(article.publish_date).toLocaleDateString('ar-SA')}
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'white', marginBottom: '16px', lineHeight: 1.5 }}>
                    {article.title}
                  </h2>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px', lineHeight: 1.8, marginBottom: '24px', flex: 1 }}>
                    {article.excerpt}
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', fontWeight: 700, fontSize: '15px' }}>
                    قراءة المزيد <ChevronLeft size={16} />
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {articles.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px 20px', color: 'var(--color-text-muted)' }}>
              <div style={{ display: 'inline-flex', padding: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.02)', marginBottom: '24px' }}>
                <FileText size={48} opacity={0.5} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700 }}>لا توجد مقالات حالياً</h3>
              <p>ستظهر المقالات هنا بمجرد نشرها من لوحة التحكم.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

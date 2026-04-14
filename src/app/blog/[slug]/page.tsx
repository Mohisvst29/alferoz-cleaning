import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import Link from 'next/link';
import { ArrowRight, Calendar, User, Share2 } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await db.articles.getBySlug(params.slug);
  const seo = await db.seo.get();

  if (!article) return { title: 'مقال غير موجود' };

  return {
    title: `${article.title} | ${seo.metaTitle}`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.image ? [{ url: article.image }] : undefined,
    }
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await db.articles.getBySlug(params.slug);

  if (!article || article.status !== 'published') {
    notFound();
  }

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '100px', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        <div style={{ marginBottom: '40px' }}>
          <Link href="/blog" className="btn-saas" style={{ background: 'transparent', padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <ArrowRight size={18} /> العودة للمدونة
          </Link>
        </div>

        {article.image && (
          <div style={{ width: '100%', height: '400px', borderRadius: '32px', overflow: 'hidden', marginBottom: '40px', border: '1px solid var(--color-border)' }}>
            <img src={article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        <h1 style={{ fontSize: '40px', fontWeight: 900, marginBottom: '24px', lineHeight: 1.4 }}>
          {article.title}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '48px', paddingBottom: '32px', borderBottom: '1px solid var(--color-border)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)', fontSize: '15px' }}>
            <Calendar size={18} /> {new Date(article.publish_date).toLocaleDateString('ar-SA')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)', fontSize: '15px' }}>
            <User size={18} /> إدارة الفيروز
          </div>
        </div>

        <div 
          className="article-content" 
          dangerouslySetInnerHTML={{ __html: article.content }} 
          style={{ lineHeight: 2, fontSize: '18px', color: 'rgba(255,255,255,0.9)' }} 
        />

      </div>
    </div>
  );
}

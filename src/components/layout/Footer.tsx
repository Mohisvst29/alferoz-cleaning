'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => setSettings(data));
  }, []);

  return (
    <footer style={{ background: '#020617', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Layer (CMS Controlled) */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #020617, transparent)' }} />
      </div>

      <motion.div 
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
        style={{ 
          height: '2px', width: '100%', 
          background: 'linear-gradient(90deg, transparent, var(--color-primary), var(--color-accent), transparent)',
          backgroundSize: '200% 100%',
          position: 'relative', zIndex: 2
        }} 
      />

      <div className="section-padding" style={{ padding: '80px 0 40px', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.2fr', gap: '80px', marginBottom: '60px' }}>
            
            {/* Brand */}
            <div>
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', marginBottom: '24px' }}>
                {settings?.logo ? (
                  <div style={{ position: 'relative', width: '140px', height: '48px' }}>
                    <Image src={settings.logo} alt={settings?.siteName || 'Al Feroz'} fill style={{ objectFit: 'contain', objectPosition: 'right' }} />
                  </div>
                ) : (
                  <>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                      <Sparkles size={20} />
                    </div>
                    <span style={{ fontSize: '26px', fontWeight: 900, color: 'white' }}>{settings?.siteName || 'الفيروز'}</span>
                  </>
                )}
              </Link>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px', lineHeight: 1.8, marginBottom: '32px', maxWidth: '400px' }}>
                {settings?.heroDescription || 'نضع بين يديك خبر سنوات في مجال النظافة والتعقيم في جميع مدن المملكة العربية السعودية.'}
              </p>
            </div>

            {/* Links */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}>
              <div>
                <h4 style={{ color: 'white', fontSize: '18px', fontWeight: 800, marginBottom: '24px' }}>روابط سريعة</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <Link href="/" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '14px' }}>الرئيسية</Link>
                  <Link href="/about" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '14px' }}>من نحن</Link>
                  <Link href="/services" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '14px' }}>خدماتنا</Link>
                  <Link href="/contact" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '14px' }}>اتصل بنا</Link>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="glass-card" style={{ padding: '32px', background: 'rgba(255,255,255,0.02)' }}>
              <h4 style={{ color: 'white', fontSize: '18px', fontWeight: 800, marginBottom: '24px' }}>تواصل معنا</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(14, 165, 233, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Phone size={18} /></div>
                  <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }} dir="ltr">{settings?.phone || '+966562185880'}</span>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(14, 165, 233, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mail size={18} /></div>
                  <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>{settings?.email || 'info@alferoz.sa'}</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }} className="footer-bottom">
            <p dir="rtl">© {currentYear} {settings?.footerText || 'جميع الحقوق محفوظة.'}</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 991px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 48px !important; text-align: center; }
          .footer-grid > div { display: flex; flex-direction: column; align-items: center; }
          .footer-bottom { flex-direction: column; gap: 20px; text-align: center; }
        }
      `}</style>
    </footer>
  );
}

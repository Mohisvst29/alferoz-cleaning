'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

export default function HeroSection() {
  const [settings, setSettings] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => setSettings(data));
  }, []);

  const heroImages = [settings?.heroImage, settings?.heroImage2, settings?.heroImage3].filter(Boolean);

  useEffect(() => {
    if (heroImages.length > 1 && !settings?.heroVideo) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [heroImages.length, settings?.heroVideo]);

  return (
    <section className="section-padding" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
      
      {/* CMS Controlled Background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <AnimatePresence mode="wait">
          {settings?.heroVideo ? (
            <motion.video 
              key="video"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              autoPlay loop muted playsInline 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            >
              <source src={settings.heroVideo} type="video/mp4" />
            </motion.video>
          ) : heroImages.length > 0 ? (
            <motion.div 
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            >
              <Image 
                src={heroImages[currentImageIndex]} 
                alt="Al Feroz Premium" fill style={{ objectFit: 'cover' }} priority 
              />
            </motion.div>
          ) : (
            <motion.div 
              key="fallback"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: 'var(--color-bg)' }}
            />
          )}
        </AnimatePresence>
        
        {/* Cinematic Overlays */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(2,6,23,0.95), rgba(2,6,23,0.4), rgba(2,6,23,0.98))' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 10% 50%, rgba(14, 165, 233, 0.1), transparent 50%)' }} />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div className="hero-grid" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '900px', margin: '0 auto', gap: '40px' }}>
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="hero-content"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >


            <h1 className="heading-gradient" style={{ fontSize: '5rem', fontWeight: 900, marginBottom: '24px', lineHeight: 1.1 }}>
              {settings?.heroTitle || 'نظافة استثنائية لمنشآت فاخرة'}
            </h1>

            <p style={{ fontSize: '1.3rem', color: 'var(--color-text-secondary)', marginBottom: '48px', maxWidth: '700px', lineHeight: 1.7 }}>
              {settings?.heroDescription || 'تقنيات تنظيف عالمية بأيدٍ محترفة تمنحك الرفاهية التي تستحقها في كل زاوية من منزلك أو مكتبك.'}
            </p>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }} className="hero-btns">
              <Link href="/booking" className="btn-saas btn-saas-primary" style={{ minWidth: '200px', height: '60px', fontSize: '18px' }}>
                احجز موعدك الآن <ArrowLeft size={22} />
              </Link>
              <Link href="/services" className="btn-saas" style={{ background: 'rgba(255,255,255,0.03)', color: 'white', minWidth: '180px', height: '60px', fontSize: '18px' }}>
                اكتشف خدماتنا
              </Link>
            </div>

            <div style={{ display: 'flex', gap: '48px', marginTop: '80px', justifyContent: 'center', flexWrap: 'wrap' }} className="hero-stats">
              {[
                { label: 'عميل سعيد', value: '1,500+', icon: <Sparkles size={20} /> },
                { label: 'خبير تنظيف', value: '80+', icon: <CheckCircle2 size={20} /> },
                { label: 'مدينة نخدمها', value: '12', icon: <Clock size={20} /> },
              ].map((stat, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: 900, color: 'white' }}>{stat.value}</div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '14px', fontWeight: 600 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .hero-grid { gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}

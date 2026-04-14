'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Leaf, Award, Zap, Clock } from 'lucide-react';

export default function WhyChooseUs() {
  const [settings, setSettings] = useState<any>(null);
  
  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(setSettings);
  }, []);

  const features = [
    { title: 'استدامة بيئية', desc: 'نختار بعناية مواد تنظيف صديقة للبيئة وآمنة لعائلتك وحيواناتك الأليفة.', icon: <Leaf size={28} /> },
    { title: 'خبرة موثقة', desc: 'فريق عمل مختص خضع لأعلى مستويات التدريب التقني والمهني.', icon: <Award size={28} /> },
    { title: 'أداء فائق', desc: 'نستخدم أحدث المعدات التكنولوجية لضمان نتائج مبهرة في وقت قياسي.', icon: <Zap size={28} /> },
    { title: 'سرعة استجابة', desc: 'نظام حجز ذكي وفريق جاهز لخدمتكم على مدار الساعة بمرونة كاملة.', icon: <Clock size={28} /> },
  ];

  const whyImage = settings?.whyUsImage || '/images/equipment.png';

  return (
    <section className="section-padding">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 className="heading-gradient" style={{ fontSize: '3.5rem', marginBottom: '16px' }}>لماذا تختار <span style={{ color: 'var(--color-primary)' }}>الفيروز</span>؟</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            نحن لا نقدم خدمة تنظيف فحسب، بل نبني علاقة ثقة قائمة على الجودة والرفاهية.
          </p>
        </div>

        <div className="why-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '80px', alignItems: 'center' }}>
          
          {/* Photos Layered */}
          <div className="photos-container" style={{ position: 'relative', height: '550px' }}>
            <motion.div 
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.8 }}
              style={{ 
                width: '90%', height: '90%', borderRadius: '32px', overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.6)',
                position: 'relative'
              }}
            >
              <Image src={whyImage} alt="Equipment" fill style={{ objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(2,6,23,0.4), transparent)' }} />
            </motion.div>

            <motion.div 
              whileInView={{ scale: 1, opacity: 1 }}
              initial={{ scale: 0.8, opacity: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="glass"
              style={{ 
                position: 'absolute', top: '230px', left: '-20px', width: '220px', padding: '24px',
                borderRadius: '24px', zIndex: 3, border: '1px solid var(--color-primary)'
              }}
            >
              <div style={{ fontSize: '36px', fontWeight: 900, marginBottom: '4px' }}>12+</div>
              <div style={{ fontSize: '13px', color: 'white', fontWeight: 600 }}>سنة من الخبرة في السوق السعودي</div>
            </motion.div>
          </div>

          {/* Features Grid */}
          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card"
                style={{ padding: '32px' }}
              >
                <div style={{ 
                  width: '56px', height: '56px', borderRadius: '16px', 
                  background: 'rgba(14, 165, 233, 0.1)', color: 'var(--color-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px'
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px', color: 'white' }}>{f.title}</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .why-grid { grid-template-columns: 1fr !important; gap: 64px !important; }
          .photos-container { height: 400px !important; order: 1; }
          .features-grid { order: 2; }
        }
        @media (max-width: 600px) {
          .features-grid { grid-template-columns: 1fr !important; }
          .photos-container { height: 320px !important; }
          .glass { left: 10px !important; top: 150px !important; width: 180px !important; padding: 16px !important; }
        }
      `}</style>
    </section>
  );
}

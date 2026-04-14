'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Home, Building2, ShieldEllipsis, Sparkles, Armchair, Container, ShieldCheck, Crown, Bug } from 'lucide-react';

const iconMap: any = {
  Home: <Home size={24} />,
  Building2: <Building2 size={24} />,
  Sparkles: <Sparkles size={24} />,
  Armchair: <Armchair size={24} />,
  Container: <Container size={24} />,
  ShieldCheck: <ShieldCheck size={24} />,
  Crown: <Crown size={24} />,
  Bug: <Bug size={24} />
};

export default function ServicesPreview() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(data || []);
        setLoading(false);
      });
  }, []);

  if (loading) return null;

  return (
    <section className="section-padding">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 className="heading-gradient" style={{ fontSize: '3.5rem', marginBottom: '16px' }}>حلول نظافة <span style={{ color: 'var(--color-primary)' }}>ذكية</span></h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            باقة متكاملة من الخدمات المصممة خصيصاً لتلبية أعلى معايير الجودة والرفاهية.
          </p>
        </div>

        <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '32px' }}>
          {services.map((service, index) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="glass-card"
              style={{ padding: '0', display: 'flex', flexDirection: 'column' }}
            >
              <div className="img-wrap" style={{ height: '260px', borderRadius: '0', position: 'relative' }}>
                <Image src={service.image} alt={service.title} fill style={{ objectFit: 'cover' }} />
                <div className="img-overlay" />
                <div style={{
                  position: 'absolute', top: '20px', right: '20px', width: '44px', height: '44px',
                  borderRadius: '12px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)', zIndex: 10
                }}>
                  {iconMap[service.icon] || <Sparkles size={24} />}
                </div>
              </div>
              <div style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '16px', color: 'white' }}>{service.title}</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '32px', flex: 1 }}>
                  {service.description}
                </p>
                <Link href="/booking" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)',
                  fontWeight: 700, fontSize: '14px', transition: '0.3s', textDecoration: 'none'
                }}>
                  حجز الخدمة الآن <ArrowLeft size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

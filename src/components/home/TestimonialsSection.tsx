'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronRight, ChevronLeft, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  city: string;
}

export default function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const next = () => setIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="section-padding" style={{ position: 'relative' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>
            ماذا يقول عملاؤنا
          </div>
          <h2 className="heading-gradient" style={{ fontSize: '3.5rem' }}>بيئة تثق بها آلاف <span style={{ color: 'white' }}>العائلات</span></h2>
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="glass-card"
              style={{ padding: '60px', position: 'relative' }}
            >
              <div style={{ 
                position: 'absolute', top: '40px', right: '40px', 
                color: 'var(--color-primary-glow)', opacity: 0.3 
              }}>
                <Quote size={80} />
              </div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Stars */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '32px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={20} 
                      fill={i < testimonials[index].rating ? "var(--color-gold)" : "transparent"} 
                      color={i < testimonials[index].rating ? "var(--color-gold)" : "#334155"} 
                    />
                  ))}
                </div>

                <p style={{ fontSize: '1.5rem', fontWeight: 500, lineHeight: 1.6, color: '#f1f5f9', marginBottom: '48px', fontStyle: 'italic' }}>
                  "{testimonials[index].text}"
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  {/* Avatar Placeholder */}
                  <div style={{ 
                    width: '64px', height: '64px', borderRadius: '50%', 
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '24px', fontWeight: 900, color: 'white'
                  }}>
                    {testimonials[index].name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'white' }}>{testimonials[index].name}</div>
                    <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>{testimonials[index].city}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider Controls */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '40px', justifyContent: 'center' }}>
            <button onClick={prev} style={{ 
              width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: '0.3s'
            }}>
              <ChevronRight size={24} />
            </button>
            <button onClick={next} style={{ 
              width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: '0.3s'
            }}>
              <ChevronLeft size={24} />
            </button>
          </div>

          {/* Pagination Dots */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '24px', justifyContent: 'center' }}>
            {testimonials.map((_, i) => (
              <div 
                key={i} 
                onClick={() => setIndex(i)}
                style={{ 
                  width: index === i ? '24px' : '8px', height: '8px', borderRadius: '4px',
                  background: index === i ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                  transition: '0.4s', cursor: 'pointer'
                }} 
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

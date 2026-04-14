'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, ChevronLeft } from 'lucide-react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    fetch('/api/settings').then(res => res.json()).then(data => setSettings(data));
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (pathname.startsWith('/admin')) return null;

  const navItems = [
    { name: 'الرئيسية', href: '/' },
    { name: 'من نحن', href: '/about' },
    { name: 'خدماتنا', href: '/services' },
    { name: 'المدونة', href: '/blog' },
    { name: 'اتصل بنا', href: '/contact' },
  ];

  return (
    <>
      <header className={`navbar-fixed ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
              {settings?.logo ? (
                <div style={{ position: 'relative', width: 'var(--logo-size, 120px)', transition: 'width 0.3s ease', display: 'flex', alignItems: 'center' }}>
                  <img src={settings.logo} alt={settings.siteName || 'Logo'} style={{ width: '100%', height: 'auto', maxHeight: '80px', objectFit: 'contain' }} />
                </div>
              ) : (
                <>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                    boxShadow: '0 8px 20px var(--color-primary-glow)'
                  }}>
                    <Sparkles size={24} />
                  </div>
                  <span style={{ fontSize: '24px', fontWeight: 900, color: 'white', letterSpacing: '-0.5px' }}>
                    {settings?.siteName || 'الفيروز'}
                  </span>
                </>
              )}
            </Link>

            {/* Desktop Nav */}
            <div className="desktop-nav" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: pathname === item.href ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    transition: '0.3s',
                    textDecoration: 'none'
                  }}
                  className="nav-link"
                >
                  {item.name}
                </Link>
              ))}
              <Link href="/booking" className="btn-saas btn-saas-primary" style={{ padding: '10px 24px', fontSize: '14px' }}>
                احجز الآن
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button 
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)',
                borderRadius: '10px', color: 'white', padding: '8px', cursor: 'pointer'
              }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass"
            style={{
              position: 'fixed', top: '80px', left: '20px', right: '20px', 
              zIndex: 999, borderRadius: '24px', padding: '32px',
              border: '1px solid var(--color-border)'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    fontSize: '18px', fontWeight: 700, color: pathname === item.href ? 'var(--color-primary)' : 'white',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none'
                  }}
                >
                  {item.name}
                  <ChevronLeft size={20} />
                </Link>
              ))}
              <div style={{ paddingTop: '20px', borderTop: '1px solid var(--color-border)' }}>
                <Link href="/booking" className="btn-saas btn-saas-primary" style={{ width: '100%' }}>
                  احجز الآن
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .navbar-fixed {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          padding: 32px 0;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .navbar-fixed.scrolled {
          padding: 20px 0;
          background: rgba(2, 6, 23, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 991px) {
          .navbar-fixed { padding: 20px 0; }
          .navbar-fixed.scrolled { padding: 16px 0; }
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Calendar, 
  Settings, 
  ShieldCheck, 
  MessageSquare, 
  Star, 
  LogOut,
  Menu,
  X,
  Sparkles,
  FileText,
  ChevronRight
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setCollapsed(false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (pathname === '/admin/login') return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [pathname, router]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  if (pathname === '/admin/login') return <>{children}</>;

  const navItems = [
    { name: 'لوحة التحكم', href: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'الحجوزات', href: '/admin/bookings', icon: <Calendar size={20} /> },
    { name: 'الخدمات', href: '/admin/services', icon: <ShieldCheck size={20} /> },
    { name: 'المراجعات', href: '/admin/testimonials', icon: <Star size={20} /> },
    { name: 'الرسائل', href: '/admin/messages', icon: <MessageSquare size={20} /> },
    { name: 'المقالات', href: '/admin/content', icon: <FileText size={20} /> },
    { name: 'الإعدادات', href: '/admin/settings', icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  const sidebarWidth = collapsed ? 72 : 260;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
      <div className="bg-mesh" style={{ opacity: 0.5 }} />

      {/* Mobile Header */}
      <div style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, height: '60px',
        background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)', 
        borderBottom: '1px solid var(--color-border)', zIndex: 60,
        padding: '0 16px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        visibility: isMobile ? 'visible' : 'hidden',
        opacity: isMobile ? 1 : 0,
        pointerEvents: isMobile ? 'auto' : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Sparkles size={14} />
          </div>
          <span style={{ fontWeight: 900, color: 'white', fontSize: '16px' }}>إدارة الفيروز</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          style={{ 
            background: 'rgba(255,255,255,0.08)', border: '1px solid var(--color-border)', 
            color: 'white', width: '36px', height: '36px', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
          }}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(2, 6, 23, 0.7)',
              backdropFilter: 'blur(4px)', zIndex: 49
            }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        animate={{ 
          width: isMobile ? 260 : sidebarWidth,
          right: isMobile ? (mobileMenuOpen ? 0 : -260) : 0,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{ 
          position: 'fixed', top: 0, bottom: 0, zIndex: 50,
          background: '#0a1628',
          borderLeft: '1px solid var(--color-border)',
          display: 'flex', flexDirection: 'column', 
          padding: isMobile ? '16px 12px' : '24px 12px',
          overflow: 'hidden',
        }}
      >
        {/* Logo */}
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: '12px', 
          marginBottom: '32px', padding: '8px',
          marginTop: isMobile ? '60px' : '0'
        }}>
          <div style={{ 
            minWidth: '36px', height: '36px', borderRadius: '10px', 
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
            boxShadow: '0 4px 12px var(--color-primary-glow)'
          }}>
            <Sparkles size={18} />
          </div>
          <AnimatePresence>
            {(!collapsed || isMobile) && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                style={{ fontWeight: 900, fontSize: '18px', color: 'white', whiteSpace: 'nowrap' }}
              >
                AL FEROZ
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                style={{
                  display: 'flex', alignItems: 'center',
                  gap: '12px', padding: '11px 12px',
                  borderRadius: '10px',
                  color: isActive ? 'white' : 'var(--color-text-secondary)',
                  background: isActive ? 'rgba(14,165,233,0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(14,165,233,0.25)' : '1px solid transparent',
                  textDecoration: 'none', fontWeight: isActive ? 700 : 500,
                  fontSize: '14px', transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap', overflow: 'hidden',
                }}
                className="admin-nav-item-link"
              >
                <div style={{ minWidth: '20px', color: isActive ? 'var(--color-primary)' : 'inherit' }}>
                  {item.icon}
                </div>
                <AnimatePresence>
                  {(!collapsed || isMobile) && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
          {/* Desktop collapse toggle */}
          {!isMobile && (
            <button 
              onClick={() => setCollapsed(!collapsed)} 
              style={{ 
                width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 12px', borderRadius: '10px', border: 'none',
                background: 'transparent', color: 'var(--color-text-secondary)',
                cursor: 'pointer', fontSize: '14px', fontWeight: 500,
                transition: 'all 0.2s', whiteSpace: 'nowrap', overflow: 'hidden',
                fontFamily: 'var(--font-family)',
              }}
            >
              <motion.div animate={{ rotate: collapsed ? 180 : 0 }}>
                <ChevronRight size={20} />
              </motion.div>
              {!collapsed && <span>طي القائمة</span>}
            </button>
          )}
          <button 
            onClick={handleLogout} 
            style={{ 
              width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 12px', borderRadius: '10px', border: 'none',
              background: 'transparent', color: '#ef4444',
              cursor: 'pointer', fontSize: '14px', fontWeight: 600,
              transition: 'all 0.2s', whiteSpace: 'nowrap', overflow: 'hidden',
              fontFamily: 'var(--font-family)',
            }}
          >
            <LogOut size={20} />
            {(!collapsed || isMobile) && <span>الخروج</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.main
        animate={{ 
          marginRight: isMobile ? 0 : sidebarWidth,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{ 
          flex: 1,
          minWidth: 0,
          padding: isMobile ? '76px 16px 40px' : '32px 32px 40px',
          transition: '0.3s',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {children}
        </div>
      </motion.main>
    </div>
  );
}

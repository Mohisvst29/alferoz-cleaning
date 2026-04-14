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
  FileText
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === '/admin/login') return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [pathname, router]);

  // Let CSS handle media queries for sidebar, no aggressive JS collapsing
  useEffect(() => {
    // Only use collapsed state to allow manual desktop toggling
    if (window.innerWidth < 1024) setCollapsed(false);
  }, []);

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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
      <div className="bg-mesh" style={{ opacity: 0.5 }} />

      {/* Mobile Header Toggle */}
      <div className="mobile-admin-header" style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, height: '64px',
        background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', 
        borderBottom: '1px solid var(--color-border)', zIndex: 60, padding: '0 20px',
        alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ fontWeight: 900, color: 'white' }}>إدارة الفيروز</div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: 'transparent', border: 'none', color: 'white' }}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <motion.aside 
        animate={{ width: collapsed ? 80 : 280 }}
        className={`admin-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}
        style={{ 
          position: 'fixed', top: 0, bottom: 0, zIndex: 50,
          display: 'flex', flexDirection: 'column', padding: '24px 16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', padding: '0 8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Sparkles size={18} />
          </div>
          {!collapsed && <span style={{ fontWeight: 900, fontSize: '20px', color: 'white' }}>AL FEROZ</span>}
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`admin-nav-item ${pathname === item.href ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div style={{ minWidth: '20px' }}>{item.icon}</div>
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', padding: '16px 8px', borderTop: '1px solid var(--color-border)' }}>
          <button onClick={() => setCollapsed(!collapsed)} className="admin-nav-item desktop-only" style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer' }}>
            <Menu size={20} />
            {!collapsed && <span>طي القائمة</span>}
          </button>
          <button onClick={handleLogout} className="admin-nav-item" style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444' }}>
            <LogOut size={20} />
            {!collapsed && <span>الخروج</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main style={{ 
        flex: 1, 
        marginRight: collapsed ? 80 : 280, 
        padding: '40px',
        transition: '0.3s'
      }} className="admin-main">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {children}
        </div>
      </main>


    </div>
  );
}

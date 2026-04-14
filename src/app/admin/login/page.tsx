'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Lock, User, LogIn, Loader2, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'خطأ في تسجيل الدخول');
      }

      localStorage.setItem('admin_token', data.token);
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      padding: '20px',
      background: 'var(--color-bg)',
      overflow: 'hidden'
    }}>
      {/* Dynamic Background */}
      <div className="bg-mesh" style={{ opacity: 0.6 }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="admin-card" 
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '40px 32px',
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(30px)',
          border: '1px solid var(--color-border)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          zIndex: 10
        }}
      >
        {/* Logo Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '18px',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', margin: '0 auto 20px',
            boxShadow: '0 8px 24px var(--color-primary-glow)'
          }}>
            <Sparkles size={32} />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '8px', color: 'white' }}>لوحة التحكم</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>الفيروز لخدمات النظافة العامة</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '12px',
              color: '#ef4444',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '24px',
            }}
          >
            <AlertCircle size={18} /> {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ position: 'relative' }}>
            <label className="admin-label" style={{ marginBottom: '8px', display: 'block' }}>اسم المستخدم</label>
            <div style={{ position: 'relative' }}>
               <User size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', zIndex: 1 }} />
               <input
                 type="text"
                 required
                 className="input-saas"
                 style={{ paddingRight: '44px' }}
                 placeholder="admin"
                 value={username}
                 onChange={e => setUsername(e.target.value)}
               />
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <label className="admin-label" style={{ marginBottom: '8px', display: 'block' }}>كلمة المرور</label>
            <div style={{ position: 'relative' }}>
               <Lock size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', zIndex: 1 }} />
               <input
                 type="password"
                 required
                 className="input-saas"
                 style={{ paddingRight: '44px' }}
                 placeholder="••••••••"
                 value={password}
                 onChange={e => setPassword(e.target.value)}
               />
            </div>
          </div>

          <button
            type="submit"
            className="btn-saas btn-saas-primary"
            disabled={loading}
            style={{ 
              width: '100%', 
              fontSize: '16px', 
              padding: '14px',
              height: '56px',
              marginTop: '8px'
            }}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={20} />}
            <span>{loading ? 'جاري الدخول...' : 'تسجيل الدخول'}</span>
          </button>
        </form>

        <div style={{ 
          marginTop: '32px', 
          padding: '12px', 
          borderRadius: '12px', 
          background: 'rgba(255,255,255,0.03)', 
          textAlign: 'center' 
        }}>
           <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
             🔒 نظام إدارة الفيروز الآمن
           </p>
        </div>
      </motion.div>

      {/* Decorative Circles */}
      <div style={{ position: 'absolute', top: '10%', left: '10%', width: '300px', height: '300px', background: 'var(--color-primary)', filter: 'blur(150px)', opacity: 0.15, zIndex: 1 }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '300px', height: '300px', background: 'var(--color-accent)', filter: 'blur(150px)', opacity: 0.15, zIndex: 1 }} />
    </div>
  );
}

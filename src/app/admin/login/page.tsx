'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
      padding: '24px',
    }}>
      <div className="glass-section" style={{
        padding: '48px',
        width: '100%',
        maxWidth: '420px',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            margin: '0 auto 16px',
          }}>
            ✨
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>لوحة التحكم</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>الفيروز لخدمات النظافة</p>
        </div>

        {error && (
          <div style={{
            padding: '12px 16px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-error)',
            fontSize: '14px',
            fontWeight: 600,
            textAlign: 'center',
            marginBottom: '20px',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label className="form-label" htmlFor="admin-username">اسم المستخدم</label>
            <input
              id="admin-username"
              type="text"
              required
              className="form-input"
              placeholder="admin"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label" htmlFor="admin-password">كلمة المرور</label>
            <input
              id="admin-password"
              type="password"
              required
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', fontSize: '16px', padding: '14px', opacity: loading ? 0.7 : 1 }}
          >
            <span>{loading ? 'جاري الدخول...' : 'تسجيل الدخول'}</span>
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
          بيانات الدخول الافتراضية: admin / admin123
        </p>
      </div>
    </div>
  );
}

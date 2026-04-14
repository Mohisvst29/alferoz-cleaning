'use client';

import { useState, useEffect, useCallback } from 'react';

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch('/api/contacts', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
    } catch { /* empty */ }
    setLoading(false);
  }, [token]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const markAsRead = async (id: string) => {
    await fetch('/api/contacts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, is_read: true }),
    });
    fetchMessages();
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;
    await fetch(`/api/contacts?id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchMessages();
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '4px' }}>رسائل التواصل</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
          {messages.length} رسالة • {unreadCount} غير مقروءة
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}><div className="spinner" /></div>
      ) : messages.length === 0 ? (
        <div className="glass-section" style={{ padding: '48px', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '16px' }}>لا توجد رسائل</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {messages.map(msg => (
            <div
              key={msg.id}
              className="glass-card"
              style={{
                padding: '24px',
                borderRight: msg.is_read ? 'none' : '3px solid var(--color-accent)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{msg.name}</h3>
                    {!msg.is_read && <span className="badge badge-pending">جديدة</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                    {msg.email && <span>📧 {msg.email}</span>}
                    {msg.phone && <span style={{ direction: 'ltr' }}>📞 {msg.phone}</span>}
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  {new Date(msg.created_at).toLocaleDateString('ar-SA')}
                </div>
              </div>

              <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: 1.8, marginBottom: '16px' }}>
                {msg.message}
              </p>

              <div style={{ display: 'flex', gap: '8px' }}>
                {!msg.is_read && (
                  <button onClick={() => markAsRead(msg.id)} className="btn-secondary btn-sm" style={{ padding: '4px 12px', fontSize: '12px' }}>
                    تم القراءة ✓
                  </button>
                )}
                <button onClick={() => deleteMessage(msg.id)} className="btn-danger" style={{ padding: '4px 12px', fontSize: '12px' }}>
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Mail, Phone, Trash2, CheckCircle, Search, Clock, Loader2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [searchTerm, setSearchTerm] = useState('');

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

  const filtered = messages.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontWeight: 900, marginBottom: '6px' }}>رسائل التواصل</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
            لديك {unreadCount} رسالة غير مقروءة من إجمالي {messages.length}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="admin-card" style={{ marginBottom: '24px', padding: '16px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input 
            type="text" 
            placeholder="ابحث في محتوى الرسائل أو الأسماء..." 
            className="input-saas" 
            style={{ paddingRight: '44px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
          <Loader2 className="animate-spin" size={40} color="var(--color-primary)" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Mail size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '16px', opacity: 0.5 }} />
          <p style={{ color: 'var(--color-text-secondary)' }}>صندوق الوارد فارغ حالياً</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          <AnimatePresence>
            {filtered.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="admin-card"
                style={{ 
                  borderRight: msg.is_read ? '1px solid var(--color-border)' : '4px solid var(--color-primary)',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                      <User size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 800 }}>{msg.name}</h3>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '4px' }}>
                        {msg.email && (
                          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Mail size={12} /> {msg.email}
                          </div>
                        )}
                        {msg.phone && (
                          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', direction: 'ltr' }}>
                            <Phone size={12} /> {msg.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {new Date(msg.created_at).toLocaleDateString('ar-SA')}
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>
                  {msg.message}
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  {!msg.is_read && (
                    <button onClick={() => markAsRead(msg.id)} className="btn-saas btn-saas-primary btn-sm">
                      <CheckCircle size={14} /> تحديد كمقروء
                    </button>
                  )}
                  <button onClick={() => deleteMessage(msg.id)} className="btn-danger btn-sm">
                    <Trash2 size={14} /> حذف
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

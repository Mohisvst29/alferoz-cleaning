'use client';

import { useState, useEffect, useCallback } from 'react';
import { Download, Search, Trash2, Calendar as CalendarIcon, Filter, MoreVertical, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Booking {
  id: string;
  name: string;
  phone: string;
  city: string;
  service_type: string;
  booking_date: string;
  notes: string;
  status: string;
  created_at: string;
}

const statusLabels: Record<string, string> = {
  pending: 'معلق',
  confirmed: 'مؤكد',
  completed: 'مكتمل',
  cancelled: 'ملغي',
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch('/api/bookings', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (Array.isArray(data)) setBookings(data);
    } catch {
      /* empty */
    }
    setLoading(false);
  }, [token]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/bookings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, status }),
    });
    fetchBookings();
  };

  const deleteBooking = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الحجز؟')) return;
    await fetch(`/api/bookings?id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchBookings();
  };

  const exportBookings = () => {
    const csv = [
      ['الاسم', 'الجوال', 'المدينة', 'الخدمة', 'التاريخ', 'الحالة', 'ملاحظات'].join(','),
      ...filtered.map(b =>
        [b.name, b.phone, b.city, b.service_type, b.booking_date, statusLabels[b.status], b.notes].join(',')
      ),
    ].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bookings_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const filtered = bookings.filter(b => {
    const matchesFilter = filter === 'all' || b.status === filter;
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.phone.includes(searchTerm) ||
                          b.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontWeight: 900, marginBottom: '6px' }}>إدارة الحجوزات</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>لديك {bookings.length} حجوزات إجمالية</p>
        </div>
        <button onClick={exportBookings} className="btn-secondary" style={{ gap: '8px' }}>
          <Download size={18} /> تصدير CSV
        </button>
      </div>

      {/* Controllers */}
      <div className="admin-card" style={{ marginBottom: '24px', padding: '16px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input 
              type="text" 
              placeholder="ابحث بالاسم أو الجوال..." 
              className="input-saas" 
              style={{ paddingRight: '44px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }} className="no-scrollbar">
            {[
              { key: 'all', label: 'الكل' },
              { key: 'pending', label: 'معلق' },
              { key: 'confirmed', label: 'مؤكد' },
              { key: 'completed', label: 'مكتمل' },
              { key: 'cancelled', label: 'ملغي' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`btn-sm ${filter === f.key ? 'btn-saas-primary' : 'btn-secondary'}`}
                style={{ borderRadius: '20px', padding: '6px 16px' }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
          <Loader2 className="animate-spin" size={40} color="var(--color-primary)" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <CalendarIcon size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '16px', opacity: 0.5 }} />
          <h3 style={{ color: 'var(--color-text-secondary)' }}>لا توجد حجوزات تطابق ذوقك</h3>
        </div>
      ) : (
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>العميل</th>
                  <th>الخدمة والمدينة</th>
                  <th>التاريخ</th>
                  <th>الحالة</th>
                  <th>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(booking => (
                  <tr key={booking.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'white' }}>{booking.name}</div>
                      <div style={{ fontSize: '12px', opacity: 0.7, direction: 'ltr', textAlign: 'right' }}>{booking.phone}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '13px' }}>{booking.service_type}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-primary)' }}>{booking.city}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '13px', direction: 'ltr' }}>{booking.booking_date}</div>
                    </td>
                    <td>
                      <select
                        value={booking.status}
                        onChange={e => updateStatus(booking.id, e.target.value)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '8px',
                          border: '1px solid var(--color-border)',
                          background: 'rgba(255,255,255,0.05)',
                          color: 'var(--color-text)',
                          fontSize: '12px',
                          fontFamily: 'var(--font-family)',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        <option value="pending">معلق</option>
                        <option value="confirmed">مؤكد</option>
                        <option value="completed">مكتمل</option>
                        <option value="cancelled">ملغي</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={() => deleteBooking(booking.id)} className="btn-danger btn-sm">
                        <Trash2 size={14} /> حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

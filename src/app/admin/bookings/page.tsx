'use client';

import { useState, useEffect, useCallback } from 'react';

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

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '4px' }}>إدارة الحجوزات</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>{bookings.length} حجز</p>
        </div>
        <button onClick={exportBookings} className="btn-secondary btn-sm">تصدير CSV 📥</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
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
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              borderColor: filter === f.key ? 'var(--color-accent)' : 'var(--color-border)',
              background: filter === f.key ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
              color: filter === f.key ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-family)',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="glass-section" style={{ padding: '48px', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '16px' }}>لا توجد حجوزات</p>
        </div>
      ) : (
        <div className="glass-section" style={{ overflow: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>الجوال</th>
                <th>المدينة</th>
                <th>الخدمة</th>
                <th>التاريخ</th>
                <th>الحالة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(booking => (
                <tr key={booking.id}>
                  <td style={{ fontWeight: 600, color: 'var(--color-text)' }}>{booking.name}</td>
                  <td style={{ direction: 'ltr' }}>{booking.phone}</td>
                  <td>{booking.city}</td>
                  <td>{booking.service_type}</td>
                  <td style={{ direction: 'ltr' }}>{booking.booking_date}</td>
                  <td>
                    <select
                      value={booking.status}
                      onChange={e => updateStatus(booking.id, e.target.value)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)',
                        background: 'var(--color-bg-card)',
                        color: 'var(--color-text)',
                        fontSize: '13px',
                        fontFamily: 'var(--font-family)',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="pending">معلق</option>
                      <option value="confirmed">مؤكد</option>
                      <option value="completed">مكتمل</option>
                      <option value="cancelled">ملغي</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => deleteBooking(booking.id)} className="btn-danger" style={{ padding: '4px 10px', fontSize: '12px' }}>
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

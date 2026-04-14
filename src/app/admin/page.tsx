'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Star,
  MessageCircle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'يناير', bookings: 45, revenue: 4500 },
  { name: 'فبراير', bookings: 52, revenue: 5200 },
  { name: 'مارس', bookings: 48, revenue: 4800 },
  { name: 'أبريل', bookings: 70, revenue: 7000 },
  { name: 'مايو', bookings: 61, revenue: 6100 },
  { name: 'يونيو', bookings: 85, revenue: 8500 },
  { name: 'يوليو', bookings: 90, revenue: 9000 },
];

export default function AdminDashboard() {
  const [counts, setCounts] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
        });
        const data = await res.json();
        setCounts(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { title: 'إجمالي الحجوزات', value: counts?.total_bookings || 0, change: '+12%', icon: <Calendar />, trend: 'up' },
    { title: 'الخدمات المتاحة', value: counts?.total_services || 0, change: 'نشطة', icon: <ShieldCheck />, trend: 'up' },
    { title: 'تقييمات العملاء', value: counts?.total_reviews || 0, change: '+5%', icon: <Star />, trend: 'up' },
    { title: 'رسائل التواصل', value: counts?.total_messages || 0, change: 'جديد', icon: <MessageCircle />, trend: 'up' },
  ];

  return (
    <div className="admin-container">
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '8px' }}>نظرة عامة</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>مرحباً بك مجدداً في نظام إدارة الفيروز. إليك ملخص العمليات اليومية.</p>
      </div>

      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="admin-card"
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ 
                width: '48px', height: '48px', borderRadius: '12px', 
                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)'
              }}>
                {stat.icon}
              </div>
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700,
                color: stat.trend === 'up' ? '#10b981' : '#ef4444'
              }}>
                {stat.change} {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </div>
            </div>
            
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '8px' }}>{stat.title}</div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: 'white' }}>{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="admin-card" style={{ padding: '32px', minHeight: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>نمو الحجوزات</h3>
            <div className="glass" style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600 }}>آخر 7 أشهر</div>
          </div>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#0f172a', border: '1px solid var(--color-border)', borderRadius: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="bookings" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="admin-card" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '32px' }}>حالة المنصة</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {[
              { label: 'الحجوزات', value: counts?.total_bookings || 0, color: 'var(--color-primary)' },
              { label: 'الخدمات', value: counts?.total_services || 0, color: '#10b981' },
              { label: 'التقييمات', value: counts?.total_reviews || 0, color: 'var(--color-gold)' },
            ].map((item, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>{item.label}</span>
                  <span style={{ fontSize: '14px', fontWeight: 700 }}>{item.value}</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${Math.min(100, (item.value / 100) * 100)}%` }} style={{ height: '100%', background: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


    </div>
  );
}

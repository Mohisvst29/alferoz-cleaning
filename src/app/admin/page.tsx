'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  ShieldCheck,
  Star,
  MessageCircle,
  ArrowUpRight,
  TrendingUp
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

const chartData = [
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
    { 
      title: 'إجمالي الحجوزات', 
      value: counts?.total_bookings ?? '...', 
      change: '+12%', 
      icon: <Calendar size={22} />, 
      color: 'var(--color-primary)',
      glow: 'rgba(14,165,233,0.15)'
    },
    { 
      title: 'الخدمات المتاحة', 
      value: counts?.total_services ?? '...', 
      change: 'نشطة', 
      icon: <ShieldCheck size={22} />, 
      color: '#10b981',
      glow: 'rgba(16,185,129,0.15)'
    },
    { 
      title: 'تقييمات العملاء', 
      value: counts?.total_reviews ?? '...', 
      change: '+5%', 
      icon: <Star size={22} />, 
      color: 'var(--color-gold)',
      glow: 'rgba(245,158,11,0.15)'
    },
    { 
      title: 'رسائل التواصل', 
      value: counts?.total_messages ?? '...', 
      change: 'جديد', 
      icon: <MessageCircle size={22} />, 
      color: '#a855f7',
      glow: 'rgba(168,85,247,0.15)'
    },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontWeight: 900, marginBottom: '6px', lineHeight: 1.2 }}>نظرة عامة</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
          مرحباً بك في لوحة تحكم الفيروز. إليك ملخص العمليات اليومية.
        </p>
      </div>

      {/* Stats Grid - uses CSS class for responsive */}
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="admin-card"
            style={{ 
              background: `radial-gradient(ellipse at top right, ${stat.glow}, transparent 70%), #0f172a`,
              borderColor: 'var(--color-border)',
              position: 'relative', overflow: 'hidden'
            }}
          >
            {/* Icon */}
            <div style={{ 
              width: '44px', height: '44px', borderRadius: '12px', 
              background: stat.glow,
              border: `1px solid ${stat.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              color: stat.color, marginBottom: '16px'
            }}>
              {stat.icon}
            </div>

            {/* Value */}
            <div style={{ fontSize: '30px', fontWeight: 900, color: 'white', lineHeight: 1, marginBottom: '6px' }}>
              {stat.value}
            </div>
            
            {/* Title */}
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '13px', fontWeight: 500, marginBottom: '12px' }}>
              {stat.title}
            </div>

            {/* Badge */}
            <div style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              padding: '3px 10px', borderRadius: 'var(--radius-full)',
              background: 'rgba(16,185,129,0.1)', color: '#10b981',
              fontSize: '12px', fontWeight: 700
            }}>
              <ArrowUpRight size={12} />
              {stat.change}
            </div>

            {/* Decorative */}
            <div style={{
              position: 'absolute', top: -20, left: -20,
              width: '80px', height: '80px', borderRadius: '50%',
              background: stat.glow, filter: 'blur(20px)',
              pointerEvents: 'none'
            }} />
          </motion.div>
        ))}
      </div>

      {/* Charts Grid - uses CSS class for responsive */}
      <div className="charts-grid">
        {/* Area Chart */}
        <div className="admin-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '4px' }}>نمو الحجوزات</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>آخر 7 أشهر</p>
            </div>
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 14px', borderRadius: '8px', 
              background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)',
              color: 'var(--color-primary)', fontSize: '13px', fontWeight: 600
            }}>
              <TrendingUp size={14} />
              +32% هذا الشهر
            </div>
          </div>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    background: '#0f172a', 
                    border: '1px solid var(--color-border)', 
                    borderRadius: '10px', 
                    color: '#fff',
                    fontSize: '13px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="var(--color-primary)" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#colorBookings)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Status */}
        <div className="admin-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '28px' }}>حالة المنصة</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { label: 'الحجوزات', value: counts?.total_bookings || 0, max: 200, color: 'var(--color-primary)' },
              { label: 'الخدمات', value: counts?.total_services || 0, max: 20, color: '#10b981' },
              { label: 'التقييمات', value: counts?.total_reviews || 0, max: 100, color: 'var(--color-gold)' },
              { label: 'الرسائل', value: counts?.total_messages || 0, max: 50, color: '#a855f7' },
            ].map((item, i) => {
              const pct = Math.min(100, (item.value / item.max) * 100);
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{item.label}</span>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: 'white' }}>{item.value}</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                      style={{ height: '100%', background: item.color, borderRadius: '3px' }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick stats */}
          <div style={{ 
            marginTop: '32px', padding: '16px', borderRadius: '10px',
            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)'
          }}>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px', fontWeight: 600 }}>
              📊 ملخص سريع
            </p>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              الموقع يعمل بكفاءة عالية. آخر تحديث منذ قليل.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

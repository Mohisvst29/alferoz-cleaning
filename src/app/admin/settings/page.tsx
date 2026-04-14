'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Globe, Shield, Phone, Monitor, Image as ImageIcon, Search, User, Eye, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';
import FileUploader from '@/components/admin/FileUploader';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'general' | 'branding' | 'hero' | 'sections' | 'contact' | 'seo' | 'account';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [seo, setSeo] = useState<any>({});
  const [adminData, setAdminData] = useState({ username: '', email: '', currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const [settingsRes, seoRes] = await Promise.all([
        fetch('/api/settings', { headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` } }),
        fetch('/api/seo', { headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` } }),
      ]);
      const settingsData = await settingsRes.json();
      const seoData = await seoRes.json();
      setSettings(settingsData);
      setSeo(seoData);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const fetchAdminAccount = async () => {
    try {
      const res = await fetch('/api/admin/account', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const data = await res.json();
      setAdminData(prev => ({ ...prev, username: data.username || '', email: data.email || '' }));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchSettings(); }, []);
  useEffect(() => { if (activeTab === 'account') fetchAdminAccount(); }, [activeTab]);

  const handleSaveSettings = async () => {
    if (activeTab === 'account' && adminData.newPassword && adminData.newPassword !== adminData.confirmPassword) {
      setError('كلمة المرور الجديدة غير متطابقة');
      return;
    }
    if (activeTab === 'account' && !adminData.currentPassword && adminData.newPassword) {
      setError('الرجاء إدخال كلمة المرور الحالية لتغيير كلمة المرور');
      return;
    }

    setSaving(true);
    setError('');
    let endpoint = '/api/settings';
    let bodyData: any = settings;

    if (activeTab === 'seo') { endpoint = '/api/seo'; bodyData = seo; }
    else if (activeTab === 'account') { endpoint = '/api/admin/account'; bodyData = adminData; }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(bodyData),
      });
      
      const responseData = await res.json().catch(() => ({}));
      if (res.ok) {
        if (activeTab !== 'seo' && activeTab !== 'account') setSettings(responseData);
        setShowSuccess(true);
        if (activeTab === 'account') setAdminData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        if (res.status === 413) {
          setError('حجم البيانات كبير جداً. يرجى التأكد من عدم استخدام صور ضخمة أو فيديوهات بدون Supabase.');
        } else {
          setError(responseData.error || `خطأ ${res.status}: فشل الحفظ`);
        }
      }
    } catch (err) {
      console.error('Save Error:', err);
      setError('تعذر الاتصال بالخادم. تأكد من جودة الإنترنت أو صغر حجم الصور المرفوعة.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('هل أنت متأكد من إعادة تعيين كافة إعدادات الموقع للأوضاع الافتراضية؟')) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/reset', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
      });
      if (res.ok) window.location.reload();
      else alert('فشل في إعادة التعيين');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const tabs: { id: Tab; name: string; icon: any }[] = [
    { id: 'general',  name: 'عام',            icon: <Monitor size={16} /> },
    { id: 'branding', name: 'الهوية',          icon: <Globe size={16} /> },
    { id: 'hero',     name: 'Hero',            icon: <ImageIcon size={16} /> },
    { id: 'sections', name: 'الأقسام',         icon: <Eye size={16} /> },
    { id: 'contact',  name: 'التواصل',         icon: <Phone size={16} /> },
    { id: 'seo',      name: 'SEO',             icon: <Search size={16} /> },
    { id: 'account',  name: 'الحساب',          icon: <User size={16} /> },
  ];

  const inputClass = 'input-saas';
  const labelClass = 'admin-label';

  return (
    <div style={{ paddingBottom: '100px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontWeight: 900, marginBottom: '6px' }}>إعدادات المنصة</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>تخصيص الهوية، الأمان، وتحسين محركات البحث.</p>
      </div>

      {/* Tabs - scrollable on mobile */}
      <div style={{ 
        display: 'flex', gap: '4px', 
        marginBottom: '24px', 
        borderBottom: '1px solid var(--color-border)', 
        overflowX: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch',
        paddingBottom: '0',
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 14px',
              border: 'none',
              background: 'transparent',
              color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              borderBottom: `2px solid ${activeTab === tab.id ? 'var(--color-primary)' : 'transparent'}`,
              fontWeight: activeTab === tab.id ? 700 : 500,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
              transition: '0.2s',
              fontFamily: 'var(--font-family)',
              fontSize: '13px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
          <Loader2 className="animate-spin" size={40} color="var(--color-primary)" />
        </div>
      ) : (
        <div style={{ maxWidth: '860px' }}>

          {/* ── General ───────────────── */}
          {activeTab === 'general' && (
            <div className="admin-card">
              <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '20px' }}>الإعدادات العامة والألوان</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label className={labelClass}>اسم الموقع</label>
                  <input className={inputClass} value={settings?.siteName || ''} onChange={e => setSettings({...settings, siteName: e.target.value})} />
                </div>

                {/* Colors - responsive grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
                  <div>
                    <label className={labelClass}>اللون الرئيسي</label>
                    <input type="color" className={inputClass} style={{ height: '48px', padding: '4px', cursor: 'pointer' }} value={settings?.primaryColor || '#0ea5e9'} onChange={e => setSettings({...settings, primaryColor: e.target.value})} />
                  </div>
                  <div>
                    <label className={labelClass}>اللون الثانوي</label>
                    <input type="color" className={inputClass} style={{ height: '48px', padding: '4px', cursor: 'pointer' }} value={settings?.secondaryColor || '#06b6d4'} onChange={e => setSettings({...settings, secondaryColor: e.target.value})} />
                  </div>
                  <div>
                    <label className={labelClass}>لون الخلفية</label>
                    <input type="color" className={inputClass} style={{ height: '48px', padding: '4px', cursor: 'pointer' }} value={settings?.bgColor || '#020617'} onChange={e => setSettings({...settings, bgColor: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>نوع الخط</label>
                  <select className={inputClass} value={settings?.fontFamily || 'cairo'} onChange={e => setSettings({...settings, fontFamily: e.target.value})}>
                    <option value="cairo">Cairo</option>
                    <option value="tajawal">Tajawal</option>
                    <option value="almarai">Almarai</option>
                    <option value="rubik">Rubik</option>
                  </select>
                </div>

                <button 
                  onClick={handleReset}
                  className="btn-saas" 
                  style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px dashed #ef444460', gap: '10px' }}
                >
                  <RotateCcw size={16} /> إعادة ضبط المصنع
                </button>
              </div>
            </div>
          )}

          {/* ── Branding ───────────────── */}
          {activeTab === 'branding' && (
            <div className="admin-card">
              <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '20px' }}>الهوية البصرية</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                <div>
                  <FileUploader label="شعار الموقع (Logo)" value={settings?.logo} onChange={u => setSettings((prev: any) => ({...prev, logo: u}))} aspectRatio="2/1" />
                  <div style={{ marginTop: '16px' }}>
                    <label className={labelClass}>حجم الشعار: {settings?.logoSize || 120}px</label>
                    <input type="range" min="60" max="250" value={settings?.logoSize || 120} onChange={e => setSettings({...settings, logoSize: Number(e.target.value)})} style={{ width: '100%', accentColor: 'var(--color-primary)' }} />
                  </div>
                </div>
                <FileUploader label="أيقونة المتصفح (Favicon)" value={settings?.favicon} onChange={u => setSettings((prev: any) => ({...prev, favicon: u}))} />
              </div>
            </div>
          )}

          {/* ── Hero ───────────────── */}
          {activeTab === 'hero' && (
            <div className="admin-card">
              <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '20px' }}>قسم الهيرو (الرئيسي)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label className={labelClass}>العنوان الرئيسي</label>
                  <input className={inputClass} value={settings?.heroTitle || ''} onChange={e => setSettings({...settings, heroTitle: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>الوصف</label>
                  <textarea className={inputClass} rows={3} value={settings?.heroDescription || ''} onChange={e => setSettings({...settings, heroDescription: e.target.value})} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                  <FileUploader label="الصورة رقم 1" value={settings?.heroImage} onChange={u => setSettings((prev: any) => ({...prev, heroImage: u}))} aspectRatio="16/9" />
                  <FileUploader label="الصورة رقم 2" value={settings?.heroImage2} onChange={u => setSettings((prev: any) => ({...prev, heroImage2: u}))} aspectRatio="16/9" />
                  <FileUploader label="الصورة رقم 3" value={settings?.heroImage3} onChange={u => setSettings((prev: any) => ({...prev, heroImage3: u}))} aspectRatio="16/9" />
                </div>
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '20px' }}>
                  <FileUploader label="فيديو الهيرو (MP4) - اختياري" value={settings?.heroVideo} onChange={u => setSettings((prev: any) => ({...prev, heroVideo: u}))} aspectRatio="16/9" accept="video/mp4" />
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '8px' }}>إذا تم رفع فيديو، سيتم عرضه كخلفية بدلاً من الصور.</p>
                </div>
              </div>
            </div>
          )}

          {/* ── Sections ───────────────── */}
          {activeTab === 'sections' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="admin-card">
                <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '6px' }}>صفحة من نحن</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginBottom: '20px' }}>الصورة الجانبية في صفحة «من نحن».</p>
                <FileUploader label="صورة قسم من نحن" value={settings?.aboutImage} onChange={u => setSettings((prev: any) => ({...prev, aboutImage: u}))} aspectRatio="4/3" />
              </div>

              <div className="admin-card">
                <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '6px' }}>صور الفريق</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginBottom: '20px' }}>الصور التي تظهر في قسم فريقنا المحترف.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
                  <FileUploader label="صورة الفريق 1" value={settings?.teamImage1} onChange={u => setSettings((prev: any) => ({...prev, teamImage1: u}))} aspectRatio="1/1" />
                  <FileUploader label="صورة الفريق 2" value={settings?.teamImage2} onChange={u => setSettings((prev: any) => ({...prev, teamImage2: u}))} aspectRatio="1/1" />
                  <FileUploader label="صورة الفريق 3" value={settings?.teamImage3} onChange={u => setSettings((prev: any) => ({...prev, teamImage3: u}))} aspectRatio="1/1" />
                </div>
              </div>

              <div className="admin-card">
                <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '6px' }}>قسم لماذا الفيروز؟</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginBottom: '20px' }}>الصورة الجانبية في قسم مميزاتنا.</p>
                <FileUploader label="صورة لماذا الفيروز" value={settings?.whyUsImage} onChange={u => setSettings((prev: any) => ({...prev, whyUsImage: u}))} aspectRatio="4/3" />
              </div>

              <div className="admin-card">
                <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '6px' }}>قسم الدعوة للحجز (CTA)</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginBottom: '20px' }}>صورة الخلفية في قسم «احجز الآن».</p>
                <FileUploader label="صورة خلفية CTA" value={settings?.ctaImage} onChange={u => setSettings((prev: any) => ({...prev, ctaImage: u}))} aspectRatio="16/5" />
              </div>
            </div>
          )}

          {/* ── Contact ───────────────── */}
          {activeTab === 'contact' && (
            <div className="admin-card">
              <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '20px' }}>بيانات التواصل</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label className={labelClass}>رقم الجوال</label>
                  <input className={inputClass} value={settings?.phone || ''} onChange={e => setSettings({...settings, phone: e.target.value})} placeholder="+966 5X XXX XXXX" />
                </div>
                <div>
                  <label className={labelClass}>البريد الإلكتروني</label>
                  <input className={inputClass} value={settings?.email || ''} onChange={e => setSettings({...settings, email: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>نص التذييل (Footer Copy)</label>
                  <input className={inputClass} value={settings?.footerText || ''} onChange={e => setSettings({...settings, footerText: e.target.value})} />
                </div>
              </div>
            </div>
          )}

          {/* ── SEO ───────────────── */}
          {activeTab === 'seo' && (
            <div className="admin-card">
              <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '20px' }}>تحسين محركات البحث (SEO)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label className={labelClass}>العنوان الوصفي (Meta Title)</label>
                  <input className={inputClass} value={seo?.metaTitle || ''} onChange={e => setSeo({...seo, metaTitle: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>وصف الموقع (Meta Description)</label>
                  <textarea className={inputClass} rows={3} value={seo?.metaDescription || ''} onChange={e => setSeo({...seo, metaDescription: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>كلمات مفتاحية (Keywords)</label>
                  <input className={inputClass} value={seo?.keywords || ''} onChange={e => setSeo({...seo, keywords: e.target.value})} placeholder="شركة تنظيف, غسيل كنب, إلخ..." />
                </div>
                <div style={{ height: '1px', background: 'var(--color-border)' }} />
                <div>
                  <label className={labelClass}>عنوان المشاركة (OG Title)</label>
                  <input className={inputClass} value={seo?.ogTitle || ''} onChange={e => setSeo({...seo, ogTitle: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>وصف المشاركة (OG Description)</label>
                  <textarea className={inputClass} rows={2} value={seo?.ogDescription || ''} onChange={e => setSeo({...seo, ogDescription: e.target.value})} />
                </div>
                <FileUploader label="صورة المشاركة (OG Image)" value={seo?.ogImage} onChange={u => setSeo({...seo, ogImage: u})} aspectRatio="1200/630" />
              </div>
            </div>
          )}

          {/* ── Account ───────────────── */}
          {activeTab === 'account' && (
            <div className="admin-card">
              <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '20px' }}>إعدادات الحساب</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label className={labelClass}>اسم المستخدم</label>
                  <input className={inputClass} value={adminData?.username || ''} onChange={e => setAdminData({...adminData, username: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>البريد الإلكتروني</label>
                  <input className={inputClass} value={adminData?.email || ''} onChange={e => setAdminData({...adminData, email: e.target.value})} />
                </div>
                <div style={{ height: '1px', background: 'var(--color-border)' }} />
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'white' }}>تغيير كلمة المرور</h4>
                <div>
                  <label className={labelClass}>كلمة المرور الحالية</label>
                  <input type="password" className={inputClass} value={adminData?.currentPassword || ''} onChange={e => setAdminData({...adminData, currentPassword: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>كلمة المرور الجديدة (اختياري)</label>
                  <input type="password" className={inputClass} value={adminData?.newPassword || ''} onChange={e => setAdminData({...adminData, newPassword: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>تأكيد كلمة المرور الجديدة</label>
                  <input type="password" className={inputClass} value={adminData?.confirmPassword || ''} onChange={e => setAdminData({...adminData, confirmPassword: e.target.value})} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Save Bar ─── Fixed bottom bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '14px 20px',
        background: 'rgba(10, 16, 38, 0.92)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
      }}>
        {/* Left: status messages */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight: 700, fontSize: '13px' }}
              >
                <AlertCircle size={16} /> {error}
              </motion.div>
            )}
            {showSuccess && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 700, fontSize: '13px' }}
              >
                <CheckCircle size={16} /> تم الحفظ بنجاح!
              </motion.div>
            )}
          </AnimatePresence>
          {!error && !showSuccess && (
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              تبويب: {tabs.find(t => t.id === activeTab)?.name}
            </span>
          )}
        </div>

        {/* Right: save button */}
        <button 
          onClick={handleSaveSettings} 
          className="btn-saas btn-saas-primary" 
          disabled={saving}
          style={{ flexShrink: 0, minWidth: '160px' }}
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </div>
    </div>
  );
}

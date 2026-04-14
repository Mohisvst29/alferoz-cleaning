'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Globe, Shield, Phone, Monitor, Image as ImageIcon, Search, User, Eye, RotateCcw } from 'lucide-react';
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
      // Always fetch all settings on first load
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

  useEffect(() => {
    fetchSettings();
  }, []); // Only fetch once on mount

  useEffect(() => {
    if (activeTab === 'account') fetchAdminAccount();
  }, [activeTab]);

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

    if (activeTab === 'seo') {
      endpoint = '/api/seo';
      bodyData = seo;
    } else if (activeTab === 'account') {
      endpoint = '/api/admin/account';
      bodyData = adminData;
    }

    console.log('💾 Saving to:', endpoint, 'fields:', Object.keys(bodyData));
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(bodyData),
      });
      
      const responseData = await res.json();
      console.log('📥 Response:', responseData);

      if (res.ok) {
        // Update local state with saved data
        if (activeTab !== 'seo' && activeTab !== 'account') {
          setSettings(responseData);
        }
        setShowSuccess(true);
        if (activeTab === 'account') {
           setAdminData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
        }
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setError(responseData.error || `خطأ ${res.status}: فشل الحفظ`);
        console.error('Save failed:', responseData);
      }
    } catch (err) {
      console.error('Save error:', err);
      setError('تعذر الاتصال بالخادم');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('هل أنت متأكد من إعادة تعيين كافة إعدادات الموقع للأوضاع الافتراضية؟ لا يمكن التراجع عن هذا الإجراء.')) return;
    
    setSaving(true);
    try {
      const res = await fetch('/api/admin/reset', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
      });
      if (res.ok) {
        window.location.reload();
      } else {
        alert('فشل في إعادة التعيين');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const tabs: { id: Tab; name: string; icon: any }[] = [
    { id: 'general', name: 'عام', icon: <Monitor size={18} /> },
    { id: 'branding', name: 'الهوية البصرية', icon: <Globe size={18} /> },
    { id: 'hero', name: 'البداية (Hero)', icon: <ImageIcon size={18} /> },
    { id: 'sections', name: 'صور الأقسام', icon: <Eye size={18} /> },
    { id: 'contact', name: 'التواصل', icon: <Phone size={18} /> },
    { id: 'seo', name: 'SEO & Meta', icon: <Search size={18} /> },
    { id: 'account', name: 'الحساب', icon: <User size={18} /> },
  ];

  return (
    <div style={{ paddingBottom: '140px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '8px' }}>إعدادات المنصة</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>تخصيص الهوية، الأمان، وتحسين محركات البحث.</p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', borderBottom: '1px solid var(--color-border)', overflowX: 'auto' }} className="no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'transparent',
              color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              borderBottom: `2px solid ${activeTab === tab.id ? 'var(--color-primary)' : 'transparent'}`,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px', transition: '0.3s'
            }}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
          <Loader2 className="animate-spin" size={48} color="var(--color-primary)" />
        </div>
      ) : (
        <div style={{ maxWidth: '900px' }}>
          {activeTab === 'general' && (
            <div className="admin-card">
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '24px' }}>الإعدادات العامة والألوان</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                 <div style={{ gridColumn: 'span 3' }}>
                  <label className="admin-label">اسم الموقع</label>
                  <input className="input-saas" value={settings?.siteName || ''} onChange={e => setSettings({...settings, siteName: e.target.value})} />
                </div>
                <div><label className="admin-label">اللون الرئيسي</label><input type="color" className="input-saas" style={{ height: '50px', padding: 0, cursor: 'pointer' }} value={settings?.primaryColor || '#0ea5e9'} onChange={e => setSettings({...settings, primaryColor: e.target.value})} /></div>
                <div><label className="admin-label">اللون الثانوي</label><input type="color" className="input-saas" style={{ height: '50px', padding: 0, cursor: 'pointer' }} value={settings?.secondaryColor || '#06b6d4'} onChange={e => setSettings({...settings, secondaryColor: e.target.value})} /></div>
                <div><label className="admin-label">لون الخلفية</label><input type="color" className="input-saas" style={{ height: '50px', padding: 0, cursor: 'pointer' }} value={settings?.bgColor || '#020617'} onChange={e => setSettings({...settings, bgColor: e.target.value})} /></div>
                
                <div>
                  <label className="admin-label">نوع الخط (Font Family)</label>
                  <select className="input-saas" style={{ width: '100%', height: '50px' }} value={settings?.fontFamily || 'cairo'} onChange={e => setSettings({...settings, fontFamily: e.target.value})}>
                    <option value="cairo">Cairo</option>
                    <option value="tajawal">Tajawal</option>
                    <option value="almarai">Almarai</option>
                    <option value="rubik">Rubik</option>
                  </select>
                </div>
                
                <div style={{ gridColumn: 'span 3', marginTop: '20px' }}>
                  <button 
                    onClick={handleReset}
                    className="btn-saas" 
                    style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px dashed #ef4444', width: '100%', gap: '12px' }}
                  >
                    <RotateCcw size={18} /> إعادة ضبط المصنع (استعادة الإعدادات الافتراضية)
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="admin-card">
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '24px' }}>الهوية البصرية</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                <div>
                  <FileUploader label="شعار الموقع (Logo)" value={settings?.logo} onChange={u => setSettings(prev => ({...prev, logo: u}))} aspectRatio="2/1" />
                  <div style={{ marginTop: '16px' }}>
                    <label className="admin-label">حجم الشعار: {settings?.logoSize || 120}px</label>
                    <input type="range" min="60" max="250" value={settings?.logoSize || 120} onChange={e => setSettings({...settings, logoSize: Number(e.target.value)})} style={{ width: '100%' }} />
                  </div>
                </div>
                <div>
                  <FileUploader label="أيقونة المتصفح (Favicon)" value={settings?.favicon} onChange={u => setSettings(prev => ({...prev, favicon: u}))} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hero' && (
            <div className="admin-card">
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '24px' }}>قسم الهيرو (الرئيسي)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div><label className="admin-label">العنوان الرئيسي</label><input className="input-saas" value={settings?.heroTitle || ''} onChange={e => setSettings({...settings, heroTitle: e.target.value})} /></div>
                <div><label className="admin-label">الوصف</label><textarea className="input-saas" rows={3} value={settings?.heroDescription || ''} onChange={e => setSettings({...settings, heroDescription: e.target.value})} /></div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                  <FileUploader label="الصورة رقم 1" value={settings?.heroImage} onChange={u => setSettings(prev => ({...prev, heroImage: u}))} aspectRatio="16/9" />
                  <FileUploader label="الصورة رقم 2" value={settings?.heroImage2} onChange={u => setSettings(prev => ({...prev, heroImage2: u}))} aspectRatio="16/9" />
                  <FileUploader label="الصورة رقم 3" value={settings?.heroImage3} onChange={u => setSettings(prev => ({...prev, heroImage3: u}))} aspectRatio="16/9" />
                </div>
                
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '24px' }}>
                  <label className="admin-label">ملف الفيديو (اختياري)</label>
                  <FileUploader label="فيديو الهيرو (MP4)" value={settings?.heroVideo} onChange={u => setSettings(prev => ({...prev, heroVideo: u}))} aspectRatio="16/9" accept="video/mp4" />
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '8px' }}>ملاحظة: إذا تم رفع فيديو، سيتم عرضه كخلفية بدلاً من الصور المتحركة.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sections' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div className="admin-card">
                <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>صفحة من نحن</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginBottom: '24px' }}>الصورة الجانبية التي تظهر في صفحة «من نحن».</p>
                <FileUploader label="صورة قسم من نحن" value={settings?.aboutImage} onChange={u => setSettings(prev => ({...prev, aboutImage: u}))} aspectRatio="4/3" />
              </div>

              <div className="admin-card">
                <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>صور الفريق (صفحة من نحن)</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginBottom: '24px' }}>الصور الثلاث التي تظهر في قسم فريقنا المحترف.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                  <FileUploader label="صورة الفريق 1" value={settings?.teamImage1} onChange={u => setSettings(prev => ({...prev, teamImage1: u}))} aspectRatio="1/1" />
                  <FileUploader label="صورة الفريق 2" value={settings?.teamImage2} onChange={u => setSettings(prev => ({...prev, teamImage2: u}))} aspectRatio="1/1" />
                  <FileUploader label="صورة الفريق 3" value={settings?.teamImage3} onChange={u => setSettings(prev => ({...prev, teamImage3: u}))} aspectRatio="1/1" />
                </div>
              </div>

              <div className="admin-card">
                <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>قسم لماذا الفيروز؟</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginBottom: '24px' }}>الصورة الجانبية في قسم مميزاتنا بالصفحة الرئيسية.</p>
                <FileUploader label="صورة قسم لماذا الفيروز" value={settings?.whyUsImage} onChange={u => setSettings(prev => ({...prev, whyUsImage: u}))} aspectRatio="4/3" />
              </div>

              <div className="admin-card">
                <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>قسم الدعوة للحجز (CTA)</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginBottom: '24px' }}>صورة الخلفية في قسم «احجز الآن» في أسفل الصفحة الرئيسية.</p>
                <FileUploader label="صورة خلفية CTA" value={settings?.ctaImage} onChange={u => setSettings(prev => ({...prev, ctaImage: u}))} aspectRatio="16/5" />
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="admin-card">
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '24px' }}>بيانات التواصل</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div><label className="admin-label">رقم الجوال</label><input className="input-saas" value={settings?.phone || ''} onChange={e => setSettings({...settings, phone: e.target.value})} /></div>
                <div style={{ gridColumn: 'span 2' }}><label className="admin-label">البريد الإلكتروني</label><input className="input-saas" value={settings?.email || ''} onChange={e => setSettings({...settings, email: e.target.value})} /></div>
                <div style={{ gridColumn: 'span 2' }}><label className="admin-label">نص التذييل (Footer Copy)</label><input className="input-saas" value={settings?.footerText || ''} onChange={e => setSettings({...settings, footerText: e.target.value})} /></div>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="admin-card">
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '24px' }}>تحسين محركات البحث (SEO)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div><label className="admin-label">العنوان الوصفي (Meta Title)</label><input className="input-saas" value={seo?.metaTitle || ''} onChange={e => setSeo({...seo, metaTitle: e.target.value})} /></div>
                <div><label className="admin-label">وصف الموقع (Meta Description)</label><textarea className="input-saas" rows={3} value={seo?.metaDescription || ''} onChange={e => setSeo({...seo, metaDescription: e.target.value})} /></div>
                <div><label className="admin-label">كلمات مفتاحية (Keywords)</label><input className="input-saas" value={seo?.keywords || ''} onChange={e => setSeo({...seo, keywords: e.target.value})} placeholder="شركة تنظيف, غسيل كنب, إلخ..." /></div>
                <div style={{ height: '1px', background: 'var(--color-border)', margin: '16px 0' }} />
                <div><label className="admin-label">عنوان المشاركة الجرافيكية (OG Title)</label><input className="input-saas" value={seo?.ogTitle || ''} onChange={e => setSeo({...seo, ogTitle: e.target.value})} /></div>
                <div><label className="admin-label">وصف المشاركة الجرافيكية (OG Description)</label><textarea className="input-saas" rows={2} value={seo?.ogDescription || ''} onChange={e => setSeo({...seo, ogDescription: e.target.value})} /></div>
                <FileUploader label="صورة المشاركة (OG Image)" value={seo?.ogImage} onChange={u => setSeo({...seo, ogImage: u})} aspectRatio="1200/630" />
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="admin-card">
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '24px' }}>إعدادات الحساب</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div><label className="admin-label">اسم المستخدم</label><input className="input-saas" value={adminData?.username || ''} onChange={e => setAdminData({...adminData, username: e.target.value})} /></div>
                <div><label className="admin-label">البريد الإلكتروني</label><input className="input-saas" value={adminData?.email || ''} onChange={e => setAdminData({...adminData, email: e.target.value})} /></div>
                <div style={{ height: '1px', background: 'var(--color-border)', margin: '16px 0' }} />
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'white' }}>تغيير كلمة المرور</h4>
                <div><label className="admin-label">كلمة المرور الحالية</label><input type="password" className="input-saas" value={adminData?.currentPassword || ''} onChange={e => setAdminData({...adminData, currentPassword: e.target.value})} /></div>
                <div><label className="admin-label">كلمة المرور الجديدة (اختياري)</label><input type="password" className="input-saas" value={adminData?.newPassword || ''} onChange={e => setAdminData({...adminData, newPassword: e.target.value})} /></div>
                <div><label className="admin-label">تأكيد كلمة المرور الجديدة</label><input type="password" className="input-saas" value={adminData?.confirmPassword || ''} onChange={e => setAdminData({...adminData, confirmPassword: e.target.value})} /></div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="admin-save-bar">
        {error && (
            <div style={{ color: '#ef4444', fontWeight: 700, marginRight: 'auto' }}>{error}</div>
        )}
        <AnimatePresence>
          {showSuccess && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} style={{ color: '#10b981', fontWeight: 700 }}>تم حفظ التغييرات بنجاح!</motion.div>
          )}
        </AnimatePresence>
        <button onClick={handleSaveSettings} className="btn-saas btn-saas-primary" disabled={saving}>
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} 
          حفظ كافة التغييرات
        </button>
      </div>

      <style jsx>{`
        .admin-label { display: block; font-size: 13px; font-weight: 700; margin-bottom: 8px; color: var(--color-text-secondary); opacity: 0.8; }
        .admin-save-bar {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;
          padding: 24px 40px; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(20px);
          border-top: 1px solid var(--color-border); display: flex; justify-content: flex-end; align-items: center; gap: 24px;
        }
      `}</style>
    </div>
  );
}

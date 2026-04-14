'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => setSettings(data));
  }, []);

  const whatsappNumber = settings?.whatsapp || "966562185880";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      style={{
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        zIndex: 2000,
        width: '64px',
        height: '64px',
        background: '#25D366',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 25px rgba(37, 211, 102, 0.4)',
        cursor: 'pointer',
        textDecoration: 'none',
      }}
    >
      {/* Pulse Animation */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          inset: 0,
          background: '#25D366',
          borderRadius: '50%',
          zIndex: -1
        }}
      />
      
      <MessageCircle color="white" size={32} />

      {/* Tooltip */}
      <div className="glass" style={{
        position: 'absolute',
        right: '80px',
        padding: '8px 16px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: 600,
        color: 'white',
        whiteSpace: 'nowrap',
        opacity: 0,
        transform: 'translateX(10px)',
        transition: '0.3s',
        pointerEvents: 'none',
        border: '1px solid rgba(255,255,255,0.1)'
      }} id="wa-tooltip">
        تواصل عبر واتساب
      </div>

      <style jsx>{`
        a:hover #wa-tooltip {
          opacity: 1 !important;
          transform: translateX(0) !important;
        }
        @media (max-width: 768px) {
          a {
            bottom: 24px !important;
            right: 24px !important;
            width: 56px !important;
            height: 56px !important;
          }
        }
      `}</style>
    </motion.a>
  );
}

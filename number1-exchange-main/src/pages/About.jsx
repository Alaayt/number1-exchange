// src/pages/About.jsx
import { useEffect } from 'react'

// ─── SVG icons ───
const IcShield = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
const IcZap    = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
const IcEye2   = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const IcSupport= () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
const IcClipboard = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>

const VALUES = [
  { icon: <IcShield />, title: 'الأمان أولاً',  desc: 'كل معاملة تمر عبر مراجعة يدوية وتحقق تلقائي من blockchain قبل الإرسال.' },
  { icon: <IcZap />,    title: 'السرعة',         desc: 'معظم التحويلات تكتمل خلال 5 إلى 30 دقيقة، 7 أيام في الأسبوع.' },
  { icon: <IcEye2 />,   title: 'الشفافية',       desc: 'أسعارنا واضحة بلا رسوم خفية. السعر الذي تراه هو ما ستدفعه.' },
  { icon: <IcSupport/>, title: 'دعم حقيقي',      desc: 'فريق بشري يتابع كل طلب ويرد على استفساراتك بسرعة عبر تيليغرام.' },
]

const STATS = [
  { value: '2023',    label: 'سنة التأسيس' },
  { value: '10K+',   label: 'صفقة منجزة'  },
  { value: '99.8%',  label: 'نسبة النجاح'  },
  { value: '24/7',   label: 'الدعم الفني'  },
]

export default function About() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div style={{ minHeight: '80vh', padding: '60px 24px', maxWidth: 900, margin: '0 auto', direction: 'rtl' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 16px', borderRadius: 20, border: '1px solid rgba(0,212,255,0.3)', background: 'rgba(0,212,255,0.06)', marginBottom: 20 }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--cyan)', fontFamily: "'JetBrains Mono',monospace", letterSpacing: 2 }}>ABOUT US</span>
        </div>
        <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 900, color: 'var(--text-1)', margin: '0 0 20px' }}>
          من نحن
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-3)', maxWidth: 580, margin: '0 auto', fontFamily: "'Tajawal',sans-serif", lineHeight: 1.9 }}>
          NUMBER 1 EXCHANGE منصة متخصصة في تحويل العملات الرقمية والمحافظ الإلكترونية. أُسست لتقديم خدمة صرف سريعة وآمنة وشفافة للعرب في كل مكان.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 56 }}>
        {STATS.map(s => (
          <div key={s.label} style={{ background: 'var(--card)', border: '1px solid var(--border-1)', borderRadius: 14, padding: '22px', textAlign: 'center' }}>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '1.4rem', fontWeight: 900, color: 'var(--cyan)', marginBottom: 6 }}>{s.value}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', fontFamily: "'Tajawal',sans-serif" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Mission */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border-1)', borderRadius: 20, padding: '30px 28px', marginBottom: 48, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, var(--cyan), transparent)' }} />
        <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '1rem', fontWeight: 700, color: 'var(--cyan)', margin: '0 0 16px', letterSpacing: 1 }}>رسالتنا</h2>
        <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-2)', lineHeight: 1.9, fontFamily: "'Tajawal',sans-serif" }}>
          نؤمن بأن تحويل الأموال يجب أن يكون سهلاً وسريعاً وآمناً للجميع. هدفنا هو تقليص الوقت والتعقيد في عمليات صرف العملات الرقمية، وتوفير سعر عادل وشفاف بدون رسوم مخفية أو مفاجآت.
        </p>
      </div>

      {/* Values */}
      <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '1rem', fontWeight: 700, color: 'var(--text-1)', margin: '0 0 20px', letterSpacing: 1 }}>قيمنا</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: 52 }}>
        {VALUES.map(v => (
          <div key={v.title} style={{ background: 'var(--card)', border: '1px solid var(--border-1)', borderRadius: 16, padding: '22px 18px', transition: 'border-color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-1)'}>
            <div style={{ marginBottom: 10, color: 'var(--cyan)', display:'flex' }}>{v.icon}</div>
            <h3 style={{ margin: '0 0 8px', fontFamily: "'Tajawal',sans-serif", fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-1)' }}>{v.title}</h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-3)', lineHeight: 1.75, fontFamily: "'Tajawal',sans-serif" }}>{v.desc}</p>
          </div>
        ))}
      </div>

      {/* BestChange compliance notice */}
      <div style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 16, padding: '22px 24px' }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <span style={{ color: 'var(--cyan)', flexShrink: 0 }}><IcClipboard /></span>
          <div>
            <h3 style={{ margin: '0 0 8px', fontFamily: "'Tajawal',sans-serif", fontWeight: 700, color: 'var(--text-1)', fontSize: '0.95rem' }}>الامتثال والتسجيل</h3>
            <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-3)', lineHeight: 1.8, fontFamily: "'Tajawal',sans-serif" }}>
              منصتنا مسجلة على BestChange.com وتعمل وفق معايير AML/KYC الدولية. نلتزم بالشفافية الكاملة في جميع عملياتنا ونتابع باستمرار اللوائح المتعلقة بصرف العملات الرقمية.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
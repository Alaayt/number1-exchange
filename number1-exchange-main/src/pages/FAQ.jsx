// src/pages/FAQ.jsx
import { useState, useEffect } from 'react'

const IcExchange = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
const IcCard     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
const IcLockFaq  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
const IcPackage  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>

const FAQ_DATA = [
  {
    category: 'عمليات الصرف', catIcon: <IcExchange />,
    items: [
      { q: 'ما هي العملات المدعومة؟', a: 'نقبل USDT (TRC-20)، فودافون كاش، إنستاباي. نرسل إلى MoneyGo USD وبعض المحافظ الإلكترونية الأخرى. يمكنك مراجعة صفحة الأسعار للتفاصيل الكاملة.' },
      { q: 'ما الحد الأدنى والأقصى للتحويل؟', a: 'الحد الأدنى هو 10 USDT أو ما يعادلها. الحد الأقصى يعتمد على نوع الصرف وقد يتطلب تحقق الهوية للمبالغ الكبيرة.' },
      { q: 'كم يستغرق التحويل؟', a: 'تحويلات USDT: تلقائية خلال 5-15 دقيقة. المحافظ الإلكترونية المصرية: يدوي خلال 15-30 دقيقة خلال أوقات العمل.' },
      { q: 'هل الأسعار ثابتة؟', a: 'الأسعار تتحدث بانتظام حسب السوق. السعر الذي ترى عند تقديم الطلب هو السعر المضمون لك لمدة 15 دقيقة.' },
    ]
  },
  {
    category: 'الدفع والتحقق', catIcon: <IcCard />,
    items: [
      { q: 'كيف أرسل USDT؟', a: 'انسخ عنوان TRC-20 المعروض في طلبك وأرسل المبلغ المحدد من محفظتك. تأكد من اختيار شبكة TRC-20 وليس ERC-20.' },
      { q: 'لماذا يطلب إيصال دفع؟', a: 'للمحافظ الإلكترونية المصرية، نطلب إيصالاً للتحقق من وصول الدفع. هذا يحميك ويحمينا ويضمن سرعة المعالجة.' },
      { q: 'ماذا أفعل إذا أرسلت بشبكة خاطئة؟', a: 'تواصل معنا فوراً على تيليغرام برقم طلبك وتفاصيل المعاملة. سنحاول استرداد الأموال لكن لا يمكن ضمان ذلك دائماً.' },
    ]
  },
  {
    category: 'الأمان والخصوصية', catIcon: <IcLockFaq />,
    items: [
      { q: 'هل المنصة آمنة؟', a: 'نعم. نستخدم TronGrid API الرسمي للتحقق من معاملات USDT. جميع الطلبات تُراجع يدوياً من فريقنا قبل الإرسال.' },
      { q: 'هل تحتفظون ببياناتي؟', a: 'نحتفظ فقط بالبيانات الضرورية لإتمام الطلبات والامتثال لمتطلبات AML/KYC. راجع سياسة الخصوصية للتفاصيل.' },
      { q: 'هل يطلب التحقق من الهوية؟', a: 'للمبالغ العادية لا. للمبالغ الكبيرة (فوق حد معين) قد نطلب وثيقة هوية وفقاً لسياسة AML/KYC.' },
    ]
  },
  {
    category: 'تتبع الطلبات', catIcon: <IcPackage />,
    items: [
      { q: 'كيف أتابع طلبي؟', a: 'بعد إتمام الطلب ستحصل على رقم طلب. أدخله في صفحة "تتبع الطلب" لمعرفة الحالة الحالية.' },
      { q: 'ما هي حالات الطلب؟', a: 'الحالات هي: معلق (انتظار الدفع) ← قيد المراجعة ← قيد المعالجة ← مكتمل. في حالة وجود مشكلة ستتلقى إشعاراً.' },
      { q: 'ماذا أفعل إذا تأخر طلبي؟', a: 'إذا تجاوز وقت المعالجة 45 دقيقة، تواصل معنا على تيليغرام برقم الطلب وسنتابع معك فوراً.' },
    ]
  },
]

function AccordionItem({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ border: '1px solid var(--border-1)', borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.2s' }}>
      <button onClick={() => setOpen(v => !v)}
        style={{ width: '100%', padding: '14px 18px', background: open ? 'rgba(0,212,255,0.05)' : 'var(--card)', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, textAlign: 'right' }}>
        <span style={{ fontFamily: "'Tajawal',sans-serif", fontWeight: 700, fontSize: '0.9rem', color: open ? 'var(--cyan)' : 'var(--text-1)' }}>{item.q}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, transition: 'transform 0.25s', transform: open ? 'rotate(180deg)' : 'rotate(0)', color: 'var(--text-3)' }}><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      {open && (
        <div style={{ padding: '14px 18px 18px', background: 'var(--card)', borderTop: '1px solid var(--border-1)' }}>
          <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-2)', lineHeight: 1.8, fontFamily: "'Tajawal',sans-serif" }}>{item.a}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div style={{ minHeight: '80vh', padding: '60px 24px', maxWidth: 820, margin: '0 auto', direction: 'rtl' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 52 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 16px', borderRadius: 20, border: '1px solid rgba(0,212,255,0.3)', background: 'rgba(0,212,255,0.06)', marginBottom: 20 }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--cyan)', fontFamily: "'JetBrains Mono',monospace", letterSpacing: 2 }}>FAQ</span>
        </div>
        <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 900, color: 'var(--text-1)', margin: '0 0 16px' }}>
          الأسئلة الشائعة
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-3)', maxWidth: 420, margin: '0 auto', fontFamily: "'Tajawal',sans-serif", lineHeight: 1.8 }}>
          إجابات على أكثر الأسئلة التي يطرحها عملاؤنا
        </p>
      </div>

      {/* FAQ sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
        {FAQ_DATA.map(section => (
          <div key={section.category}>
            <h2 style={{ fontFamily: "'Tajawal',sans-serif", fontSize: '1rem', fontWeight: 700, color: 'var(--text-2)', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              {section.category}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {section.items.map(item => <AccordionItem key={item.q} item={item} />)}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ marginTop: 52, textAlign: 'center', padding: '28px', background: 'var(--card)', border: '1px solid var(--border-1)', borderRadius: 18 }}>
        <p style={{ fontFamily: "'Tajawal',sans-serif", color: 'var(--text-2)', margin: '0 0 16px', fontSize: '0.95rem' }}>
          لم تجد إجابة على سؤالك؟
        </p>
        <a href="/contact" style={{ display: 'inline-block', padding: '10px 28px', background: 'linear-gradient(135deg,#009fc0,#006e9e)', borderRadius: 10, color: '#fff', textDecoration: 'none', fontFamily: "'Tajawal',sans-serif", fontWeight: 700, fontSize: '0.9rem' }}>
          تواصل معنا مباشرة →
        </a>
      </div>
    </div>
  )
}
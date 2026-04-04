// src/pages/Reviews.jsx — Horizontal Auto-Scroll Carousel (two rows)
import { useEffect } from 'react'
import useLang from '../context/useLang'

const REVIEWS = [
  { id:1,  nameAr:'أحمد محمد',     nameEn:'Ahmed Mohammed',    country:'SA', rating:5, dateAr:'مارس 2025',    dateEn:'Mar 2025',   amount:'500 USDT → MoneyGo',  textAr:'خدمة ممتازة! التحويل تم خلال 10 دقائق فقط. السعر أفضل مما وجدته في أي مكان آخر.', textEn:'Excellent service! Transfer was done in just 10 minutes. The rate was better than anywhere else.' },
  { id:2,  nameAr:'محمود علي',     nameEn:'Mahmoud Ali',       country:'EG', rating:5, dateAr:'مارس 2025',    dateEn:'Mar 2025',   amount:'200 USDT → فودافون',  textAr:'تعاملت معهم مرات عديدة ودائماً الخدمة سريعة وأمينة. فريق الدعم متجاوب جداً على تيليغرام.', textEn:'I\'ve dealt with them many times and the service is always fast and reliable. Support team is very responsive on Telegram.' },
  { id:3,  nameAr:'خالد العمري',   nameEn:'Khalid Al-Omari',   country:'SA', rating:4, dateAr:'فبراير 2025',  dateEn:'Feb 2025',   amount:'1000 USDT → MoneyGo', textAr:'تجربة جيدة جداً. انتظرت 20 دقيقة بسبب ازدحام لكن المبلغ وصل كاملاً. أنصح بهم.', textEn:'Very good experience. Waited 20 minutes due to congestion but the full amount arrived. Recommended.' },
  { id:4,  nameAr:'ياسمين حسن',   nameEn:'Yasmine Hassan',    country:'EG', rating:5, dateAr:'فبراير 2025',  dateEn:'Feb 2025',   amount:'300 USDT → InstaPay', textAr:'أول تعامل معهم وكان رائعاً. الموقع واضح وسهل، والتحويل وصل بسرعة. شكراً!', textEn:'First time using them and it was great. The site is clear and easy, and the transfer arrived quickly. Thanks!' },
  { id:5,  nameAr:'عمر الزهراني', nameEn:'Omar Al-Zahrani',   country:'SA', rating:5, dateAr:'يناير 2025',   dateEn:'Jan 2025',   amount:'750 USDT → MoneyGo',  textAr:'من أفضل منصات الصرف التي استخدمتها. شفافية كاملة في الأسعار وسرعة في التنفيذ.', textEn:'One of the best exchange platforms I\'ve used. Full price transparency and fast execution.' },
  { id:6,  nameAr:'نورة القحطاني',nameEn:'Noura Al-Qahtani',  country:'SA', rating:4, dateAr:'يناير 2025',   dateEn:'Jan 2025',   amount:'150 USDT → Vodafone',  textAr:'الخدمة ممتازة والفريق محترف. السعر منافس جداً مقارنة بالبدائل الأخرى.', textEn:'Excellent service and professional team. Very competitive rates compared to alternatives.' },
  { id:7,  nameAr:'مصطفى إبراهيم',nameEn:'Mustafa Ibrahim',   country:'EG', rating:5, dateAr:'ديسمبر 2024', dateEn:'Dec 2024',   amount:'2000 USDT → MoneyGo', textAr:'أثق بهم بمبالغ كبيرة منذ سنة. لم يخذلوني أبداً. الدعم متاح على مدار الساعة.', textEn:'I trust them with large amounts for a year now. They never let me down. Support is available 24/7.' },
  { id:8,  nameAr:'سارة الأنصاري',nameEn:'Sara Al-Ansari',    country:'SA', rating:5, dateAr:'ديسمبر 2024', dateEn:'Dec 2024',   amount:'400 USDT → InstaPay', textAr:'تحويل سلس ومريح. الموقع جميل ومنظم. استمروا هكذا.', textEn:'Smooth and convenient transfer. Beautiful and organized website. Keep it up.' },
  { id:9,  nameAr:'فيصل المطيري', nameEn:'Faisal Al-Mutairi', country:'SA', rating:5, dateAr:'نوفمبر 2024', dateEn:'Nov 2024',   amount:'600 USDT → MoneyGo',  textAr:'من أفضل تجاربي في تحويل الأموال. سرعة التنفيذ لا تصدق والأسعار منافسة جداً.', textEn:'One of my best money transfer experiences. Unbelievable execution speed and very competitive rates.' },
  { id:10, nameAr:'رنا الشهراني', nameEn:'Rana Al-Shahrani',  country:'SA', rating:5, dateAr:'أكتوبر 2024', dateEn:'Oct 2024',   amount:'350 USDT → InstaPay', textAr:'خدمة عملاء رائعة وتعامل احترافي. التحويل وصل قبل الوقت المتوقع. سأعود دائماً.', textEn:'Amazing customer service and professional treatment. Transfer arrived earlier than expected. Will always come back.' },
]

const STATS = [
  { value:'10,000+', labelAr:'صفقة منجزة',   labelEn:'Deals Completed',
    icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3"/></svg> },
  { value:'4.9/5',   labelAr:'متوسط التقييم', labelEn:'Average Rating',
    icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  { value:'98%',     labelAr:'رضا العملاء',   labelEn:'Customer Satisfaction',
    icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg> },
  { value:'< 15m',   labelAr:'متوسط التحويل', labelEn:'Average Transfer',
    icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
]

const ACCENT_COLORS = ['#00b8d9','#7c5cfc','#f59e0b','#00e5a0','#f43f5e','#06b6d4','#a78bfa','#34d399','#fb923c','#38bdf8']

function Stars({ rating }) {
  return (
    <div style={{ display:'flex', gap:2 }}>
      {[1,2,3,4,5].map(s => (
        <svg key={s} width="11" height="11" viewBox="0 0 24 24"
          fill={s <= rating ? '#f59e0b' : 'none'}
          stroke={s <= rating ? '#f59e0b' : 'rgba(255,255,255,0.15)'}
          strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  )
}

function ReviewCard({ review, idx, isEn }) {
  const col = ACCENT_COLORS[idx % ACCENT_COLORS.length]
  const name = isEn ? review.nameEn : review.nameAr
  const text = isEn ? review.textEn : review.textAr
  const date = isEn ? review.dateEn : review.dateAr
  return (
    <div style={{
      flexShrink: 0,
      width: 272,
      background: 'var(--card)',
      border: '1px solid var(--border-1)',
      borderRadius: 18,
      padding: '18px 18px 16px',
      display: 'flex', flexDirection: 'column', gap: 11,
      margin: '6px 8px',
      position: 'relative', overflow: 'hidden',
      transition: 'border-color .2s, box-shadow .2s',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor=col+'60'; e.currentTarget.style.boxShadow=`0 8px 28px ${col}18` }}
    onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border-1)'; e.currentTarget.style.boxShadow='none' }}
    >
      <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${col}90,transparent)` }}/>

      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:40, height:40, borderRadius:'50%', background:`linear-gradient(135deg,${col},${col}77)`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, color:'#fff', fontSize:'.95rem', fontFamily:"'Tajawal',sans-serif", flexShrink:0, boxShadow:`0 3px 10px ${col}44` }}>
          {name[0]}
        </div>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ fontFamily:"'Tajawal',sans-serif", fontWeight:700, fontSize:'.87rem', color:'var(--text-1)' }}>{name}</span>
            <span style={{ fontSize:'.58rem', fontFamily:"'JetBrains Mono',monospace", color:col, background:`${col}18`, padding:'1px 5px', borderRadius:4, border:`1px solid ${col}28` }}>{review.country}</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:3 }}>
            <Stars rating={review.rating}/>
            <span style={{ fontSize:'.6rem', color:'var(--text-3)', fontFamily:"'JetBrains Mono',monospace" }}>{date}</span>
          </div>
        </div>
      </div>

      <p style={{ margin:0, fontSize:'.83rem', color:'var(--text-2)', lineHeight:1.7, fontFamily:"'Tajawal',sans-serif",
        display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
        "{text}"
      </p>

      <div style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 9px', borderRadius:7, background:`${col}12`, border:`1px solid ${col}28`, alignSelf:'flex-start', marginTop:'auto' }}>
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        <span style={{ fontSize:'.61rem', color:col, fontFamily:"'JetBrains Mono',monospace", fontWeight:600 }}>{review.amount}</span>
      </div>
    </div>
  )
}

function CarouselTrack({ reviews, direction, isEn }) {
  const items = [...reviews, ...reviews, ...reviews, ...reviews]
  const dur = direction === 'left' ? '40s' : '48s'
  const anim = direction === 'left' ? 'scrollLeft' : 'scrollRight'
  return (
    <div style={{ overflow:'hidden', position:'relative', width:'100%' }}>
      <div style={{ position:'absolute', top:0, left:0, bottom:0, width:100, background:'linear-gradient(90deg,var(--bg),transparent)', zIndex:2, pointerEvents:'none' }}/>
      <div style={{ position:'absolute', top:0, right:0, bottom:0, width:100, background:'linear-gradient(-90deg,var(--bg),transparent)', zIndex:2, pointerEvents:'none' }}/>
      <div className="rev-pauser" style={{ display:'flex', width:'max-content', animation:`${anim} ${dur} linear infinite`, willChange:'transform' }}>
        {items.map((r, i) => <ReviewCard key={`${direction}-${r.id}-${i}`} review={r} idx={r.id} isEn={isEn}/>)}
      </div>
    </div>
  )
}

export default function Reviews() {
  const { lang } = useLang()
  const isEn = lang === 'en'
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const row1 = REVIEWS.slice(0, 6)
  const row2 = REVIEWS.slice(4)

  return (
    <div style={{ minHeight:'80vh', padding:'60px 0', direction: isEn ? 'ltr' : 'rtl', overflow:'hidden' }}>
      <style>{`
        @keyframes scrollLeft  { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes scrollRight { from{transform:translateX(-50%)} to{transform:translateX(0)} }
        .rev-pauser:hover { animation-play-state: paused !important; }
      `}</style>

      {/* Header */}
      <div style={{ textAlign:'center', marginBottom:48, padding:'0 24px' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'5px 18px', borderRadius:20, border:'1px solid rgba(0,212,255,0.3)', background:'rgba(0,212,255,0.06)', marginBottom:18 }}>
          <div style={{ width:6, height:6, borderRadius:'50%', background:'var(--cyan)', boxShadow:'0 0 6px var(--cyan)' }}/>
          <span style={{ fontSize:'.68rem', color:'var(--cyan)', fontFamily:"'JetBrains Mono',monospace", letterSpacing:2 }}>CUSTOMER REVIEWS</span>
        </div>
        <h1 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:'clamp(1.5rem,4vw,2.2rem)', fontWeight:900, color:'var(--text-1)', margin:'0 0 14px' }}>{isEn ? 'What Our Clients Say' : 'ماذا يقول عملاؤنا؟'}</h1>
        <p style={{ fontSize:'.98rem', color:'var(--text-3)', maxWidth:440, margin:'0 auto', fontFamily:"'Tajawal',sans-serif", lineHeight:1.8 }}>
          {isEn ? 'Thousands of clients trust us daily. Read their real experiences.' : 'آلاف العملاء يثقون بنا يومياً. اقرأ تجاربهم الحقيقية.'}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:52, padding:'0 24px', maxWidth:960, margin:'0 auto 52px' }}>
        {STATS.map(s => (
          <div key={isEn ? s.labelEn : s.labelAr} style={{ background:'var(--card)', border:'1px solid var(--border-1)', borderRadius:16, padding:'20px 14px', textAlign:'center', transition:'border-color .2s, transform .2s' }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(0,212,255,0.4)';e.currentTarget.style.transform='translateY(-3px)'}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border-1)';e.currentTarget.style.transform='translateY(0)'}}>
            <div style={{ color:'var(--cyan)', marginBottom:8, display:'flex', justifyContent:'center' }}>{s.icon}</div>
            <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:'1.25rem', fontWeight:900, color:'var(--cyan)', marginBottom:4 }}>{s.value}</div>
            <div style={{ fontSize:'.72rem', color:'var(--text-3)', fontFamily:"'Tajawal',sans-serif" }}>{isEn ? s.labelEn : s.labelAr}</div>
          </div>
        ))}
      </div>

      {/* Row 1 — scrolls LEFT */}
      <div className="reviews-carousel-row" style={{ marginBottom:14 }}>
        <CarouselTrack reviews={row1} direction="left" isEn={isEn}/>
      </div>

      {/* Row 2 — scrolls RIGHT */}
      <div className="reviews-carousel-row" style={{ marginBottom:60 }}>
        <CarouselTrack reviews={row2} direction="right" isEn={isEn}/>
      </div>

    </div>
  )
}

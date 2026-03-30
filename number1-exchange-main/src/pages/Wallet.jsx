// src/pages/Wallet.jsx
import { useEffect, useState } from 'react'
import { useNavigate }         from 'react-router-dom'
import useAuth                 from '../context/useAuth'
import { walletAPI }           from '../services/api'

const TX_CONFIG = {
  deposit:       { label: 'إيداع',    color: '#00e5a0', icon: '↓', bg: '#064e3b' },
  withdraw:      { label: 'سحب',      color: '#f85149', icon: '↑', bg: '#3d0a0a' },
  exchange_debit:{ label: 'صرافة',    color: '#60a5fa', icon: '⇄', bg: '#1e3a5f' },
}

export default function WalletPage() {
  const { user }    = useAuth()
  const navigate    = useNavigate()

  const [wallet,       setWallet]       = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(null)

  // ── Withdraw modal state ──────────────────────
  const [showWithdraw,   setShowWithdraw]   = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawNote,   setWithdrawNote]   = useState('')
  const [withdrawing,    setWithdrawing]    = useState(false)
  const [withdrawError,  setWithdrawError]  = useState(null)
  const [withdrawSuccess,setWithdrawSuccess]= useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    if (!user) { navigate('/'); return }
    fetchWallet()
  }, [user])

  const fetchWallet = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await walletAPI.getWallet()
      setWallet(data.wallet)
      setTransactions(data.transactions || [])
    } catch {
      setError('تعذر تحميل المحفظة')
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) return
    setWithdrawing(true)
    setWithdrawError(null)
    try {
      const { data } = await walletAPI.withdraw({
        amount: parseFloat(withdrawAmount),
        note:   withdrawNote || null
      })
      setWallet(prev => ({ ...prev, balance: data.balance }))
      setTransactions(prev => [data.transaction, ...prev])
      setWithdrawSuccess(true)
      setTimeout(() => {
        setShowWithdraw(false)
        setWithdrawSuccess(false)
        setWithdrawAmount('')
        setWithdrawNote('')
      }, 2000)
    } catch (err) {
      setWithdrawError(err.response?.data?.message || 'فشل السحب')
    } finally {
      setWithdrawing(false)
    }
  }

  if (loading) return (
    <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-3)', fontFamily:"'Tajawal',sans-serif" }}>
      ⏳ جاري التحميل...
    </div>
  )

  if (error) return (
    <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ color:'#f85149', fontFamily:"'Tajawal',sans-serif", textAlign:'center' }}>{error}</div>
    </div>
  )

  return (
    <div style={{ minHeight:'80vh', padding:'60px 24px', maxWidth:700, margin:'0 auto', direction:'rtl' }}>

      {/* ── Header ──────────────────────────────── */}
      <div style={{ marginBottom:32 }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'5px 16px', borderRadius:20, border:'1px solid rgba(0,212,255,0.3)', background:'rgba(0,212,255,0.06)', marginBottom:16 }}>
          <span style={{ fontSize:'0.7rem', color:'var(--cyan)', fontFamily:"'JetBrains Mono',monospace", letterSpacing:2 }}>VIRTUAL WALLET</span>
        </div>
        <h1 style={{ fontFamily:"'Tajawal',sans-serif", fontSize:'1.8rem', fontWeight:900, color:'var(--text-1)', margin:0 }}>
          محفظتي
        </h1>
      </div>

      {/* ── Balance Card ────────────────────────── */}
      <div style={{ background:'linear-gradient(135deg, #0d2137 0%, #0a1628 100%)', border:'1px solid rgba(0,212,255,0.2)', borderRadius:20, padding:'32px 28px', marginBottom:24, position:'relative', overflow:'hidden' }}>
        {/* خلفية decorative */}
        <div style={{ position:'absolute', top:-40, left:-40, width:200, height:200, borderRadius:'50%', background:'rgba(0,212,255,0.04)', pointerEvents:'none' }} />

        <div style={{ fontSize:'0.75rem', color:'var(--text-3)', fontFamily:"'JetBrains Mono',monospace", marginBottom:8, letterSpacing:2 }}>
          BALANCE
        </div>
        <div style={{ display:'flex', alignItems:'baseline', gap:10, marginBottom:24 }}>
          <span style={{ fontSize:'3rem', fontWeight:900, color:'var(--cyan)', fontFamily:"'Orbitron',sans-serif", lineHeight:1 }}>
            {wallet?.balance?.toFixed(2) || '0.00'}
          </span>
          <span style={{ fontSize:'1.2rem', color:'var(--text-3)', fontFamily:"'JetBrains Mono',monospace" }}>
            USDT
          </span>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          {[
            { label: 'إجمالي الإيداع',   value: `${wallet?.totalDeposited?.toFixed(2) || '0.00'} USDT`, color:'#00e5a0' },
            { label: 'إجمالي السحب',     value: `${wallet?.totalWithdrawn?.toFixed(2) || '0.00'} USDT`, color:'#f85149' },
          ].map(s => (
            <div key={s.label} style={{ background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'12px 14px' }}>
              <div style={{ fontSize:'0.65rem', color:'var(--text-3)', fontFamily:"'JetBrains Mono',monospace", marginBottom:4 }}>{s.label}</div>
              <div style={{ fontSize:'0.9rem', fontWeight:700, color: s.color, fontFamily:"'JetBrains Mono',monospace" }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Withdraw Button */}
        <button
          onClick={() => setShowWithdraw(true)}
          disabled={!wallet?.isActive || wallet?.balance <= 0}
          style={{ marginTop:20, width:'100%', padding:'12px', background: wallet?.balance > 0 ? 'linear-gradient(135deg,#009fc0,#006e9e)' : 'rgba(255,255,255,0.05)', border:'none', borderRadius:12, color: wallet?.balance > 0 ? '#fff' : 'var(--text-3)', fontFamily:"'Tajawal',sans-serif", fontSize:'1rem', fontWeight:700, cursor: wallet?.balance > 0 ? 'pointer' : 'not-allowed', transition:'all 0.2s' }}
        >
          سحب USDT ↑
        </button>

        {!wallet?.isActive && (
          <div style={{ marginTop:10, textAlign:'center', fontSize:'0.8rem', color:'#f85149', fontFamily:"'Tajawal',sans-serif" }}>
            ⚠️ المحفظة معطلة — تواصل مع الدعم
          </div>
        )}
      </div>

      {/* ── Transactions ────────────────────────── */}
      <div style={{ background:'var(--card)', border:'1px solid var(--border-1)', borderRadius:16, overflow:'hidden' }}>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border-1)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h3 style={{ margin:0, fontSize:'1rem', fontWeight:700, color:'var(--text-1)', fontFamily:"'Tajawal',sans-serif" }}>
            آخر المعاملات
          </h3>
          <button
            onClick={fetchWallet}
            style={{ background:'none', border:'1px solid var(--border-1)', borderRadius:8, padding:'5px 12px', color:'var(--text-3)', fontFamily:"'Tajawal',sans-serif", fontSize:'0.8rem', cursor:'pointer' }}
          >
            تحديث
          </button>
        </div>

        {transactions.length === 0 ? (
          <div style={{ padding:40, textAlign:'center', color:'var(--text-3)', fontFamily:"'Tajawal',sans-serif" }}>
            لا يوجد معاملات بعد
          </div>
        ) : (
          transactions.map((tx) => {
            const cfg = TX_CONFIG[tx.type] || { label: tx.type, color:'#8b949e', icon:'•', bg:'#21262d' }
            return (
              <div key={tx._id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 20px', borderBottom:'1px solid var(--border-1)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  {/* Icon */}
                  <div style={{ width:36, height:36, borderRadius:10, background: cfg.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', color: cfg.color, fontWeight:700 }}>
                    {cfg.icon}
                  </div>
                  <div>
                    <div style={{ fontSize:'0.85rem', fontWeight:700, color:'var(--text-1)', fontFamily:"'Tajawal',sans-serif" }}>
                      {cfg.label}
                    </div>
                    <div style={{ fontSize:'0.7rem', color:'var(--text-3)', fontFamily:"'JetBrains Mono',monospace" }}>
                      {new Date(tx.createdAt).toLocaleString('ar-EG')}
                    </div>
                    {tx.note && (
                      <div style={{ fontSize:'0.7rem', color:'var(--text-3)', fontFamily:"'Tajawal',sans-serif", marginTop:2 }}>
                        {tx.note}
                      </div>
                    )}
                  </div>
                </div>
                {/* Amount */}
                <div style={{ textAlign:'left' }}>
                  <div style={{ fontSize:'0.95rem', fontWeight:700, color: cfg.color, fontFamily:"'JetBrains Mono',monospace" }}>
                    {tx.type === 'deposit' ? '+' : '-'}{tx.amount} USDT
                  </div>
                  <div style={{ fontSize:'0.68rem', color:'var(--text-3)', fontFamily:"'JetBrains Mono',monospace" }}>
                    → {tx.balanceAfter?.toFixed(2)} USDT
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* ── Withdraw Modal ───────────────────────── */}
      {showWithdraw && (
        <div style={{ position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:20 }}
          onClick={() => setShowWithdraw(false)}
        >
          <div style={{ background:'var(--card)', border:'1px solid var(--border-1)', borderRadius:20, padding:28, width:'100%', maxWidth:420 }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ margin:'0 0 20px', fontFamily:"'Tajawal',sans-serif", color:'var(--text-1)', fontSize:'1.1rem' }}>
              سحب USDT
            </h3>

            {withdrawSuccess ? (
              <div style={{ textAlign:'center', padding:20 }}>
                <div style={{ fontSize:'3rem', marginBottom:8 }}>✅</div>
                <div style={{ color:'#00e5a0', fontFamily:"'Tajawal',sans-serif", fontWeight:700 }}>تم السحب بنجاح!</div>
              </div>
            ) : (
              <>
                {/* رصيد متاح */}
                <div style={{ background:'rgba(0,212,255,0.06)', border:'1px solid rgba(0,212,255,0.2)', borderRadius:10, padding:'10px 14px', marginBottom:16, textAlign:'center' }}>
                  <span style={{ fontSize:'0.75rem', color:'var(--text-3)', fontFamily:"'JetBrains Mono',monospace" }}>الرصيد المتاح: </span>
                  <span style={{ fontSize:'1rem', fontWeight:700, color:'var(--cyan)', fontFamily:"'JetBrains Mono',monospace" }}>{wallet?.balance?.toFixed(2)} USDT</span>
                </div>

                {/* Amount input */}
                <div style={{ marginBottom:14 }}>
                  <label style={{ display:'block', fontSize:'0.72rem', color:'var(--text-3)', fontFamily:"'JetBrains Mono',monospace", marginBottom:6 }}>المبلغ (USDT)</label>
                  <input
                    type="number"
                    min="0.01"
                    max={wallet?.balance}
                    step="0.01"
                    value={withdrawAmount}
                    onChange={e => setWithdrawAmount(e.target.value)}
                    placeholder="0.00"
                    style={{ width:'100%', padding:'11px 14px', background:'rgba(255,255,255,0.04)', border:'1px solid var(--border-1)', borderRadius:10, color:'var(--text-1)', fontFamily:"'JetBrains Mono',monospace", fontSize:'1rem', outline:'none', boxSizing:'border-box', direction:'ltr' }}
                    onFocus={e => e.target.style.borderColor='var(--cyan)'}
                    onBlur={e  => e.target.style.borderColor='var(--border-1)'}
                  />
                </div>

                {/* Note input */}
                <div style={{ marginBottom:16 }}>
                  <label style={{ display:'block', fontSize:'0.72rem', color:'var(--text-3)', fontFamily:"'JetBrains Mono',monospace", marginBottom:6 }}>ملاحظة (اختياري)</label>
                  <input
                    type="text"
                    value={withdrawNote}
                    onChange={e => setWithdrawNote(e.target.value)}
                    placeholder="سبب السحب..."
                    style={{ width:'100%', padding:'11px 14px', background:'rgba(255,255,255,0.04)', border:'1px solid var(--border-1)', borderRadius:10, color:'var(--text-1)', fontFamily:"'Tajawal',sans-serif", fontSize:'0.9rem', outline:'none', boxSizing:'border-box' }}
                  />
                </div>

                {withdrawError && (
                  <div style={{ color:'#f85149', fontSize:'0.85rem', fontFamily:"'Tajawal',sans-serif", marginBottom:12, textAlign:'center' }}>
                    {withdrawError}
                  </div>
                )}

                <div style={{ display:'flex', gap:10 }}>
                  <button
                    onClick={() => setShowWithdraw(false)}
                    style={{ flex:1, padding:12, background:'none', border:'1px solid var(--border-1)', borderRadius:10, color:'var(--text-2)', fontFamily:"'Tajawal',sans-serif", cursor:'pointer' }}
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleWithdraw}
                    disabled={withdrawing || !withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > wallet?.balance}
                    style={{ flex:2, padding:12, background:'linear-gradient(135deg,#f85149,#c0392b)', border:'none', borderRadius:10, color:'#fff', fontFamily:"'Tajawal',sans-serif", fontWeight:700, cursor:'pointer', opacity: withdrawing ? 0.7 : 1 }}
                  >
                    {withdrawing ? '⏳ جاري السحب...' : `سحب ${withdrawAmount || '0'} USDT`}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
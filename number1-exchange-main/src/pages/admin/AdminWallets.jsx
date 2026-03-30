// src/pages/admin/AdminWallets.jsx
import { useEffect, useState, useCallback } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { walletAPI } from '../../services/api'
import { RefreshCw, Plus } from 'lucide-react'

export default function AdminWallets() {
  const [wallets,  setWallets]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [selected, setSelected] = useState(null)   // للإيداع
  const [amount,   setAmount]   = useState('')
  const [note,     setNote]     = useState('')
  const [depositing, setDepositing] = useState(false)
  const [msg,      setMsg]      = useState(null)

  const fetchWallets = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await walletAPI.getAllWallets()
      setWallets(data.wallets || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchWallets() }, [fetchWallets])

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0 || !selected) return
    setDepositing(true)
    setMsg(null)
    try {
      await walletAPI.adminDeposit(selected.user._id, {
        amount: parseFloat(amount),
        note:   note || 'Admin deposit'
      })
      setMsg({ type:'success', text:`تم إيداع ${amount} USDT بنجاح ✅` })
      setAmount('')
      setNote('')
      await fetchWallets()
      setTimeout(() => { setSelected(null); setMsg(null) }, 2000)
    } catch (err) {
      setMsg({ type:'error', text: err.response?.data?.message || 'فشل الإيداع' })
    } finally {
      setDepositing(false)
    }
  }

  const handleToggle = async (userId) => {
    try {
      await walletAPI.toggleWallet(userId)
      await fetchWallets()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <AdminLayout>
      <div style={s.pageHeader}>
        <h2 style={s.pageTitle}>إدارة المحافظ</h2>
        <button style={s.refreshBtn} onClick={fetchWallets}>
          <RefreshCw size={15} />
        </button>
      </div>

      <div style={s.card}>
        {loading ? (
          <div style={s.loading}>جاري التحميل...</div>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                {['المستخدم', 'الإيميل', 'الرصيد (USDT)', 'إجمالي الإيداع', 'إجمالي السحب', 'الحالة', 'إجراء'].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {wallets.length === 0 ? (
                <tr><td colSpan={7} style={s.empty}>لا يوجد محافظ</td></tr>
              ) : wallets.map((w) => (
                <tr key={w._id}>
                  <td style={s.td}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={s.avatar}>{(w.user?.name || 'U')[0].toUpperCase()}</div>
                      {w.user?.name || '—'}
                    </div>
                  </td>
                  <td style={s.td}>{w.user?.email || '—'}</td>
                  <td style={s.td}>
                    <span style={{ color:'var(--cyan,#00d4ff)', fontFamily:'monospace', fontWeight:700 }}>
                      {w.balance?.toFixed(2)}
                    </span>
                  </td>
                  <td style={s.td}><span style={{ color:'#00e5a0' }}>{w.totalDeposited?.toFixed(2)}</span></td>
                  <td style={s.td}><span style={{ color:'#f85149' }}>{w.totalWithdrawn?.toFixed(2)}</span></td>
                  <td style={s.td}>
                    <span style={{ fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:10, background: w.isActive ? '#064e3b' : '#3d0a0a', color: w.isActive ? '#059669' : '#f85149' }}>
                      {w.isActive ? 'نشطة' : 'معطلة'}
                    </span>
                  </td>
                  <td style={s.td}>
                    <div style={{ display:'flex', gap:6 }}>
                      <button
                        style={s.depositBtn}
                        onClick={() => { setSelected(w); setMsg(null) }}
                        title="إيداع"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        style={w.isActive ? s.blockBtn : s.unblockBtn}
                        onClick={() => handleToggle(w.user._id)}
                        title={w.isActive ? 'تعطيل' : 'تفعيل'}
                      >
                        {w.isActive ? '🔒' : '🔓'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Deposit Modal */}
      {selected && (
        <div style={modal.overlay} onClick={() => setSelected(null)}>
          <div style={modal.box} onClick={e => e.stopPropagation()}>
            <div style={modal.header}>
              <span style={modal.title}>إيداع USDT — {selected.user?.name}</span>
              <button style={modal.closeBtn} onClick={() => setSelected(null)}>✕</button>
            </div>

            <div style={{ marginBottom:12, background:'rgba(0,212,255,0.06)', border:'1px solid rgba(0,212,255,0.2)', borderRadius:10, padding:'10px 14px', textAlign:'center' }}>
              <span style={{ fontSize:'0.75rem', color:'#8b949e', fontFamily:'monospace' }}>الرصيد الحالي: </span>
              <span style={{ fontWeight:700, color:'#00d4ff', fontFamily:'monospace' }}>{selected.balance?.toFixed(2)} USDT</span>
            </div>

            <div style={{ marginBottom:12 }}>
              <label style={modal.label}>المبلغ (USDT)</label>
              <input
                type="number" min="0.01" step="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                style={modal.input}
              />
            </div>

            <div style={{ marginBottom:16 }}>
              <label style={modal.label}>ملاحظة</label>
              <input
                type="text"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="سبب الإيداع..."
                style={{ ...modal.input, fontFamily:"'Tajawal',sans-serif" }}
              />
            </div>

            {msg && (
              <div style={{ marginBottom:12, padding:'10px', borderRadius:8, background: msg.type==='success' ? '#064e3b' : '#3d0a0a', color: msg.type==='success' ? '#00e5a0' : '#f85149', fontFamily:"'Tajawal',sans-serif", fontSize:'0.85rem', textAlign:'center' }}>
                {msg.text}
              </div>
            )}

            <button
              onClick={handleDeposit}
              disabled={depositing || !amount || parseFloat(amount) <= 0}
              style={{ width:'100%', padding:12, background:'linear-gradient(135deg,#059669,#047857)', border:'none', borderRadius:10, color:'#fff', fontFamily:"'Tajawal',sans-serif", fontWeight:700, fontSize:'0.95rem', cursor:'pointer', opacity: depositing ? 0.7 : 1 }}
            >
              {depositing ? '⏳ جاري الإيداع...' : `إيداع ${amount || '0'} USDT`}
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

const s = {
  pageHeader: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 },
  pageTitle:  { fontSize:20, fontWeight:700, color:'#e6edf3', margin:0 },
  refreshBtn: { display:'flex', alignItems:'center', justifyContent:'center', width:36, height:36, border:'1px solid #21262d', borderRadius:8, background:'#161b22', color:'#8b949e', cursor:'pointer' },
  card:       { backgroundColor:'#161b22', border:'1px solid #21262d', borderRadius:12, overflow:'hidden' },
  loading:    { padding:40, textAlign:'center', color:'#6e7681' },
  table:      { width:'100%', borderCollapse:'collapse' },
  th:         { textAlign:'right', padding:'10px 14px', fontSize:12, color:'#6e7681', borderBottom:'1px solid #21262d', fontWeight:500 },
  td:         { padding:'11px 14px', fontSize:13, color:'#c9d1d9', borderBottom:'1px solid #161b22' },
  empty:      { padding:40, textAlign:'center', color:'#6e7681' },
  avatar:     { width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#2563eb,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#fff', flexShrink:0 },
  depositBtn: { background:'#064e3b', border:'none', color:'#059669', borderRadius:6, padding:'5px 8px', cursor:'pointer', display:'flex', alignItems:'center' },
  blockBtn:   { background:'#3d0a0a', border:'none', color:'#f85149', borderRadius:6, padding:'5px 8px', cursor:'pointer' },
  unblockBtn: { background:'#064e3b', border:'none', color:'#059669', borderRadius:6, padding:'5px 8px', cursor:'pointer' },
}

const modal = {
  overlay: { position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.75)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:20 },
  box:     { backgroundColor:'#161b22', border:'1px solid #30363d', borderRadius:14, padding:24, width:'100%', maxWidth:420 },
  header:  { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 },
  title:   { fontSize:16, fontWeight:700, color:'#e6edf3' },
  closeBtn:{ background:'none', border:'none', color:'#6e7681', cursor:'pointer', fontSize:18 },
  label:   { display:'block', fontSize:'0.72rem', color:'#6e7681', fontFamily:'monospace', marginBottom:6 },
  input:   { width:'100%', padding:'11px 14px', background:'rgba(255,255,255,0.04)', border:'1px solid #21262d', borderRadius:10, color:'#e6edf3', fontFamily:'monospace', fontSize:'1rem', outline:'none', boxSizing:'border-box', direction:'ltr' },
}
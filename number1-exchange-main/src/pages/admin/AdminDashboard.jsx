// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftRight, Users, DollarSign, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import AdminStatusBadge from '../../components/admin/AdminStatusBadge'
import { adminAPI } from '../../services/api'

export default function AdminDashboard() {
  const [stats,   setStats]   = useState(null)
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => { fetchDashboard() }, [])

  const fetchDashboard = async () => {
    setLoading(true)
    setError('')
    try {
      const [statsRes, ordersRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getOrders({ limit: 5 }),
      ])
      setStats(statsRes.data.stats)
      setOrders(ordersRes.data.orders || [])
    } catch (err) {
      console.error('Dashboard fetch error:', err)
      setError('تعذّر تحميل البيانات. تأكد من الاتصال وأعد المحاولة.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <AdminLayout>
      <div style={s.loading}>جاري التحميل...</div>
    </AdminLayout>
  )

  if (error) return (
    <AdminLayout>
      <div style={s.errorBox}>{error}</div>
    </AdminLayout>
  )

  const completionRate = stats?.totalOrders > 0
    ? Math.round((stats.completedOrders / stats.totalOrders) * 100)
    : 0

  const statCards = [
    {
      title: 'إجمالي الطلبات',
      value: stats?.totalOrders ?? '—',
      icon: ArrowLeftRight,
      color: '#2563eb', bg: '#1e3a5f',
      sub: `${stats?.todayOrders ?? 0} اليوم`,
    },
    {
      title: 'المستخدمون',
      value: stats?.totalUsers ?? '—',
      icon: Users,
      color: '#7c3aed', bg: '#3b1f6e',
      sub: 'إجمالي المسجلين',
    },
    {
      title: 'حجم التداول (USD)',
      value: stats?.totalVolumeUSD ? `$${Number(stats.totalVolumeUSD).toLocaleString()}` : '$0',
      icon: DollarSign,
      color: '#059669', bg: '#064e3b',
      sub: 'إجمالي كل الوقت',
    },
    {
      title: 'معدل الإتمام',
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: '#d97706', bg: '#451a03',
      sub: 'طلبات مكتملة / إجمالي',
    },
  ]

  return (
    <AdminLayout>
      {/* Stats */}
      <div style={s.statsGrid}>
        {statCards.map(card => <StatCard key={card.title} {...card} />)}
      </div>

      {/* Bottom grid */}
      <div style={s.bottomGrid}>

        {/* Recent orders table */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <span style={s.cardTitle}>أحدث الطلبات</span>
            <Link to="/admin/orders" style={s.viewAll}>عرض الكل ←</Link>
          </div>
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={s.table}>
              <thead>
                <tr>
                  {['رقم الطلب', 'العميل', 'النوع', 'المبلغ', 'الحالة', 'التاريخ'].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ ...s.td, textAlign: 'center', color: '#6e7681' }}>
                      لا يوجد طلبات حتى الآن
                    </td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr key={order._id}>
                      <td style={s.td}>
                        <span style={s.orderId}>{order.orderNumber || `#${order._id.slice(-6)}`}</span>
                      </td>
                      <td style={s.td}>{order.customerEmail || '—'}</td>
                      <td style={s.td}>
                        <span style={s.typeBadge}>
                          {order.orderType === 'USDT_TO_MONEYGO' ? 'USDT→USD' : 'محفظة→USD'}
                        </span>
                      </td>
                      <td style={s.td}>{order.payment?.amountSent} {order.payment?.currencySent}</td>
                      <td style={s.td}><AdminStatusBadge status={order.status} /></td>
                      <td style={s.td}>{new Date(order.createdAt).toLocaleDateString('ar-EG')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Status summary */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <span style={s.cardTitle}>ملخص الحالات</span>
          </div>
          <div style={s.summaryList}>
            <SummaryRow icon={<Clock size={16} />}       label="قيد الانتظار" value={stats?.pendingOrders    ?? 0} color="#d97706" />
            <SummaryRow icon={<AlertCircle size={16} />} label="قيد التحقق"   value={stats?.verifyingOrders  ?? stats?.pendingOrders ?? 0} color="#7c3aed" />
            <SummaryRow icon={<CheckCircle size={16} />} label="مكتملة"       value={stats?.completedOrders  ?? 0} color="#059669" />
            <SummaryRow icon={<XCircle size={16} />}     label="مرفوضة"       value={stats?.rejectedOrders   ?? 0} color="#f85149" />
          </div>
        </div>

      </div>
    </AdminLayout>
  )
}

// ── Sub-components ──────────────────────────────────────────────
function StatCard({ title, value, icon: Icon, color, bg, sub }) {
  return (
    <div style={s.statCard}>
      <div style={{ ...s.statIcon, backgroundColor: bg, color }}>
        <Icon size={22} />
      </div>
      <div>
        <div style={s.statValue}>{value}</div>
        <div style={s.statTitle}>{title}</div>
        <div style={s.statSub}>{sub}</div>
      </div>
    </div>
  )
}

function SummaryRow({ icon, label, value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #21262d' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color }}>
        {icon}
        <span style={{ fontSize: 14, color: '#c9d1d9' }}>{label}</span>
      </div>
      <span style={{ fontSize: 18, fontWeight: 700, color }}>{value}</span>
    </div>
  )
}

const s = {
  loading:    { display: 'flex', justifyContent: 'center', padding: 80, color: '#8b949e', fontSize: 18 },
  errorBox:   { padding: '16px 20px', borderRadius: 10, background: '#3d0a0a', color: '#f85149', fontSize: 14 },
  statsGrid:  { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 },
  statCard:   { backgroundColor: '#161b22', border: '1px solid #21262d', borderRadius: 12, padding: 20, display: 'flex', alignItems: 'center', gap: 16 },
  statIcon:   { width: 50, height: 50, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  statValue:  { fontSize: 24, fontWeight: 700, color: '#e6edf3' },
  statTitle:  { fontSize: 13, color: '#8b949e', marginTop: 2 },
  statSub:    { fontSize: 11, color: '#484f58', marginTop: 2 },
  bottomGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 },
  card:       { backgroundColor: '#161b22', border: '1px solid #21262d', borderRadius: 12, padding: 20 },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle:  { fontSize: 15, fontWeight: 600, color: '#e6edf3' },
  viewAll:    { fontSize: 13, color: '#2563eb', textDecoration: 'none' },
  table:      { width: '100%', borderCollapse: 'collapse', minWidth: 540 },
  th:         { textAlign: 'right', padding: '8px 12px', fontSize: 12, color: '#6e7681', borderBottom: '1px solid #21262d', fontWeight: 500, whiteSpace: 'nowrap' },
  td:         { padding: '10px 12px', fontSize: 13, color: '#c9d1d9', borderBottom: '1px solid #21262d' },
  orderId:    { fontFamily: 'monospace', color: '#8b949e', fontSize: 12 },
  typeBadge:  { fontSize: 11, color: '#2563eb', background: '#1e3a5f', padding: '2px 8px', borderRadius: 10, fontWeight: 600 },
  summaryList:{ display: 'flex', flexDirection: 'column' },
}


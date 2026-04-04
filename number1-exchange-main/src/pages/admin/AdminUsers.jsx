// src/pages/admin/AdminUsers.jsx
import { useEffect, useState, useCallback } from 'react'
import { UserCheck, UserX, Eye, Shield } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import {
  AdminPageHeader, AdminRefreshBtn, AdminFilterTabs,
  AdminSearchBar, AdminPagination, AdminTableWrap,
  AdminModal, AdminModalHeader, AdminInfoGrid,
  thStyle, tdStyle,
} from '../../components/admin/adminShared'
import { adminAPI } from '../../services/api'

const FILTER_TABS = [
  { value: '',        label: 'الكل'    },
  { value: 'active',  label: 'نشطون'   },
  { value: 'blocked', label: 'محظورون' },
  { value: 'admin',   label: 'مشرفون'  },
]

const LIMIT = 20

export default function AdminUsers() {
  const [users,         setUsers]         = useState([])
  const [loading,       setLoading]       = useState(true)
  const [search,        setSearch]        = useState('')
  const [filter,        setFilter]        = useState('')
  const [page,          setPage]          = useState(1)
  const [totalPages,    setTotalPages]    = useState(1)
  const [selected,      setSelected]      = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await adminAPI.getUsers({
        page,
        limit: LIMIT,
        ...(search && { search }),
        ...(filter && { status: filter }),
      })
      setUsers(data.users || [])
      setTotalPages(data.totalPages || 1)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, search, filter])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const toggleBlock = async (userId, isBlocked) => {
    setActionLoading(true)
    try {
      await adminAPI.blockUser(userId, { isBlocked: !isBlocked })
      await fetchUsers()
      if (selected?._id === userId) setSelected(prev => ({ ...prev, isBlocked: !isBlocked }))
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleFilterChange = (val) => { setFilter(val); setPage(1) }
  const handleSearch       = (val) => { setSearch(val); setPage(1) }

  return (
    <AdminLayout>
      <AdminPageHeader title="إدارة المستخدمين">
        <AdminRefreshBtn onClick={fetchUsers} />
      </AdminPageHeader>

      <AdminFilterTabs tabs={FILTER_TABS} active={filter} onChange={handleFilterChange} />

      <AdminSearchBar
        value={search}
        onChange={handleSearch}
        placeholder="ابحث بالاسم أو الإيميل..."
      />

      <AdminTableWrap loading={loading} isEmpty={!loading && users.length === 0} emptyText="لا يوجد مستخدمون">
        <table style={styles.table}>
          <thead>
            <tr>
              {['المستخدم', 'الإيميل', 'تاريخ التسجيل', 'الطلبات', 'الدور', 'الحالة', 'إجراء'].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(user => {
              const isBlocked = !user.isActive
              return (
                <tr key={user._id}>
                  <td style={tdStyle}>
                    <div style={styles.userCell}>
                      <div style={styles.avatar}>{(user.name || 'U')[0].toUpperCase()}</div>
                      <span style={{ whiteSpace: 'nowrap' }}>{user.name || '—'}</span>
                    </div>
                  </td>
                  <td style={tdStyle}>{user.email}</td>
                  <td style={tdStyle}>{new Date(user.createdAt).toLocaleDateString('ar-EG')}</td>
                  <td style={tdStyle}>
                    <span style={styles.orderCount}>{user.totalOrders ?? 0}</span>
                  </td>
                  <td style={tdStyle}>
                    {user.role === 'admin' ? (
                      <span style={styles.adminBadge}><Shield size={11} /> مشرف</span>
                    ) : (
                      <span style={styles.userBadge}>مستخدم</span>
                    )}
                  </td>
                  <td style={tdStyle}>
                    <span style={isBlocked ? styles.blockedBadge : styles.activeBadge}>
                      {isBlocked ? 'محظور' : 'نشط'}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button style={styles.viewBtn} onClick={() => setSelected({ ...user, isBlocked })} title="عرض">
                        <Eye size={14} />
                      </button>
                      <button
                        style={isBlocked ? styles.unblockBtn : styles.blockBtn}
                        onClick={() => toggleBlock(user._id, isBlocked)}
                        title={isBlocked ? 'رفع الحظر' : 'حظر'}
                      >
                        {isBlocked ? <UserCheck size={14} /> : <UserX size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <AdminPagination page={page} totalPages={totalPages} onChange={setPage} />
      </AdminTableWrap>

      {selected && (
        <UserDetailModal
          user={selected}
          onClose={() => setSelected(null)}
          onToggleBlock={toggleBlock}
          loading={actionLoading}
        />
      )}
    </AdminLayout>
  )
}

// ── User detail modal ───────────────────────────────────────────
function UserDetailModal({ user, onClose, onToggleBlock, loading }) {
  const rows = [
    ['الاسم',          user.name  || '—'],
    ['الإيميل',        user.email || '—'],
    ['رقم الهاتف',     user.phone || '—'],
    ['تاريخ التسجيل',  new Date(user.createdAt).toLocaleString('ar-EG')],
    ['إجمالي الطلبات', user.totalOrders ?? 0],
    ['الدور',          user.role  || 'user'],
    ['الحالة',         user.isBlocked ? 'محظور' : 'نشط'],
  ]

  return (
    <AdminModal onClose={onClose} maxWidth={440}>
      <AdminModalHeader title="تفاصيل المستخدم" onClose={onClose} />

      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={styles.bigAvatar}>{(user.name || 'U')[0].toUpperCase()}</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#e6edf3', marginTop: 8 }}>{user.name}</div>
        <div style={{ fontSize: 13, color: '#6e7681' }}>{user.email}</div>
      </div>

      <AdminInfoGrid rows={rows} />

      {user.role !== 'admin' && (
        <button
          style={user.isBlocked ? modal.unblockBtn : modal.blockBtn}
          disabled={loading}
          onClick={() => onToggleBlock(user._id, user.isBlocked)}
        >
          {user.isBlocked
            ? <><UserCheck size={16} /> رفع الحظر</>
            : <><UserX size={16} /> حظر المستخدم</>
          }
        </button>
      )}
    </AdminModal>
  )
}

const styles = {
  table:       { width: '100%', borderCollapse: 'collapse', minWidth: 640 },
  userCell:    { display: 'flex', alignItems: 'center', gap: 10 },
  avatar:      { width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 },
  bigAvatar:   { width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: '#fff', margin: '0 auto' },
  orderCount:  { background: '#21262d', padding: '2px 10px', borderRadius: 10, fontSize: 12, fontWeight: 600 },
  adminBadge:  { display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: '#d97706', background: '#451a03', padding: '2px 8px', borderRadius: 10 },
  userBadge:   { fontSize: 11, color: '#6e7681', background: '#21262d', padding: '2px 8px', borderRadius: 10 },
  activeBadge: { fontSize: 11, color: '#059669', background: '#064e3b', padding: '2px 8px', borderRadius: 10, fontWeight: 600 },
  blockedBadge:{ fontSize: 11, color: '#f85149', background: '#3d0a0a', padding: '2px 8px', borderRadius: 10, fontWeight: 600 },
  viewBtn:     { background: '#21262d', border: 'none', color: '#8b949e', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  blockBtn:    { background: '#3d0a0a', border: 'none', color: '#f85149', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  unblockBtn:  { background: '#064e3b', border: 'none', color: '#059669', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' },
}

const modal = {
  blockBtn:  { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: 11, borderRadius: 8, border: 'none', background: '#3d0a0a', color: '#f87171', cursor: 'pointer', fontSize: 14, fontWeight: 600 },
  unblockBtn:{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: 11, borderRadius: 8, border: 'none', background: '#064e3b', color: '#34d399', cursor: 'pointer', fontSize: 14, fontWeight: 600 },
}

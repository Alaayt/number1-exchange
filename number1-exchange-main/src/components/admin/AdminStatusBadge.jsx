// src/components/admin/AdminStatusBadge.jsx
// Single source of truth for order/deposit status badges
import { STATUS_CONFIG } from './adminConstants'

export default function AdminStatusBadge({ status }) {
  const s = STATUS_CONFIG[status] || { label: status, color: '#8b949e', bg: '#21262d' }
  return (
    <span style={{
      padding: '2px 10px',
      borderRadius: 12,
      fontSize: 12,
      fontWeight: 600,
      backgroundColor: s.bg,
      color: s.color,
      whiteSpace: 'nowrap',
    }}>
      {s.label}
    </span>
  )
}

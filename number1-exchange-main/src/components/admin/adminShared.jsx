// src/components/admin/adminShared.jsx
// Reusable UI building blocks shared across all admin pages.
// Import only what you need: AdminPageHeader, AdminFilterTabs, AdminSearchBar,
// AdminPagination, AdminTableWrap, AdminModal, AdminCard

import { Search, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'

// ─── Shared style tokens ────────────────────────────────────────
const t = {
  card:        { backgroundColor: '#161b22', border: '1px solid #21262d', borderRadius: 12 },
  btn:         { display: 'flex', alignItems: 'center', gap: 6, borderRadius: 8, cursor: 'pointer', fontFamily: "'Cairo',sans-serif", fontWeight: 600 },
  iconBtn:     { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, border: '1px solid #21262d', borderRadius: 8, background: '#161b22', color: '#8b949e', cursor: 'pointer' },
  tab:         { padding: '7px 16px', borderRadius: 8, border: '1px solid #21262d', background: 'none', color: '#8b949e', cursor: 'pointer', fontSize: 13, fontFamily: "'Cairo',sans-serif", fontWeight: 600 },
  tabActive:   { background: '#1e3a5f', color: '#2563eb', borderColor: '#2563eb' },
  searchBox:   { display: 'flex', alignItems: 'center', gap: 8, background: '#161b22', border: '1px solid #21262d', borderRadius: 8, padding: '8px 14px', width: '100%', maxWidth: 420, boxSizing: 'border-box' },
  searchInput: { background: 'none', border: 'none', outline: 'none', color: '#e6edf3', fontSize: 14, flex: 1, fontFamily: "'Cairo',sans-serif" },
  pageInfo:    { fontSize: 13, color: '#8b949e' },
  pageBtn:     { background: '#21262d', border: 'none', color: '#8b949e', borderRadius: 6, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  th:          { textAlign: 'right', padding: '10px 14px', fontSize: 12, color: '#6e7681', borderBottom: '1px solid #21262d', fontWeight: 500, whiteSpace: 'nowrap' },
  td:          { padding: '11px 14px', fontSize: 13, color: '#c9d1d9', borderBottom: '1px solid #21262d' },
}

// ─── AdminPageHeader ────────────────────────────────────────────
// Title + optional subtitle + right-side actions slot
export function AdminPageHeader({ title, subtitle, children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: subtitle ? 'flex-start' : 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#e6edf3', margin: 0 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 13, color: '#6e7681', marginTop: 4, marginBottom: 0 }}>{subtitle}</p>}
      </div>
      {children && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {children}
        </div>
      )}
    </div>
  )
}

// ─── AdminRefreshBtn ────────────────────────────────────────────
export function AdminRefreshBtn({ onClick, label }) {
  return (
    <button style={{ ...t.btn, ...t.iconBtn, width: label ? 'auto' : 36, padding: label ? '0 14px' : undefined }} onClick={onClick} title="تحديث">
      <RefreshCw size={15} />
      {label && <span style={{ fontSize: 13 }}>{label}</span>}
    </button>
  )
}

// ─── AdminFilterTabs ────────────────────────────────────────────
// tabs: [{ value, label }]
export function AdminFilterTabs({ tabs, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, marginBottom: 16, flexWrap: 'wrap' }}>
      {tabs.map(tab => (
        <button
          key={tab.value}
          style={{ ...t.tab, ...(active === tab.value ? t.tabActive : {}) }}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

// ─── AdminSearchBar ─────────────────────────────────────────────
export function AdminSearchBar({ value, onChange, placeholder = 'بحث...' }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={t.searchBox}>
        <Search size={15} style={{ color: '#6e7681', flexShrink: 0 }} />
        <input
          style={t.searchInput}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      </div>
    </div>
  )
}

// ─── AdminPagination ────────────────────────────────────────────
export function AdminPagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 16 }}>
      <button style={t.pageBtn} disabled={page === 1} onClick={() => onChange(page - 1)}>
        <ChevronRight size={16} />
      </button>
      <span style={t.pageInfo}>{page} / {totalPages}</span>
      <button style={t.pageBtn} disabled={page === totalPages} onClick={() => onChange(page + 1)}>
        <ChevronLeft size={16} />
      </button>
    </div>
  )
}

// ─── AdminTableWrap ─────────────────────────────────────────────
// Wraps a table with a card style, horizontal scroll on mobile,
// and a consistent loading / empty state.
export function AdminTableWrap({ loading, isEmpty, emptyText = 'لا توجد بيانات', colSpan = 1, children }) {
  return (
    <div style={{ ...t.card, overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#6e7681' }}>جاري التحميل...</div>
        ) : isEmpty ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#6e7681' }}>{emptyText}</div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}

// Shared <th> and <td> style getters for consistency
export const thStyle = t.th
export const tdStyle = t.td

// ─── AdminModal ─────────────────────────────────────────────────
// Generic modal overlay + box. Put your content as children.
export function AdminModal({ onClose, children, maxWidth = 520 }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}
      onClick={onClose}
    >
      <div
        style={{ backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: 14, padding: 24, width: '100%', maxWidth, maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

// ─── AdminModalHeader ───────────────────────────────────────────
export function AdminModalHeader({ title, onClose }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
      <span style={{ fontSize: 16, fontWeight: 700, color: '#e6edf3' }}>{title}</span>
      <button style={{ background: 'none', border: 'none', color: '#6e7681', cursor: 'pointer', fontSize: 20, lineHeight: 1 }} onClick={onClose}>✕</button>
    </div>
  )
}

// ─── AdminCard ──────────────────────────────────────────────────
export function AdminCard({ children, style }) {
  return (
    <div style={{ ...t.card, padding: 20, ...style }}>
      {children}
    </div>
  )
}

// ─── AdminInfoGrid ──────────────────────────────────────────────
// Renders an array of [label, value] rows in a modal info section
export function AdminInfoGrid({ rows }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
      {rows.map(([label, value]) => (
        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #21262d', paddingBottom: 8 }}>
          <span style={{ fontSize: 13, color: '#6e7681' }}>{label}</span>
          <span style={{ fontSize: 13, color: '#e6edf3', fontWeight: 500 }}>{value}</span>
        </div>
      ))}
    </div>
  )
}

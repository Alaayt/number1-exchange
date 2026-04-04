// src/components/admin/AdminLayout.jsx
import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, ArrowLeftRight, Wallet, TrendingUp,
  CreditCard, Users, Settings, Menu, X,
  LogOut, ChevronRight, ChevronLeft, Home,
} from 'lucide-react'
import useAuth from '../../context/useAuth'

const NAV = [
  { path: '/admin',                 label: 'الرئيسية',           icon: LayoutDashboard, exact: true },
  { path: '/admin/orders',          label: 'الطلبات',            icon: ArrowLeftRight },
  { path: '/admin/wallets',         label: 'المحافظ والإيداعات', icon: Wallet },
  { path: '/admin/rates',           label: 'الأسعار',            icon: TrendingUp },
  { path: '/admin/payment-methods', label: 'وسائل الدفع',        icon: CreditCard },
  { path: '/admin/users',           label: 'المستخدمون',         icon: Users },
  { path: '/admin/settings',        label: 'الإعدادات',          icon: Settings },
]

export default function AdminLayout({ children, title }) {
  const [collapsed,   setCollapsed]   = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const location  = useLocation()
  const navigate  = useNavigate()
  const { user, logout } = useAuth()

  // Close mobile drawer on route change
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const isActive = (item) =>
    item.exact
      ? location.pathname === item.path
      : location.pathname.startsWith(item.path)

  const currentPage = NAV.find(n => isActive(n)) || NAV[0]

  const handleLogout = () => { logout(); navigate('/') }

  const SidebarContent = ({ isMobile = false }) => (
    <>
      {/* Logo — on mobile includes the close (X) button */}
      <div className="al-logo-wrap" style={isMobile ? { justifyContent: 'space-between' } : {}}>
        {(!collapsed || isMobile) ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <div className="al-logo-icon">N1</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#f1f5f9', letterSpacing: 0.3 }}>Number 1</div>
              <div style={{ fontSize: 9, color: '#3b5ea6', letterSpacing: 2.5, textTransform: 'uppercase', marginTop: 1, fontFamily: "'JetBrains Mono',monospace" }}>ADMIN PANEL</div>
            </div>
          </div>
        ) : (
          <div className="al-logo-icon" style={{ margin: '0 auto' }}>N1</div>
        )}
        {isMobile && (
          <button className="al-mobile-close" onClick={() => setMobileOpen(false)}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="al-nav">
        {(!collapsed || isMobile) && <div className="al-section-label">القائمة الرئيسية</div>}
        {NAV.slice(0, 4).map(item => {
          const active = isActive(item)
          const Icon   = item.icon
          return (
            <Link
              key={item.path}
              to={item.path}
              title={collapsed && !isMobile ? item.label : undefined}
              className={`al-nav-item${active ? ' active' : ''}`}
              style={{ justifyContent: collapsed && !isMobile ? 'center' : 'flex-start' }}
            >
              <Icon size={17} style={{ flexShrink: 0, opacity: active ? 1 : 0.65 }} />
              {(!collapsed || isMobile) && <span style={{ flex: 1 }}>{item.label}</span>}
              {active && <span className="al-active-bar" />}
            </Link>
          )
        })}

        {(!collapsed || isMobile) && (
          <>
            <div className="al-section-label" style={{ marginTop: 4 }}>الإدارة</div>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', margin: '0 4px 6px' }} />
          </>
        )}

        {NAV.slice(4).map(item => {
          const active = isActive(item)
          const Icon   = item.icon
          return (
            <Link
              key={item.path}
              to={item.path}
              title={collapsed && !isMobile ? item.label : undefined}
              className={`al-nav-item${active ? ' active' : ''}`}
              style={{ justifyContent: collapsed && !isMobile ? 'center' : 'flex-start' }}
            >
              <Icon size={17} style={{ flexShrink: 0, opacity: active ? 1 : 0.65 }} />
              {(!collapsed || isMobile) && <span style={{ flex: 1 }}>{item.label}</span>}
              {active && <span className="al-active-bar" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="al-sidebar-bottom">
        {(!collapsed || isMobile) && (
          <div className="al-user-card">
            <div className="al-user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name?.split(' ')[0] || 'Admin'}
              </div>
              <div style={{ fontSize: 10, color: '#475569', marginTop: 2, fontFamily: "'JetBrains Mono',monospace", letterSpacing: 0.5 }}>ADMINISTRATOR</div>
            </div>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.6)', flexShrink: 0 }} />
          </div>
        )}

        <div style={{ display: 'flex', gap: 6, padding: collapsed && !isMobile ? '0 10px' : '0 12px', marginBottom: 14 }}>
          {/* Collapse toggle — desktop only */}
          <button className="al-icon-btn al-collapse-btn" onClick={() => setCollapsed(v => !v)} title={collapsed ? 'توسيع' : 'طي'}>
            {collapsed ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
          <button
            className="al-icon-btn danger"
            onClick={handleLogout}
            title="تسجيل الخروج"
            style={{ flex: collapsed && !isMobile ? 0 : 1, color: '#ef4444' }}
          >
            <LogOut size={14} />
            {(!collapsed || isMobile) && <span>خروج</span>}
          </button>
        </div>
      </div>
    </>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .al-root {
          display: flex; height: 100vh; overflow: hidden;
          background: #080e1a; color: #cbd5e1;
          font-family: 'Cairo','Tajawal',sans-serif; direction: rtl;
        }

        /* ── Sidebar ── */
        .al-sidebar {
          background: linear-gradient(180deg, #0d1526 0%, #0a1020 100%);
          border-left: 1px solid rgba(59,130,246,0.1);
          display: flex; flex-direction: column;
          transition: width 0.28s cubic-bezier(0.4,0,0.2,1);
          flex-shrink: 0; overflow: hidden; position: relative; z-index: 20;
          box-shadow: -4px 0 24px rgba(0,0,0,0.4);
        }
        .al-logo-wrap {
          padding: 18px 14px; border-bottom: 1px solid rgba(255,255,255,0.05);
          min-height: 70px; display: flex; align-items: center;
          background: rgba(59,130,246,0.03);
        }
        .al-logo-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          display: flex; align-items: center; justify-content: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px; font-weight: 700; color: #fff; flex-shrink: 0;
          box-shadow: 0 4px 16px rgba(59,130,246,0.35), inset 0 1px 0 rgba(255,255,255,0.15);
        }

        /* ── Nav ── */
        .al-nav { flex: 1; padding: 10px 8px; display: flex; flex-direction: column; gap: 1px; overflow-y: auto; overflow-x: hidden; }
        .al-nav::-webkit-scrollbar { width: 3px; }
        .al-nav::-webkit-scrollbar-track { background: transparent; }
        .al-nav::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.2); border-radius: 3px; }

        .al-section-label {
          font-size: 9.5px; font-weight: 700; letter-spacing: 1.8px;
          text-transform: uppercase; color: #334155;
          padding: 14px 12px 5px;
          font-family: 'JetBrains Mono', monospace;
        }
        .al-nav-item {
          display: flex; align-items: center; gap: 11px;
          padding: 10px 11px; border-radius: 9px;
          text-decoration: none; color: #64748b;
          font-size: 13.5px; font-weight: 600;
          transition: all 0.18s ease; position: relative;
          cursor: pointer; white-space: nowrap; letter-spacing: 0.2px;
        }
        .al-nav-item:hover { background: rgba(59,130,246,0.07); color: #94a3b8; }
        .al-nav-item.active {
          background: rgba(37,99,235,0.12); color: #60a5fa;
          border: 1px solid rgba(59,130,246,0.15);
        }
        .al-active-bar {
          position: absolute; right: 0; top: 50%; transform: translateY(-50%);
          width: 3px; height: 22px;
          background: linear-gradient(180deg, #3b82f6, #2563eb);
          border-radius: 3px 0 0 3px;
          box-shadow: 0 0 8px rgba(59,130,246,0.5);
        }

        /* ── Bottom / User card ── */
        .al-sidebar-bottom { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 10px; }
        .al-user-card {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; margin-bottom: 6px;
        }
        .al-user-avatar {
          width: 32px; height: 32px; border-radius: 9px;
          background: linear-gradient(135deg,#f59e0b,#d97706);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 800; color: #fff; flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(245,158,11,0.3);
        }
        .al-icon-btn {
          display: flex; align-items: center; justify-content: center; gap: 5px;
          padding: 8px 10px; background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06); border-radius: 8px;
          color: #475569; cursor: pointer; font-size: 12.5px;
          transition: all 0.15s; white-space: nowrap;
          font-family: 'Cairo',sans-serif; font-weight: 600;
        }
        .al-icon-btn:hover { background: rgba(255,255,255,0.05); color: #94a3b8; border-color: rgba(255,255,255,0.1); }
        .al-icon-btn.danger:hover { background: rgba(239,68,68,0.08); color: #f87171; border-color: rgba(239,68,68,0.2); }

        /* ── Main area ── */
        .al-main { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow: hidden; }

        .al-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 28px; height: 64px;
          background: linear-gradient(90deg, #0d1526 0%, #0a1020 100%);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          flex-shrink: 0; gap: 12px;
        }
        .al-header-left { display: flex; align-items: center; gap: 12px; min-width: 0; }
        .al-breadcrumb { display: flex; align-items: center; gap: 5px; margin-bottom: 3px; flex-wrap: wrap; }
        .al-page-title { font-size: 17px; font-weight: 800; color: #e2e8f0; margin: 0; letter-spacing: -0.3px; }

        .al-back-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
          color: #64748b; cursor: pointer; font-size: 12.5px; font-weight: 600;
          transition: all 0.15s; font-family: 'Cairo',sans-serif; white-space: nowrap;
        }
        .al-back-btn:hover { border-color: rgba(59,130,246,0.3); color: #93c5fd; background: rgba(59,130,246,0.05); }

        .al-badge {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 12px; border-radius: 8px;
          background: rgba(37,99,235,0.08); border: 1px solid rgba(59,130,246,0.15);
          font-size: 12px; font-weight: 700; color: #60a5fa; white-space: nowrap;
        }
        .al-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #22c55e;
          box-shadow: 0 0 7px rgba(34,197,94,0.7);
          animation: pulseDot 2s ease-in-out infinite;
        }
        @keyframes pulseDot {
          0%,100% { opacity: 1; box-shadow: 0 0 7px rgba(34,197,94,0.7); }
          50%      { opacity: 0.7; box-shadow: 0 0 12px rgba(34,197,94,0.4); }
        }

        .al-content { flex: 1; overflow-y: auto; padding: 28px; background: #080e1a; }
        .al-content::-webkit-scrollbar { width: 5px; }
        .al-content::-webkit-scrollbar-track { background: transparent; }
        .al-content::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.15); border-radius: 5px; }

        @keyframes adminFadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .al-page-enter { animation: adminFadeIn 0.22s ease forwards; }

        /* ── Mobile hamburger ── */
        .al-hamburger {
          display: none; align-items: center; justify-content: center;
          width: 38px; height: 38px; flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 9px; background: rgba(255,255,255,0.02);
          color: #64748b; cursor: pointer;
        }
        /* Collapse button hidden on mobile */
        .al-collapse-btn { display: flex; }

        /* ── Mobile drawer backdrop ── */
        .al-backdrop {
          display: none; position: fixed; inset: 0;
          background: rgba(0,0,0,0.6); backdrop-filter: blur(2px);
          z-index: 29;
        }
        .al-backdrop.open { display: block; }

        /* ── Mobile sidebar drawer ── */
        .al-mobile-sidebar {
          display: none;
          position: fixed; top: 0; right: 0; bottom: 0;
          width: 240px; z-index: 30;
          background: linear-gradient(180deg, #0d1526 0%, #0a1020 100%);
          border-left: 1px solid rgba(59,130,246,0.15);
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
          box-shadow: -8px 0 40px rgba(0,0,0,0.5);
          overflow: hidden;
        }
        .al-mobile-sidebar.open { transform: translateX(0); }

        .al-mobile-close {
          display: flex; align-items: center; justify-content: center;
          width: 32px; height: 32px; border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
          color: #64748b; cursor: pointer; flex-shrink: 0;
        }

        /* ── Responsive breakpoints ── */
        @media (max-width: 768px) {
          .al-sidebar       { display: none; }
          .al-hamburger     { display: flex; }
          .al-mobile-sidebar{ display: flex; }
          .al-collapse-btn  { display: none; }
          .al-back-btn span { display: none; }
          .al-header        { padding: 0 16px; }
          .al-content       { padding: 16px; }
        }

        @media (max-width: 480px) {
          .al-badge span    { display: none; }
          .al-page-title    { font-size: 15px; }
        }
      `}</style>

      {/* ── Mobile drawer backdrop ── */}
      <div className={`al-backdrop${mobileOpen ? ' open' : ''}`} onClick={() => setMobileOpen(false)} />

      {/* ── Mobile sidebar drawer ── */}
      <aside className={`al-mobile-sidebar${mobileOpen ? ' open' : ''}`}>
        <SidebarContent isMobile />
      </aside>

      <div className="al-root">

        {/* ── Desktop sidebar ── */}
        <aside className="al-sidebar" style={{ width: collapsed ? 64 : 235 }}>
          <SidebarContent />
        </aside>

        {/* ── Main ── */}
        <div className="al-main">

          {/* Header */}
          <header className="al-header">
            <div className="al-header-left">
              {/* Hamburger — mobile only */}
              <button className="al-hamburger" onClick={() => setMobileOpen(true)}>
                <Menu size={18} />
              </button>

              <div style={{ minWidth: 0 }}>
                <div className="al-breadcrumb">
                  <span style={{ fontSize: 11, color: '#334155' }}>لوحة التحكم</span>
                  <span style={{ fontSize: 11, color: '#1e3a5f' }}>/</span>
                  <span style={{ fontSize: 11, color: '#3b82f6', fontWeight: 700 }}>{currentPage?.label}</span>
                </div>
                <h1 className="al-page-title">{title || currentPage?.label}</h1>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button className="al-back-btn" onClick={() => navigate('/')}>
                <Home size={13} />
                <span>الموقع الرئيسي</span>
              </button>

              <div className="al-badge">
                <div className="al-dot" />
                <span>مشرف</span>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="al-content al-page-enter">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}

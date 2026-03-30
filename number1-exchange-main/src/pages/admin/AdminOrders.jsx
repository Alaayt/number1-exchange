// src/pages/admin/AdminOrders.jsx
import { useEffect, useState, useCallback } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  Search, Eye, CheckCircle, XCircle,
  Clock, RefreshCw, ChevronLeft, ChevronRight,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL;

const STATUS_CONFIG = {
  pending:    { label: "انتظار",    color: "#d97706", bg: "#451a03" },
  verifying:  { label: "تحقق",     color: "#7c3aed", bg: "#3b1f6e" },
  verified:   { label: "تم التحقق", color: "#2563eb", bg: "#1e3a5f" },
  processing: { label: "معالجة",   color: "#0891b2", bg: "#0c3547" },
  completed:  { label: "مكتمل",    color: "#059669", bg: "#064e3b" },
  rejected:   { label: "مرفوض",   color: "#f85149", bg: "#3d0a0a" },
  cancelled:  { label: "ملغي",     color: "#6e7681", bg: "#21262d" },
};

// ✅ إصلاح: enum يطابق الباك إند بالضبط
const ORDER_TYPE_LABELS = {
  USDT_TO_MONEYGO:       "USDT → USD",
  EGP_WALLET_TO_MONEYGO: "محفظة → USD",
};

const STATUS_TABS = [
  { value: "",           label: "الكل"      },
  { value: "pending",    label: "انتظار"    },
  { value: "verifying",  label: "تحقق"     },
  { value: "verified",   label: "تم التحقق" },
  { value: "processing", label: "معالجة"   },
  { value: "completed",  label: "مكتمل"    },
  { value: "rejected",   label: "مرفوض"    },
];

export default function AdminOrders() {
  const [orders,        setOrders]        = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState("");
  const [statusTab,     setStatusTab]     = useState("");
  const [page,          setPage]          = useState(1);
  const [totalPages,    setTotalPages]    = useState(1);
  const [selected,      setSelected]      = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const LIMIT = 15;

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      // ✅ إصلاح: n1_token
      const token = localStorage.getItem("n1_token");
      const params = new URLSearchParams({
        page,
        limit: LIMIT,
        ...(statusTab && { status: statusTab }),
        ...(search    && { search }),
      });
      const res  = await fetch(`${API}/api/admin/orders?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data.orders || []);
      // ✅ إصلاح: pagination.pages بدل totalPages مباشرة
      setTotalPages(data.pagination?.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, statusTab, search]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (orderId, newStatus) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("n1_token");
      // ✅ إصلاح: PUT بدل PATCH (يطابق admin.js)
      await fetch(`${API}/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      await fetchOrders();
      setSelected(null);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div style={styles.pageHeader}>
        <h2 style={styles.pageTitle}>إدارة الطلبات</h2>
        <button style={styles.refreshBtn} onClick={fetchOrders}>
          <RefreshCw size={16} />
          <span>تحديث</span>
        </button>
      </div>

      <div style={styles.tabs}>
        {STATUS_TABS.map((t) => (
          <button
            key={t.value}
            style={{ ...styles.tab, ...(statusTab === t.value ? styles.tabActive : {}) }}
            onClick={() => { setStatusTab(t.value); setPage(1); }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={styles.searchRow}>
        <div style={styles.searchBox}>
          <Search size={16} style={{ color: "#6e7681" }} />
          <input
            style={styles.searchInput}
            placeholder="ابحث بالإيميل أو رقم الطلب..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      <div style={styles.card}>
        {loading ? (
          <div style={styles.loading}>جاري التحميل...</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                {["رقم الطلب", "العميل", "النوع", "المرسَل", "المستلَم", "الطريقة", "الحالة", "التاريخ", ""].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={9} style={styles.empty}>لا يوجد طلبات</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} style={styles.tr}>
                    {/* ✅ إصلاح: orderNumber */}
                    <td style={styles.td}>
                      <span style={styles.orderId}>{order.orderNumber || `#${order._id.slice(-6)}`}</span>
                    </td>
                    {/* ✅ إصلاح: customerEmail */}
                    <td style={styles.td}>{order.customerEmail || "—"}</td>
                    {/* ✅ إصلاح: orderType */}
                    <td style={styles.td}>
                      <span style={styles.typeBadge}>
                        {ORDER_TYPE_LABELS[order.orderType] || order.orderType}
                      </span>
                    </td>
                    {/* ✅ إصلاح: payment.amountSent + payment.currencySent */}
                    <td style={styles.td}>{order.payment?.amountSent} {order.payment?.currencySent}</td>
                    {/* ✅ إصلاح: moneygo.amountUSD */}
                    <td style={styles.td}>{order.moneygo?.amountUSD} USD</td>
                    {/* ✅ إصلاح: payment.method */}
                    <td style={styles.td}>{order.payment?.method || "—"}</td>
                    <td style={styles.td}>
                      <StatusBadge status={order.status} />
                    </td>
                    <td style={styles.td}>
                      {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                    </td>
                    <td style={styles.td}>
                      <button style={styles.viewBtn} onClick={() => setSelected(order)}>
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button style={styles.pageBtn} disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              <ChevronRight size={16} />
            </button>
            <span style={styles.pageInfo}>{page} / {totalPages}</span>
            <button style={styles.pageBtn} disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
              <ChevronLeft size={16} />
            </button>
          </div>
        )}
      </div>

      {selected && (
        <OrderDetailModal
          order={selected}
          onClose={() => setSelected(null)}
          onUpdateStatus={updateStatus}
          loading={actionLoading}
        />
      )}
    </AdminLayout>
  );
}

function OrderDetailModal({ order, onClose, onUpdateStatus, loading }) {
  // ✅ إصلاح: كل الحقول صحيحة
  const rows = [
    ["رقم الطلب",          order.orderNumber || order._id],
    ["اسم العميل",         order.customerName  || "—"],
    ["إيميل العميل",       order.customerEmail || "—"],
    ["هاتف العميل",        order.customerPhone || "—"],
    ["نوع العملية",        ORDER_TYPE_LABELS[order.orderType] || order.orderType],
    ["المبلغ المرسل",      `${order.payment?.amountSent} ${order.payment?.currencySent}`],
    ["المبلغ المستلم",     `${order.moneygo?.amountUSD} USD`],
    ["طريقة الدفع",        order.payment?.method || "—"],
    ["اسم المستلم",        order.moneygo?.recipientName  || "—"],
    ["هاتف المستلم",       order.moneygo?.recipientPhone || "—"],
    ["الحالة",             <StatusBadge status={order.status} />],
    ["تاريخ الإنشاء",      new Date(order.createdAt).toLocaleString("ar-EG")],
  ];

  return (
    <div style={modal.overlay} onClick={onClose}>
      <div style={modal.box} onClick={(e) => e.stopPropagation()}>
        <div style={modal.header}>
          <span style={modal.title}>تفاصيل الطلب — {order.orderNumber}</span>
          <button style={modal.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* ✅ إصلاح: payment.receiptImageUrl */}
        {order.payment?.receiptImageUrl && (
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <img
              src={order.payment.receiptImageUrl}
              alt="receipt"
              style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8, border: "1px solid #21262d" }}
            />
            <div style={{ fontSize: 12, color: "#6e7681", marginTop: 4 }}>إيصال الدفع</div>
          </div>
        )}

        <div style={modal.infoGrid}>
          {rows.map(([label, value]) => (
            <div key={label} style={modal.infoRow}>
              <span style={modal.infoLabel}>{label}</span>
              <span style={modal.infoValue}>{value}</span>
            </div>
          ))}
        </div>

        {order.adminNote && (
          <div style={modal.notes}>
            <span style={{ color: "#6e7681", fontSize: 12 }}>ملاحظة الأدمن: </span>
            {order.adminNote}
          </div>
        )}

        {/* أزرار التحديث — تظهر فقط للحالات القابلة للتغيير */}
        {!["completed", "rejected", "cancelled"].includes(order.status) && (
          <div style={modal.actions}>
            <button style={modal.approveBtn} disabled={loading} onClick={() => onUpdateStatus(order._id, "completed")}>
              <CheckCircle size={16} />
              {loading ? "..." : "إكمال الطلب"}
            </button>
            <button style={modal.rejectBtn} disabled={loading} onClick={() => onUpdateStatus(order._id, "rejected")}>
              <XCircle size={16} />
              {loading ? "..." : "رفض الطلب"}
            </button>
          </div>
        )}

        {order.status === "pending" && (
          <button
            style={{ ...modal.approveBtn, background: "#3b1f6e", color: "#7c3aed", marginTop: 8, width: "100%" }}
            disabled={loading}
            onClick={() => onUpdateStatus(order._id, "verifying")}
          >
            <Clock size={16} />
            بدء التحقق
          </button>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const s = STATUS_CONFIG[status] || { label: status, color: "#8b949e", bg: "#21262d" };
  return (
    <span style={{ padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600, backgroundColor: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

const styles = {
  pageHeader:  { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  pageTitle:   { fontSize: 20, fontWeight: 700, color: "#e6edf3", margin: 0 },
  refreshBtn:  { display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "1px solid #21262d", background: "#161b22", color: "#8b949e", cursor: "pointer", fontSize: 13 },
  tabs:        { display: "flex", gap: 4, marginBottom: 16, flexWrap: "wrap" },
  tab:         { padding: "7px 16px", borderRadius: 8, border: "1px solid #21262d", background: "none", color: "#8b949e", cursor: "pointer", fontSize: 13 },
  tabActive:   { background: "#1e3a5f", color: "#2563eb", borderColor: "#2563eb" },
  searchRow:   { marginBottom: 16 },
  searchBox:   { display: "flex", alignItems: "center", gap: 8, background: "#161b22", border: "1px solid #21262d", borderRadius: 8, padding: "8px 14px", maxWidth: 400 },
  searchInput: { background: "none", border: "none", outline: "none", color: "#e6edf3", fontSize: 14, flex: 1 },
  card:        { backgroundColor: "#161b22", border: "1px solid #21262d", borderRadius: 12, overflow: "hidden" },
  loading:     { padding: 40, textAlign: "center", color: "#6e7681" },
  table:       { width: "100%", borderCollapse: "collapse" },
  th:          { textAlign: "right", padding: "10px 14px", fontSize: 12, color: "#6e7681", borderBottom: "1px solid #21262d", fontWeight: 500, whiteSpace: "nowrap" },
  td:          { padding: "11px 14px", fontSize: 13, color: "#c9d1d9", borderBottom: "1px solid #161b22" },
  tr:          {},
  empty:       { padding: 40, textAlign: "center", color: "#6e7681" },
  orderId:     { fontFamily: "monospace", color: "#8b949e", fontSize: 12 },
  typeBadge:   { fontSize: 11, color: "#2563eb", background: "#1e3a5f", padding: "2px 8px", borderRadius: 10, fontWeight: 600 },
  viewBtn:     { background: "#21262d", border: "none", color: "#8b949e", borderRadius: 6, padding: "5px 8px", cursor: "pointer", display: "flex", alignItems: "center" },
  pagination:  { display: "flex", alignItems: "center", justifyContent: "center", gap: 16, padding: 16 },
  pageBtn:     { background: "#21262d", border: "none", color: "#8b949e", borderRadius: 6, padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center" },
  pageInfo:    { fontSize: 13, color: "#8b949e" },
};

const modal = {
  overlay:    { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 },
  box:        { backgroundColor: "#161b22", border: "1px solid #30363d", borderRadius: 14, padding: 24, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto" },
  header:     { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  title:      { fontSize: 16, fontWeight: 700, color: "#e6edf3" },
  closeBtn:   { background: "none", border: "none", color: "#6e7681", cursor: "pointer", fontSize: 18 },
  infoGrid:   { display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 },
  infoRow:    { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #21262d", paddingBottom: 8 },
  infoLabel:  { fontSize: 13, color: "#6e7681" },
  infoValue:  { fontSize: 13, color: "#e6edf3", fontWeight: 500 },
  notes:      { fontSize: 13, color: "#c9d1d9", background: "#21262d", padding: 12, borderRadius: 8, marginBottom: 16 },
  actions:    { display: "flex", gap: 10, marginTop: 16 },
  approveBtn: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px", borderRadius: 8, border: "none", background: "#064e3b", color: "#059669", cursor: "pointer", fontSize: 14, fontWeight: 600 },
  rejectBtn:  { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px", borderRadius: 8, border: "none", background: "#3d0a0a", color: "#f85149", cursor: "pointer", fontSize: 14, fontWeight: 600 },
};
import { useState, useEffect, useCallback } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { useToast } from '../../../context/ToastContext';
import styles from './OrdersPage.module.css';

const STATUSES = ['pending', 'verified', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_CONFIG = {
  pending:    { label: 'Pending',     badge: 'badge-warning', next: 'verified' },
  verified:   { label: 'Verified',    badge: 'badge-teal',    next: 'processing' },
  processing: { label: 'Processing',  badge: 'badge-teal',    next: 'shipped' },
  shipped:    { label: 'Shipped',     badge: 'badge-teal',    next: 'delivered' },
  delivered:  { label: 'Delivered',   badge: 'badge-success', next: null },
  cancelled:  { label: 'Cancelled',   badge: 'badge-error',   next: null },
};

export default function AdminOrdersPage() {
  const toast = useToast();
  const [orders,      setOrders]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [filterStatus,setFilterStatus]= useState('all');
  const [proofUrl,    setProofUrl]    = useState(null);
  const [updating,    setUpdating]    = useState(null);

  useEffect(() => { document.title = 'Orders | NMG Zembeta Admin'; }, []);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => { toast.error('Failed to load orders.'); setLoading(false); });
    return unsub;
  }, []);

  const updateStatus = useCallback(async (order, newStatus) => {
    setUpdating(order.id);
    try {
      await updateDoc(doc(db, 'orders', order.id), { status: newStatus, updatedAt: serverTimestamp() });
      toast.success(`Order updated to "${STATUS_CONFIG[newStatus]?.label}".`);
    } catch {
      toast.error('Failed to update order status.');
    } finally {
      setUpdating(null);
    }
  }, [toast]);

  const filtered = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  // Fix Firestore Timestamp
  const formatDate = (ts) => {
    if (!ts) return '—';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-ZA', { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' });
  };

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length;
    return acc;
  }, {});

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Orders</h1>
            <p className={styles.subtitle}>{orders.length} total orders</p>
          </div>
        </div>

        {/* Status filter tabs */}
        <div className={styles.filterTabs} role="tablist" aria-label="Filter orders by status">
          <button
            role="tab"
            aria-selected={filterStatus === 'all'}
            className={`${styles.filterTab} ${filterStatus === 'all' ? styles.filterTabActive : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All <span className={styles.filterCount}>{orders.length}</span>
          </button>
          {STATUSES.map(s => (
            <button
              key={s}
              role="tab"
              aria-selected={filterStatus === s}
              className={`${styles.filterTab} ${filterStatus === s ? styles.filterTabActive : ''} ${styles[`filterTab_${s}`]}`}
              onClick={() => setFilterStatus(s)}
            >
              {STATUS_CONFIG[s].label}
              {counts[s] > 0 && <span className={styles.filterCount}>{counts[s]}</span>}
            </button>
          ))}
        </div>

        {/* Orders */}
        {loading ? (
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
            {[1,2,3].map(i => <div key={i} className={`skeleton`} style={{ height:120, borderRadius:'var(--radius-xl)' }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <p>No orders found{filterStatus !== 'all' ? ` with status "${STATUS_CONFIG[filterStatus]?.label}"` : ''}.</p>
          </div>
        ) : (
          <ul className={styles.ordersList} role="list">
            {filtered.map(order => (
              <li key={order.id}>
                <OrderRow
                  order={order}
                  formatDate={formatDate}
                  onStatusUpdate={updateStatus}
                  onViewProof={setProofUrl}
                  isUpdating={updating === order.id}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Proof viewer modal */}
      {proofUrl && (
        <div
          className={styles.proofModal}
          onClick={() => setProofUrl(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Proof of payment viewer"
        >
          <button className={styles.proofClose} onClick={() => setProofUrl(null)} aria-label="Close proof viewer">×</button>
          {proofUrl.includes('.pdf') ? (
            <iframe src={proofUrl} className={styles.proofFrame} title="Proof of payment" />
          ) : (
            <img
              src={proofUrl}
              alt="Proof of payment"
              className={styles.proofImg}
              onClick={e => e.stopPropagation()}
            />
          )}
        </div>
      )}
    </div>
  );
}

function OrderRow({ order, formatDate, onStatusUpdate, onViewProof, isUpdating }) {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CONFIG[order.status] || { label: order.status, badge: 'badge-muted', next: null };

  return (
    <article className={styles.orderCard}>
      {/* Summary row */}
      <div className={styles.orderSummary} onClick={() => setExpanded(v => !v)}>
        <div className={styles.orderLeft}>
          <span className={styles.orderId}>
            #{order.id.substring(0,10).toUpperCase()}
          </span>
          <span className={styles.orderCustomer}>{order.userName}</span>
          <span className={styles.orderDate}>{formatDate(order.createdAt)}</span>
        </div>
        <div className={styles.orderRight}>
          <span className={`badge ${status.badge}`}>{status.label}</span>
          <span className={styles.orderTotal}>R{Number(order.totalAmount).toFixed(2)}</span>
          <span className={`${styles.chevron} ${expanded ? styles.chevronOpen : ''}`} aria-hidden="true">
            <ChevronIcon />
          </span>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className={styles.orderDetail}>
          {/* Customer info */}
          <div className={styles.detailSection}>
            <h3 className={styles.detailTitle}>Customer</h3>
            <div className={styles.detailGrid}>
              <DetailField label="Name"    value={order.userName} />
              <DetailField label="Email"   value={order.userEmail} />
              <DetailField label="Phone"   value={order.userPhone || '—'} />
              <DetailField label="Address" value={order.userAddress || '—'} />
              {order.notes && <DetailField label="Notes" value={order.notes} />}
            </div>
          </div>

          {/* Items */}
          <div className={styles.detailSection}>
            <h3 className={styles.detailTitle}>Items Ordered</h3>
            <ul className={styles.itemsList} role="list">
              {order.items?.map((item, i) => (
                <li key={i} className={styles.orderItem}>
                  <div className={styles.itemImg}>
                    {item.image
                      ? <img src={item.image} alt={item.name} loading="lazy" />
                      : <span className={styles.itemImgPlaceholder}>NMG</span>
                    }
                  </div>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemQty}>× {item.quantity}</span>
                  <span className={styles.itemTotal}>R{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className={styles.detailActions}>
            {order.proofOfPayment && (
              <button
                className={`btn btn-outline btn-sm`}
                onClick={() => onViewProof(order.proofOfPayment)}
              >
                <ImageIcon /> View Proof of Payment
              </button>
            )}

            {/* Status update buttons */}
            <div className={styles.statusActions}>
              <span className={styles.statusActionsLabel}>Update status:</span>
              <div className={styles.statusBtns}>
                {STATUSES.filter(s => s !== order.status && s !== 'pending').map(s => (
                  <button
                    key={s}
                    className={`btn btn-sm ${s === 'cancelled' ? 'btn-danger' : 'btn-ghost'}`}
                    onClick={() => onStatusUpdate(order, s)}
                    disabled={isUpdating}
                  >
                    {isUpdating ? <Spinner /> : `→ ${STATUS_CONFIG[s].label}`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

function DetailField({ label, value }) {
  return (
    <div className={styles.detailField}>
      <span className={styles.detailLabel}>{label}</span>
      <span className={styles.detailValue}>{value}</span>
    </div>
  );
}

const ChevronIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>;
const ImageIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
const Spinner     = () => <span style={{ display:'inline-block', width:12, height:12, border:'2px solid rgba(13,17,23,0.3)', borderTopColor:'var(--ink)', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} aria-hidden="true" />;

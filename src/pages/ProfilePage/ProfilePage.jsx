import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import styles from './ProfilePage.module.css';

const STATUS_MAP = {
  pending:   { label: 'Pending',    badge: 'badge-warning' },
  verified:  { label: 'Verified',   badge: 'badge-teal' },
  processing:{ label: 'Processing', badge: 'badge-teal' },
  shipped:   { label: 'Shipped',    badge: 'badge-teal' },
  delivered: { label: 'Delivered',  badge: 'badge-success' },
  cancelled: { label: 'Cancelled',  badge: 'badge-error' },
};

export default function ProfilePage() {
  const { user, userData } = useAuth();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState('orders');

  useEffect(() => {
    document.title = 'My Profile | NMG Zembeta';
    if (!user) return;
    const q = query(collection(db, 'users', user.uid, 'orders'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, [user]);

  const firstName = userData?.fullName?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'there';

  return (
    <div className={`page-wrapper ${styles.page}`}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.avatar}>
            {(userData?.fullName || user?.displayName || 'U')[0].toUpperCase()}
          </div>
          <div className={styles.headerInfo}>
            <h1 className={styles.greeting}>Welcome back, {firstName}</h1>
            <p className={styles.email}>{user?.email}</p>
          </div>
          <div className={styles.headerStats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{orders.length}</span>
              <span className={styles.statLabel}>Orders</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs} role="tablist">
          {[
            { id: 'orders',  label: 'Order History' },
            { id: 'account', label: 'Account Details' },
          ].map(t => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              className={`${styles.tab} ${tab === t.id ? styles.tabActive : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        {tab === 'orders' && (
          <div role="tabpanel" aria-label="Order history">
            {loading ? (
              <OrdersSkeleton />
            ) : orders.length === 0 ? (
              <EmptyOrders />
            ) : (
              <ul className={styles.ordersList} role="list">
                {orders.map(order => <OrderCard key={order.id} order={order} />)}
              </ul>
            )}
          </div>
        )}

        {tab === 'account' && (
          <div role="tabpanel" aria-label="Account details" className={styles.accountPanel}>
            <div className={styles.accountCard}>
              <h2 className={styles.accountCardTitle}>Personal Information</h2>
              <div className={styles.accountFields}>
                <InfoField label="Full Name" value={userData?.fullName || user?.displayName || '—'} />
                <InfoField label="Email Address" value={user?.email || '—'} />
                <InfoField label="Account Type" value={userData?.role === 'admin' ? 'Administrator' : 'Customer'} />
                <InfoField label="Member Since" value={userData?.createdAt?.toDate ? userData.createdAt.toDate().toLocaleDateString('en-ZA', { year:'numeric', month:'long', day:'numeric' }) : '2024'} />
              </div>
            </div>
            <div className={styles.accountCard}>
              <h2 className={styles.accountCardTitle}>Need Help?</h2>
              <p className={styles.accountHelpText}>
                To update your account details or for any order enquiries, contact us directly on WhatsApp.
              </p>
              <a
                href="https://wa.me/27739740331"
                target="_blank"
                rel="noopener noreferrer"
                className={`btn btn-primary`}
                style={{ marginTop: 'var(--space-4)', width: 'fit-content' }}
              >
                <WhatsAppIcon /> Chat on WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_MAP[order.status] || { label: order.status, badge: 'badge-muted' };

  // Fix: Handle Firestore Timestamp objects correctly
  const formatDate = (ts) => {
    if (!ts) return '—';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <li className={styles.orderCard}>
      <div className={styles.orderHeader} onClick={() => setExpanded(v => !v)}>
        <div className={styles.orderMeta}>
          <span className={styles.orderId}>#{order.orderId?.substring(0,10).toUpperCase() || order.id?.substring(0,10).toUpperCase()}</span>
          <span className={styles.orderDate}>{formatDate(order.createdAt || order.orderDate)}</span>
        </div>
        <div className={styles.orderRight}>
          <span className={`badge ${status.badge}`}>{status.label}</span>
          <span className={styles.orderTotal}>R{Number(order.totalAmount).toFixed(2)}</span>
          <span className={`${styles.orderChevron} ${expanded ? styles.orderChevronOpen : ''}`} aria-hidden="true">
            <ChevronIcon />
          </span>
        </div>
      </div>

      {expanded && (
        <div className={styles.orderBody}>
          <ul className={styles.orderItems} role="list">
            {order.items?.map((item, i) => (
              <li key={i} className={styles.orderItem}>
                <div className={styles.orderItemImg}>
                  {item.image
                    ? <img src={item.image} alt={item.name} loading="lazy" />
                    : <span className={styles.orderItemImgPlaceholder}>NMG</span>
                  }
                </div>
                <div className={styles.orderItemInfo}>
                  <span className={styles.orderItemName}>{item.name}</span>
                  <span className={styles.orderItemQty}>Qty: {item.quantity} × R{Number(item.price).toFixed(2)}</span>
                </div>
                <span className={styles.orderItemTotal}>R{(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          {order.status === 'pending' && (
            <p className={styles.orderPendingNote}>
              <InfoIcon /> Payment verification in progress. We'll update your order status within 24 hours.
            </p>
          )}
        </div>
      )}
    </li>
  );
}

function InfoField({ label, value }) {
  return (
    <div className={styles.infoField}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{value}</span>
    </div>
  );
}

function EmptyOrders() {
  return (
    <div className={styles.emptyOrders}>
      <div className={styles.emptyIcon}><BoxIcon /></div>
      <h2 className={styles.emptyTitle}>No orders yet</h2>
      <p className={styles.emptyText}>When you place an order, it will appear here.</p>
      <a href="/products" className={`btn btn-primary`}>Start Shopping</a>
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
      {[1,2,3].map(i => (
        <div key={i} className={`skeleton`} style={{ height: 72, borderRadius: 'var(--radius-xl)' }} />
      ))}
    </div>
  );
}

const ChevronIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>;
const InfoIcon     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
const BoxIcon      = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const WhatsAppIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.99 2C6.469 2 2 6.47 2 11.99c0 1.96.53 3.793 1.444 5.372L2 22l4.748-1.424A9.952 9.952 0 0 0 11.99 22C17.51 22 22 17.53 22 12.01 22 6.49 17.51 2 11.99 2z"/></svg>;

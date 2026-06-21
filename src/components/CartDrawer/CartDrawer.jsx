import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
  const { items, count, total, open, setOpen, updateQty, removeItem, loading } = useCart();
  const { user } = useAuth();
  const drawerRef = useRef(null);

  // Focus trap & ESC close
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, setOpen]);

  if (!user) return null;

  return (
    <>
      <div
        className={`${styles.overlay} ${open ? styles.overlayOpen : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside
        ref={drawerRef}
        className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <BagIcon />
            <h2 className={styles.title}>Your Cart</h2>
            {count > 0 && <span className="badge badge-teal">{count} {count === 1 ? 'item' : 'items'}</span>}
          </div>
          <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close cart">
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {loading ? (
            <CartSkeleton />
          ) : items.length === 0 ? (
            <EmptyCart onClose={() => setOpen(false)} />
          ) : (
            <ul className={styles.items} role="list">
              {items.map(item => (
                <CartItem key={item.id} item={item} onQtyChange={updateQty} onRemove={removeItem} />
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && !loading && (
          <div className={styles.footer}>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalValue}>R{total.toFixed(2)}</span>
            </div>
            <p className={styles.taxNote}>Prices include VAT where applicable</p>
            <Link
              to="/checkout"
              className={`btn btn-primary btn-lg btn-full ${styles.checkoutBtn}`}
              onClick={() => setOpen(false)}
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/cart"
              className={`btn btn-outline btn-full`}
              onClick={() => setOpen(false)}
            >
              View Full Cart
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}

function CartItem({ item, onQtyChange, onRemove }) {
  return (
    <li className={styles.item}>
      <div className={styles.itemImg}>
        {item.image
          ? <img src={item.image} alt={item.name} loading="lazy" />
          : <PlaceholderImg />
        }
      </div>
      <div className={styles.itemInfo}>
        <p className={styles.itemName}>{item.name}</p>
        <p className={styles.itemPrice}>R{(item.price * item.quantity).toFixed(2)}</p>
        <div className={styles.itemControls}>
          <div className={styles.qtyControl}>
            <button
              className={styles.qtyBtn}
              onClick={() => onQtyChange(item.id, item.quantity - 1)}
              aria-label="Decrease quantity"
            >−</button>
            <span className={styles.qtyValue} aria-live="polite">{item.quantity}</span>
            <button
              className={styles.qtyBtn}
              onClick={() => onQtyChange(item.id, item.quantity + 1)}
              aria-label="Increase quantity"
            >+</button>
          </div>
          <button
            className={styles.removeBtn}
            onClick={() => onRemove(item.id)}
            aria-label={`Remove ${item.name} from cart`}
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}

function EmptyCart({ onClose }) {
  return (
    <div className={styles.empty}>
      <div className={styles.emptyIcon}><EmptyBagIcon /></div>
      <h3 className={styles.emptyTitle}>Your cart is empty</h3>
      <p className={styles.emptyText}>Browse our products and add items to your cart.</p>
      <Link to="/products" className={`btn btn-primary`} onClick={onClose}>
        Browse Products
      </Link>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className={styles.skeleton}>
      {[1,2,3].map(i => (
        <div key={i} className={styles.skeletonItem}>
          <div className={`skeleton ${styles.skeletonImg}`} />
          <div className={styles.skeletonLines}>
            <div className={`skeleton ${styles.skeletonLine}`} />
            <div className={`skeleton ${styles.skeletonLine} ${styles.skeletonLineShort}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Icons ─────────────────────────────────────────────────── */
const BagIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
);
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const EmptyBagIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
);
const PlaceholderImg = () => (
  <div style={{ width:'100%', height:'100%', background:'var(--border)', display:'flex', alignItems:'center', justifyContent:'center', color: 'var(--text-subtle)', fontSize: '10px' }}>IMG</div>
);

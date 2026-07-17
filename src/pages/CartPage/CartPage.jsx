import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import useScrollReveal from '../../hooks/useScrollReveal';
import styles from './CartPage.module.css';

export default function CartPage() {
  const { items, total, count, loading, updateQty, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const pageRef  = useScrollReveal();

  return (
    <div className={`page-wrapper ${styles.page}`} ref={pageRef}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <div>
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <Link to="/"        className={styles.breadcrumbLink}>Home</Link>
              <span aria-hidden="true">/</span>
              <Link to="/products" className={styles.breadcrumbLink}>Shop</Link>
              <span aria-hidden="true">/</span>
              <span className={styles.breadcrumbCurrent} aria-current="page">Cart</span>
            </nav>
            <h1 className={`section-title ${styles.title} reveal`}>
              Your Cart
              {count > 0 && <span className={styles.countBadge}>{count}</span>}
            </h1>
          </div>
          {items.length > 0 && (
            <button
              className={`btn btn-danger btn-sm`}
              onClick={() => { if (window.confirm('Clear your entire cart?')) clearCart(); }}
            >
              Clear Cart
            </button>
          )}
        </div>

        {loading ? (
          <CartSkeleton />
        ) : items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className={styles.layout}>
            {/* Items column */}
            <div className={styles.itemsCol}>
              <ul className={styles.itemsList} role="list">
                {items.map((item, i) => (
                  <li key={item.id} className={`reveal ${i < 3 ? `reveal-delay-${i + 1}` : ''}`}>
                    <CartItem item={item} onQtyChange={updateQty} onRemove={removeItem} />
                  </li>
                ))}
              </ul>
              <div className={styles.continueShopping}>
                <Link to="/products" className={`btn btn-outline`}>
                  <ArrowLeft /> Continue Shopping
                </Link>
              </div>
            </div>

            {/* Summary column */}
            <aside className={`${styles.summaryCol} reveal reveal-delay-2`} aria-label="Order summary">
              <div className={styles.summaryCard}>
                <h2 className={styles.summaryTitle}>Order Summary</h2>

                <div className={styles.summaryLines}>
                  <div className={styles.summaryLine}>
                    <span className={styles.summaryLineLabel}>
                      {count} {count === 1 ? 'item' : 'items'}
                    </span>
                    <span className={styles.summaryLineValue}>R{total.toFixed(2)}</span>
                  </div>
                  <div className={styles.summaryLine}>
                    <span className={styles.summaryLineLabel}>Delivery</span>
                    <span className={styles.summaryLineValueNote}>Calculated at checkout</span>
                  </div>
                </div>

                <hr className="divider" />

                <div className={`${styles.summaryLine} ${styles.summaryTotal}`}>
                  <span>Estimated Total</span>
                  <span>R{total.toFixed(2)}</span>
                </div>

                <Link to="/checkout" className={`btn btn-primary btn-lg btn-full ${styles.checkoutBtn}`}>
                  Proceed to Checkout <ArrowRight />
                </Link>

                <div className={styles.trustRow}>
                  <span className={styles.trustItem}><LockIcon /> Secure payment</span>
                  <span className={styles.trustItem}><ShieldIcon /> Quality guaranteed</span>
                </div>

                {/* Payment methods note */}
                <p className={styles.paymentNote}>
                  We accept payment via <strong>EFT (bank transfer)</strong>. Upload your proof of payment at checkout.
                </p>
              </div>

              {/* WhatsApp help */}
              <a
                href="https://wa.me/27717669014?text=Hi%20NMG%20Zembeta%2C%20I%20need%20help%20with%20my%20order."
                target="_blank"
                rel="noopener noreferrer"
                className={`btn btn-outline btn-full`}
              >
                <WhatsAppIcon /> Need Help? Chat on WhatsApp
              </a>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Cart Item ──────────────────────────────────────────────── */
function CartItem({ item, onQtyChange, onRemove }) {
  return (
    <article className={styles.item}>
      {/* Image */}
      <div className={styles.itemImg}>
        {item.image
          ? <img src={item.image} alt={item.name} loading="lazy" width="96" height="96" />
          : <span className={styles.itemImgPlaceholder}>NMG</span>
        }
      </div>

      {/* Info */}
      <div className={styles.itemInfo}>
        <Link to={`/products/${item.id}`} className={styles.itemName}>{item.name}</Link>
        <span className={styles.itemUnitPrice}>R{Number(item.price).toFixed(2)} each</span>

        <div className={styles.itemActions}>
          {/* Quantity control */}
          <div className={styles.qtyControl} role="group" aria-label={`Quantity for ${item.name}`}>
            <button
              className={styles.qtyBtn}
              onClick={() => onQtyChange(item.id, item.quantity - 1)}
              aria-label="Decrease quantity"
              disabled={item.quantity <= 1}
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
            <TrashIcon /> Remove
          </button>
        </div>
      </div>

      {/* Line total */}
      <div className={styles.itemTotal}>
        R{(item.price * item.quantity).toFixed(2)}
      </div>
    </article>
  );
}

/* ── Empty Cart ─────────────────────────────────────────────── */
function EmptyCart() {
  return (
    <div className={styles.empty}>
      <div className={styles.emptyIcon}><EmptyBagIcon /></div>
      <h2 className={styles.emptyTitle}>Your cart is empty</h2>
      <p className={styles.emptyText}>
        Browse our products and add items to your cart to get started.
      </p>
      <Link to="/products" className={`btn btn-primary btn-lg`}>
        Browse Products <ArrowRight />
      </Link>
    </div>
  );
}

/* ── Skeleton ───────────────────────────────────────────────── */
function CartSkeleton() {
  return (
    <div className={styles.layout}>
      <div className={styles.itemsCol}>
        {[1, 2, 3].map(i => (
          <div key={i} className={styles.item} style={{ gap: 'var(--space-4)' }}>
            <div className={`skeleton`} style={{ width: 96, height: 96, borderRadius: 'var(--radius-lg)', flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div className={`skeleton`} style={{ height: 16, width: '60%' }} />
              <div className={`skeleton`} style={{ height: 12, width: '30%' }} />
              <div className={`skeleton`} style={{ height: 36, width: 120 }} />
            </div>
            <div className={`skeleton`} style={{ width: 80, height: 20 }} />
          </div>
        ))}
      </div>
      <div className={styles.summaryCol}>
        <div className={`skeleton`} style={{ height: 300, borderRadius: 'var(--radius-2xl)' }} />
      </div>
    </div>
  );
}

/* ── Icons ─────────────────────────────────────────────────── */
const ArrowRight   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const ArrowLeft    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
const TrashIcon    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const LockIcon     = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const ShieldIcon   = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const EmptyBagIcon = () => <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
const WhatsAppIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.99 2C6.469 2 2 6.47 2 11.99c0 1.96.53 3.793 1.444 5.372L2 22l4.748-1.424A9.952 9.952 0 0 0 11.99 22C17.51 22 22 17.53 22 12.01 22 6.49 17.51 2 11.99 2z"/></svg>;

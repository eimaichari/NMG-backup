import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import styles from './OrderSuccess.module.css';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Order Confirmed | NMG Zembeta';
    getDoc(doc(db, 'orders', id))
      .then(snap => { if (snap.exists()) setOrder({ id: snap.id, ...snap.data() }); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className={`page-wrapper ${styles.page}`}>
      <div className={`container ${styles.inner}`}>
        {/* Confetti ring */}
        <div className={styles.successRing} aria-hidden="true">
          <div className={styles.successIcon}><CheckIcon /></div>
        </div>

        <h1 className={styles.title}>Order Confirmed!</h1>
        <p className={styles.subtitle}>
          Thank you for your order. We've received your proof of payment and will
          verify it within <strong>24 hours</strong>. You'll receive a confirmation
          once your order is processed.
        </p>

        {/* Order ID */}
        <div className={styles.orderIdCard}>
          <span className={styles.orderIdLabel}>Order Reference</span>
          <span className={styles.orderIdValue}>{id.substring(0, 12).toUpperCase()}</span>
        </div>

        {/* Order summary */}
        {!loading && order && (
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>What You Ordered</h2>
            <ul className={styles.items} role="list">
              {order.items?.map((item, i) => (
                <li key={i} className={styles.item}>
                  <div className={styles.itemImg}>
                    {item.image
                      ? <img src={item.image} alt={item.name} loading="lazy" />
                      : <span className={styles.imgPlaceholder}>NMG</span>
                    }
                  </div>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemQty}>Qty: {item.quantity}</span>
                  </div>
                  <span className={styles.itemTotal}>
                    R{(item.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total Paid</span>
              <span className={styles.totalValue}>R{Number(order.totalAmount).toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* What happens next */}
        <div className={styles.stepsCard}>
          <h2 className={styles.stepsTitle}>What Happens Next</h2>
          <ol className={styles.steps} role="list">
            {[
              { icon: '🔍', label: 'Payment Verification', desc: 'We verify your EFT payment within 24 hours.' },
              { icon: '📦', label: 'Order Processing',     desc: 'Your items are prepared and packaged with care.' },
              { icon: '🚚', label: 'Delivery / Collection',desc: 'We arrange delivery or you collect from Randburg.' },
              { icon: '✅', label: 'Done!',                desc: 'Enjoy your NMG Zembeta products and services.' },
            ].map((s, i) => (
              <li key={i} className={styles.step}>
                <div className={styles.stepIcon}>{s.icon}</div>
                <div className={styles.stepBody}>
                  <span className={styles.stepLabel}>{s.label}</span>
                  <span className={styles.stepDesc}>{s.desc}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Link to="/products" className={`btn btn-primary btn-lg`}>
            Continue Shopping
          </Link>
          <Link to="/profile" className={`btn btn-outline btn-lg`}>
            View My Orders
          </Link>
          <a
            href={`https://wa.me/27739740331?text=Hi%20NMG%20Zembeta%2C%20my%20order%20reference%20is%20${id.substring(0,12).toUpperCase()}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn btn-outline btn-lg`}
          >
            <WhatsAppIcon /> Need Help?
          </a>
        </div>
      </div>
    </div>
  );
}

const CheckIcon    = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>;
const WhatsAppIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.99 2C6.469 2 2 6.47 2 11.99c0 1.96.53 3.793 1.444 5.372L2 22l4.748-1.424A9.952 9.952 0 0 0 11.99 22C17.51 22 22 17.53 22 12.01 22 6.49 17.51 2 11.99 2z"/></svg>;

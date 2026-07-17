import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import useScrollReveal from '../../hooks/useScrollReveal';
import styles from './ProductDetails.module.css';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user }   = useAuth();
  const { addItem }= useCart();
  const toast      = useToast();

  const [product,  setProduct]  = useState(null);
  const [related,  setRelated]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [imgIdx,   setImgIdx]   = useState(0);
  const [qty,      setQty]      = useState(1);
  const [adding,   setAdding]   = useState(false);
  const [lightbox, setLightbox] = useState(false);

  const pageRef = useScrollReveal();

  useEffect(() => {
    setLoading(true);
    setImgIdx(0);
    getDoc(doc(db, 'products', id)).then(snap => {
      if (!snap.exists()) { navigate('/products', { replace: true }); return; }
      const data = { id: snap.id, ...snap.data() };
      setProduct(data);
      document.title = `${data.name} | NMG Zembeta`;
      // Fetch related
      if (data.category) {
        getDocs(query(collection(db, 'products'), where('category', '==', data.category), where('available', '==', true), limit(4)))
          .then(s => setRelated(s.docs.filter(d => d.id !== id).slice(0, 3).map(d => ({ id: d.id, ...d.data() }))));
      }
    }).catch(() => navigate('/products', { replace: true }))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAdd = async () => {
    if (!user) { toast.info('Please sign in to add items to your cart.'); return; }
    setAdding(true);
    try {
      await addItem(product, qty);
      toast.success(`${product.name} added to cart!`);
    } catch {
      toast.error('Failed to add item. Please try again.');
    } finally {
      setTimeout(() => setAdding(false), 600);
    }
  };

  if (loading) return <ProductDetailSkeleton />;
  if (!product) return null;

  const imgs = product.image_urls || [];

  return (
    <div className={`page-wrapper ${styles.page}`} ref={pageRef}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/" className={styles.breadcrumbLink}>Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/products" className={styles.breadcrumbLink}>Shop</Link>
          <span aria-hidden="true">/</span>
          {product.category && (
            <>
              <Link to={`/products?cat=${product.category}`} className={styles.breadcrumbLink}>{product.category}</Link>
              <span aria-hidden="true">/</span>
            </>
          )}
          <span className={styles.breadcrumbCurrent} aria-current="page">{product.name}</span>
        </nav>

        {/* Main layout */}
        <div className={styles.layout}>
          {/* Gallery */}
          <div className={styles.gallery}>
            {/* Main image */}
            <div
              className={styles.mainImg}
              onClick={() => imgs.length > 0 && setLightbox(true)}
              role={imgs.length > 0 ? 'button' : undefined}
              tabIndex={imgs.length > 0 ? 0 : undefined}
              onKeyDown={e => e.key === 'Enter' && imgs.length > 0 && setLightbox(true)}
              aria-label={imgs.length > 0 ? `View ${product.name} image enlarged` : undefined}
            >
              {imgs.length > 0 ? (
                <img
                  src={imgs[imgIdx]}
                  alt={`${product.name} — image ${imgIdx + 1}`}
                  loading="eager"
                  width="600"
                  height="500"
                />
              ) : (
                <div className={styles.mainImgPlaceholder}><span>NMG</span></div>
              )}
              {imgs.length > 0 && (
                <div className={styles.zoomHint} aria-hidden="true"><ZoomIcon /> Click to zoom</div>
              )}
            </div>

            {/* Thumbnails */}
            {imgs.length > 1 && (
              <div className={styles.thumbs} role="list" aria-label="Product images">
                {imgs.map((img, i) => (
                  <button
                    key={i}
                    className={`${styles.thumb} ${i === imgIdx ? styles.thumbActive : ''}`}
                    onClick={() => setImgIdx(i)}
                    aria-label={`View image ${i + 1}`}
                    aria-pressed={i === imgIdx}
                    role="listitem"
                  >
                    <img src={img} alt={`${product.name} thumbnail ${i + 1}`} loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className={styles.info}>
            {product.category && (
              <Link to={`/products?cat=${product.category}`} className={styles.categoryLink}>
                {product.category}
              </Link>
            )}

            <h1 className={`${styles.productTitle} reveal`}>{product.name}</h1>

            <div className={`${styles.priceRow} reveal reveal-delay-1`}>
              <span className={styles.price}>R{Number(product.price_rands).toFixed(2)}</span>
              <span className="badge badge-teal">In Stock</span>
            </div>

            {product.description && (
              <p className={`${styles.description} reveal reveal-delay-2`}>{product.description}</p>
            )}

            <hr className={`divider reveal reveal-delay-2`} />

            {/* Qty + Add */}
            <div className={`${styles.buyBox} reveal reveal-delay-3`}>
              <div className={styles.qtySelector}>
                <label className={styles.qtyLabel} htmlFor="qty">Quantity</label>
                <div className={styles.qtyControl}>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    disabled={qty <= 1}
                  >−</button>
                  <input
                    id="qty"
                    type="number"
                    className={styles.qtyInput}
                    value={qty}
                    min={1}
                    onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                    aria-label="Quantity"
                  />
                  <button
                    className={styles.qtyBtn}
                    onClick={() => setQty(q => q + 1)}
                    aria-label="Increase quantity"
                  >+</button>
                </div>
              </div>
              <button
                className={`btn btn-primary btn-lg btn-full ${styles.addBtn}`}
                onClick={handleAdd}
                disabled={adding}
                aria-label={`Add ${qty} ${product.name} to cart`}
              >
                {adding
                  ? <><Spinner /> Adding…</>
                  : <><CartIcon /> Add to Cart — R{(Number(product.price_rands) * qty).toFixed(2)}</>
                }
              </button>
            </div>

            {/* Trust badges */}
            <div className={`${styles.trustBadges} reveal reveal-delay-4`}>
              <div className={styles.trustBadge}><SecureIcon /><span>Secure EFT Payment</span></div>
              <div className={styles.trustBadge}><ShieldIcon /><span>Quality Guaranteed</span></div>
              <div className={styles.trustBadge}><MessageIcon /><span>WhatsApp Support</span></div>
            </div>

            {/* WhatsApp enquiry */}
            <a
              href={`https://wa.me/27717669014?text=Hi%20NMG%20Zembeta%2C%20I%20would%20like%20to%20enquire%20about%20${encodeURIComponent(product.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn btn-outline btn-full reveal reveal-delay-4`}
              style={{ marginTop: 'var(--space-3)' }}
            >
              <WhatsAppIcon /> Enquire on WhatsApp
            </a>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className={styles.related} aria-labelledby="related-title">
            <h2 id="related-title" className={`section-title ${styles.relatedTitle} reveal`}>
              You Might Also Like
            </h2>
            <ul className={styles.relatedGrid} role="list">
              {related.map((p, i) => (
                <li key={p.id} className={`reveal reveal-delay-${i + 1}`}>
                  <RelatedCard product={p} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && imgs.length > 0 && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onClick={() => setLightbox(false)}
        >
          <button className={styles.lightboxClose} onClick={() => setLightbox(false)} aria-label="Close image viewer">×</button>
          <img
            src={imgs[imgIdx]}
            alt={`${product.name} — enlarged view`}
            className={styles.lightboxImg}
            onClick={e => e.stopPropagation()}
          />
          {imgs.length > 1 && (
            <>
              <button
                className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
                onClick={e => { e.stopPropagation(); setImgIdx(i => (i - 1 + imgs.length) % imgs.length); }}
                aria-label="Previous image"
              >‹</button>
              <button
                className={`${styles.lightboxNav} ${styles.lightboxNext}`}
                onClick={e => { e.stopPropagation(); setImgIdx(i => (i + 1) % imgs.length); }}
                aria-label="Next image"
              >›</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function RelatedCard({ product }) {
  const imgs = product.image_urls || [];
  return (
    <Link to={`/products/${product.id}`} className={styles.relatedCard}>
      <div className={styles.relatedImg}>
        {imgs[0]
          ? <img src={imgs[0]} alt={product.name} loading="lazy" />
          : <div className={styles.relatedImgPlaceholder}>NMG</div>
        }
      </div>
      <div className={styles.relatedInfo}>
        <span className={styles.relatedName}>{product.name}</span>
        <span className={styles.relatedPrice}>R{Number(product.price_rands).toFixed(2)}</span>
      </div>
    </Link>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className={`page-wrapper ${styles.page}`}>
      <div className={`container ${styles.layout}`}>
        <div className={styles.gallery}>
          <div className={`skeleton ${styles.mainImg}`} style={{ minHeight: 420 }} />
        </div>
        <div className={styles.info} style={{ display:'flex', flexDirection:'column', gap:'var(--space-5)' }}>
          <div className={`skeleton`} style={{ height:14, width:'30%' }} />
          <div className={`skeleton`} style={{ height:32, width:'80%' }} />
          <div className={`skeleton`} style={{ height:24, width:'25%' }} />
          <div className={`skeleton`} style={{ height:80 }} />
          <div className={`skeleton`} style={{ height:52 }} />
        </div>
      </div>
    </div>
  );
}

/* ── Icons ─────────────────────────────────────────────────── */
const CartIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
const SecureIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const ShieldIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const MessageIcon= () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const ZoomIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>;
const WhatsAppIcon=()=><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.99 2C6.469 2 2 6.47 2 11.99c0 1.96.53 3.793 1.444 5.372L2 22l4.748-1.424A9.952 9.952 0 0 0 11.99 22C17.51 22 17.51 22 22 12.01 22 6.49 17.51 2 11.99 2z"/></svg>;
const Spinner    = () => <span style={{ display:'inline-block', width:16, height:16, border:'2px solid rgba(13,17,23,0.3)', borderTopColor:'var(--ink)', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} aria-hidden="true" />;

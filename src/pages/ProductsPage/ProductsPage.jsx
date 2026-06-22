import { useState, useEffect, useCallback, useRef } from 'react';
import { collection, query, getDocs, where, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Link, useSearchParams } from 'react-router-dom';
import useScrollReveal from '../../hooks/useScrollReveal';
import styles from './ProductsPage.module.css';

export default function ProductsPage() {
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const search   = searchParams.get('q')   || '';
  const category = searchParams.get('cat') || 'All Products';

  const pageRef = useScrollReveal();

  useEffect(() => {
    document.title = 'Shop All Products | NMG Zembeta';
  }, []);

  // Fetch categories
  useEffect(() => {
    getDocs(collection(db, 'categories')).then(snap => {
      setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }).catch(() => {});
  }, []);

  // Fetch products
  useEffect(() => {
  setLoading(true);
  getDocs(collection(db, 'products'))
    .then(snap => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    })
    .catch(err => {
      console.error('Firestore error:', err.code, err.message);
    })
    .finally(() => setLoading(false));
  }, []);

  // Filter products client-side
  const filtered = products.filter(p => {
    const matchesCat  = category === 'All Products' || p.category === category;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchSearch;
  });

  const setSearch   = useCallback(val => {
    setSearchParams(prev => { const n = new URLSearchParams(prev); if (val) n.set('q', val); else n.delete('q'); return n; });
  }, [setSearchParams]);

  const setCategory = useCallback(val => {
  setSearchParams(prev => { const n = new URLSearchParams(prev); if (val !== 'All Products') n.set('cat', val); else n.delete('cat'); return n; });
  }, [setSearchParams]);

  return (
    <div className={`page-wrapper ${styles.page}`} ref={pageRef}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className="container">
          <div className={styles.pageHeaderContent}>
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <Link to="/" className={styles.breadcrumbLink}>Home</Link>
              <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
              <span className={styles.breadcrumbCurrent} aria-current="page">Shop</span>
            </nav>
            <h1 className={`section-title ${styles.pageTitle} reveal`}>
              Browse Our Products
            </h1>
            <p className={`body-lg reveal reveal-delay-1`}>
              Everyday essentials, business supplies and branded products delivered with care.
              NMG Zembeta delivers products and services designed to make life and business 
              easier.
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={`container ${styles.controlsInner}`}>
          <SearchBar value={search} onChange={setSearch} />
          <CategoryFilter categories={categories} active={category} onChange={setCategory} />
        </div>
      </div>

      {/* Results */}
      <div className="container">
        {/* Results count */}
        {!loading && (
          <div className={styles.resultsCount} role="status" aria-live="polite">
            {filtered.length === 0
              ? 'No products found'
              : `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found${search ? ` for "${search}"` : ''}`
            }
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <ProductsGrid>
            {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
          </ProductsGrid>
        ) : filtered.length === 0 ? (
          <EmptyState search={search} onClear={() => { setSearch(''); setCategory('All Products'); }} />
        ) : (
          <ProductsGrid>
            {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </ProductsGrid>
        )}
      </div>
    </div>
  );
}

/* ── Search Bar ─────────────────────────────────────────────── */
function SearchBar({ value, onChange }) {
  const inputRef = useRef(null);

  return (
    <div className={styles.searchWrap} role="search">
      <label htmlFor="product-search" className="sr-only">Search products</label>
      <span className={styles.searchIcon} aria-hidden="true"><SearchIcon /></span>
      <input
        ref={inputRef}
        id="product-search"
        type="search"
        className={`form-input ${styles.searchInput}`}
        placeholder="Search products..."
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label="Search products"
      />
      {value && (
        <button
          className={styles.searchClear}
          onClick={() => { onChange(''); inputRef.current?.focus(); }}
          aria-label="Clear search"
        >×</button>
      )}
    </div>
  );
}

/* ── Category Filter ────────────────────────────────────────── */
function CategoryFilter({ categories, active, onChange }) {
  const allCats = [{ id: 'all', name: 'All Products' }, ...categories];

  return (
    <div className={styles.filterWrap}>
      <span className={styles.filterLabel} id="category-label">Category:</span>
      <div className={styles.filterChips} role="group" aria-labelledby="category-label">
        {allCats.map(c => (
          <button
            key={c.id}
            className={`${styles.chip} ${active === c.name ? styles.chipActive : ''}`}
            onClick={() => onChange(c.name)}
            aria-pressed={active === c.name}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Products Grid wrapper ──────────────────────────────────── */
function ProductsGrid({ children }) {
  return <ul className={styles.grid} role="list">{children}</ul>;
}

/* ── Product Card ───────────────────────────────────────────── */
function ProductCard({ product, index }) {
  const { addItem } = useCart();
  const { user }    = useAuth();
  const toast       = useToast();
  const [adding, setAdding]   = useState(false);
  const [imgIdx, setImgIdx]   = useState(0);
  const imgs = product.image_urls || [];

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user) { toast.info('Please sign in to add items to your cart.'); return; }
    setAdding(true);
    try {
      await addItem(product);
      toast.success(`${product.name} added to cart!`);
    } catch {
      toast.error('Failed to add item. Please try again.');
    } finally {
      setTimeout(() => setAdding(false), 600);
    }
  };

  return (
    <li className={`reveal ${index < 4 ? `reveal-delay-${index + 1}` : ''}`}>
      <article className={styles.card}>
        {/* Image */}
        <Link to={`/products/${product.id}`} className={styles.cardImgLink} tabIndex={-1} aria-hidden="true">
          <div className={styles.cardImg}>
            {imgs.length > 0 ? (
              <img
                src={imgs[imgIdx]}
                alt={product.name}
                loading="lazy"
                width="400"
                height="300"
              />
            ) : (
              <div className={styles.cardImgPlaceholder}><span>NMG</span></div>
            )}
            {imgs.length > 1 && (
              <div className={styles.imgThumbs} aria-hidden="true">
                {imgs.map((img, i) => (
                  <button
                    key={i}
                    className={`${styles.imgThumb} ${i === imgIdx ? styles.imgThumbActive : ''}`}
                    onMouseEnter={() => setImgIdx(i)}
                    onClick={e => { e.preventDefault(); setImgIdx(i); }}
                    tabIndex={-1}
                    aria-label={`Image ${i + 1}`}
                  >
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            )}
            <div className={styles.cardBadges}>
              <span className="badge badge-teal">Available</span>
              {product.category && <span className="badge badge-muted">{product.category}</span>}
            </div>
          </div>
        </Link>

        {/* Info */}
        <div className={styles.cardBody}>
          <Link to={`/products/${product.id}`} className={styles.cardTitleLink}>
            <h2 className={styles.cardTitle}>{product.name}</h2>
          </Link>
          {product.description && (
            <p className={styles.cardDesc}>
              {product.description.length > 90
                ? product.description.substring(0, 90) + '…'
                : product.description}
            </p>
          )}
        </div>

        <div className={styles.cardFooter}>
          <span className={styles.cardPrice}>R{Number(product.price_rands).toFixed(2)}</span>
          <div className={styles.cardActions}>
            <Link to={`/products/${product.id}`} className={`btn btn-outline btn-sm`} aria-label={`View ${product.name} details`}>
              View
            </Link>
            <button
              className={`btn btn-primary btn-sm ${adding ? styles.btnAdding : ''}`}
              onClick={handleAdd}
              disabled={adding}
              aria-label={`Add ${product.name} to cart`}
            >
              {adding ? <Spinner /> : <><CartIcon /> Add</>}
            </button>
          </div>
        </div>
      </article>
    </li>
  );
}

/* ── Product Skeleton ───────────────────────────────────────── */
function ProductSkeleton() {
  return (
    <li className={styles.skeletonCard}>
      <div className={`skeleton ${styles.skeletonImg}`} />
      <div className={styles.skeletonBody}>
        <div className={`skeleton ${styles.skeletonLine}`} style={{ width:'70%' }} />
        <div className={`skeleton ${styles.skeletonLine}`} style={{ width:'90%', height:12 }} />
        <div className={`skeleton ${styles.skeletonLine}`} style={{ width:'50%', height:12 }} />
      </div>
    </li>
  );
}

/* ── Empty State ────────────────────────────────────────────── */
function EmptyState({ search, onClear }) {
  return (
    <div className={styles.empty}>
      <div className={styles.emptyIcon}><SearchEmptyIcon /></div>
      <h2 className={styles.emptyTitle}>
        {search ? `No results for "${search}"` : 'No products found'}
      </h2>
      <p className={styles.emptyText}>
        {search
          ? 'Try a different search term or browse all categories.'
          : 'No products are available in this category right now.'}
      </p>
      <button className={`btn btn-primary`} onClick={onClear}>
        Browse All Products
      </button>
    </div>
  );
}

/* ── Icons ─────────────────────────────────────────────────── */
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const CartIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
);
const SearchEmptyIcon = () => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
);
const Spinner = () => (
  <span className={styles.spinnerIcon} aria-hidden="true" />
);

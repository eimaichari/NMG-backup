import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp, where
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../../firebase/config';
import { useToast } from '../../../context/ToastContext';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const toast = useToast();

  const [products,    setProducts]    = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [stats,       setStats]       = useState({ products: 0, orders: 0, pending: 0, revenue: 0 });
  const [loading,     setLoading]     = useState(true);
  const [showModal,   setShowModal]   = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => { document.title = 'Admin Dashboard | NMG Zembeta'; }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [prodSnap, catSnap, orderSnap] = await Promise.all([
        getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc'))),
        getDocs(collection(db, 'categories')),
        getDocs(collection(db, 'orders')),
      ]);

      const prods  = prodSnap.docs.map(d  => ({ id: d.id,  ...d.data() }));
      const cats   = catSnap.docs.map(d   => ({ id: d.id,  ...d.data() }));
      const orders = orderSnap.docs.map(d => ({ id: d.id,  ...d.data() }));

      setProducts(prods);
      setCategories(cats);

      const pending = orders.filter(o => o.status === 'pending').length;
      const revenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.totalAmount || 0), 0);
      setStats({ products: prods.length, orders: orders.length, pending, revenue });
    } catch (err) {
      toast.error('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    try {
      await deleteDoc(doc(db, 'products', product.id));
      toast.success(`"${product.name}" deleted.`);
      fetchAll();
    } catch {
      toast.error('Failed to delete product.');
    }
  };

  const handleToggleAvailable = async (product) => {
    try {
      await updateDoc(doc(db, 'products', product.id), { available: !product.available, updatedAt: serverTimestamp() });
      toast.success(`"${product.name}" marked as ${!product.available ? 'available' : 'unavailable'}.`);
      fetchAll();
    } catch {
      toast.error('Failed to update product.');
    }
  };

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Dashboard</h1>
            <p className={styles.subtitle}>Manage your NMG Zembeta products and orders</p>
          </div>
          <div className={styles.headerActions}>
            <Link to="/admin/orders" className={`btn btn-outline`}>
              <OrdersIcon /> View Orders
            </Link>
            <button className={`btn btn-primary`} onClick={() => { setEditProduct(null); setShowModal(true); }}>
              <PlusIcon /> Add Product
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          {[
            { label: 'Total Products', value: stats.products, icon: <BoxIcon />,     color: 'teal' },
            { label: 'Total Orders',   value: stats.orders,   icon: <OrdersIcon />,  color: 'gold' },
            { label: 'Pending Orders', value: stats.pending,  icon: <ClockIcon />,   color: 'warning' },
            { label: 'Total Revenue',  value: `R${stats.revenue.toFixed(0)}`, icon: <MoneyIcon />, color: 'success' },
          ].map((s, i) => (
            <div key={i} className={`${styles.statCard} ${styles[`statCard_${s.color}`]}`}>
              <div className={styles.statIcon}>{s.icon}</div>
              <div className={styles.statBody}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Products table */}
        <div className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <h2 className={styles.tableTitle}>Products</h2>
            <span className={styles.tableCount}>{products.length} total</span>
          </div>

          {loading ? (
            <TableSkeleton />
          ) : products.length === 0 ? (
            <EmptyProducts onAdd={() => setShowModal(true)} />
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Product</th>
                    <th className={styles.th}>Category</th>
                    <th className={styles.th}>Price</th>
                    <th className={styles.th}>Status</th>
                    <th className={styles.th} style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} className={styles.tr}>
                      <td className={styles.td}>
                        <div className={styles.productCell}>
                          <div className={styles.productThumb}>
                            {product.image_urls?.[0]
                              ? <img src={product.image_urls[0]} alt={product.name} loading="lazy" />
                              : <span className={styles.thumbPlaceholder}>NMG</span>
                            }
                          </div>
                          <div className={styles.productCellInfo}>
                            <span className={styles.productCellName}>{product.name}</span>
                            <span className={styles.productCellDesc}>
                              {product.description?.substring(0, 60)}{product.description?.length > 60 ? '…' : ''}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className={styles.td}>
                        <span className="badge badge-muted">{product.category || '—'}</span>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.priceCell}>R{Number(product.price_rands).toFixed(2)}</span>
                      </td>
                      <td className={styles.td}>
                        <button
                          className={`badge ${product.available ? 'badge-success' : 'badge-error'}`}
                          onClick={() => handleToggleAvailable(product)}
                          aria-label={`Toggle availability for ${product.name}`}
                          style={{ cursor: 'pointer' }}
                        >
                          {product.available ? 'Available' : 'Unavailable'}
                        </button>
                      </td>
                      <td className={styles.td}>
                        <div className={styles.rowActions}>
                          <button
                            className={`btn btn-ghost btn-sm`}
                            onClick={() => { setEditProduct(product); setShowModal(true); }}
                            aria-label={`Edit ${product.name}`}
                          >
                            <EditIcon /> Edit
                          </button>
                          <button
                            className={`btn btn-danger btn-sm`}
                            onClick={() => handleDelete(product)}
                            aria-label={`Delete ${product.name}`}
                          >
                            <TrashIcon /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Categories section */}
        <div className={styles.tableSection} style={{ marginTop: 'var(--space-8)' }}>
          <div className={styles.tableHeader}>
            <h2 className={styles.tableTitle}>Categories</h2>
            <span className={styles.tableCount}>{categories.length} total</span>
          </div>
          <CategoriesPanel categories={categories} onRefresh={fetchAll} />
        </div>

      </div>

      {/* Product modal */}
      {showModal && (
        <ProductModal
          product={editProduct}
          categories={categories}
          onClose={() => { setShowModal(false); setEditProduct(null); }}
          onSave={() => { setShowModal(false); setEditProduct(null); fetchAll(); }}
        />
      )}
    </div>
  );
}

/* ── Product Modal ──────────────────────────────────────────── */
function ProductModal({ product, categories, onClose, onSave }) {
  const toast = useToast();
  const isEdit = !!product;

  const [form, setForm] = useState({
    name:        product?.name        || '',
    description: product?.description || '',
    price_rands: product?.price_rands || '',
    category:    product?.category    || '',
    available:   product?.available   ?? true,
  });
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const update = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(p => ({ ...p, [field]: value }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim())   errs.name        = 'Product name is required.';
    if (!form.price_rands || isNaN(form.price_rands) || Number(form.price_rands) <= 0)
                              errs.price_rands = 'Enter a valid price.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      let image_urls = product?.image_urls || [];

      if (images.length > 0) {
        const uploads = await Promise.all(images.map(async (file) => {
          const storRef = ref(storage, `products_images/${Date.now()}_${file.name}`);
          await uploadBytes(storRef, file);
          return getDownloadURL(storRef);
        }));
        image_urls = [...image_urls, ...uploads];
      }

      const data = {
        name:        form.name.trim(),
        description: form.description.trim(),
        price_rands: Number(form.price_rands),
        category:    form.category.trim(),
        available:   form.available,
        image_urls,
        updatedAt:   serverTimestamp(),
      };

      if (isEdit) {
        await updateDoc(doc(db, 'products', product.id), data);
        toast.success('Product updated.');
      } else {
        await addDoc(collection(db, 'products'), { ...data, createdAt: serverTimestamp() });
        toast.success('Product added.');
      }
      onSave();
    } catch (err) {
      toast.error('Failed to save product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div className={styles.modalBackdrop} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label={isEdit ? 'Edit product' : 'Add product'}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
          <button className={styles.modalClose} onClick={onClose} aria-label="Close modal">×</button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalGrid}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label" htmlFor="prod-name">Product Name *</label>
              <input id="prod-name" className={`form-input ${errors.name ? 'error' : ''}`} type="text" value={form.name} onChange={update('name')} placeholder="e.g. Beef Pie (6 pack)" />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="prod-price">Price (ZAR) *</label>
              <input id="prod-price" className={`form-input ${errors.price_rands ? 'error' : ''}`} type="number" min="0" step="0.01" value={form.price_rands} onChange={update('price_rands')} placeholder="0.00" />
              {errors.price_rands && <span className="form-error">{errors.price_rands}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="prod-cat">Category</label>
              <input id="prod-cat" className="form-input" type="text" value={form.category} onChange={update('category')} placeholder="e.g. Catering" list="categories-list" />
              <datalist id="categories-list">
                {categories.map(c => <option key={c.id} value={c.name} />)}
              </datalist>
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label" htmlFor="prod-desc">Description</label>
              <textarea id="prod-desc" className="form-input" value={form.description} onChange={update('description')} rows={3} placeholder="Describe the product..." />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label" htmlFor="prod-images">
                {isEdit ? 'Add More Images' : 'Product Images'}
              </label>
              <input
                id="prod-images"
                type="file"
                accept="image/*"
                multiple
                className="form-input"
                style={{ paddingTop: 'var(--space-2)' }}
                onChange={e => setImages(Array.from(e.target.files))}
              />
              {images.length > 0 && (
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--teal)' }}>
                  {images.length} image{images.length !== 1 ? 's' : ''} selected
                </span>
              )}
              {isEdit && product.image_urls?.length > 0 && (
                <div className={styles.existingImages}>
                  {product.image_urls.map((url, i) => (
                    <img key={i} src={url} alt={`Image ${i+1}`} className={styles.existingThumb} />
                  ))}
                </div>
              )}
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label className={styles.toggleLabel}>
                <input type="checkbox" checked={form.available} onChange={update('available')} className={styles.toggleInput} />
                <span className={`${styles.toggleTrack} ${form.available ? styles.toggleTrackOn : ''}`}>
                  <span className={styles.toggleThumb} />
                </span>
                <span className={styles.toggleText}>
                  {form.available ? 'Product is available for purchase' : 'Product is hidden from shop'}
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={`btn btn-outline`} onClick={onClose} disabled={saving}>Cancel</button>
          <button className={`btn btn-primary`} onClick={handleSave} disabled={saving}>
            {saving ? <><Spinner /> Saving…</> : isEdit ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Categories Panel ───────────────────────────────────────── */
function CategoriesPanel({ categories, onRefresh }) {
  const toast = useToast();
  const [newCat, setNewCat] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    const name = newCat.trim();
    if (!name) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'categories'), { name, createdAt: serverTimestamp() });
      toast.success(`Category "${name}" added.`);
      setNewCat('');
      onRefresh();
    } catch {
      toast.error('Failed to add category.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}"? Products using this category will not be deleted.`)) return;
    try {
      await deleteDoc(doc(db, 'categories', cat.id));
      toast.success(`Category "${cat.name}" deleted.`);
      onRefresh();
    } catch {
      toast.error('Failed to delete category.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
        <input
          className="form-input"
          style={{ maxWidth: 280 }}
          type="text"
          placeholder="New category name..."
          value={newCat}
          onChange={e => setNewCat(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <button className="btn btn-primary btn-sm" onClick={handleAdd} disabled={saving || !newCat.trim()}>
          {saving ? <Spinner /> : <><PlusIcon /> Add</>}
        </button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        {categories.map(cat => (
          <div
            key={cat.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-full)',
              padding: '4px 12px 4px 14px',
            }}
          >
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text)' }}>
              {cat.name}
            </span>
            <button
              onClick={() => handleDelete(cat)}
              aria-label={`Delete ${cat.name}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                color: 'var(--text-subtle)',
                cursor: 'pointer',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--error)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-subtle)'}
            >
              <TrashIcon />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Table Skeleton ─────────────────────────────────────────── */
function TableSkeleton() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-2)', marginTop:'var(--space-4)' }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} className={`skeleton`} style={{ height: 64, borderRadius: 'var(--radius-lg)' }} />
      ))}
    </div>
  );
}

/* ── Empty Products ─────────────────────────────────────────── */
function EmptyProducts({ onAdd }) {
  return (
    <div className={styles.emptyTable}>
      <BoxIcon />
      <h3>No products yet</h3>
      <p>Add your first product to start selling.</p>
      <button className={`btn btn-primary`} onClick={onAdd}><PlusIcon /> Add First Product</button>
    </div>
  );
}

/* ── Icons ─────────────────────────────────────────────────── */
const PlusIcon   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const EditIcon   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const TrashIcon  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const BoxIcon    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const OrdersIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>;
const ClockIcon  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const MoneyIcon  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const Spinner    = () => <span style={{ display:'inline-block', width:14, height:14, border:'2px solid rgba(13,17,23,0.3)', borderTopColor:'var(--ink)', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} aria-hidden="true" />;

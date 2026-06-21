import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import styles from './CheckoutPage.module.css';

const BANK = {
  name:    'NMG Zembeta Pty Ltd',
  bank:    'First National Bank (FNB)',
  account: '62xxxxxxxxxx',
  branch:  '250655',
  type:    'Cheque / Current Account',
  ref:     'Your Name + Order Number',
};

export default function CheckoutPage() {
  const { user, userData } = useAuth();
  const { items, total, clearCart } = useCart();
  const toast    = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: userData?.fullName || user?.displayName || '',
    email:    user?.email || '',
    phone:    '',
    address:  '',
    notes:    '',
  });
  const [proof,      setProof]      = useState(null);
  const [proofError, setProofError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [step,       setStep]       = useState(1); // 1=details, 2=payment

  const update = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setProofError('File must be smaller than 5MB.');
      setProof(null);
      return;
    }
    if (!['image/jpeg','image/png','image/webp','application/pdf'].includes(file.type)) {
      setProofError('Please upload a JPG, PNG, WebP, or PDF file.');
      setProof(null);
      return;
    }
    setProofError('');
    setProof(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChange({ target: { files: [file] } });
  };

  const handleSubmit = async () => {
    if (!proof) { setProofError('Please upload your proof of payment to continue.'); return; }
    if (!form.fullName || !form.email || !form.phone) {
      toast.error('Please fill in all required fields.');
      setStep(1);
      return;
    }

    setSubmitting(true);
    try {
      // Upload proof
      const ext     = proof.name.split('.').pop();
      const storRef = ref(storage, `proofs/${user.uid}/${Date.now()}.${ext}`);
      await uploadBytes(storRef, proof);
      const proofURL = await getDownloadURL(storRef);

      // Create order
      const orderData = {
        userId:         user.uid,
        userName:       form.fullName,
        userEmail:      form.email,
        userPhone:      form.phone,
        userAddress:    form.address,
        notes:          form.notes,
        items:          items.map(i => ({ productId:i.id, name:i.name, price:i.price, quantity:i.quantity, image:i.image })),
        totalAmount:    total,
        proofOfPayment: proofURL,
        status:         'pending',
        createdAt:      serverTimestamp(),
        orderDate:      serverTimestamp(),
      };

      const orderRef = await addDoc(collection(db, 'orders'), orderData);
      const orderId  = orderRef.id;

      // Save to user's orders subcollection
      await setDoc(doc(db, 'users', user.uid, 'orders', orderId), { ...orderData, orderId });

      // Clear cart
      await clearCart();

      toast.success('Order placed successfully!');
      navigate(`/order-success/${orderId}`);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again or contact us on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className={`page-wrapper ${styles.empty}`}>
        <div className={styles.emptyContent}>
          <h1 className={styles.emptyTitle}>Your cart is empty</h1>
          <p className={styles.emptyText}>Add some products before checking out.</p>
          <a href="/products" className={`btn btn-primary btn-lg`}>Browse Products</a>
        </div>
      </div>
    );
  }

  return (
    <div className={`page-wrapper ${styles.page}`}>
      <div className="container">
        {/* Header */}
        <div className={styles.pageHeader}>
          <h1 className={`section-title ${styles.pageTitle}`}>Checkout</h1>
          <ProgressIndicator step={step} />
        </div>

        <div className={styles.layout}>
          {/* Left column — form */}
          <div className={styles.formCol}>
            {/* Step 1: Details */}
            <div className={`${styles.formSection} ${step !== 1 ? styles.formSectionCompleted : ''}`}>
              <div className={styles.stepHeader}>
                <div className={`${styles.stepNumber} ${step > 1 ? styles.stepDone : styles.stepActive}`}>
                  {step > 1 ? <CheckIcon /> : '1'}
                </div>
                <h2 className={styles.stepTitle}>Your Details</h2>
                {step > 1 && (
                  <button className={styles.editBtn} onClick={() => setStep(1)}>Edit</button>
                )}
              </div>

              {step === 1 && (
                <div className={styles.formGrid}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="fullName">Full Name *</label>
                    <input id="fullName" className="form-input" type="text" value={form.fullName} onChange={update('fullName')} required placeholder="Your full name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Email *</label>
                    <input id="email" className="form-input" type="email" value={form.email} onChange={update('email')} required placeholder="your@email.com" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">Phone *</label>
                    <input id="phone" className="form-input" type="tel" value={form.phone} onChange={update('phone')} required placeholder="+27 ..." />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label" htmlFor="address">Delivery Address</label>
                    <input id="address" className="form-input" type="text" value={form.address} onChange={update('address')} placeholder="Optional — for delivery orders" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label" htmlFor="notes">Order Notes</label>
                    <textarea id="notes" className="form-input" value={form.notes} onChange={update('notes')} placeholder="Any special instructions..." rows={3} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <button
                      className={`btn btn-primary btn-lg btn-full`}
                      onClick={() => {
                        if (!form.fullName || !form.email || !form.phone) { toast.error('Please fill in all required fields.'); return; }
                        setStep(2);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      Continue to Payment <ArrowRight />
                    </button>
                  </div>
                </div>
              )}

              {step > 1 && (
                <div className={styles.completedSummary}>
                  <span>{form.fullName}</span>
                  <span>{form.email}</span>
                  <span>{form.phone}</span>
                </div>
              )}
            </div>

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className={styles.formSection}>
                <div className={styles.stepHeader}>
                  <div className={`${styles.stepNumber} ${styles.stepActive}`}>2</div>
                  <h2 className={styles.stepTitle}>Payment via EFT</h2>
                </div>

                {/* Bank details card */}
                <div className={styles.bankCard}>
                  <div className={styles.bankCardHeader}>
                    <BankIcon />
                    <span className={styles.bankCardTitle}>Bank Transfer (EFT)</span>
                    <span className="badge badge-teal">Secure</span>
                  </div>
                  <div className={styles.bankDetails}>
                    {Object.entries({
                      'Account Name': BANK.name,
                      'Bank':         BANK.bank,
                      'Account No.':  BANK.account,
                      'Branch Code':  BANK.branch,
                      'Account Type': BANK.type,
                      'Reference':    BANK.ref,
                    }).map(([label, value]) => (
                      <div key={label} className={styles.bankRow}>
                        <span className={styles.bankLabel}>{label}</span>
                        <span className={styles.bankValue}>{value}</span>
                      </div>
                    ))}
                  </div>
                  <p className={styles.bankNote}>
                    Use your name + order number as your payment reference. Once you've transferred, upload your proof of payment below.
                  </p>
                </div>

                {/* Upload zone */}
                <div className="form-group">
                  <label className="form-label">Proof of Payment *</label>
                  <div
                    className={`${styles.uploadZone} ${proof ? styles.uploadZoneHasFile : ''} ${proofError ? styles.uploadZoneError : ''}`}
                    onDrop={handleDrop}
                    onDragOver={e => e.preventDefault()}
                    onClick={() => document.getElementById('proof-upload').click()}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && document.getElementById('proof-upload').click()}
                    aria-label="Upload proof of payment"
                  >
                    <input
                      id="proof-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      onChange={handleFileChange}
                      className={styles.uploadInput}
                      aria-describedby="proof-error"
                    />
                    {proof ? (
                      <div className={styles.uploadSuccess}>
                        <CheckCircleIcon />
                        <span className={styles.uploadFileName}>{proof.name}</span>
                        <span className={styles.uploadFileSize}>({(proof.size / 1024).toFixed(0)} KB)</span>
                        <button
                          className={styles.uploadRemove}
                          onClick={e => { e.stopPropagation(); setProof(null); }}
                          aria-label="Remove file"
                        >Change file</button>
                      </div>
                    ) : (
                      <div className={styles.uploadPrompt}>
                        <UploadIcon />
                        <span className={styles.uploadTitle}>Drop your screenshot here</span>
                        <span className={styles.uploadSubtitle}>or click to browse — JPG, PNG, PDF up to 5MB</span>
                      </div>
                    )}
                  </div>
                  {proofError && (
                    <span id="proof-error" className="form-error" role="alert">{proofError}</span>
                  )}
                </div>

                <button
                  className={`btn btn-primary btn-lg btn-full`}
                  onClick={handleSubmit}
                  disabled={submitting}
                  aria-label="Place your order"
                >
                  {submitting
                    ? <><Spinner /> Placing Order…</>
                    : <>Place Order — R{total.toFixed(2)}</>
                  }
                </button>
                <p className={styles.orderNote}>
                  By placing your order, you agree to our terms. Your order will be confirmed once payment is verified.
                </p>
              </div>
            )}
          </div>

          {/* Right column — order summary */}
          <aside className={styles.summaryCol} aria-label="Order summary">
            <div className={styles.summaryCard}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>
              <ul className={styles.summaryItems} role="list">
                {items.map(item => (
                  <li key={item.id} className={styles.summaryItem}>
                    <div className={styles.summaryItemImg}>
                      {item.image
                        ? <img src={item.image} alt={item.name} loading="lazy" />
                        : <span className={styles.summaryImgPlaceholder}>NMG</span>
                      }
                      <span className={styles.summaryQtyBadge}>{item.quantity}</span>
                    </div>
                    <div className={styles.summaryItemInfo}>
                      <span className={styles.summaryItemName}>{item.name}</span>
                      <span className={styles.summaryItemUnit}>R{Number(item.price).toFixed(2)} each</span>
                    </div>
                    <span className={styles.summaryItemTotal}>R{(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <hr className="divider" />
              <div className={styles.summaryTotals}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryRowLabel}>Subtotal</span>
                  <span className={styles.summaryRowValue}>R{total.toFixed(2)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryRowLabel}>Delivery</span>
                  <span className={styles.summaryRowValueAlt}>To be confirmed</span>
                </div>
                <hr className="divider" style={{ margin: 'var(--space-3) 0' }} />
                <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                  <span>Total</span>
                  <span>R{total.toFixed(2)}</span>
                </div>
              </div>
              <div className={styles.summaryBadges}>
                <div className={styles.summaryBadge}><LockIcon /><span>Secure payment</span></div>
                <div className={styles.summaryBadge}><ShieldIcon /><span>Quality guaranteed</span></div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ProgressIndicator({ step }) {
  return (
    <div className={styles.progress} aria-label="Checkout progress">
      <div className={`${styles.progressStep} ${step >= 1 ? styles.progressStepActive : ''}`}>
        <span className={styles.progressDot}>{step > 1 ? '✓' : '1'}</span>
        <span className={styles.progressLabel}>Details</span>
      </div>
      <div className={`${styles.progressLine} ${step >= 2 ? styles.progressLineActive : ''}`} aria-hidden="true" />
      <div className={`${styles.progressStep} ${step >= 2 ? styles.progressStepActive : ''}`}>
        <span className={styles.progressDot}>2</span>
        <span className={styles.progressLabel}>Payment</span>
      </div>
      <div className={`${styles.progressLine}`} aria-hidden="true" />
      <div className={styles.progressStep}>
        <span className={styles.progressDot}>3</span>
        <span className={styles.progressLabel}>Confirm</span>
      </div>
    </div>
  );
}

/* ── Icons ─────────────────────────────────────────────────── */
const CheckIcon      = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>;
const CheckCircleIcon= () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const ArrowRight     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const BankIcon       = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>;
const UploadIcon     = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>;
const LockIcon       = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const ShieldIcon     = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const Spinner        = () => <span style={{ display:'inline-block', width:16, height:16, border:'2px solid rgba(13,17,23,0.3)', borderTopColor:'var(--ink)', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} aria-hidden="true" />;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import styles from '../SignIn/SignInPage.module.css';
import formStyles from './SignUpPage.module.css';

export default function SignUpPage() {
  const { signUp, signInWithGoogle } = useAuth();
  const toast    = useToast();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ fullName: '', email: '', password: '', confirmPassword: '', agreedToTerms: false });
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors]   = useState({});

  const update = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(p => ({ ...p, [field]: value }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim())                         errs.fullName        = 'Full name is required.';
    if (!form.email)                                   errs.email           = 'Email is required.';
    if (form.password.length < 6)                      errs.password        = 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword)        errs.confirmPassword = 'Passwords do not match.';
    if (!form.agreedToTerms)                           errs.agreedToTerms   = 'Please agree to the terms to continue.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const firstName = form.fullName.trim().split(' ')[0];
      await signUp({ fullName: form.fullName.trim(), email: form.email, password: form.password });
      toast.success(`Account created! Welcome to NMG Zembeta, ${firstName}! 🎉`);
      navigate('/');
    } catch (err) {
        const msg = err.code === 'auth/email-already-in-use'
          ? 'An account with this email already exists.'
          : err.code === 'auth/invalid-email'
          ? 'Please enter a valid email address.'
          : 'Registration failed. Please try again.';
        toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGLoading(true);
    try {
      const user = await signInWithGoogle();
      const name = user.displayName?.split(' ')[0] || 'there';
      toast.success(`Welcome to NMG Zembeta, ${name}! 🎉`);
      navigate('/');
    } catch {
        toast.error('Google sign in failed. Please try again.');
    } finally {
      setGLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Brand panel */}
      <div className={styles.brand} aria-hidden="true">
        <div className={styles.brandInner}>
          <div className={styles.brandLogo}>
            <span className={styles.brandLogoMark}>NMG</span>
            <span className={styles.brandLogoDivider} />
            <span className={styles.brandLogoSub}>Zembeta</span>
          </div>
          <p className={styles.brandTagline}>Join thousands of satisfied customers across Gauteng.</p>
          <div className={styles.brandFeatures}>
            {['Fast order processing', 'Secure EFT payments', 'WhatsApp support', 'Quality guaranteed'].map(f => (
              <div key={f} className={styles.brandFeature}>
                <span className={styles.brandFeatureDot} />
                {f}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.brandOrb1} />
        <div className={styles.brandOrb2} />
      </div>

      {/* Form panel */}
      <div className={styles.formPanel}>
        <div className={styles.formWrap}>
          <div className={styles.formHeader}>
            <h1 className={styles.formTitle}>Create account</h1>
            <p className={styles.formSubtitle}>Start shopping with NMG Zembeta today</p>
          </div>

          <button className={styles.googleBtn} onClick={handleGoogle} disabled={gLoading} type="button">
            {gLoading ? <Spinner /> : <GoogleIcon />}
            Continue with Google
          </button>

          <div className={styles.divider}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerText}>or create with email</span>
            <span className={styles.dividerLine} />
          </div>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                className={`form-input ${errors.fullName ? 'error' : ''}`}
                value={form.fullName}
                onChange={update('fullName')}
                placeholder="Your full name"
                autoComplete="name"
                required
              />
              {errors.fullName && <span className="form-error" role="alert">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                value={form.email}
                onChange={update('email')}
                placeholder="your@email.com"
                autoComplete="email"
                required
              />
              {errors.email && <span className="form-error" role="alert">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className={styles.passwordWrap}>
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  value={form.password}
                  onChange={update('password')}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  required
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(v => !v)} aria-label={showPass ? 'Hide password' : 'Show password'}>
                  {showPass ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {errors.password && <span className="form-error" role="alert">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type={showPass ? 'text' : 'password'}
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                value={form.confirmPassword}
                onChange={update('confirmPassword')}
                placeholder="Repeat your password"
                autoComplete="new-password"
                required
              />
              {errors.confirmPassword && <span className="form-error" role="alert">{errors.confirmPassword}</span>}
            </div>

            {/* Terms checkbox */}
            <div className={formStyles.checkboxGroup}>
              <label className={formStyles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={formStyles.checkbox}
                  checked={form.agreedToTerms}
                  onChange={update('agreedToTerms')}
                  aria-describedby={errors.agreedToTerms ? 'terms-error' : undefined}
                />
                <span className={formStyles.checkboxCustom} aria-hidden="true">
                  {form.agreedToTerms && <CheckIcon />}
                </span>
                <span className={formStyles.checkboxText}>
                  I agree to the{' '}
                  <Link to="/contact" className={styles.switchLink}>Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/contact" className={styles.switchLink}>Privacy Policy</Link>
                </span>
              </label>
              {errors.agreedToTerms && <span id="terms-error" className="form-error" role="alert">{errors.agreedToTerms}</span>}
            </div>

            <button type="submit" className={`btn btn-primary btn-lg btn-full`} disabled={loading}>
              {loading ? <><Spinner /> Creating account…</> : 'Create Account'}
            </button>
          </form>

          <p className={styles.switchText}>
            Already have an account?{' '}
            <Link to="/signin" className={styles.switchLink}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);
const EyeIcon    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const EyeOffIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const CheckIcon  = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>;
const Spinner    = () => <span style={{ display:'inline-block', width:16, height:16, border:'2px solid rgba(13,17,23,0.3)', borderTopColor:'var(--ink)', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} aria-hidden="true" />;

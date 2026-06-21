import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import styles from './SignInPage.module.css';

export default function SignInPage() {
  const { signIn, signInWithGoogle } = useAuth();
  const toast    = useToast();
  const navigate = useNavigate();

  const [form, setForm]         = useState({ email: '', password: '' });
  const [loading, setLoading]   = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors]     = useState({});

  const update = (field) => (e) => {
    setForm(p => ({ ...p, [field]: e.target.value }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.email)    errs.email    = 'Email is required.';
    if (!form.password) errs.password = 'Password is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await signIn(form);
      // Get name from Firestore userData (attached by signIn) or Firebase displayName
      const fullName = user._userData?.fullName || user.displayName || '';
      const firstName = fullName.split(' ')[0] || 'there';
      toast.success(`Welcome back, ${firstName}! 👋`);
      navigate('/');
    } catch (err) {
      const msg = err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password'
        ? 'Incorrect email or password. Please try again.'
        : err.code === 'auth/too-many-requests'
        ? 'Too many attempts. Please try again later.'
        : 'Sign in failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGLoading(true);
    try {
      const user = await signInWithGoogle();
      const firstName = user.displayName?.split(' ')[0] || 'there';
      toast.success(`Welcome back, ${firstName}! 👋`);
      navigate('/');
    } catch (err) {
      // Silently ignore popup closed by user — not an error
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        return;
      }
      toast.error('Google sign in failed. Please try again.');
    } finally {
      setGLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Left panel — branding */}
      <div className={styles.brand} aria-hidden="true">
        <div className={styles.brandInner}>
          <div className={styles.brandLogo}>
            <span className={styles.brandLogoMark}>NMG</span>
            <span className={styles.brandLogoDivider} />
            <span className={styles.brandLogoSub}>Zembeta</span>
          </div>
          <p className={styles.brandTagline}>My World. Your World. Our World.</p>
          <div className={styles.brandFeatures}>
            {['Cleaning & Laundry', 'Catering Services', 'Embroidery & Branding', 'Corporate Stationery'].map(f => (
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

      {/* Right panel — form */}
      <div className={styles.formPanel}>
        <div className={styles.formWrap}>
          <div className={styles.formHeader}>
            <h1 className={styles.formTitle}>Welcome back</h1>
            <p className={styles.formSubtitle}>Sign in to your NMG Zembeta account</p>
          </div>

          {/* Google button */}
          <button
            className={styles.googleBtn}
            onClick={handleGoogle}
            disabled={gLoading}
            type="button"
          >
            {gLoading ? <Spinner /> : <GoogleIcon />}
            Continue with Google
          </button>

          <div className={styles.divider}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerText}>or continue with email</span>
            <span className={styles.dividerLine} />
          </div>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
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
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && <span id="email-error" className="form-error" role="alert">{errors.email}</span>}
            </div>

            <div className="form-group">
              <div className={styles.passwordLabel}>
                <label className="form-label" htmlFor="password">Password</label>
              </div>
              <div className={styles.passwordWrap}>
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  value={form.password}
                  onChange={update('password')}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPass(v => !v)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {errors.password && <span id="password-error" className="form-error" role="alert">{errors.password}</span>}
            </div>

            <button
              type="submit"
              className={`btn btn-primary btn-lg btn-full`}
              disabled={loading}
            >
              {loading ? <><Spinner /> Signing in…</> : 'Sign In'}
            </button>
          </form>

          <p className={styles.switchText}>
            Don't have an account?{' '}
            <Link to="/signup" className={styles.switchLink}>Create one</Link>
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
const Spinner    = () => <span style={{ display:'inline-block', width:16, height:16, border:'2px solid rgba(13,17,23,0.3)', borderTopColor:'var(--ink)', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} aria-hidden="true" />;

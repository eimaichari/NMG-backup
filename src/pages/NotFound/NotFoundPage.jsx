import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = '404 — Page Not Found | NMG Zembeta';
  }, []);

  return (
    <div className={`page-wrapper ${styles.page}`}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.code} aria-hidden="true">404</div>
        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.subtitle}>
          The page you're looking for doesn't exist or may have been moved.
          Let us help you find what you need.
        </p>
        <div className={styles.actions}>
          <button className={`btn btn-outline btn-lg`} onClick={() => navigate(-1)}>
            Go Back
          </button>
          <Link to="/" className={`btn btn-primary btn-lg`}>
            Back to Home
          </Link>
          <Link to="/products" className={`btn btn-ghost btn-lg`}>
            Browse Products
          </Link>
        </div>
        <div className={styles.links}>
          <span className={styles.linksLabel}>Quick links:</span>
          {[
            { to: '/about',   label: 'About Us' },
            { to: '/contact', label: 'Contact' },
            { to: '/signin',  label: 'Sign In' },
          ].map(l => (
            <Link key={l.to} to={l.to} className={styles.quickLink}>{l.label}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}

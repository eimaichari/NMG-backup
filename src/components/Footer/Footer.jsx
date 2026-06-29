import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const YEAR = new Date().getFullYear();

const NAV_LINKS = {
  Company: [
    { to: '/about',   label: 'About Us' },
    { to: '/contact', label: 'Contact' },
  ],
  Shop: [
    { to: '/products',                  label: 'All Products' },
    { to: '/products?cat=Catering',     label: 'Catering' },
    { to: '/products?cat=Branding',     label: 'Branding' },
    { to: '/products?cat=Cleaning',     label: 'Cleaning' },
  ],
  Account: [
    { to: '/signin',  label: 'Sign In' },
    { to: '/signup',  label: 'Create Account' },
    { to: '/profile', label: 'My Orders' },
    { to: '/cart',    label: 'My Cart' },
  ],
};

export default function Footer() {
  const waLink = 'https://wa.me/27739740331?text=Hi%20NMG%20Zembeta%2C%20I%20would%20like%20to%20enquire%20about%20your%20services.';

  return (
    <footer className={styles.footer} role="contentinfo">
      {/* Top rule */}
      <div className={styles.topRule} aria-hidden="true" />

      <div className={styles.main}>
        <div className="container">
          <div className={styles.grid}>
            {/* Brand */}
            <div className={styles.brand}>
              <Link to="/" className={styles.logo} aria-label="NMG Zembeta — Home">
                <span className={styles.logoMark}>NMG</span>
                <span className={styles.logoDivider} aria-hidden="true" />
                <span className={styles.logoSub}>Zembeta</span>
              </Link>

              <p className={styles.tagline}>
                My World. Your World. Our World.
              </p>

              <p className={styles.brandDesc}>
                Professional cleaning, catering, branding, and consulting
                services for businesses and homes in Randburg, Gauteng.
              </p>

              <div className={styles.contact}>
                <a href="tel:+27739740331" className={styles.contactItem}>
                  +27 73 974 0331
                </a>
                <a href="mailto:nasiphizembeta@gmail.com" className={styles.contactItem}>
                  nasiphizembeta@gmail.com
                </a>
                <span className={styles.contactItem}>Randburg, Gauteng, South Africa</span>
              </div>

              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn btn-primary btn-sm ${styles.waBtn}`}
              >
                <WhatsAppIcon /> Chat on WhatsApp
              </a>
            </div>

            {/* Nav columns */}
            {Object.entries(NAV_LINKS).map(([group, links]) => (
              <nav key={group} className={styles.navCol} aria-label={`${group} links`}>
                <h3 className={styles.navColTitle}>{group}</h3>
                <ul role="list" className={styles.navList}>
                  {links.map(({ to, label }) => (
                    <li key={to}>
                      <Link to={to} className={styles.navLink}>{label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <div className="container">
          <div className={styles.bottomInner}>
            <p className={styles.copy}>
              © {YEAR} NMG Zembeta Pty Ltd. All rights reserved | BUILT BY{" "}
              <a
                href="https://www.linkedin.com/company/cor3hausproduction/"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.legalLink} ${styles.builtByLink}`}
              >
                COR3 HAUS PRODUCTION
              </a>
            </p>
            <p className={styles.credit}>
              Registered business · Randburg, Gauteng · South Africa
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

const WhatsAppIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M11.99 2C6.469 2 2 6.47 2 11.99c0 1.96.53 3.793 1.444 5.372L2 22l4.748-1.424A9.952 9.952 0 0 0 11.99 22C17.51 22 22 17.53 22 12.01 22 6.49 17.51 2 11.99 2z"/>
  </svg>
);

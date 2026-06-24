import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import styles from './NavBar.module.css';

const NAV_LINKS = [
  { to: '/',         label: 'Home',    exact: true },
  { to: '/products', label: 'Shop' },
  { to: '/about',    label: 'About' },
  { to: '/contact',  label: 'Contact' },
];

export default function NavBar({ adminMode = false }) {
  const { user, userData, isAdmin, logOut } = useAuth();
  const { count, setOpen } = useCart();
  const toast    = useToast();
  const navigate = useNavigate();

  const [scrolled,     setScrolled]     = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const menuRef     = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogout = async () => {
    try {
      await logOut();
      setUserMenuOpen(false);
      setMenuOpen(false);
      toast.success('Signed out successfully.');
      navigate('/');
    } catch {
      toast.error('Failed to sign out. Try again.');
    }
  };

  const firstName = userData?.fullName?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'Account';

  return (
    <header
      className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${adminMode ? styles.adminMode : ''}`}
      role="banner"
    >
      {/* Top gold rule — only visible before scroll */}
      <div className={styles.topRule} aria-hidden="true" />

      <nav className={styles.nav} aria-label="Main navigation">
        {/* Logo */}
        <Link
          to="/"
          className={styles.logo}
          aria-label="NMG Zembeta — Home"
        >
          <img
            src="/images/nmg-logo.png"
            alt="NMG Zembeta"
            className={styles.logoImg}
          />
        </Link>

        {/* Desktop nav links */}
        {!adminMode && (
          <ul className={styles.desktopLinks} role="list">
            {NAV_LINKS.map(({ to, label, exact }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={exact}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.active : ''}`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        )}

        {adminMode && (
          <ul className={styles.desktopLinks} role="list">
            <li><NavLink to="/admin" end className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>Dashboard</NavLink></li>
            <li><NavLink to="/admin/orders" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>Orders</NavLink></li>
          </ul>
        )}

        {/* Actions */}
        <div className={styles.actions}>
          {/* Cart */}
          {user && !isAdmin && (
            <button
              className={styles.iconBtn}
              onClick={() => setOpen(true)}
              aria-label={`Open cart, ${count} items`}
            >
              <BagIcon />
              {count > 0 && (
                <span className={styles.cartBadge} aria-hidden="true">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </button>
          )}

          {/* Auth */}
          {user ? (
            <div className={styles.userMenu} ref={userMenuRef}>
              <button
                className={styles.avatarBtn}
                onClick={() => setUserMenuOpen(v => !v)}
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
                aria-label="Account menu"
              >
                <span className={styles.avatar}>{firstName[0].toUpperCase()}</span>
                <span className={styles.avatarName}>{firstName}</span>
              </button>

              {userMenuOpen && (
                <div className={styles.dropdown} role="menu">
                  <div className={styles.dropdownHeader}>
                    <span className={styles.dropdownName}>{userData?.fullName || user.displayName}</span>
                    <span className={styles.dropdownEmail}>{user.email}</span>
                  </div>
                  <div className={styles.dropdownDivider} />
                  {!isAdmin && (
                    <>
                      <Link to="/profile" className={styles.dropdownItem} role="menuitem" onClick={() => setUserMenuOpen(false)}>
                        My Profile
                      </Link>
                      <Link to="/cart" className={styles.dropdownItem} role="menuitem" onClick={() => setUserMenuOpen(false)}>
                        My Cart
                      </Link>
                    </>
                  )}
                  {isAdmin && (
                    <Link to="/admin" className={styles.dropdownItem} role="menuitem" onClick={() => setUserMenuOpen(false)}>
                      Admin Panel
                    </Link>
                  )}
                  <div className={styles.dropdownDivider} />
                  <button className={`${styles.dropdownItem} ${styles.signOut}`} role="menuitem" onClick={handleLogout}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.authBtns}>
              <Link to="/signin" className={`btn btn-ghost btn-sm`}>Sign In</Link>
              <Link to="/signup" className={`btn btn-primary btn-sm`}>Get Started</Link>
            </div>
          )}

          {/* Hamburger */}
          {!adminMode && (
            <button
              className={styles.hamburger}
              onClick={() => setMenuOpen(v => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <span className={`${styles.bar} ${menuOpen ? styles.barOpen1 : ''}`} />
              <span className={`${styles.bar} ${menuOpen ? styles.barOpen2 : ''}`} />
            </button>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {!adminMode && (
        <>
          <div
            className={`${styles.mobileOverlay} ${menuOpen ? styles.overlayOpen : ''}`}
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            id="mobile-menu"
            className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}
            ref={menuRef}
          >
            <div className={styles.mobileHeader}>
              <span className={styles.mobileLogoMark}>NMG</span>
              <button className={styles.mobileClose} onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <CloseIcon />
              </button>
            </div>

            <ul className={styles.mobileLinks} role="list">
              {NAV_LINKS.map(({ to, label, exact }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={exact}
                    className={({ isActive }) =>
                      `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ''}`
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
              {user && !isAdmin && (
                <>
                  <li>
                    <NavLink to="/profile" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                      My Profile
                    </NavLink>
                  </li>
                  <li>
                    <button className={styles.mobileLink} onClick={() => { setOpen(true); setMenuOpen(false); }}>
                      Cart {count > 0 && <span className={styles.mobileBadge}>{count}</span>}
                    </button>
                  </li>
                </>
              )}
            </ul>

            <div className={styles.mobileActions}>
              {user ? (
                <button className="btn btn-outline btn-full" onClick={handleLogout}>Sign Out</button>
              ) : (
                <>
                  <Link to="/signin" className="btn btn-outline btn-full" onClick={() => setMenuOpen(false)}>Sign In</Link>
                  <Link to="/signup" className="btn btn-primary btn-full" onClick={() => setMenuOpen(false)}>Get Started</Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}

const BagIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

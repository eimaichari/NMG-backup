import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAuth, signOut } from 'firebase/auth';
import styles from './NavBar.module.css';

const Nav = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false); // 🔹 track menu toggle

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      setIsOpen(false); // close menu on sign out
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <nav className={styles.nav}>
      {/* Logo */}
      <div className={styles.logo}>
        <Link to="/" onClick={() => setIsOpen(false)}>NMG-Zembeta</Link>
      </div>

      {/* Hamburger button (mobile only) */}
      <div
        className={`${styles.hamburgerMenu} ${isOpen ? styles.open : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
      </div>

      {/* Nav links (Main Menu) */}
      <ul className={`${styles.navLinks} ${isOpen ? styles.active : ''}`}>
        <li><Link to="/" className={styles.link} onClick={() => setIsOpen(false)}>Home</Link></li>
        <li><Link to="/about" className={styles.link} onClick={() => setIsOpen(false)}>About</Link></li>

        {((user && user.role !== 'admin') || !user) && (
          <>
            <li><Link to="/products" className={styles.link} onClick={() => setIsOpen(false)}>Products</Link></li>
            <li><Link to="/cart" className={styles.link} onClick={() => setIsOpen(false)}>Cart</Link></li>
          </>
        )}

        <li><Link to="/contact" className={styles.link} onClick={() => setIsOpen(false)}>Contact</Link></li>

        {/* Admin Links - These remain with the main links for consistent ordering */}
        {isAuthenticated && user.role === 'admin' && (
          <>
            <li>
              <Link to="/admin/dashboard" className={styles.link} onClick={() => setIsOpen(false)}>Dashboard</Link>
            </li>
            <li className={styles.ordersLink}>
              <Link to="/admin/orders" className={styles.link} onClick={() => setIsOpen(false)}>Orders</Link>
            </li>
          </>
        )}
      </ul>
      
      {/* 🚀 NEW: AUTHENTICATION ACTIONS CONTAINER 🚀 */}
      <div className={`${styles.authActions} ${isOpen ? styles.active : ''}`}>
        {isAuthenticated ? (
          <>
            <span className={styles.userInfo}>
              Welcome, {user.displayName || user.email}
            </span>
            <button
              onClick={handleSignOut}
              className={`${styles.link} ${styles.primaryButton}`}
            >
              Sign Out
            </button>
          </>
        ) : (
          !loading && (
            <>
              <Link
                to="/auth/signin"
                className={`${styles.link} ${styles.primaryButton}`}
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/auth/signup"
                className={`${styles.link} ${styles.primaryButton}`}
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )
        )}
      </div>
      {/* ------------------------------------------- */}
  </nav>
  );
};

export default Nav;

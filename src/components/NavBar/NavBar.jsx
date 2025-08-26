import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAuth, signOut } from 'firebase/auth';
import styles from './NavBar.module.css';

const Nav = () => {
  const { user, isAuthenticated } = useAuth();

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <Link to="/">MyEcommerce</Link>
      </div>
      <ul className={styles.navLinks}>
        <li>
          <Link to="/" className={styles.link}>Home</Link>
        </li>
        <li>
          <Link to="/about" className={styles.link}>About</Link>
        </li>
        <li>
          <Link to="/products" className={styles.link}>Products</Link>
        </li>
        <li>
          <Link to="/contact" className={styles.link}>Contact</Link>
        </li>
        <li>
          <Link to="/cart" className={styles.link}>Cart</Link>
        </li>
        {isAuthenticated ? (
          <>
            <li className={styles.userInfo}>
              Welcome, {user.displayName || user.email}
            </li>
            <li>
              <button onClick={handleSignOut} className={styles.link}>
                Sign Out
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/auth/signin" className={styles.link}>Sign In</Link>
            </li>
            <li>
              <Link to="/auth/signup" className={styles.link}>Sign Up</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Nav;
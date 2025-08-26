import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>MyEcommerce</h3>
          <p>Quality products, delivered to your door.</p>
        </div>
        <div className={styles.footerSection}>
          <h4>Quick Links</h4>
          <ul className={styles.footerLinks}>
            <li><Link to="/about" className={styles.link}>About Us</Link></li>
            <li><Link to="/contact" className={styles.link}>Contact</Link></li>
            <li><Link to="/products" className={styles.link}>Products</Link></li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h4>Contact Info</h4>
          <p>Email: support@myecommerce.com</p>
          <p>Phone: (123) 456-7890</p>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} MyEcommerce. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
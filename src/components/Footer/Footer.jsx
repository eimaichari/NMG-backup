import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>NMG-Zembeta</h3>
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
          <p>Email: nasiphizembeta@gmail.com</p>
          <p>Phone: (+27)73 974-0331</p>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} NMG-Zembeta. All rights reserved. Built By<a href="https://www.linkedin.com/in/jeremie-kazadi-013a55372?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" style="color: inherit; text-decoration: underline;">INFINITY V1</a></p>
      </div>
    </footer>
  );
};

export default Footer;
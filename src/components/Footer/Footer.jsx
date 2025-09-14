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
          <div className={styles.footerSocials}>
            <a href="https://www.facebook.com/share/1F33u4amC7/" target="_blank" rel="noopener noreferrer">
              <img src="src/assets/images/favicon-facebook.ico" alt="Facebook icon" />
            </a>
            <a href="https://www.instagram.com/nmgm439?utm_source=qr&igsh=NmZyZW9rNnZuaGd1" target="_blank" rel="noopener noreferrer">
              <img src="/src/assets/images/favicon-ig.ico" alt="Instagram icon" />
            </a>
            <a href="https://www.tiktok.com/@nasie325?_t=ZS-8z96uUQ1TeB&_r=1" target="_blank" rel="noopener noreferrer">
              <img src="src/assets/images/favicon-tiktok.ico" alt="TikTok icon" />
            </a>
            <a href="https://youtube.com/@nasie6302/community?si=Oglk3z9MhHV0yr3L" target="_blank" rel="noopener noreferrer">
              <img src="src/assets/images/favicon-youtube.ico" alt="YouTube icon" />
            </a>
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>
          &copy; {new Date().getFullYear()} NMG-Zembeta. All rights reserved. Built By{" "}
          <a
            href="https://www.linkedin.com/in/jeremie-kazadi-013a55372?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit", textDecoration: "underline" }}
          >
            JAY_K
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
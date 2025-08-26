import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerLinks}>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/products">Products</a>
          <a href="/contact">Contact</a>
        </div>
        <p className={styles.footerText}>
          © {new Date().getFullYear()} My E-Commerce Store. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

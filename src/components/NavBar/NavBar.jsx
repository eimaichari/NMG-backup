import React from "react";
import { Link } from "react-router-dom";
import styles from "./NavBar.module.css";

const NavBar = () => {
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
        <li>
          <Link to="/signin" className={styles.link}>Sign In</Link>
        </li>
        <li>
          <Link to="/signup" className={styles.link}>Sign Up</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;

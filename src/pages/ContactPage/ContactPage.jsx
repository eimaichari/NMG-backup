// src/pages/ContactPage.jsx
import React from "react";
import styles from "./ContactPage.module.css";

const ContactPage = () => {
  return (
    <div className={styles.contactPage}>
      {/* Navigation (mock, since global NavBar component may replace this later) */}
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <img src="/LOGO NMG.png" alt="Logo" />
        </div>
        <div className={styles.navLinks}>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/products">Services</a>
          <a href="/contact">Contact</a>
        </div>
        <div className={styles.hamburgerMenu}>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
        </div>
      </nav>

      {/* Contact Section */}
      <section className={styles.contactContainer}>
        {/* Image */}
        <div className={styles.contactImage}>
          <img
            src="/images/Cleaning.png"
            alt="A sleek, professional setting representing NMG Zembeta."
          />
        </div>

        {/* Form + Info */}
        <div className={styles.contactFormWrapper}>
          {/* Info */}
          <div className={styles.contactInfo}>
            <h2>Contact Us</h2>
            <p>
              We'd love to hear from you. Fill out the form below or connect
              with us directly.
            </p>
            <p>
              <strong>Email:</strong>
              <br /> info@nmgzembeta.co.za
            </p>
            <p>
              <strong>Location:</strong>
              <br /> 123 Business Avenue, JHB, South Africa
            </p>

            <div className={styles.socialIcons}>
              {/* Instagram */}
              <a href="#" aria-label="Instagram">
                <svg className={styles.socialIcon} viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4c0 3.2-2.6 5.8-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2zm4.2 2.8c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm0 10c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm4.8-9.6c.6 0 1.2.5 1.2 1.2s-.5 1.2-1.2 1.2-1.2-.5-1.2-1.2.5-1.2 1.2-1.2z"
                  />
                </svg>
              </a>
              {/* WhatsApp */}
              <a href="#" aria-label="WhatsApp">
                <svg className={styles.socialIcon} viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.76.45 3.48 1.3 4.98L2 22l5.25-1.38c1.45.83 3.08 1.27 4.79 1.27 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm3.63 14.53c-.22.62-.87.99-1.45.75-.73-.31-2.22-.97-3.12-1.87-.89-.89-1.56-2.37-1.87-3.12-.24-.58.13-1.24.75-1.45.2-.07.37-.09.54-.03.17.06.31.23.44.46.62 1.12.93 2.06 1.03 2.28.09.22.03.47-.16.67-.2.22-.44.37-.66.56-.22.2-.29.36-.25.59.22.89.87 1.73 1.56 2.41.69.69 1.53 1.34 2.41 1.56.22.03.39-.03.59-.25.19-.22.34-.46.56-.66.2-.19.45-.25.67-.16.22.1 1.16.41 2.28 1.03.23.13.4.27.46.44.06.17.04.34-.03.54z"
                  />
                </svg>
              </a>
              {/* Email */}
              <a href="#" aria-label="Email">
                <svg className={styles.socialIcon} viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2l-8 5-8-5V6l8 5 8-5z"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Form */}
          <form className={styles.form}>
            <input type="text" name="name" placeholder="Full Name" required />
            <input type="email" name="email" placeholder="E-mail" required />
            <textarea name="message" placeholder="Message" required></textarea>
            <button type="submit" className={styles.submitButton}>
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;

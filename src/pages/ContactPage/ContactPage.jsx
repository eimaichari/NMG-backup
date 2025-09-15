import React from 'react';
import styles from './ContactPage.module.css';

const ContactPage = () => {
  return (
    <main>
      {/* Contact Section */}
      <section className={styles.contactSection}>
        <div className={styles.contactContainer}>
          <div className={styles.contactInfo}>
            <h1>Contact Us</h1>
            <p>
              We'd love to hear from you! Please fill out the form or use the contact details below to get in touch with our team.
            </p>
          </div>
          <div className={styles.contactFormWrapper}>
            <div className={styles.contactForm}>
              <h2>Send Us a Message</h2>
              <div className={styles.formContainer}>
                <input type="text" placeholder="Name" />
                <input type="email" placeholder="Email" />
                <input type="tel" placeholder="Phone" />
                <textarea placeholder="Message" rows="5"></textarea>
                <button className={styles.submitButton}>Send Message</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
// src/pages/AboutPage.jsx
import React from "react";
import styles from "./AboutPage.module.css";

const AboutPage = () => {
  return (
    <div className={styles.aboutPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>About Us</h1>
          <p className={styles.heroSubtitle}>
            Learn more about our mission, vision, and values
          </p>
        </div>
      </section>

      {/* Company Info Section */}
      <section className={styles.companyInfo}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Who We Are</h2>
          <p className={styles.sectionText}>
            We are a dedicated team passionate about delivering the best shopping
            experience. Our mission is to provide high quality products with
            excellent customer service.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className={styles.team}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Meet Our Team</h2>
          <div className={styles.teamGrid}>
            {/* Team member mock data */}
            <div className={styles.teamMember}>
              <img
                src="https://via.placeholder.com/150"
                alt="Team member"
                className={styles.teamPhoto}
              />
              <h3 className={styles.teamName}>John Doe</h3>
              <p className={styles.teamRole}>CEO</p>
            </div>
            <div className={styles.teamMember}>
              <img
                src="https://via.placeholder.com/150"
                alt="Team member"
                className={styles.teamPhoto}
              />
              <h3 className={styles.teamName}>Jane Smith</h3>
              <p className={styles.teamRole}>Marketing Head</p>
            </div>
            <div className={styles.teamMember}>
              <img
                src="https://via.placeholder.com/150"
                alt="Team member"
                className={styles.teamPhoto}
              />
              <h3 className={styles.teamName}>Mike Johnson</h3>
              <p className={styles.teamRole}>Lead Developer</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

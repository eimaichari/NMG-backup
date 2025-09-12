import React from 'react';
import styles from './AboutPage.module.css';

const AboutPage = () => {
  return (
    <main>
      {/* About Hero Section */}
      <section className={styles.aboutHero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>About NMG Zembeta</h1>
          <p className={styles.heroSubtitle}>
            My World. Your World. Our World.
          </p>
        </div>
      </section>

      {/* Company Overview Section */}
      <section className={styles.companyOverview}>
        <h2 className={styles.sectionTitle}>Who We Are</h2>
        <div className={styles.card}>
          <p>
            Established in January 2024 and based in Randburg, South Africa, NMG Zembeta Pty Ltd is a trusted multi-service provider dedicated to delivering quality, reliability, and innovation across a wide range of essential services. 
            We aim to be the preferred choice for individuals, households, businesses, and institutions, known for excellence in service delivery, convenience, and continuous improvement.
          </p>
        </div>
      </section>

      {/* Vision and Mission Section */}
      <section className={styles.visionMission}>
        <div className={styles.visionMissionWrapper}>
          <div className={styles.vision}>
            <h3 className={styles.cardTitle}>Our Vision</h3>
            <div className={styles.card}>
              <p>
                To become a leading and trusted multi service provider across South Africa, setting a new standard for quality, reliability, and innovation by offering diverse services under one professional brand. 
                We strive to make a positive impact in every area we serve through consistent growth, empowered staff, and strong community ties.
              </p>
            </div>
          </div>
          <div className={styles.mission}>
            <h3 className={styles.cardTitle}>Our Mission</h3>
            <div className={styles.card}>
              <p>
                To deliver a comprehensive portfolio of high-quality services in cleaning, laundry, catering, embroidery, branding, consulting, and supplies. 
                Guided by integrity, punctuality, and attention to detail, we invest in skilled staff, innovative practices, and strong client relationships to simplify service access while uplifting the communities we serve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className={styles.whyChooseUs}>
        <h2 className={styles.sectionTitle}>Why Choose NMG Zembeta?</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureItem}>
            <h3 className={styles.cardTitle}>One-Stop Shop</h3>
            <div className={styles.card}>
              <p>
                A diverse range of solutions, all under one reliable brand.
              </p>
            </div>
          </div>
          <div className={styles.featureItem}>
            <h3 className={styles.cardTitle}>Skilled & Experienced Team</h3>
            <div className={styles.card}>
              <p>
                Staff carefully selected, trained, and equipped to deliver every service with professionalism and efficiency.
              </p>
            </div>
          </div>
          <div className={styles.featureItem}>
            <h3 className={styles.cardTitle}>Reliable & Affordable</h3>
            <div className={styles.card}>
              <p>
                Consistent quality at competitive prices, making our services both accessible and dependable.
              </p>
            </div>
          </div>
          <div className={styles.featureItem}>
            <h3 className={styles.cardTitle}>Client-Focused</h3>
            <div className={styles.card}>
              <p>
                Flexible and adaptable to your needs, budget, and expectations with excellent customer support.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
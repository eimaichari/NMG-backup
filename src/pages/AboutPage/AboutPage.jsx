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
            One Company, One Stop Services — My World. Your World. Our World.
          </p>
        </div>
      </section>

      {/* Company Overview Section */}
      <section className={styles.companyOverview}>
        <h2 className={styles.sectionTitle}>Who We Are</h2>
        <div className={styles.card}>
          <p>
            Established on 02 January 2025 and based in Randburg, South Africa, NMG Zembeta Pty Ltd is a trusted multi-service provider dedicated to delivering quality, reliability, and innovation across a wide range of essential services. 
            We aim to be the preferred choice for individuals, households, businesses, and institutions — known for excellence in service delivery, convenience, and continuous improvement.
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
                To become a leading and trusted multi-service provider across South Africa, setting a new standard for quality, reliability, and innovation by offering diverse services under one professional brand. 
                We strive to make a positive impact in every area we serve through consistent growth, empowered staff, and strong community ties.
              </p>
            </div>
          </div>
          <div className={styles.mission}>
            <h3 className={styles.cardTitle}>Our Mission</h3>
            <div className={styles.card}>
              <p>
                To deliver a comprehensive portfolio of high-quality services — from cleaning and laundry to catering, embroidery, branding, consulting, and supplies. 
                Guided by integrity, punctuality, and attention to detail, we invest in skilled staff, innovative practices, and strong client relationships to simplify service access while uplifting the communities we serve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services List Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>What We Offer</h2>
        <div className={styles.servicesListCard}>
          <ul>
            <li className={styles.serviceCleaning}>
              <a href="#">Cleaning & Laundry Services</a>
            </li>
            <li className={styles.servicePies}>
              <a href="#">Pies & Noodles</a>
            </li>
            <li className={styles.serviceLunchbox}>
              <a href="#">Lunchbox Treats & Party Packs</a>
            </li>
            <li className={styles.serviceRisk}>
              <a href="#">Risk Consulting & Recruitment</a>
            </li>
            <li className={styles.serviceEmbroidery}>
              <a href="#">Embroidery, Branding & Custom Gifts</a>
            </li>
            <li className={styles.serviceSupply}>
              <a href="#">Supply, Delivery & Corporate Stationery</a>
            </li>
          </ul>
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
                A diverse range of solutions — from cleaning and catering to branding and consulting — all under one reliable brand.
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
import React from 'react';
import styles from './HomePage.module.css';

const HomePage = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroBackgroundImage}></div>
        <div className={styles.heroOverlay}></div>
        <div className={styles.content}>
          <h1 className={styles.heroTitle}>My World. Your World. Our World.</h1>
          <p className={styles.heroSubtitle}>
            Premium Cleaning, Catering, Branding & Supply Solutions
          </p>
          <a href="#" className={styles.tourButton}>Explore Services</a>
        </div>
        <div id="lottie-animation" className={styles.lottieAnimation}></div>
      </section>

      {/* About Section */}
      <section className={styles.aboutSection}>
        <div className={styles.aboutWrapper}>
          <div className={styles.leftSection}>
            <p>
              At NMG Zembeta Pty Ltd, our vision is to become a leading and trusted multi-service provider across South Africa.
              We set new standards for quality, reliability, and innovation by offering essential services under one unified,
              professional brand.
            </p>
            <img src="/images/team.jpg" alt="Team" />
          </div>
          <div className={styles.rightSection}>
            <h1 className={styles.gradientText}>WELCOME TO NMG ZEMBETA</h1>
            <p>
              We are committed to delivering high-quality services that meet the everyday needs of our clients — from cleaning
              and laundry to catering, embroidery, branding, consulting, and supplies.
            </p>
            <button className={styles.readMoreButton}>Read More</button>
          </div>
        </div>
      </section>

      {/* Services and Products Section */}
      <section className={styles.servicesAndProductsSection}>
        <h2 className={styles.gradientText}>Our Services</h2>
        <div className={styles.servicesWrapper}>
          <div className={styles.servicesLeft}>
            <div className={styles.servicesList}>
              <div className={styles.serviceItem}>
                <h3>Cleaning & Laundry</h3>
                <p>Affordable and reliable residential, commercial, and industrial cleaning services.</p>
              </div>
              <div className={styles.serviceItem}>
                <h3>Risk Consulting & Recruitment</h3>
                <p>Professional risk assessments, security consulting, and recruitment services.</p>
              </div>
            </div>
          </div>
          <div className={styles.servicesRight}>
            <div className={styles.servicesList}>
              <div className={styles.serviceItem}>
                <h3>Embroidery & Branding</h3>
                <p>Custom embroidery, branding, and personalised promotional gifts.</p>
              </div>
              <div className={styles.serviceItem}>
                <h3>Supply & Corporate Stationery</h3>
                <p>Branded corporate packs, office supplies, and deliveries for all your business needs.</p>
              </div>
            </div>
          </div>
        </div>
        <h2 className={styles.gradientText}>Our Products</h2>
        <div className={styles.servicesWrapper}>
          <div className={styles.servicesLeft}>
            <div className={styles.productsList}>
              <div className={styles.productItem}>
                <h3>Pies</h3>
                <p>Delicious homemade pies for resale, events, or meals.</p>
              </div>
              <div className={styles.productItem}>
                <h3>Noodles</h3>
                <p>Quick and tasty instant noodles for everyday convenience.</p>
              </div>
            </div>
          </div>
          <div className={styles.servicesRight}>
            <div className={styles.productsList}>
              <div className={styles.productItem}>
                <h3>Lunchbox Treats</h3>
                <p>Snack packs designed for school or office lunchboxes.</p>
              </div>
              <div className={styles.productItem}>
                <h3>Party Packs</h3>
                <p>Custom party packs for birthdays, schools, and events.</p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.servicesFooter}>
          <a href="#" className={styles.moreServicesButton}>More Services</a>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialsSection}>
        <div className={styles.testimonialsContent}>
          <h2 className={styles.testimonialsTitle}>What Our Clients Say</h2>
          <div className={styles.testimonialsCarousel}>
            <div className={styles.testimonialItem}>
              <p className={styles.testimonialComment}>
                "NMG Zembeta transformed our office with their exceptional cleaning services."
              </p>
              <div className={styles.testimonialRating}>★★★★★</div>
              <p className={styles.testimonialName}>Jane Doe</p>
            </div>
            <div className={styles.testimonialItem}>
              <p className={styles.testimonialComment}>
                "The catering for our event was flawless. Highly recommend!"
              </p>
              <div className={styles.testimonialRating}>★★★★☆</div>
              <p className={styles.testimonialName}>John Smith</p>
            </div>
            <div className={styles.testimonialItem}>
              <p className={styles.testimonialComment}>
                "Their branding gave our business a fresh look. Outstanding work!"
              </p>
              <div className={styles.testimonialRating}>★★★★★</div>
              <p className={styles.testimonialName}>Emily Johnson</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
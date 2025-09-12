import React from 'react';
import styles from './HomePage.module.css';
import Testimonials from '../../components/Testimonials/Testimonials';

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
          <a href="../ProductsPage/ProductsPage.jsx" className={styles.tourButton}>Explore Services</a>
        </div>
        <div id="lottie-animation" className={styles.lottieAnimation}></div>
      </section>

      {/* About Section */}
      <section className={styles.aboutSection}>
        <div className={styles.aboutWrapper}>
          <div className={styles.leftSection}>
            <p>
              Our vision is to become a leading and trusted multi-service provider across South Africa.
              We set new standards for quality, reliability, and innovation by offering essential services under one unified,
              professional brand.
            </p>
          </div>
          <div className={styles.rightSection}>
            <h1 className={styles.gradientText}>WELCOME TO NMG ZEMBETA</h1>
            <p>
              We are committed to delivering high-quality services that meet the everyday needs of our clients, from cleaning
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
                <p>We offer affordable and reliable residential, commercial, and industrial cleaning
                  services. Our laundry solutions include washing, dry, iron, and folding for both
                  individual and bulk orders, perfect for households, offices, and uniforms.</p>
              </div>
              <div className={styles.serviceItem}>
                <h3>Risk Consulting & Recruitment</h3>
                <p>Our team offers professional risk assessments, security consulting, and recruitment
                    services tailored for businesses and events. We will help you hire trusted personnel
                    and reduce potential business risks.</p>
              </div>
               <div className={styles.serviceItem}>
                <h3>Company Diaries, Tags & Pens</h3>
                <p>Order customized corporate diaries, staff ID tags, and branded pens to
                    professionally represent your business. Great for end-of-year gifts, branding, or
                    corporate identity.</p>
              </div>
            </div>
          </div>
          <div className={styles.servicesRight}>
            <div className={styles.servicesList}>
              <div className={styles.serviceItem}>
                <h3>Embroidery & Branding</h3>
                <p>We specialize in custom embroidery for uniforms, caps, aprons, and promotional
                    items. We also offer branding services to help businesses stand out with custom
                    logos on apparel, gifts, and corporate wear</p>
              </div>
              <div className={styles.serviceItem}>
                <h3>Supply & Corporate Stationery</h3>
                <p>We source and deliver a variety of goods — from office supplies to school packs and
                    bulk snacks. Whether for homes, schools, or businesses, we ensure timely and
                    affordable delivery</p>
              </div>
              <div className={styles.serviceItem}>
                <h3>Custom Car Stickers & Gifts</h3>
                <p>We design and print personalized car decals, bumper stickers, and thoughtful gifts
                    for all occasions. Perfect for personal use, small businesses, or promotional events.</p>
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
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialsSection}>
        <div className={styles.testimonialsContent}>
          <h2 className={styles.testimonialsTitle}>What Our Clients Say</h2>
          <Testimonials/>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
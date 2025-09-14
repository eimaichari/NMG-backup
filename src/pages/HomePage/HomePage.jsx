import React, { useState } from 'react';
import styles from './HomePage.module.css';
import Testimonials from '../../components/Testimonials/Testimonials';

import serviceImageOne from '../../assets/images/WhatsApp Image 2025-09-12 at 13.05.51 (1).jpeg'
import serviceImageTwo from '../../assets/images/WhatsApp Image 2025-09-12 at 13.05.51.jpeg'
import serviceImageThree from '../../assets/images/WhatsApp Image 2025-08-06 at 15.17.28.jpeg'
import serviceImageFour from '../../assets/images/team-at-work.jpg'
import serviceImageFive from '../../assets/images/diaries.jpeg'
import serviceImageSix from '../../assets/images/diarriesss.jpeg'


const HomePage = () => {
  const [activeImageIndex, setActiveImageIndex] = useState({});

  const handleImageChange = (itemId, direction) => {
    setActiveImageIndex((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + direction,
    }));
  };

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
              <div className={styles.serviceItem}
                onMouseEnter={() => setActiveImageIndex((prev) => ({ ...prev, ['service0']: 0 }))}
                onMouseLeave={() => setActiveImageIndex((prev) => ({ ...prev, ['service0']: undefined }))}>
                <h3>Cleaning & Laundry</h3>
                <p>We offer affordable and reliable residential, commercial, and industrial cleaning
                  services. Our laundry solutions include washing, dry, iron, and folding for both
                  individual and bulk orders, perfect for households, offices, and uniforms.</p>
                <div className={styles.imageContainer}>
                  {activeImageIndex['service0'] !== undefined && (
                    <>
                      <img src={serviceImageOne} alt="Cleaning & Laundry 1" className={`${styles.serviceImage} ${activeImageIndex['service0'] === 0 ? styles.activeImage : ''}`} />
                      <img src={serviceImageTwo} alt="Cleaning & Laundry 2" className={`${styles.serviceImage} ${activeImageIndex['service0'] === 1 ? styles.activeImage : ''}`} />
                    </>
                  )}
                </div>
              </div>
              <div className={styles.serviceItem}
                onMouseEnter={() => setActiveImageIndex((prev) => ({ ...prev, ['service1']: 0 }))}
                onMouseLeave={() => setActiveImageIndex((prev) => ({ ...prev, ['service1']: undefined }))}>
                <h3>Risk Consulting & Recruitment</h3>
                <p>Our team offers professional risk assessments, security consulting, and recruitment
                    services tailored for businesses and events. We will help you hire trusted personnel
                    and reduce potential business risks.</p>
                <div className={styles.imageContainer}>
                  {activeImageIndex['service1'] !== undefined && (
                    <>
                      <img src={serviceImageThree} alt="Risk Consulting 1" className={`${styles.serviceImage} ${activeImageIndex['service1'] === 0 ? styles.activeImage : ''}`} />
                      <img src={serviceImageFour} alt="Risk Consulting 2" className={`${styles.serviceImage} ${activeImageIndex['service1'] === 1 ? styles.activeImage : ''}`} />
                    </>
                  )}
                </div>
              </div>
              <div className={styles.serviceItem}
                onMouseEnter={() => setActiveImageIndex((prev) => ({ ...prev, ['service2']: 0 }))}
                onMouseLeave={() => setActiveImageIndex((prev) => ({ ...prev, ['service2']: undefined }))}>
                <h3>Company Diaries, Tags & Pens</h3>
                <p>Order customized corporate diaries, staff ID tags, and branded pens to
                    professionally represent your business. Great for end-of-year gifts, branding, or
                    corporate identity.</p>
                <div className={styles.imageContainer}>
                  {activeImageIndex['service2'] !== undefined && (
                    <>
                      <img src={serviceImageFive} alt="Diaries & Tags 1" className={`${styles.serviceImage} ${activeImageIndex['service2'] === 0 ? styles.activeImage : ''}`} />
                      <img src={serviceImageSix} alt="Diaries & Tags 2" className={`${styles.serviceImage} ${activeImageIndex['service2'] === 1 ? styles.activeImage : ''}`} />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.servicesRight}>
            <div className={styles.servicesList}>
              <div className={styles.serviceItem}
                onMouseEnter={() => setActiveImageIndex((prev) => ({ ...prev, ['service3']: 0 }))}
                onMouseLeave={() => setActiveImageIndex((prev) => ({ ...prev, ['service3']: undefined }))}>
                <h3>Embroidery & Branding</h3>
                <p>We specialize in custom embroidery for uniforms, caps, aprons, and promotional
                    items. We also offer branding services to help businesses stand out with custom
                    logos on apparel, gifts, and corporate wear</p>
                <div className={styles.imageContainer}>
                  {activeImageIndex['service3'] !== undefined && (
                    <>
                      <img src="src/assets/images/WhatsApp Image 2025-08-06 at 15.17.25 (2).jpeg" alt="Embroidery 1" className={`${styles.serviceImage} ${activeImageIndex['service3'] === 0 ? styles.activeImage : ''}`} />
                      <img src="src/assets/images/WhatsApp Image 2025-08-06 at 15.17.24 (1).jpeg" alt="Embroidery 2" className={`${styles.serviceImage} ${activeImageIndex['service3'] === 1 ? styles.activeImage : ''}`} />
                    </>
                  )}
                </div>
              </div>
              <div className={styles.serviceItem}
                onMouseEnter={() => setActiveImageIndex((prev) => ({ ...prev, ['service4']: 0 }))}
                onMouseLeave={() => setActiveImageIndex((prev) => ({ ...prev, ['service4']: undefined }))}>
                <h3>Supply & Corporate Stationery</h3>
                <p>We source and deliver a variety of goods — from office supplies to school packs and
                    bulk snacks. Whether for homes, schools, or businesses, we ensure timely and
                    affordable delivery</p>
                <div className={styles.imageContainer}>
                  {activeImageIndex['service4'] !== undefined && (
                    <>
                      <img src="src/assets/images/WhatsApp Image 2025-09-14 at 21.33.48.jpeg" alt="Stationery 1" className={`${styles.serviceImage} ${activeImageIndex['service4'] === 0 ? styles.activeImage : ''}`} />
                      <img src="src/assets/images/WhatsApp Image 2025-09-14 at 21.33.48 (1).jpeg" alt="Stationery 2" className={`${styles.serviceImage} ${activeImageIndex['service4'] === 1 ? styles.activeImage : ''}`} />
                    </>
                  )}
                </div>
              </div>
              <div className={styles.serviceItem}
                onMouseEnter={() => setActiveImageIndex((prev) => ({ ...prev, ['service5']: 0 }))}
                onMouseLeave={() => setActiveImageIndex((prev) => ({ ...prev, ['service5']: undefined }))}>
                <h3>Custom Car Stickers & Gifts</h3>
                <p>We design and print personalized car decals, bumper stickers, and thoughtful gifts
                    for all occasions. Perfect for personal use, small businesses, or promotional events.</p>
                <div className={styles.imageContainer}>
                  {activeImageIndex['service5'] !== undefined && (
                    <>
                      <img src="src/assets/images/WhatsApp Image 2025-08-06 at 15.17.26.jpeg" alt="Stickers & Gifts 1" className={`${styles.serviceImage} ${activeImageIndex['service5'] === 0 ? styles.activeImage : ''}`} />
                      <img src="src/assets/images/WhatsApp Image 2025-08-06 at 15.17.29 (1).jpeg" alt="Stickers & Gifts 2" className={`${styles.serviceImage} ${activeImageIndex['service5'] === 1 ? styles.activeImage : ''}`} />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className={styles.gradientText}>Our Products</h2>
        <div className={styles.servicesWrapper}>
          <div className={styles.servicesLeft}>
            <div className={styles.productsList}>
              <div className={styles.productItem}
                onMouseEnter={() => setActiveImageIndex((prev) => ({ ...prev, ['product0']: 0 }))}
                onMouseLeave={() => setActiveImageIndex((prev) => ({ ...prev, ['product0']: undefined }))}>
                <h3>Pies</h3>
                <p>Delicious homemade pies for resale, events, or meals.</p>
                <div className={styles.imageContainer}>
                  {activeImageIndex['product0'] !== undefined && (
                    <>
                      <img src="src/assets/images/pies.jpg" alt="Pies 1" className={`${styles.serviceImage} ${activeImageIndex['product0'] === 0 ? styles.activeImage : ''}`} />
                      <img src="src/assets/images/WhatsApp Image 2025-09-12 at 13.11.18 (2).jpeg" alt="Pies 2" className={`${styles.serviceImage} ${activeImageIndex['product0'] === 1 ? styles.activeImage : ''}`} />
                    </>
                  )}
                </div>
              </div>
              <div className={styles.productItem}
                onMouseEnter={() => setActiveImageIndex((prev) => ({ ...prev, ['product1']: 0 }))}
                onMouseLeave={() => setActiveImageIndex((prev) => ({ ...prev, ['product1']: undefined }))}>
                <h3>Noodles</h3>
                <p>Quick and tasty instant noodles for everyday convenience.</p>
                <div className={styles.imageContainer}>
                  {activeImageIndex['product1'] !== undefined && (
                    <>
                      <img src="src/assets/images/WhatsApp Image 2025-09-12 at 13.10.11.jpeg" alt="Noodles 1" className={`${styles.serviceImage} ${activeImageIndex['product1'] === 0 ? styles.activeImage : ''}`} />
                      <img src="src/assets/images/WhatsApp Image 2025-09-12 at 13.07.55.jpeg" alt="Noodles 2" className={`${styles.serviceImage} ${activeImageIndex['product1'] === 1 ? styles.activeImage : ''}`} />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.servicesRight}>
            <div className={styles.productsList}>
              <div className={styles.productItem}
                onMouseEnter={() => setActiveImageIndex((prev) => ({ ...prev, ['product2']: 0 }))}
                onMouseLeave={() => setActiveImageIndex((prev) => ({ ...prev, ['product2']: undefined }))}>
                <h3>Lunchbox Treats</h3>
                <p>Snack packs designed for school or office lunchboxes.</p>
                <div className={styles.imageContainer}>
                  {activeImageIndex['product2'] !== undefined && (
                    <>
                      <img src="src/assets/images/WhatsApp Image 2025-08-06 at 09.48.10.jpeg" alt="Lunchbox Treats 1" className={`${styles.serviceImage} ${activeImageIndex['product2'] === 0 ? styles.activeImage : ''}`} />
                      <img src="src/assets/images/WhatsApp Image 2025-08-06 at 09.48.11.jpeg" alt="Lunchbox Treats 2" className={`${styles.serviceImage} ${activeImageIndex['product2'] === 1 ? styles.activeImage : ''}`} />
                    </>
                  )}
                </div>
              </div>
              <div className={styles.productItem}
                onMouseEnter={() => setActiveImageIndex((prev) => ({ ...prev, ['product3']: 0 }))}
                onMouseLeave={() => setActiveImageIndex((prev) => ({ ...prev, ['product3']: undefined }))}>
                <h3>Party Packs</h3>
                <p>Custom party packs for birthdays, schools, and events.</p>
                <div className={styles.imageContainer}>
                  {activeImageIndex['product3'] !== undefined && (
                    <>
                      <img src="src/assets/images/WhatsApp Image 2025-09-14 at 21.38.22 (1).jpeg" alt="Party Packs 1" className={`${styles.serviceImage} ${activeImageIndex['product3'] === 0 ? styles.activeImage : ''}`} />
                      <img src="src/assets/images/WhatsApp Image 2025-08-06 at 09.48.10 (1).jpeg" className={`${styles.serviceImage} ${activeImageIndex['product3'] === 1 ? styles.activeImage : ''}`} />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialsSection}>
        <div className={styles.testimonialsContent}>
          <Testimonials/>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
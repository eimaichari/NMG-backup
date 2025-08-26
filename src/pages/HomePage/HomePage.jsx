import React, { useEffect } from 'react';
import lottie from 'lottie-web'; // Assume installed: npm i lottie-web
import styles from './HomePage.module.css';

const HomePage = () => {
  useEffect(() => {
    // Mock body loaded for opacity transition
    document.body.classList.add('loaded');

    // Load Lottie animation (mock path; replace with actual JSON)
    const animation = lottie.loadAnimation({
      container: document.getElementById('lottie-animation'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/animations/your-lottie-file.json', // Mock; replace with actual
    });

    // Cleanup
    return () => {
      animation.destroy();
      document.body.classList.remove('loaded');
    };
  }, []);

  // Mock testimonials data
  const testimonials = [
    {
      comment: "NMG Zembeta transformed our office with their exceptional cleaning services. Highly professional and reliable!",
      rating: "★★★★★",
      name: "Jane Doe",
    },
    {
      comment: "The catering for our event was flawless, with delicious food and impeccable service. Highly recommend!",
      rating: "★★★★☆",
      name: "John Smith",
    },
    {
      comment: "Their branding solutions gave our business a fresh, modern look. Truly outstanding work!",
      rating: "★★★★★",
      name: "Emily Johnson",
    },
  ];

  return (
    <>
      <div id="custom-cursor" className={styles.customCursor}></div> {/* Site-wide cursor; move to App if needed */}

      <section className={styles.heroSection}>
        <div className={styles.heroBackgroundImage}></div>
        <div className={styles.heroOverlay}></div>
        
        {/* TopNavigation component will go here */}
        
        <div className={styles.content}>
          <h1 className={styles.heroTitle}>My World. Your World. Our World.</h1>
          <p className={styles.heroSubtitle}>Premium Cleaning, Catering, Branding & Supply Solutions</p>
          <button className={styles.tourButton}>Explore Services</button>
        </div>

        <div id="lottie-animation" className={styles.lottieContainer}></div>
      </section>

      <div className={styles.aboutSection}>
        <div className={styles.aboutWrapper}>
          <div className={styles.leftSection}>
            <p>At NMG Zembeta Pty Ltd, our vision is to become a leading and trusted multi-service provider across South Africa. We set new standards for quality, reliability, and innovation by offering essential services under one unified, professional brand.</p>
            <img src="/images/risk.jpg" alt="NMG Team at Work" /> {/* Assume public/images */}
          </div>
          <div className={styles.rightSection}>
            <h1>WELCOME TO NMG ZEMBETA</h1>
            <p>We are committed to delivering high-quality services that meet the everyday needs of our clients — from cleaning and laundry to catering, embroidery, branding, consulting, and supplies. Every service we offer is guided by integrity, punctuality, and attention to detail. By investing in skilled staff, innovative practices, and strong client relationships, we simplify service access while uplifting the communities we serve.</p>
          </div>
        </div>
      </div>

      <section className={`${styles.servicesOverview} section`}>
        <div className="container">
          <h2 className={styles.sectionTitle}>What We Offer</h2>
          <div className={`${styles.servicesListCard} card`}>
            <ul>
              <li className={styles.serviceCleaning}><a href="...">Cleaning & Laundry Services</a></li>
              <li className={styles.servicePies}><a href="...">Pies & Noodles</a></li>
              <li className={styles.serviceLunchbox}><a href="...">Lunchbox Treats & Party Packs</a></li>
              <li className={styles.serviceRisk}><a href="...">Risk Consulting & Recruitment</a></li>
              <li className={styles.serviceEmbroidery}><a href="...">Embroidery, Branding & Custom Gifts</a></li>
              <li className={styles.serviceSupply}><a href="...">Supply, Delivery & Corporate Stationery</a></li>
            </ul>
          </div>
        </div>
      </section>

      <section id="testimonials" className={styles.testimonialsSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>What Our Clients Say</h2>
          <div className={styles.testimonialsGrid}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className={styles.testimonialCard}>
                <p className={styles.testimonialComment}>"{testimonial.comment}"</p>
                <div className={styles.testimonialRating}>{testimonial.rating}</div>
                <p className={styles.testimonialName}>{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer component will go here */}
    </>
  );
};

export default HomePage;
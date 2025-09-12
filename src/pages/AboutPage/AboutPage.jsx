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
      <section className="whyChooseUs bg-[#1E2A38] py-20 px-6">
        <h2 className="sectionTitle text-3xl md:text-4xl text-center text-[#2EC4B6] mb-12 font-bold">
          Why Choose NMG Zembeta?
        </h2>
        <div className="featuresGrid container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="featureItem group relative bg-[#2F3E46]/80 border border-[#2EC4B6]/30 rounded-xl p-6 text-center hover:bg-[#2EC4B6]/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
            <div className="icon mb-4">
              <svg className="w-12 h-12 mx-auto text-[#FFB703] group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-7h2v4h-2zm0-6h2v4h-2z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[#FFB703] mb-3 group-hover:text-white">One-Stop Shop</h3>
            <p className="text-[#E6E6E6] text-sm leading-relaxed">
              A diverse range of solutions, all under one reliable brand.
            </p>
          </div>
          <div className="featureItem group relative bg-[#2F3E46]/80 border border-[#2EC4B6]/30 rounded-xl p-6 text-center hover:bg-[#2EC4B6]/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
            <div className="icon mb-4">
              <svg className="w-12 h-12 mx-auto text-[#FFB703] group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[#FFB703] mb-3 group-hover:text-white">Skilled & Experienced Team</h3>
            <p className="text-[#E6E6E6] text-sm leading-relaxed">
              Staff carefully selected, trained, and equipped to deliver every service with professionalism and efficiency.
            </p>
          </div>
          <div className="featureItem group relative bg-[#2F3E46]/80 border border-[#2EC4B6]/30 rounded-xl p-6 text-center hover:bg-[#2EC4B6]/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
            <div className="icon mb-4">
              <svg className="w-12 h-12 mx-auto text-[#FFB703] group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v7.5a10 10 0 0010 10 10 10 0 0010-10V7l-10-5zm0 18a8 8 0 01-8-8V9.5l8-4 8 4V12a8 8 0 01-8 8z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[#FFB703] mb-3 group-hover:text-white">Reliable & Affordable</h3>
            <p className="text-[#E6E6E6] text-sm leading-relaxed">
              Consistent quality at competitive prices, making our services both accessible and dependable.
            </p>
          </div>
          <div className="featureItem group relative bg-[#2F3E46]/80 border border-[#2EC4B6]/30 rounded-xl p-6 text-center hover:bg-[#2EC4B6]/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
            <div className="icon mb-4">
              <svg className="w-12 h-12 mx-auto text-[#FFB703] group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[#FFB703] mb-3 group-hover:text-white">Client-Focused</h3>
            <p className="text-[#E6E6E6] text-sm leading-relaxed">
              Flexible and adaptable to your needs, budget, and expectations with excellent customer support.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
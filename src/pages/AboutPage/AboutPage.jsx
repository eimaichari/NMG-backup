import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useScrollReveal from '../../hooks/useScrollReveal';
import styles from './AboutPage.module.css';

export default function AboutPage() {
  useEffect(() => { document.title = 'About Us | NMG Zembeta Pty Ltd'; }, []);
  const pageRef = useScrollReveal();

  return (
    <div className={`page-wrapper ${styles.page}`} ref={pageRef}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <span className={`section-label reveal`}>Our Story</span>
            <h1 className={`display-heading ${styles.heroTitle} reveal reveal-delay-1`}>
              Everything you need<br />
              <em className={styles.accent}>in one company</em>
            </h1>
            <p className={`body-lg ${styles.heroSub} reveal reveal-delay-2`}>
              NMG Zembeta Pty Ltd was established to make life simpler by offering a range of 
              trusted services under one roof. Whether you need cleaning and laundry, catering, 
              recruitment, branding, corporate gifts or supply and delivery, you have one team ready 
              to help.
              <br /><br />
              Based in Randburg, we proudly serve clients across Gauteng and are committed to 
              expanding our reach while maintaining the quality and reliability that defines us. 
              Our name reflects our belief in a shared world where we work together to create 
              better outcomes for everyone.
            </p>
          </div>
        </div>
        <div className={styles.heroGrid} aria-hidden="true" />
        {/* Hero background image — full bleed behind content, darkened by CSS overlay */}
        <img
          src="/src/assets/images/team.jpg"
          alt=""
          aria-hidden="true"
          className={styles.heroBgImg}
          loading="eager"
        />
      </section>

      {/* Stats */}
      <div className={styles.statsStrip}>
        <div className="container">
          <ul className={styles.statsList} role="list">
            {[
              { value: '2024',  label: 'Founded' },
              { value: '500+',  label: 'Orders Served' },
              { value: '8+',    label: 'Services Offered' },
              { value: '4.9★',  label: 'Customer Rating' },
              { value: 'JHB',   label: 'Based in Randburg' },
            ].map((s, i) => (
              <li key={i} className={`${styles.statItem} reveal reveal-delay-${(i % 3) + 1}`}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mission & Vision */}
      <section className={`section ${styles.missionSection}`}>
        <div className="container">
          <div className={styles.missionGrid}>
            <div className={`${styles.missionCard} reveal`}>
              <div className={styles.missionIcon}>🎯</div>
              <h2 className={styles.missionTitle}>Our Mission</h2>
              <p className={styles.missionText}>
                To make everyday services easier to access by offering reliable cleaning
                , catering, recruitment, branding and supply services all in one place.
                We help homes, businesses and organisations save time, reduce stress 
                and get dependable service from a team they can trust.
              </p>
            </div>
            <div className={`${styles.missionCard} reveal reveal-delay-2`}>
              <div className={styles.missionIcon}>🌍</div>
              <h2 className={styles.missionTitle}>Our Vision</h2>
              <p className={styles.missionText}>
                To become one of South Africa's most trusted multi-service companies 
                by delivering quality work, building lasting relationships and making life 
                easier for the people we serve.
                <br />
                My World. Your World. Our World.
              </p>
            </div>
            <div className={`${styles.missionCard} reveal reveal-delay-3`}>
              <div className={styles.missionIcon}>💎</div>
              <h2 className={styles.missionTitle}>Our Values</h2>
              <p className={styles.missionText}>
                We believe in doing honest work, delivering consistent quality
                 and treating every client with respect.
                We keep our promises, charge fairly and work hard to build 
                relationships that last.
              </p>
            </div>
          </div>
          {/* Mission section bottom image strip — visual break between mission and timeline */}
          <div className={styles.missionImageStrip}>
            <img
              src="/src/assets/images/printing-caps.jpeg"
              alt="NMG Zembeta cleaning services"
              className={styles.missionStripImg}
              loading="lazy"
            />
            <img
              src="/src/assets/images/pexels-rethaferguson-4177708.jpg"
              alt="NMG Zembeta catering services"
              className={styles.missionStripImg}
              loading="lazy"
            />
            <img
              src="/src/assets/images/embroydery1.jpeg"
              alt="NMG Zembeta embroidery and branding"
              className={styles.missionStripImg}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Story timeline */}
      <section className={`section ${styles.timelineSection}`}>
        <div className="container">
          <div className={`${styles.sectionHeader} reveal`}>
            <span className="section-label">Our Journey</span>
            <h2 className="section-title">How We Got Here</h2>
          </div>
          <div className={styles.timeline}>
            {[
              {
                year:  'Jan 2024',
                title: 'NMG Zembeta Begins',
                desc:  'Incorporated in Randburg, Gauteng with a vision to make everyday services easier by bringing multiple solutions under one trusted brand',
              },
              {
                year:  'Q1 2024',
                title: 'First Services Launched',
                desc:  'Cleaning, laundry and catering services were introduced, helping local homes and businesses access reliable services without the hassle of dealing with multiple providers',
              },
              {
                year:  'Q2 2024',
                title: 'Expanded Service Offering',
                desc:  'As demand grew, we expanded into embroidery, branding, corporate merchandise, recruitment and risk consulting, giving clients even more ways to work with us',
              },
              {
                year:  'Q3 2025',
                title: 'Online Store Launched',
                desc:  'Our online platform launched, making it easier for customers across South Africa to browse our services, place orders and connect with our team',
              },
              {
                year:  'TODAY',
                title: 'Growing Across Gauteng',
                desc:  'We continue to grow our reach across Gauteng while improving our services and investing in long term relationships with the people and businesses we serve',
              },
            ].map((item, i) => (
              <div key={i} className={`${styles.timelineItem} reveal reveal-delay-${(i % 3) + 1}`}>
                <div className={styles.timelineDot} aria-hidden="true" />
                <div className={styles.timelineContent}>
                  <span className={styles.timelineYear}>{item.year}</span>
                  <h3 className={styles.timelineTitle}>{item.title}</h3>
                  <p className={styles.timelineDesc}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services summary */}
      <section className={`section ${styles.servicesSection}`}>
        <div className="container">
          <div className={`${styles.sectionHeader} reveal`}>
            <span className="section-label">What We Offer</span>
            <h2 className="section-title">Our Services at a Glance</h2>
          </div>
          <ul className={styles.servicesList} role="list">
            {[
              { icon: '🧹', name: 'Cleaning & Laundry',         desc: 'Reliable residential, commercial and laundry services designed to keep homes and businesses clean, organised and running smoothly' },
              { icon: '🍽️', name: 'Catering',                   desc: 'Fresh meals, lunchbox treats and party packs for schools, events, workplaces and special occasions' },
              { icon: '🪡', name: 'Embroidery & Branding',      desc: 'Custom embroidery, branded apparel and promotional products that help businesses stand out and look professional' },
              { icon: '🛡️', name: 'Risk Consulting',            desc: 'Professional support with risk assessments, recruitment and business solutions tailored to your needs' },
              { icon: '🖊️', name: 'Corporate Stationery',       desc: 'Branded diaries, pens, ID tags and promotional items designed to strengthen your brand identity' },
              { icon: '🚗', name: 'Custom Stickers & Gifts',    desc: 'Personalised gifts, car stickers and creative products for businesses, events and everyday celebrations' },
            ].map((s, i) => (
              <li key={i} className={`${styles.serviceItem} reveal reveal-delay-${(i % 3) + 1}`}>
                <span className={styles.serviceEmoji} role="img" aria-hidden="true">{s.icon}</span>
                <div>
                  <h3 className={styles.serviceName}>{s.name}</h3>
                  <p className={styles.serviceDesc}>{s.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className={`section ${styles.ctaSection}`}>
        <div className="container">
          <div className={`${styles.ctaCard} reveal`}>
            <h2 className={`section-title ${styles.ctaTitle}`}>
              Ready to Work With Us?
            </h2>
            <p className="body-lg">
              You do not need to juggle multiple providers to get the services you need. We are here to make life simpler by offering trusted solutions under one roof.
            </p>
            <div className={styles.ctaActions}>
              <Link to="/contact" className={`btn btn-primary btn-lg`}>
                Contact Us
              </Link>
              <Link to="/products" className={`btn btn-outline btn-lg`}>
                Browse Our Products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

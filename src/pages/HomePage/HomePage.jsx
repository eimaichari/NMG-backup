import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import useScrollReveal from '../../hooks/useScrollReveal';
import styles from './HomePage.module.css';

const META = {
  title: 'NMG Zembeta Pty Ltd | Professional Services in Randburg',
  description: 'Professional cleaning, catering, branding, and consulting services for businesses and homes in Randburg, Gauteng.',
};

export default function HomePage() {
  useEffect(() => {
    document.title = META.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', META.description);
  }, []);

  const pageRef = useScrollReveal();

  return (
    <div className={styles.page} ref={pageRef}>
      <HeroSection />
      <ManifestoStrip />
      <ServicesSection />
      <FeaturedProducts />
      <AboutTeaser />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   HERO — Full editorial, asymmetric, no orbs, no grids
══════════════════════════════════════════════════════════════ */
function HeroSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  const waLink = 'https://wa.me/27739740331?text=Hi%20NMG%20Zembeta%2C%20I%20would%20like%20to%20get%20a%20quote.';

  return (
    <section className={styles.hero} aria-label="Hero">
      {/* Vertical accent line */}
      <div className={styles.heroAccentLine} aria-hidden="true" />

      <div className={`container ${styles.heroInner}`}>
        {/* Left — Typography */}
        <div className={`${styles.heroLeft} ${loaded ? styles.heroLoaded : ''}`}>
          <div className={styles.heroEyebrow}>
            <span className="eyebrow">Randburg, South Africa</span>
            <div className={styles.eyebrowLine} aria-hidden="true" />
          </div>

          <h1 className={styles.heroHeadline}>
            <span className={styles.heroLine1}>Professional Services</span>
            <span className={styles.heroLine2}>
              <em className={styles.heroItalic}>for Homes,</em>
            </span>
            <span className={styles.heroLine2}>
              <em className={styles.heroItalic}>Businesses & Events</em>
            </span>
          </h1>

          <p className={styles.heroBody}>
            Need cleaning, catering, branding, laundry, recruitment, or supplies?
             NMG Zembeta brings multiple essential services together under one 
             reliable company, helping you save time, reduce hassle, and get the
             job done right
          </p>

          <div className={styles.heroActions}>
            <Link to="/products" className="btn btn-primary btn-lg">
              Browse Products
              <ArrowRight />
            </Link>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-lg"
            >
              Get a Quote
            </a>
          </div>

          <div className={styles.heroMeta}>
            <span className={styles.heroMetaItem}>Est. 2024</span>
            <span className={styles.heroMetaDot} aria-hidden="true" />
            <span className={styles.heroMetaItem}>500+ Orders</span>
            <span className={styles.heroMetaDot} aria-hidden="true" />
            <span className={styles.heroMetaItem}>Registered Pty Ltd</span>
          </div>
        </div>

        {/* Right — Visual */}
        <div className={`${styles.heroRight} ${loaded ? styles.heroRightLoaded : ''}`}>
          {/* SERVICE MARQUEE COLUMN */}
          <div className={styles.heroServiceCol} aria-hidden="true">
            {['Cleaning', 'Catering', 'Branding', 'Embroidery', 'Consulting', 'Stationery', 'Laundry', 'Events'].map((s, i) => (
              <div key={i} className={styles.heroServiceTag} style={{ '--delay': `${i * 0.08}s` }}>
                <span className={styles.heroServiceNum}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.heroServiceName}>{s}</span>
              </div>
            ))}
          </div>

          {/* STAT CARD */}
          <div className={styles.heroStatCard}>
            <span className={styles.heroStatNum}>8+</span>
            <span className={styles.heroStatLabel}>Services under one roof</span>
            <div className={styles.heroStatRule} aria-hidden="true" />
            <span className={styles.heroStatSub}>Trusted Across Gauteng</span>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className={styles.scrollCue} aria-hidden="true">
        <div className={styles.scrollLine} />
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   MANIFESTO STRIP
══════════════════════════════════════════════════════════════ */
function ManifestoStrip() {
  return (
    <div className={styles.manifesto}>
      <div className="container">
        <div className={styles.manifestoInner}>
          <blockquote className={styles.manifestoQuote}>
            <em>"My World. Your World. Our World."</em>
          </blockquote>
          <div className={styles.manifestoRule} aria-hidden="true" />
          <p className={styles.manifestoSub}>
            Supporting homes, businesses, schools, and events with practical services that make everyday operations easier.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SERVICES — Vertical editorial list, not a card grid
══════════════════════════════════════════════════════════════ */
const SERVICES = [
  {
    title: 'Cleaning & Laundry',
    desc: 'Reliable cleaning and laundry services for homes, offices, commercial spaces, and industrial environments across Gauteng',
    scope: 'Homes · Offices · Commercial · Industrial',
    /* Image for service row — replace path if needed */
    img: '/src/assets/images/corporate-cleaning.jpeg',
    imgAlt: 'Professional cleaning service',
  },
  {
    title: 'Catering Services',
    desc: 'Fresh pies, noodles, lunch packs, and party packs prepared for offices, schools, events, and special occasions',
    scope: 'Schools · Offices · Events · Special Occasions',
    img: '/src/assets/images/lunch-box-combo1.jpeg',
    imgAlt: 'Catering lunch box combo',
  },
  {
    title: 'Embroidery & Branding',
    desc: 'Custom uniforms, embroidery, promotional items, and branding solutions designed to help your business stand out',
    scope: 'Uniforms · Corporate · Branding · Promotional',
    img: '/src/assets/images/embroydery.jpeg',
    imgAlt: 'Custom embroidery branding',
  },
  {
    title: 'Risk Consulting',
    desc: 'Risk assessments, compliance support, and recruitment services that help businesses strengthen operations and build reliable teams.',
    scope: 'Risk · Compliance · Recruitment',
    img: '/src/assets/images/risk.jpg',
    imgAlt: 'Risk consulting services',
  },
  {
    title: 'Corporate Stationery',
    desc: 'Branded diaries, pens, tags, and corporate merchandise that reinforce your professional image',
    scope: 'Corporate · Branded · Custom Items',
    img: '/src/assets/images/diaries.jpeg',
    imgAlt: 'Branded corporate diaries and stationery',
  },
  {
    title: 'Custom Car Stickers',
    desc: 'Vehicle branding, custom decals, and promotional graphics that increase visibility wherever you go',
    scope: 'Vehicles · Decals · Promotional Graphics',
    img: '/src/assets/images/printing.jpeg',
    imgAlt: 'Custom printing and stickers',
  },
];

function ServicesSection() {
  return (
    <section className={`${styles.services}`} aria-labelledby="services-title">
      <div className="container">
        <div className={styles.servicesSplit}>
          {/* Left sticky header */}
          <div className={styles.servicesLeft}>
            <div className={`${styles.sectionLabel} reveal`}>
              <span className="eyebrow">What We Do</span>
            </div>
            <h2
              id="services-title"
              className={`${styles.servicesTitle} reveal reveal-delay-1`}
            >
              Essential services
              <br />
              <em className={styles.titleItalic}>that keeps life</em>
              <br />
              and business moving
            </h2>
            <p className={`${styles.servicesSubtext} reveal reveal-delay-2`}>
              Whether you're running a company, organizing an event, managing a school, 
              or simply need dependable support, NMG Zembeta delivers solutions you can 
              rely on
            </p>
            <div className={`reveal reveal-delay-3`}>
              <Link to="/products" className="btn btn-primary">
                Browse All Products <ArrowRight />
              </Link>
            </div>
          </div>

          {/* Right list */}
          <div className={styles.servicesList}>
            {SERVICES.map((s, i) => (
              <div
                key={i}
                className={`${styles.serviceItem} reveal reveal-delay-${(i % 3) + 1}`}
              >
                <span className={styles.serviceNum}>{String(i + 1).padStart(2, '0')}</span>
                <div className={styles.serviceContent}>
                  <h3 className={styles.serviceTitle}>{s.title}</h3>
                  <p className={styles.serviceDesc}>{s.desc}</p>
                  <span className={styles.serviceScope}>{s.scope}</span>
                </div>
                {/* Service thumbnail — replace src with actual image when verified */}
                <div className={styles.serviceThumb}>
                  <img
                    src={s.img}
                    alt={s.imgAlt}
                    loading="lazy"
                    className={styles.serviceThumbImg}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   FEATURED PRODUCTS — editorial tiles
══════════════════════════════════════════════════════════════ */
function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const q    = query(collection(db, 'products'), where('available', '==', true), limit(3));
        const snap = await getDocs(q);
        setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <FeaturedSkeleton />;
  if (!products.length) return null;

  return (
    <section className={styles.featured} aria-labelledby="featured-title">
      <div className="container">
        <div className={styles.featuredHeader}>
          <div className={styles.featuredHeaderLeft}>
            <span className="eyebrow reveal">Available Now</span>
            <h2 id="featured-title" className={`${styles.featuredTitle} reveal reveal-delay-1`}>
              Popular<br /><em className={styles.titleItalic}>Products</em>
            </h2>
          </div>
          <div className={`${styles.featuredHeaderRight} reveal`}>
            <Link to="/products" className="btn btn-outline">
              View All <ArrowRight />
            </Link>
          </div>
        </div>

        <div className={styles.productsGrid}>
          {products.map((p, i) => (
            <FeaturedProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProductCard({ product, index }) {
  const imgs = product.image_urls || [];
  const isLarge = index === 0;

  return (
    <Link
      to={`/products/${product.id}`}
      className={`${styles.featuredCard} ${isLarge ? styles.featuredCardLarge : ''} reveal reveal-delay-${index + 1}`}
      aria-label={`View ${product.name}`}
    >
      <div className={styles.featuredCardImg}>
        {imgs.length > 0 ? (
          <img src={imgs[0]} alt={product.name} loading="lazy" />
        ) : (
          <div className={styles.featuredCardImgPlaceholder}>
            <span>NMG</span>
          </div>
        )}
        <div className={styles.featuredCardOverlay}>
          <span className={styles.featuredCardCTA}>View Product <ArrowRight /></span>
        </div>
      </div>
      <div className={styles.featuredCardInfo}>
        <div className={styles.featuredCardMeta}>
          {product.category && (
            <span className={styles.featuredCardCategory}>{product.category}</span>
          )}
          <span className={styles.featuredCardPrice}>R{Number(product.price_rands).toFixed(2)}</span>
        </div>
        <h3 className={styles.featuredCardName}>{product.name}</h3>
      </div>
    </Link>
  );
}

function FeaturedSkeleton() {
  return (
    <section className={styles.featured}>
      <div className="container">
        <div className={styles.productsGrid}>
          {[1, 2, 3].map(i => (
            <div key={i} className={styles.featuredCard}>
              <div className={`skeleton ${styles.featuredCardImgSkeleton}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   ABOUT TEASER — editorial two-column
══════════════════════════════════════════════════════════════ */
function AboutTeaser() {
  return (
    <section className={styles.about} aria-labelledby="about-teaser-title">
      <div className="container">
        <div className={styles.aboutInner}>
          <div className={`${styles.aboutVisual} reveal`}>
            {/* About teaser main visual — team / work in progress image */}
            <img
              src="/src/assets/images/team-at-work.jpg"
              alt="NMG Zembeta team at work"
              className={styles.aboutVisualImg}
              loading="lazy"
            />
            {/* Overlay info block sits on top of the image */}
            <div className={styles.aboutVisualBlock}>
              <div className={styles.aboutVisualTop}>
                <span className={styles.aboutYear}>2024</span>
                <span className={styles.aboutYearLabel}>Founded</span>
              </div>
              <div className={styles.aboutVisualBottom}>
                <span className={styles.aboutLocation}>Randburg</span>
                <span className={styles.aboutLocationSub}>Gauteng, South Africa</span>
              </div>
            </div>
            <div className={styles.aboutVisualAccent} />
          </div>

          <div className={`${styles.aboutText} reveal reveal-delay-2`}>
            <span className="eyebrow">Our Story</span>
            <h2 id="about-teaser-title" className={styles.aboutTitle}>
              A business built around making
              <br />
              <em className={styles.titleItalic}>life easier</em>
            </h2>
            <p className={styles.aboutBody}>
              NMG Zembeta started with a simple goal, to provide dependable services that people
               can rely on without having to deal with multiple suppliers.
            </p>
            <p className={styles.aboutBody}>
              Whether we're cleaning a workspace, preparing catering orders, branding uniforms, or 
              supporting business operations, our goal remains the same: deliver quality work and 
              dependable service every time.
              <br /><br /> Today, we're proud to serve clients across Gauteng while continuing to build relationships 
              based on reliability, professionalism, and service.
            </p>
            <Link to="/about" className="btn btn-outline" style={{ marginTop: 'var(--space-8)' }}>
              Our Story <ArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   TESTIMONIALS — staggered, editorial
══════════════════════════════════════════════════════════════ */
const TESTIMONIALS = [
  {
    name: 'Thandeka M.',
    role: 'Business Owner, Randburg',
    text: 'NMG Zembeta handled our office cleaning and catering for our year-end function. Everything was done professionally and on time.',
    rating: 5,
  },
  {
    name: 'James K.',
    role: 'HR Manager, Johannesburg',
    text: 'We ordered branded diaries and embroidered shirts for our team. The quality was excellent and delivery was faster than expected.',
    rating: 5,
  },
  {
    name: 'Naledi S.',
    role: 'Event Planner',
    text: 'Ordered party packs and lunchbox treats for a corporate event. The presentation was beautiful. My clients were very happy.',
    rating: 5,
  },
];

function TestimonialsSection() {
  return (
    <section className={styles.testimonials} aria-labelledby="testimonials-title">
      <div className="container">
        <div className={`${styles.testimonialsHeader} reveal`}>
          <span className="eyebrow">Client Stories</span>
          <h2 id="testimonials-title" className={styles.testimonialsTitle}>
            Trusted by businesses<br />
            <em className={styles.titleItalic}>across Gauteng.</em>
          </h2>
        </div>

        <div className={styles.testimonialsGrid}>
          {TESTIMONIALS.map((t, i) => (
            <article
              key={i}
              className={`${styles.testimonialCard} reveal reveal-delay-${i + 1}`}
            >
              <div className={styles.testimonialStars} aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <StarIcon key={j} />
                ))}
              </div>
              <blockquote className={styles.testimonialText}>
                {t.text}
              </blockquote>
              <footer className={styles.testimonialFooter}>
                <div className={styles.testimonialInitial}>{t.name[0]}</div>
                <div>
                  <cite className={styles.testimonialName}>{t.name}</cite>
                  <p className={styles.testimonialRole}>{t.role}</p>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   CTA SECTION
══════════════════════════════════════════════════════════════ */
function CTASection() {
  const waLink = 'https://wa.me/27739740331?text=Hi%20NMG%20Zembeta%2C%20I%20would%20like%20to%20get%20a%20quote.';

  return (
    <section className={styles.cta} aria-labelledby="cta-title">
      <div className="container">
        <div className={styles.ctaInner}>
          <div className={`${styles.ctaLeft} reveal`}>
            <span className="eyebrow">Start Today</span>
            <h2 id="cta-title" className={styles.ctaTitle}>
              Ready to work<br />
              <em className={styles.titleItalic}>with us?</em>
            </h2>
          </div>
          <div className={`${styles.ctaRight} reveal reveal-delay-2`}>
            <p className={styles.ctaBody}>
            Need a quote or have a question?
            Send us a message on WhatsApp and our team will get back to you as quickly as possible, 
            usually within minutes during business hours.
            </p>
            <div className={styles.ctaActions}>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn btn-primary btn-lg ${styles.waBtn}`}
              >
                <WhatsAppIcon />
                Chat on WhatsApp
              </a>
              <Link to="/contact" className="btn btn-outline btn-lg">
                Send a Message
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Icons ─────────────────────────────────────────────────── */
const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M11.99 2C6.469 2 2 6.47 2 11.99c0 1.96.53 3.793 1.444 5.372L2 22l4.748-1.424A9.952 9.952 0 0 0 11.99 22C17.51 22 22 17.53 22 12.01 22 6.49 17.51 2 11.99 2z"/>
  </svg>
);

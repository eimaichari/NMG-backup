import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import useScrollReveal from '../../hooks/useScrollReveal';
import styles from './ContactPage.module.css';

export default function ContactPage() {
  const toast   = useToast();
  const pageRef = useScrollReveal();

  const [form, setForm]       = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [errors, setErrors]   = useState({});

  useEffect(() => { document.title = 'Contact Us | NMG Zembeta'; }, []);

  const update = (field) => (e) => {
    setForm(p => ({ ...p, [field]: e.target.value }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim())    errs.name    = 'Please enter your name.';
    if (!form.email)          errs.email   = 'Please enter your email.';
    if (!form.message.trim()) errs.message = 'Please enter your message.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const lines = [
      `Hi NMG Zembeta! 👋`,
      ``,
      `*Name:* ${form.name}`,
      `*Email:* ${form.email}`,
      form.phone    ? `*Phone:* ${form.phone}`     : null,
      form.subject  ? `*Subject:* ${form.subject}` : null,
      ``,
      `*Message:*`,
      form.message,
    ].filter(line => line !== null).join('\n');

    const encoded = encodeURIComponent(lines);
    const waUrl   = `https://wa.me/27717669014?text=${encoded}`;

    window.open(waUrl, '_blank', 'noopener,noreferrer');

    setSent(true);
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    toast.success('Opening WhatsApp with your message pre-filled!');
  };

  return (
    <div className={`page-wrapper ${styles.page}`} ref={pageRef}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className="container">
          <div className={styles.headerContent}>
            <span className="section-label reveal">Get In Touch</span>
            <h1 className={`section-title ${styles.pageTitle} reveal reveal-delay-1`}>
              Let's Talk About What You Need
            </h1>
            <p className={`body-lg reveal reveal-delay-2`}>
              Whether you're looking for cleaning services, catering, branding, recruitment
               or supplies, our team is ready to help.
               <br/><br/>
              Fill out the form or reach out via WhatsApp for a quick response
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.layout}>
          {/* Contact info */}
          <aside className={`${styles.infoCol} reveal`}>
            <div className={styles.infoCard}>
              <h2 className={styles.infoTitle}>Contact Information</h2>

              <div className={styles.contactItems}>
                {[
                  { icon: <PhoneIcon />,    label: 'Phone / WhatsApp', value: '+27 71 766 9014',               href: 'tel:+27717669014' },
                  { icon: <EmailIcon />,    label: 'Email',            value: 'nasiphizembeta@gmail.com',       href: 'mailto:nasiphizembeta@gmail.com' },
                  { icon: <LocationIcon />, label: 'Location',         value: 'Randburg, Gauteng, South Africa', href: null },
                  { icon: <ClockIcon />,    label: 'Business Hours',   value: 'Mon – Fri: 8am – 5pm\nSat: 9am – 1pm', href: null },
                ].map((item, i) => (
                  <div key={i} className={styles.contactItem}>
                    <div className={styles.contactItemIcon}>{item.icon}</div>
                    <div className={styles.contactItemBody}>
                      <span className={styles.contactItemLabel}>{item.label}</span>
                      {item.href
                        ? <a href={item.href} className={styles.contactItemValue}>{item.value}</a>
                        : <span className={styles.contactItemValue} style={{ whiteSpace: 'pre-line' }}>{item.value}</span>
                      }
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <div className={styles.waCta}>
                <p className={styles.waCtaText}>Fastest response on WhatsApp</p>
                <a
                  href="https://wa.me/27717669014?text=Hi%20NMG%20Zembeta%2C%20I%20would%20like%20to%20enquire%20about%20your%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn btn-lg btn-full ${styles.waCtaBtn}`}
                >
                  <WhatsAppIcon />
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Social links */}
            <div className={styles.socialCard}>
              <h3 className={styles.socialTitle}>Follow Us</h3>
              <div className={styles.socialLinks}>
                {[
                  { name: 'Facebook',  href: 'https://www.facebook.com/share/1F33u4amC7/',                                       icon: <FbIcon /> },
                  { name: 'Instagram', href: 'https://www.instagram.com/nmgm439?utm_source=qr&igsh=NmZyZW9rNnZuaGd1',            icon: <IgIcon /> },
                  { name: 'TikTok',   href: 'https://www.tiktok.com/@nasie325?_t=ZS-8z96uUQ1TeB&_r=1',                          icon: <TikTokIcon /> },
                  { name: 'YouTube',  href: 'https://youtube.com/@nasie6302/community?si=Oglk3z9MhHV0yr3L',                      icon: <YouTubeIcon /> },
                ].map(s => (
                  <a
                    key={s.name}
                    href={s.href}
                    className={styles.socialLink}
                    aria-label={`Follow us on ${s.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {s.icon}
                    <span>{s.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </aside>

          {/* Contact form */}
          <div className={`${styles.formCol} reveal reveal-delay-2`}>
            {sent ? (
              <div className={styles.sentState}>
                <div className={styles.sentIcon}><CheckCircleIcon /></div>
                <h2 className={styles.sentTitle}>Message Sent!</h2>
                <p className={styles.sentText}>WhatsApp opened with your message ready to send. We typically reply within a few hours!</p>
                <button className={`btn btn-primary`} onClick={() => setSent(false)}>Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form} noValidate>
                <h2 className={styles.formTitle}>Send a Message</h2>

                <div className={styles.formRow}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="c-name">Full Name *</label>
                    <input id="c-name" className={`form-input ${errors.name ? 'error' : ''}`} type="text" value={form.name} onChange={update('name')} placeholder="Your name" required />
                    {errors.name && <span className="form-error" role="alert">{errors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="c-email">Email Address *</label>
                    <input id="c-email" className={`form-input ${errors.email ? 'error' : ''}`} type="email" value={form.email} onChange={update('email')} placeholder="your@email.com" required />
                    {errors.email && <span className="form-error" role="alert">{errors.email}</span>}
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="c-phone">Phone Number</label>
                    <input id="c-phone" className="form-input" type="tel" value={form.phone} onChange={update('phone')} placeholder="+27 ..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="c-subject">Subject</label>
                    <input id="c-subject" className="form-input" type="text" value={form.subject} onChange={update('subject')} placeholder="What's this about?" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="c-message">Message *</label>
                  <textarea
                    id="c-message"
                    className={`form-input ${errors.message ? 'error' : ''}`}
                    value={form.message}
                    onChange={update('message')}
                    placeholder="Tell us how we can help…"
                    rows={6}
                    required
                  />
                  {errors.message && <span className="form-error" role="alert">{errors.message}</span>}
                </div>

                <button type="submit" className={`btn btn-primary btn-lg btn-full`} disabled={sending}>
                  <>Send via WhatsApp <WhatsAppIcon /></>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Icons ───────────────────────────────────────────────────── */
const PhoneIcon     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.34 2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.13 6.13l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const EmailIcon     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const LocationIcon  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const ClockIcon     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const CheckCircleIcon = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const WhatsAppIcon  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.99 2C6.469 2 2 6.47 2 11.99c0 1.96.53 3.793 1.444 5.372L2 22l4.748-1.424A9.952 9.952 0 0 0 11.99 22C17.51 22 22 17.53 22 12.01 22 6.49 17.51 2 11.99 2z"/></svg>;
const FbIcon        = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const IgIcon        = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
const TikTokIcon    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg>;
const YouTubeIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="var(--ink)"/></svg>;
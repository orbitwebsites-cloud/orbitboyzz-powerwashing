import { AnimatePresence, MotionConfig, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { captureAnalytics } from './analytics';

const services = [
  { number: '01', name: 'Driveway Washing', description: 'Lift away surface dirt and buildup for a cleaner, brighter welcome home.', icon: 'M3 17h18M5 17l2-7h10l2 7M8 10V7h8v3M7 21h10' },
  { number: '02', name: 'House Washing', description: "Refresh your home's exterior with a careful wash tailored to the surface.", icon: 'M3 11l9-7 9 7M5 10v10h14V10M9 20v-6h6v6', featured: true },
  { number: '03', name: 'Patio Washing', description: 'Clear away grime from your patio so your outdoor space feels ready to enjoy.', icon: 'M4 6h16v12H4zM4 12h16M10 6v12M17 6v12' },
];

const estimatePrices = {
  'Driveway Washing': '$200–$400',
  'House Washing': '$300–$600',
  'Patio Washing': '$150–$350',
};

const ease = [0.22, 1, 0.36, 1];
const reveal = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

function Reveal({ children, className = '', delay = 0, as = 'div', ...props }) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      variants={reveal}
      transition={{ delay }}
      {...props}
    >
      {children}
    </Component>
  );
}

function AnalyticsTracker() {
  useEffect(() => {
    const trackLink = (event) => {
      const link = event.target.closest('a');
      if (!link) return;
      const href = link.getAttribute('href') || '';
      const properties = {
        location: link.dataset.analyticsLocation || 'unknown',
        cta_text: link.textContent.trim().replace(/\s+/g, ' '),
      };
      if (href.startsWith('tel:')) captureAnalytics('phone_cta_clicked', properties);
      if (href === '#quote') captureAnalytics('quote_cta_clicked', { ...properties, service: link.dataset.analyticsService || null });
    };
    document.addEventListener('click', trackLink);
    return () => document.removeEventListener('click', trackLink);
  }, []);

  return null;
}

function Brand({ footer = false }) {
  return (
    <a className={`brand${footer ? ' footer-brand' : ''}`} href="#top" aria-label="Orbit PowerWash home">
      <span className="logo-symbol" aria-hidden="true"><img src="/images/orbit-powerwash-logo.png" alt="" /></span>
      <span className="brand-name">Orbit <small>PowerWash</small></span>
    </a>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <motion.header className={`site-header${scrolled ? ' scrolled' : ''}`} initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.65, ease }}>
      <div className="container nav-wrap">
        <Brand />
        <nav aria-label="Main navigation">
          <motion.button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="nav-links" onClick={() => setMenuOpen((open) => !open)} whileTap={{ scale: 0.94 }}>
            <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span><span></span><span></span><span></span>
          </motion.button>
          <div className={`nav-links${menuOpen ? ' open' : ''}`} id="nav-links">
            {['Services', 'Why us', 'Service area', 'FAQ'].map((label) => <a key={label} href={`#${label.toLowerCase().replaceAll(' ', '-')}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
            <motion.a className="button button-small" href="#quote" data-analytics-location="header" onClick={() => setMenuOpen(false)} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.97 }}>Get a Free Quote</motion.a>
          </div>
        </nav>
      </div>
    </motion.header>
  );
}

function Hero() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const imageY = useTransform(scrollYProgress, [0, 0.2], [0, reduceMotion ? 0 : 42]);
  const heroItem = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } };

  return (
    <section className="hero" id="top">
      <motion.div className="hero-glow" aria-hidden="true" animate={reduceMotion ? undefined : { scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="orbit-lines" aria-hidden="true" animate={reduceMotion ? undefined : { rotate: 360 }} transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}><span></span><span></span></motion.div>
      <div className="container hero-grid">
        <motion.div className="hero-copy" initial="hidden" animate="visible" transition={{ staggerChildren: 0.11, delayChildren: 0.18 }}>
          <motion.p className="eyebrow" variants={heroItem}><span></span> Plainsboro + West Windsor, NJ</motion.p>
          <motion.h1 variants={heroItem}>A cleaner home starts <em>at the curb.</em></motion.h1>
          <motion.p className="hero-lead" variants={heroItem}>Professional driveway, house, and patio washing—with clear quotes, careful work, and local service.</motion.p>
          <motion.div className="hero-actions" variants={heroItem}>
            <motion.a className="button" href="#quote" data-analytics-location="hero" whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.97 }}>Get a Free Quote <span aria-hidden="true">↗</span></motion.a>
            <motion.a className="button button-ghost" href="tel:+16092977412" data-analytics-location="hero" whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>Call (609) 297-7412</motion.a>
          </motion.div>
          <motion.div className="trust-row" aria-label="Service highlights" variants={heroItem}>
            <span><i aria-hidden="true">✓</i><b>Free</b> quotes</span><span><i aria-hidden="true">✓</i><b>Local</b> ownership</span><span><i aria-hidden="true">✓</i><b>Careful</b> work</span>
          </motion.div>
        </motion.div>
        <motion.div className="hero-visual" style={{ y: imageY }} initial={{ opacity: 0, x: 42, scale: 0.96 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.9, delay: 0.35, ease }}>
          <div className="photo-placeholder"><motion.img src="/images/suburban-home.jpg" alt="Clean suburban homes and driveways" initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 1.4, ease }} /></div>
          <motion.div className="photo-chip" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.45 }}><span aria-hidden="true">●</span> Local scheduling now open</motion.div>
          <motion.div className="result-tag" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05, duration: 0.5, ease }}><motion.span className="sparkle" animate={reduceMotion ? undefined : { rotate: [0, 14, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}>✦</motion.span><div><small>Exterior care</small><strong>Clean starts here</strong></div></motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Services({ onSelect }) {
  return (
    <section className="services section" id="services">
      <div className="container">
        <Reveal className="section-heading"><div><p className="eyebrow dark"><span></span> What we clean</p><h2>Three services.<br />One spotless standard.</h2></div><p>Focused exterior cleaning for the surfaces that make the biggest first impression.</p></Reveal>
        <div className="service-grid">
          {services.map((service, index) => (
            <motion.article className={`service-card${service.featured ? ' featured' : ''}`} key={service.name} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={reveal} transition={{ delay: index * 0.1 }} whileHover={{ y: -10 }}>
              <span className="card-number">{service.number}</span><motion.div className="icon-wrap" aria-hidden="true" whileHover={{ rotate: -5, scale: 1.06 }}><svg viewBox="0 0 24 24"><path d={service.icon} /></svg></motion.div><h3>{service.name}</h3><p>{service.description}</p><a href="#quote" data-analytics-location="service_card" data-analytics-service={service.name} onClick={() => onSelect(service.name)}>Request this service <span>↗</span></a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    ['01', 'Tell us what needs cleaning', 'Send the quick form or call with your address and service.'],
    ['02', 'Get a clear quote', 'We’ll review the job details and confirm your price.'],
    ['03', 'Pick a time that works', 'We’ll schedule your cleaning and keep communication simple.'],
  ];
  return (
    <section className="process section" aria-labelledby="process-title">
      <div className="container process-shell">
        <Reveal className="process-heading"><p className="eyebrow light"><span></span> Simple from start to finish</p><h2 id="process-title">A straightforward path to a cleaner exterior.</h2></Reveal>
        <ol className="process-list">{steps.map(([number, title, description], index) => <motion.li key={number} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={reveal} transition={{ delay: index * 0.11 }} whileHover={{ y: -5 }}><motion.span whileHover={{ rotate: -4, scale: 1.05 }}>{number}</motion.span><div><strong>{title}</strong><p>{description}</p></div></motion.li>)}</ol>
      </div>
    </section>
  );
}

function WhyOrbit() {
  const benefits = [
    ['01', 'Locally owned & operated', 'Serving our neighbors in Plainsboro and West Windsor.'],
    ['02', 'Clear, upfront quoting', 'Know what the job includes before the work begins.'],
    ['03', 'Satisfaction guaranteed', 'We check the work with you before we call it complete.'],
    ['04', 'Fast, reliable scheduling', 'Prompt replies and appointment times that respect your day.'],
  ];
  return (
    <section className="why section" id="why-us"><div className="container why-grid">
      <Reveal className="why-visual"><div className="before-after-placeholder"><motion.img src="/images/door-hanger-before-after.png" alt="Illustrative before and after view of a washed driveway" whileHover={{ scale: 1.025 }} transition={{ duration: 0.45, ease }} /><span className="before-label">Before</span><span className="after-label">After</span><div><small>Example result</small><strong>A noticeable clean from the curb.</strong></div></div><motion.div className="local-stamp" animate={{ rotate: [0, 3, 0, -3, 0] }} transition={{ duration: 8, repeat: Infinity }}><span>LOCALLY</span><strong>OWNED</strong><small>NJ</small></motion.div></Reveal>
      <Reveal className="why-copy" delay={0.08}><p className="eyebrow light"><span></span> Why Orbit</p><h2>Good work starts with earning your trust.</h2><p className="intro">We’re a new local business built around responsive service, clear communication, and results we’re proud to stand behind.</p><ul className="benefit-list">{benefits.map(([number, title, description], index) => <motion.li key={number} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: index * 0.08, ease }}><span>{number}</span><div><strong>{title}</strong><p>{description}</p></div></motion.li>)}</ul></Reveal>
    </div></section>
  );
}

function ServiceArea() {
  return <section className="area section" id="service-area"><Reveal className="container area-card"><div className="map-art"><motion.img src="/images/service-area.jpg" alt="Aerial view of a leafy residential neighborhood" whileHover={{ scale: 1.035 }} transition={{ duration: 0.55, ease }} /><span className="map-location"><motion.i aria-hidden="true" animate={{ scale: [1, 1.35, 1] }} transition={{ duration: 2, repeat: Infinity }}>●</motion.i> Plainsboro &amp; West Windsor</span></div><div className="area-copy"><p className="eyebrow dark"><span></span> Close to home</p><h2>Proudly serving your neighborhood.</h2><p>Professional exterior cleaning for homes across our two launch communities.</p><div className="location-badges"><span>Plainsboro, NJ</span><span>West Windsor, NJ</span></div></div></Reveal></section>;
}

function FAQ() {
  const questions = [
    ['Do I need to be home during the appointment?', 'Not usually. As long as we can access the area being cleaned and a working outdoor water spigot, you can leave the work to us.'],
    ['Will washing damage my siding, driveway, or patio?', 'We match the cleaning method to the surface, using a gentler approach for siding and delicate materials and higher pressure only where it is appropriate.'],
    ['Where does the water come from?', 'Most jobs use an outdoor spigot at your home. If one is not available, mention it in your quote request so we can plan ahead.'],
    ['How is the price determined?', 'Surface size, condition, access, and water availability all factor in. We confirm the exact scope and price with you before work begins.'],
  ];

  return (
    <section className="faq section" id="faq">
      <div className="container">
        <Reveal className="section-heading"><div><p className="eyebrow dark"><span></span> Common questions</p><h2>What to expect.</h2></div><p>A few helpful details before you book an exterior cleaning.</p></Reveal>
        <div className="faq-list">{questions.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
      </div>
    </section>
  );
}

function EstimateModal({ service, onClose, returnFocusRef }) {
  const reduceMotion = useReducedMotion();
  const closeRef = useRef(null);
  const dialogRef = useRef(null);
  const previousFocusRef = useRef(null);
  const pieces = useMemo(() => Array.from({ length: 52 }, (_, index) => ({
    id: index, x: `${(index * 37) % 100}%`, delay: (index % 12) * 0.035, rotate: (index * 79) % 520 - 260, color: ['#17d4ed', '#0b1e3d', '#63e8f6', '#f6b91d'][index % 4],
  })), []);

  useEffect(() => {
    previousFocusRef.current = returnFocusRef.current || document.activeElement;
    document.body.classList.add('modal-open');
    closeRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const focusable = dialogRef.current?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus?.();
    };
  }, [onClose, returnFocusRef]);

  return (
    <motion.div className="estimate-modal" role="dialog" aria-modal="true" aria-labelledby="estimate-title" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {!reduceMotion && <div className="confetti" aria-hidden="true">{pieces.map((piece) => <motion.i key={piece.id} style={{ left: piece.x, background: piece.color }} initial={{ y: '-5vh', rotate: 0, opacity: 1 }} animate={{ y: '110vh', rotate: piece.rotate, opacity: 0.2 }} transition={{ duration: 2.2 + (piece.id % 7) * 0.12, delay: piece.delay, ease: 'easeIn' }} />)}</div>}
      <motion.div ref={dialogRef} className="estimate-card" initial={{ opacity: 0, y: 24, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: 0.97 }} transition={{ duration: 0.42, ease }}>
        <motion.button ref={closeRef} className="modal-close" type="button" aria-label="Close estimate" onClick={onClose} whileHover={{ rotate: 6, scale: 1.05 }} whileTap={{ scale: 0.92 }}>×</motion.button>
        <motion.span className="success-icon" aria-hidden="true" initial={{ scale: 0.4, rotate: -12 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.16, duration: 0.45, ease }}>✓</motion.span>
        <p className="eyebrow dark"><span></span> Request received</p><h2 id="estimate-title">Your early estimate</h2><motion.strong className="estimate-price" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>{estimatePrices[service] || '$200–$400'}</motion.strong><p className="estimate-service">Preliminary range for {service}</p><p className="estimate-disclaimer">This is a preliminary range, not a final quote. Surface size, condition, access, and water availability may affect pricing.</p><div className="estimate-next"><span>What happens next</span><p>We’ll review your details and contact you to confirm an exact price and scheduling.</p></div><motion.button className="button modal-done" type="button" onClick={onClose} whileTap={{ scale: 0.97 }}>Sounds good</motion.button>
      </motion.div>
    </motion.div>
  );
}

function Quote({ selectedService, onSelect, onSuccess }) {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');

  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) { captureAnalytics('quote_request_validation_failed', { service: selectedService || null }); form.reportValidity(); setStatus('Please complete the required fields above.'); return; }
    const data = Object.fromEntries(new FormData(form));
    data._subject = `New ${data.service} quote request from ${data.name}`;
    data._template = 'table'; data._replyto = data.email;
    captureAnalytics('quote_request_attempted', { service: data.service });
    setSending(true); setStatus('');
    try {
      const response = await fetch('https://formsubmit.co/ajax/quotes@orbitpowerwash.com', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
      const result = await response.json();
      if (!response.ok || result.success === false) throw new Error('Submission failed');
      const submitButton = form.querySelector('button[type="submit"]');
      captureAnalytics('quote_request_submitted', { service: data.service });
      form.reset(); onSelect(''); setStatus('Thanks! Your quote request was saved and sent to Orbit PowerWash.'); onSuccess(data.service, submitButton);
    } catch {
      captureAnalytics('quote_request_failed', { service: data.service });
      setStatus(<>We couldn’t save your request. Please call or text <a href="tel:+16092977412">(609) 297-7412</a>.</>);
    } finally { setSending(false); }
  }

  return <section className="quote section" id="quote"><div className="container quote-grid"><Reveal className="quote-copy"><p className="eyebrow light"><span></span> Free, no-pressure estimate</p><h2>Let’s get your exterior looking fresh.</h2><p>Share a few details and we’ll follow up directly to confirm scope, pricing, and scheduling.</p><div className="quote-promises"><span><i>✓</i>No obligation</span><span><i>✓</i>Used only for your quote</span><span><i>✓</i>Direct local follow-up</span></div><motion.a className="phone-card" href="tel:+16092977412" data-analytics-location="quote_section" whileHover={{ y: -3 }}><span>Prefer to talk?</span><strong>(609) 297-7412</strong><small>Call or text Orbit PowerWash</small></motion.a></Reveal>
    <Reveal as="form" className={`quote-form${status && typeof status === 'string' && status.startsWith('Please') ? ' form-error' : ''}`} delay={0.08} onSubmit={submit} noValidate><input hidden type="text" name="_honey" tabIndex="-1" autoComplete="off" /><div className="form-row"><label>Name<input type="text" name="name" autoComplete="name" required placeholder="Your name" /></label><label>Phone<input type="tel" name="phone" autoComplete="tel" required placeholder="(555) 555-5555" /></label></div><label>Email<input type="email" name="email" autoComplete="email" required placeholder="you@example.com" /></label><label>Service address<input type="text" name="address" autoComplete="street-address" required placeholder="Street address, city, NJ" /></label><label>Service needed<select name="service" required value={selectedService} onChange={(event) => onSelect(event.target.value)}><option value="">Choose a service</option>{services.map((service) => <option key={service.name}>{service.name}</option>)}</select></label><label>Anything else we should know?<textarea name="message" rows="4" placeholder="Tell us about the area you'd like cleaned..."></textarea></label><motion.button className="button submit-button" type="submit" disabled={sending} whileTap={{ scale: 0.98 }}>{sending ? <><span className="button-spinner" aria-hidden="true"></span>Sending your request…</> : <>Request My Free Quote <span aria-hidden="true">↗</span></>}</motion.button><p className="form-note">Your information is used only to respond to your request. Prefer to talk? Call or text <a href="tel:+16092977412">(609) 297-7412</a>.</p><AnimatePresence mode="wait"><motion.output key={String(status)} className="form-status" aria-live="polite" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{status}</motion.output></AnimatePresence></Reveal>
  </div></section>;
}

function Footer() {
  return <footer><div className="container footer-grid"><Brand footer /><div><span>Serving</span><p>Plainsboro &amp; West Windsor, NJ</p></div><div><span>Call or text</span><p><a href="tel:+16092977412" data-analytics-location="footer">(609) 297-7412</a></p></div></div><div className="container footer-bottom"><p>© {new Date().getFullYear()} Orbit PowerWash. All rights reserved.</p><p>Clean surfaces. Clear standards.</p></div></footer>;
}

export default function App() {
  const [selectedService, setSelectedService] = useState('');
  const [estimateService, setEstimateService] = useState('');
  const estimateTriggerRef = useRef(null);
  const closeEstimate = useCallback(() => setEstimateService(''), []);
  const showEstimate = useCallback((service, trigger) => { estimateTriggerRef.current = trigger; setEstimateService(service); }, []);
  return <MotionConfig reducedMotion="user"><AnalyticsTracker /><a className="skip-link" href="#main">Skip to content</a><Header /><main id="main"><Hero /><Services onSelect={setSelectedService} /><Process /><WhyOrbit /><ServiceArea /><FAQ /><Quote selectedService={selectedService} onSelect={setSelectedService} onSuccess={showEstimate} /></main><Footer /><AnimatePresence>{estimateService ? <EstimateModal key="estimate" service={estimateService} onClose={closeEstimate} returnFocusRef={estimateTriggerRef} /> : null}</AnimatePresence><motion.div className="mobile-cta" aria-label="Quick contact options" initial={{ y: 90 }} animate={{ y: 0 }} transition={{ delay: 0.75, duration: 0.55, ease }}><a href="tel:+16092977412" data-analytics-location="mobile_sticky"><span>Call or text</span><strong>(609) 297-7412</strong></a><motion.a className="button" href="#quote" data-analytics-location="mobile_sticky" whileTap={{ scale: 0.96 }}>Free Quote</motion.a></motion.div></MotionConfig>;
}

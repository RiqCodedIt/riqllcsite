import usePageMeta from '../hooks/usePageMeta';
import '../styles/PageContent.css';
import '../styles/About.css';

const About = () => {
  usePageMeta({
    title: 'About | PRODBYRIQ',
    description: 'RIQ is a professional music producer and mix engineer. Learn about the experience and credits behind PRODBYRIQ.',
    canonicalPath: '/about',
  });

  return (
    <div className="page-content ab-page">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="ab-hero">
        <div className="ab-container">
          <p className="ab-eyebrow">Producer · Mix Engineer · Pianist</p>
          <h1>About RIQ</h1>
          <p className="ab-hero-sub">
            Making music that moves people — remotely, from scratch, at any distance.
          </p>
        </div>
      </section>

      {/* ── Bio ──────────────────────────────────────────────── */}
      <section className="ab-bio-section">
        <div className="ab-container ab-bio-grid">
          <div className="ab-photo-wrap">
            <div className="ab-photo-placeholder" role="img" aria-label="Producer photo">
              <span className="ab-photo-initials" aria-hidden="true">RIQ</span>
            </div>
          </div>
          <div className="ab-bio-body">
            <h2>Tariq Georges</h2>
            <p className="ab-bio-role">Producer · Mix Engineer · Pianist</p>
            <p>
              Tariq Georges is a multi-faceted musician trained in classical piano since age 4.
              A self-taught producer and audio engineer, he built his craft during 2020 and now
              works with artists from Boston, London, and beyond to deliver industry-grade records.
            </p>
            <p>
              Every project starts with the music — not the template. Whether it&apos;s a beat from
              scratch or stems that need a final mix, the goal is the same: a record you&apos;re proud
              to put out.
            </p>
          </div>
        </div>
      </section>

      {/* ── Credits ──────────────────────────────────────────── */}
      <section className="ab-credits-section" aria-labelledby="ab-credits-heading">
        <div className="ab-container">
          <h2 id="ab-credits-heading">Credits</h2>
          <p className="ab-section-sub">Selected production, mixing, and mastering work.</p>
          <ul className="ab-credits-list">
            <li className="ab-credit-item">
              <span className="ab-credit-title">Credit Title &mdash; Artist Name</span>
              <span className="ab-credit-role">Produced by RIQ</span>
            </li>
            <li className="ab-credit-item">
              <span className="ab-credit-title">Credit Title &mdash; Artist Name</span>
              <span className="ab-credit-role">Mixed &amp; Mastered by RIQ</span>
            </li>
            <li className="ab-credit-item">
              <span className="ab-credit-title">Credit Title &mdash; Artist Name</span>
              <span className="ab-credit-role">Mixed by RIQ</span>
            </li>
          </ul>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section className="ab-testimonials-section" aria-labelledby="ab-testimonials-heading">
        <div className="ab-container">
          <h2 id="ab-testimonials-heading">What Artists Say</h2>
          <div className="ab-testimonials-grid">
            <blockquote className="ab-testimonial">
              <p>&ldquo;Testimonial quote goes here &mdash; replace with a real client review.&rdquo;</p>
              <cite>&mdash; Artist Name</cite>
            </blockquote>
            <blockquote className="ab-testimonial">
              <p>&ldquo;Second testimonial quote goes here &mdash; replace with a real client review.&rdquo;</p>
              <cite>&mdash; Artist Name</cite>
            </blockquote>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;

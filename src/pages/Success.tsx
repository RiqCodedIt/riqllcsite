import { useEffect, useState } from 'react';
import usePageMeta from '../hooks/usePageMeta';
import { useLocation, Link } from 'react-router-dom';
import '../styles/PageContent.css';
import '../styles/Success.css';

const CONSULTATION_CALENDAR_URL =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ2hV23dUVFD8uG_Z_K-1SkgVvAjw7yYxG9PzkSZ9kjWiC3l53mS8iFK5lfAMfiiVuJn5A-NR58r?gv=true';

const Success = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [hasConsultation, setHasConsultation] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  usePageMeta({
    title: 'Order Confirmed | PRODBYRIQ',
    description: 'Your order has been confirmed. Thank you for your purchase.',
    canonicalPath: '/success',
    noIndex: true,
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const stripeSessionId = params.get('session_id');
    const consultationFlag = params.get('has_consultation');
    // Reset all state so navigating to a different /success URL never shows stale data
    setSessionId(stripeSessionId);
    setHasConsultation(consultationFlag === '1');
    setLoading(false);
  }, [location.search]);

  if (loading) {
    return (
      <div className="page-content">
        <div className="succ-center">
          <p className="succ-loading">Confirming your order…</p>
        </div>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="page-content">
        <div className="succ-center">
          <div className="succ-error">
            <h2>No order found</h2>
            <p>This page can only be accessed after a completed checkout.</p>
            <Link to="/" className="succ-home-btn">Return to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content succ-page">
      <div className="succ-container">

        {/* ── Icon ─────────────────────────────────────────── */}
        <div className="succ-icon-wrap" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* ── Heading ──────────────────────────────────────── */}
        <h1 className="succ-heading">Order Confirmed</h1>
        <p className="succ-subheading">
          Thank you for your purchase. You&apos;ll receive a Stripe receipt via email shortly.
        </p>

        {/* ── Reference ────────────────────────────────────── */}
        <div className="succ-reference">
          <span className="succ-reference-label">Order reference</span>
          <code className="succ-reference-value">{sessionId}</code>
        </div>

        {/* ── Next Steps ───────────────────────────────────── */}
        {hasConsultation ? (
          <div className="succ-block">
            <h2>Book Your Consultation</h2>
            <p>Select a time slot for your artist consultation session:</p>
            <div className="succ-calendar">
              <iframe
                src={CONSULTATION_CALENDAR_URL}
                style={{ border: 0 }}
                width="100%"
                height="600"
                frameBorder="0"
                title="Book Consultation Session"
              />
            </div>
          </div>
        ) : (
          <div className="succ-block">
            <h2>What Happens Next</h2>
            <ol className="succ-steps">
              <li>RIQ will reach out with stem upload instructions for mixing / mastering orders</li>
              <li>Beat lease download links will be sent to your email</li>
              <li>Turnaround begins once your files are received</li>
            </ol>
          </div>
        )}

        <Link to="/" className="succ-home-btn">Return to Home</Link>
      </div>
    </div>
  );
};

export default Success;

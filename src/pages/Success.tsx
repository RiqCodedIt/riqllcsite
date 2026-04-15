import { useEffect, useState } from 'react';
import usePageMeta from '../hooks/usePageMeta';
import { useLocation, Link } from 'react-router-dom';
import '../styles/PageContent.css';
import '../styles/Success.css';

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

        if (stripeSessionId) {
            setSessionId(stripeSessionId);
            // Check if this order included a consultation service
            // The backend webhook handles fulfillment; we just display confirmation here.
            // If a consultation was purchased, the backend can set a query param or we
            // can inspect the cart snapshot stored in sessionStorage before checkout.
            const consultationFlag = params.get('has_consultation');
            if (consultationFlag === '1') {
                setHasConsultation(true);
            }
        }

        setLoading(false);
    }, [location]);

    if (loading) {
        return (
            <div className="page-content">
                <div className="success-container">
                    <div className="loading-message">
                        <h3>Processing your order…</h3>
                        <p>Please wait while we confirm your payment.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!sessionId) {
        return (
            <div className="page-content">
                <div className="success-container">
                    <div className="error-message">
                        <h3>No order found</h3>
                        <p>This page can only be accessed after a completed checkout.</p>
                        <Link to="/" className="home-button">Return to Home</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-content">
            <h2>Payment Successful!</h2>

            <div className="success-container">
                <div className="success-icon">✓</div>

                <div className="success-message">
                    <h3>Thank you for your purchase</h3>
                    <p>Your order has been confirmed. You'll receive a confirmation email shortly.</p>

                    {sessionId && (
                        <p className="booking-reference">
                            Order Reference: <span>{sessionId}</span>
                        </p>
                    )}

                    {hasConsultation ? (
                        <div className="consultation-booking">
                            <h4>Book Your Consultation Session</h4>
                            <p>Select a time slot for your artist consultation:</p>
                            <div className="calendar-container">
                                <iframe
                                    src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ2hV23dUVFD8uG_Z_K-1SkgVvAjw7yYxG9PzkSZ9kjWiC3l53mS8iFK5lfAMfiiVuJn5A-NR58r?gv=true"
                                    style={{ border: 0 }}
                                    width="100%"
                                    height="600"
                                    frameBorder="0"
                                    title="Book Consultation Session"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="next-steps">
                            <h4>Next Steps</h4>
                            <ol>
                                <li>You'll receive an email confirmation with order details</li>
                                <li>For mixing / mastering services, RIQ will reach out with stem upload instructions</li>
                                <li>For beat leases, download links will be provided via email</li>
                            </ol>
                        </div>
                    )}

                    <div className="action-buttons">
                        <Link to="/" className="home-button">Return to Home</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Success;

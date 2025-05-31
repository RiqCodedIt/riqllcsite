import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../styles/PageContent.css';
import '../styles/Success.css';

const Success = () => {
    const [bookingId, setBookingId] = useState<string | null>(null);
    const location = useLocation();

    useEffect(() => {
        // Get query parameters from URL
        const params = new URLSearchParams(location.search);
        const bookingIdParam = params.get('booking_id');

        if (bookingIdParam) {
            setBookingId(bookingIdParam);
        }
    }, [location]);

    return (
        <div className="page-content">
            <h2>Payment Successful!</h2>
            
            <div className="success-container">
                <div className="success-icon">✓</div>
                
                <div className="success-message">
                    <h3>Thank you for your booking</h3>
                    <p>Your booking has been confirmed and you will receive a confirmation shortly.</p>
                    
                    {bookingId && (
                        <p className="booking-reference">
                            Booking Reference: <span>{bookingId}</span>
                        </p>
                    )}
                    
                    <div className="next-steps">
                        <h4>Next Steps</h4>
                        <ol>
                            <li>You'll receive an text message with booking details</li>
                            <li>RIQ will reach out to confirm your session time</li>
                            <li>Prepare any reference tracks or materials before your session</li>
                        </ol>
                    </div>
                    
                    <div className="action-buttons">
                        <Link to="/" className="home-button">Return to Home</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Success;

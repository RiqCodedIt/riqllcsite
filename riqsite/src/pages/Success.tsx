import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { googleSheetsService } from '../services/googleSheets';
import type { StudioBookingData } from '../services/googleSheets';
import '../styles/PageContent.css';
import '../styles/Success.css';

const Success = () => {
    const [bookingId, setBookingId] = useState<string | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [hasConsultation, setHasConsultation] = useState(false);
    const [hasStudioSession, setHasStudioSession] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const location = useLocation();

    useEffect(() => {
        const processSuccessfulPayment = async () => {
            try {
                // Get query parameters from URL
                const params = new URLSearchParams(location.search);
                const bookingIdParam = params.get('booking_id');
                const orderIdParam = params.get('order_id');
                const sessionId = params.get('session_id');

                if (bookingIdParam) {
                    setBookingId(bookingIdParam);
                } else if (orderIdParam) {
                    setOrderId(orderIdParam);
                    
                    // Fetch order details to determine what was purchased
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/bookings`);
                    if (response.ok) {
                        const bookings = await response.json();
                        const order = bookings.find((b: any) => b.id === orderIdParam);
                        
                        if (order) {
                            setHasConsultation(order.has_consultation || false);
                            setHasStudioSession(order.has_studio_session || false);
                            
                            // If there's a studio session, send data to Google Sheets
                            if (order.has_studio_session) {
                                await sendStudioDataToSheets(order);
                            }
                        }
                    }
                }
            } catch (err) {
                console.error('Error processing payment:', err);
                setError('There was an issue processing your order. Please contact support.');
            } finally {
                setLoading(false);
            }
        };

        processSuccessfulPayment();
    }, [location]);

    const sendStudioDataToSheets = async (order: any) => {
        try {
            // Find studio session in the order
            const studioSession = order.items.find((item: any) => item.type === 'studio_session');
            if (!studioSession) return;

            const bookingData: StudioBookingData = {
                timestamp: new Date().toISOString(),
                booking_id: order.id,
                customer_name: order.customer_info?.name || 'N/A',
                email: order.customer_info?.email || 'N/A',
                phone: order.customer_info?.phone || 'N/A',
                studio_name: studioSession.studio_name,
                session_date: studioSession.date,
                session_time: studioSession.time_slot,
                session_type: studioSession.session_type,
                duration: studioSession.duration,
                total_cost: studioSession.price,
                special_requests: 'N/A',
                payment_status: 'paid'
            };

            await googleSheetsService.sendStudioBookingToSheets(bookingData);
        } catch (err) {
            console.error('Error sending data to Google Sheets:', err);
            // Don't show error to user, just log it
        }
    };

    if (loading) {
        return (
            <div className="page-content">
                <div className="success-container">
                    <div className="loading-message">
                        <h3>Processing your order...</h3>
                        <p>Please wait while we confirm your payment.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-content">
                <div className="success-container">
                    <div className="error-message">
                        <h3>Payment Error</h3>
                        <p>{error}</p>
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
                    <p>Your order has been confirmed and you will receive a confirmation shortly.</p>
                    
                    {(bookingId || orderId) && (
                        <p className="booking-reference">
                            Order Reference: <span>{bookingId || orderId}</span>
                        </p>
                    )}
                    
                    {/* Show Google Calendar for Artist Consultation */}
                    {hasConsultation && (
                        <div className="consultation-booking">
                            <h4>Book Your Consultation Session</h4>
                            <p>Please select a time slot for your artist consultation using the calendar below:</p>
                            <div className="calendar-container">
                                <iframe 
                                    src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ2hV23dUVFD8uG_Z_K-1SkgVvAjw7yYxG9PzkSZ9kjWiC3l53mS8iFK5lfAMfiiVuJn5A-NR58r?gv=true" 
                                    style={{border: 0}} 
                                    width="100%" 
                                    height="600" 
                                    frameBorder="0"
                                    title="Book Consultation Session"
                                />
                            </div>
                        </div>
                    )}
                    
                    {/* Show next steps for studio sessions */}
                    {hasStudioSession && (
                        <div className="next-steps">
                            <h4>Next Steps for Your Studio Session</h4>
                            <ol>
                                <li>Your booking details have been sent to our team</li>
                                <li>RIQ will reach out to confirm your session time</li>
                                <li>You'll receive a text message with final details</li>
                                <li>Prepare any reference tracks or materials before your session</li>
                            </ol>
                        </div>
                    )}
                    
                    {/* Show general next steps for other purchases */}
                    {!hasConsultation && !hasStudioSession && (
                        <div className="next-steps">
                            <h4>Next Steps</h4>
                            <ol>
                                <li>You'll receive an email confirmation with order details</li>
                                <li>For services, RIQ will reach out with instructions</li>
                                <li>For beats, download links will be provided via email</li>
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

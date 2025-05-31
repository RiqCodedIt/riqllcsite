import React from 'react';
import type { StudioBookingData } from '../types/booking';
import { useCart } from './cart/CartProvider';

interface BookingSummaryProps {
  bookingData: Partial<StudioBookingData>;
  totalCost: number;
  depositAmount: number;
  referenceNumber: string;
  onAddToCart?: () => void;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  bookingData,
  totalCost,
  depositAmount,
  referenceNumber,
  onAddToCart
}) => {
  const { addStudioSessionToCart } = useCart();
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="step-content">
      <h3>Review & Confirm Booking</h3>
      <p className="step-description">
        Please review all details before proceeding to payment
      </p>

      <div className="booking-summary">
        {/* Booking Reference */}
        <div className="summary-section reference-section">
          <div className="reference-number">
            <h4>Booking Reference</h4>
            <span className="reference-code">{referenceNumber}</span>
          </div>
          <p className="reference-note">
            Save this reference number for your records
          </p>
        </div>

        {/* Studio & Session Details */}
        <div className="summary-section">
          <h4>Studio & Session</h4>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Studio:</span>
              <span className="summary-value">{bookingData.sessionDetails?.studio?.name}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Date:</span>
              <span className="summary-value">
                {bookingData.sessionDetails?.date 
                  ? formatDate(bookingData.sessionDetails.date)
                  : 'Not selected'
                }
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Time:</span>
              <span className="summary-value">{bookingData.sessionDetails?.timeSlot?.label}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Duration:</span>
              <span className="summary-value">{bookingData.sessionDetails?.timeSlot?.duration} hours</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Session Type:</span>
              <span className="summary-value">{bookingData.sessionDetails?.sessionType}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Number of People:</span>
              <span className="summary-value">
                {bookingData.sessionDetails?.numberOfPeople} {
                  bookingData.sessionDetails?.numberOfPeople === 1 ? 'person' : 'people'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="summary-section">
          <h4>Contact Information</h4>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Name:</span>
              <span className="summary-value">{bookingData.contactInfo?.fullName}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Email:</span>
              <span className="summary-value">{bookingData.contactInfo?.email}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Phone:</span>
              <span className="summary-value">{bookingData.contactInfo?.phone}</span>
            </div>
          </div>
        </div>



        {/* Special Requests */}
        {bookingData.sessionDetails?.specialRequests && (
          <div className="summary-section">
            <h4>Special Requests</h4>
            <div className="special-requests">
              <p>{bookingData.sessionDetails.specialRequests}</p>
            </div>
          </div>
        )}

        {/* Studio Features */}
        {bookingData.sessionDetails?.studio?.features && (
          <div className="summary-section">
            <h4>Studio Features</h4>
            <div className="studio-features-list">
              <ul>
                {bookingData.sessionDetails.studio.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Cost Breakdown */}
        <div className="summary-section cost-section">
          <h4>Cost Breakdown</h4>
          <div className="cost-breakdown">
            <div className="cost-item">
              <span className="cost-label">
                {bookingData.sessionDetails?.studio?.name} 
                ({bookingData.sessionDetails?.timeSlot?.duration} hours @ {formatCurrency(bookingData.sessionDetails?.studio?.hourlyRate || 0)}/hour)
              </span>
              <span className="cost-value">{formatCurrency(totalCost)}</span>
            </div>
            
            <div className="cost-item subtotal">
              <span className="cost-label">Session Total</span>
              <span className="cost-value">{formatCurrency(totalCost)}</span>
            </div>
            
            <div className="cost-item deposit">
              <span className="cost-label">Deposit (50% - Due Now)</span>
              <span className="cost-value">{formatCurrency(depositAmount)}</span>
            </div>
            
            <div className="cost-item remaining">
              <span className="cost-label">Remaining (Due on Arrival)</span>
              <span className="cost-value">{formatCurrency(totalCost - depositAmount)}</span>
            </div>
            
            <div className="cost-item total">
              <span className="cost-label">Charging Today</span>
              <span className="cost-value">{formatCurrency(depositAmount)}</span>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="summary-section notes-section">
          <h4>Important Information</h4>
          <div className="booking-notes">
            <ul>
              <li>
                <strong>Cancellation Policy:</strong> Free cancellation up to 24 hours before your session. 
                Cancellations within 24 hours are subject to a 50% charge.
              </li>
              <li>
                <strong>Arrival:</strong> Please arrive 15 minutes early for setup and orientation.
              </li>
              <li>
                <strong>Payment:</strong> A 50% deposit is required to secure your booking. 
                The remaining balance will be collected upon arrival at the studio.
              </li>
              <li>
                <strong>Contact:</strong> For questions or changes, contact us at therecordco.org
              </li>
            </ul>
          </div>
        </div>

        {/* Confirmation */}
        <div className="summary-section confirmation-section">
          <div className="confirmation-text">
            <p>
              By adding to cart, you agree to our terms of service and 
              confirm that all information provided is accurate.
            </p>
          </div>
          
          <div className="cart-actions">
            <button 
              className="add-to-cart-btn"
              onClick={() => {
                if (bookingData.sessionDetails) {
                  addStudioSessionToCart({
                    session_id: referenceNumber,
                    studio_name: bookingData.sessionDetails.studio?.name || 'Studio',
                    date: bookingData.sessionDetails.date || '',
                    time_slot: bookingData.sessionDetails.timeSlot?.label || '',
                    session_type: bookingData.sessionDetails.sessionType || '',
                    duration: bookingData.sessionDetails.timeSlot?.duration || 4,
                    price: depositAmount // Charge deposit amount
                  });
                  if (onAddToCart) onAddToCart();
                }
              }}
            >
              Add Studio Session to Cart - {formatCurrency(depositAmount)}
            </button>
            <p className="deposit-note">
              Only the 50% deposit ({formatCurrency(depositAmount)}) will be charged now.
              Remaining {formatCurrency(totalCost - depositAmount)} due on arrival.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;

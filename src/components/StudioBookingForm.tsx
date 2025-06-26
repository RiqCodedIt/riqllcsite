import React, { useState, useEffect } from 'react';
import type { Studio, TimeSlot, ContactInfo, SessionDetails, StudioBookingData } from '../types/booking';
import { useBookingValidation } from '../hooks/useBookingValidation';
import { useAvailability } from '../hooks/useAvailability';
import '../styles/StudioBooking.css';

import StudioSelector from './StudioSelector';
import DateTimePicker from './DateTimePicker';
import ContactForm from './ContactForm';
import SessionDetailsForm from './SessionDetailsForm';
import BookingSummary from './BookingSummary';

const StudioBookingForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Form data state
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [contactInfo, setContactInfo] = useState<Partial<ContactInfo>>({});
  const [sessionDetails, setSessionDetails] = useState<Partial<SessionDetails>>({
    numberOfPeople: 1,
    specialRequests: ''
  });

  // Hooks
  const {
    errors,
    validateStep1,
    validateStep2,
    validateStep3,
    validateStep4,
    clearErrors,
    setErrors
  } = useBookingValidation();

  const { reserveSlot, releaseSlot } = useAvailability();

  // Generate booking reference number
  const [referenceNumber] = useState(() => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `REC-${timestamp.slice(-6)}${random}`;
  });

  // Calculate total cost
  const totalCost = selectedStudio && selectedTimeSlot 
    ? selectedStudio.hourlyRate * selectedTimeSlot.duration 
    : 0;
  
  // Calculate deposit (50% of total)
  const depositAmount = totalCost * 0.5;

  // Handle input changes
  const handleContactInfoChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setContactInfo(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof ContactInfo] as any),
          [child]: value
        }
      }));
    } else {
      setContactInfo(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSessionDetailsChange = (field: string, value: any) => {
    setSessionDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Step validation and navigation
  const validateCurrentStep = (): boolean => {
    clearErrors();
    
    switch (currentStep) {
      case 1: {
        const validation = validateStep1({ studio: selectedStudio });
        if (!validation.isValid) {
          setErrors(validation.errors);
          return false;
        }
        break;
      }
      case 2: {
        const validation = validateStep2({ 
          date: selectedDate, 
          timeSlot: selectedTimeSlot 
        });
        if (!validation.isValid) {
          setErrors(validation.errors);
          return false;
        }
        break;
      }
      case 3: {
        const validation = validateStep3(contactInfo);
        if (!validation.isValid) {
          setErrors(validation.errors);
          return false;
        }
        break;
      }
      case 4: {
        const validation = validateStep4({
          ...sessionDetails,
          studio: selectedStudio!,
          date: selectedDate,
          timeSlot: selectedTimeSlot!
        });
        if (!validation.isValid) {
          setErrors(validation.errors);
          return false;
        }
        break;
      }
    }
    
    return true;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
      setSubmitError(null);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    clearErrors();
    setSubmitError(null);
  };

  // Reserve slot when moving to contact info step
  useEffect(() => {
    if (currentStep === 3 && selectedStudio && selectedDate && selectedTimeSlot) {
      reserveSlot(selectedDate, selectedStudio, selectedTimeSlot);
    }
  }, [currentStep, selectedStudio, selectedDate, selectedTimeSlot, reserveSlot]);

  // Release slot if user goes back from contact info
  useEffect(() => {
    if (currentStep < 3 && selectedStudio && selectedDate && selectedTimeSlot) {
      releaseSlot(selectedDate, selectedStudio, selectedTimeSlot);
    }
  }, [currentStep, selectedStudio, selectedDate, selectedTimeSlot, releaseSlot]);

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    setLoading(true);
    setSubmitError(null);

    try {
      // Construct booking data
      const bookingData: StudioBookingData = {
        contactInfo: contactInfo as ContactInfo,
        sessionDetails: {
          studio: selectedStudio!,
          date: selectedDate,
          timeSlot: selectedTimeSlot!,
          sessionType: sessionDetails.sessionType!,
          numberOfPeople: sessionDetails.numberOfPeople!,
          specialRequests: sessionDetails.specialRequests || ''
        },
        booking: {
          referenceNumber,
          totalCost: depositAmount, // Only charge deposit amount
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      };

      // Here you would typically send to your backend API
      // For now, we'll simulate the Stripe checkout creation
      const response = await fetch('/api/create-studio-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  // Render current step content
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StudioSelector
            selectedStudio={selectedStudio}
            onStudioSelect={setSelectedStudio}
            error={errors.studio}
          />
        );
      
      case 2:
        return selectedStudio ? (
          <DateTimePicker
            selectedStudio={selectedStudio}
            selectedDate={selectedDate}
            selectedTimeSlot={selectedTimeSlot}
            onDateSelect={setSelectedDate}
            onTimeSlotSelect={setSelectedTimeSlot}
            error={errors.date || errors.timeSlot}
          />
        ) : null;
      
      case 3:
        return (
          <ContactForm
            contactInfo={contactInfo}
            onContactInfoChange={handleContactInfoChange}
            errors={errors}
          />
        );
      
      case 4:
        return (
          <SessionDetailsForm
            sessionDetails={sessionDetails}
            onSessionDetailsChange={handleSessionDetailsChange}
            errors={errors}
          />
        );
      
      case 5:
        return (
          <BookingSummary
            bookingData={{
              contactInfo: contactInfo as ContactInfo,
              sessionDetails: {
                studio: selectedStudio!,
                date: selectedDate,
                timeSlot: selectedTimeSlot!,
                sessionType: sessionDetails.sessionType!,
                numberOfPeople: sessionDetails.numberOfPeople!,
                specialRequests: sessionDetails.specialRequests || ''
              },
              booking: {
                referenceNumber,
                totalCost,
                status: 'pending',
                createdAt: new Date().toISOString()
              }
            }}
            totalCost={totalCost}
            depositAmount={depositAmount}
            referenceNumber={referenceNumber}
          />
        );
      
      default:
        return null;
    }
  };

  const stepTitles = [
    'Choose Studio',
    'Select Date & Time',
    'Contact Information',
    'Session Details',
    'Review & Confirm'
  ];

  return (
    <div className="page-content">
      <div className="booking-header">
        <h1>Book a Studio Session</h1>
        <p>Professional recording studios at therecordco.org</p>
      </div>

      <div className="booking-container">
        <div className="booking-form">
          {renderStep()}

          {submitError && <div className="error-message">{submitError}</div>}

          <div className="form-navigation">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="nav-button secondary"
                disabled={loading}
              >
                Previous
              </button>
            )}
            
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="nav-button primary"
                disabled={loading}
              >
                {currentStep === 4 ? 'Review Booking' : 'Next'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="nav-button primary"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioBookingForm;

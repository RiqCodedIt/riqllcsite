import React from 'react';
import type { ContactInfo } from '../types/booking';

interface ContactFormProps {
  contactInfo: Partial<ContactInfo>;
  onContactInfoChange: (field: string, value: any) => void;
  errors?: { [key: string]: string };
}

const ContactForm: React.FC<ContactFormProps> = ({
  contactInfo,
  onContactInfoChange,
  errors = {}
}) => {
  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    onContactInfoChange('phone', formatted);
  };





  return (
    <div className="step-content">
      <h3>Contact Information</h3>
      <p className="step-description">
        Please provide your contact details for booking confirmation
      </p>

      <div className="contact-form">
        {/* Primary Contact Information */}
        <div className="form-section">
          <h4>Primary Contact</h4>
          
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              value={contactInfo.fullName || ''}
              onChange={(e) => onContactInfoChange('fullName', e.target.value)}
              placeholder="Enter your full name"
              className={errors.fullName ? 'error' : ''}
            />
            {errors.fullName && <span className="field-error">{errors.fullName}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                value={contactInfo.email || ''}
                onChange={(e) => onContactInfoChange('email', e.target.value)}
                placeholder="your.email@example.com"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                value={contactInfo.phone || ''}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="(555) 123-4567"
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default ContactForm;

import React from 'react';
import type { SessionDetails } from '../types/booking';
import { SESSION_TYPES } from '../types/booking';

interface SessionDetailsFormProps {
  sessionDetails: Partial<SessionDetails>;
  onSessionDetailsChange: (field: string, value: any) => void;
  errors?: { [key: string]: string };
}

const SessionDetailsForm: React.FC<SessionDetailsFormProps> = ({
  sessionDetails,
  onSessionDetailsChange,
  errors = {}
}) => {


  return (
    <div className="step-content">
      <h3>Session Details</h3>
      <p className="step-description">
        Tell us about your session requirements and preferences
      </p>

      <div className="session-details-form">
        {/* Session Type */}
        <div className="form-section">
          <h4>Session Type *</h4>
          <div className="session-type-grid">
            {SESSION_TYPES.map((type) => (
              <div
                key={type}
                className={`session-type-option ${
                  sessionDetails.sessionType === type ? 'selected' : ''
                } ${errors.sessionType ? 'error' : ''}`}
                onClick={() => onSessionDetailsChange('sessionType', type)}
              >
                <span className="session-type-label">{type}</span>
                {sessionDetails.sessionType === type && (
                  <span className="selected-indicator">✓</span>
                )}
              </div>
            ))}
          </div>
          {errors.sessionType && (
            <span className="field-error">{errors.sessionType}</span>
          )}
        </div>

        {/* Number of People */}
        <div className="form-section">
          <h4>Number of People *</h4>
          <p className="section-description">
            How many people will be attending this session?
          </p>
          
          <div className="form-group">
            <div className="number-input-container">
              <button
                type="button"
                className="number-btn"
                onClick={() => {
                  const current = sessionDetails.numberOfPeople || 1;
                  if (current > 1) {
                    onSessionDetailsChange('numberOfPeople', current - 1);
                  }
                }}
                disabled={(sessionDetails.numberOfPeople || 1) <= 1}
              >
                -
              </button>
              
              <input
                type="number"
                min="1"
                max="10"
                value={sessionDetails.numberOfPeople || 1}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value >= 1 && value <= 10) {
                    onSessionDetailsChange('numberOfPeople', value);
                  }
                }}
                className={`number-input ${errors.numberOfPeople ? 'error' : ''}`}
              />
              
              <button
                type="button"
                className="number-btn"
                onClick={() => {
                  const current = sessionDetails.numberOfPeople || 1;
                  if (current < 10) {
                    onSessionDetailsChange('numberOfPeople', current + 1);
                  }
                }}
                disabled={(sessionDetails.numberOfPeople || 1) >= 10}
              >
                +
              </button>
            </div>
            
            <div className="people-count-info">
              <span className="people-count">
                {sessionDetails.numberOfPeople || 1} {
                  (sessionDetails.numberOfPeople || 1) === 1 ? 'person' : 'people'
                }
              </span>
              <span className="max-info">(Maximum 10 people per session)</span>
            </div>
            
            {errors.numberOfPeople && (
              <span className="field-error">{errors.numberOfPeople}</span>
            )}
          </div>
        </div>



        {/* Special Requests */}
        <div className="form-section">
          <h4>Special Requests & Notes</h4>
          <p className="section-description">
            Any specific requirements, dietary restrictions, accessibility needs, or other information we should know?
          </p>
          
          <div className="form-group">
            <textarea
              value={sessionDetails.specialRequests || ''}
              onChange={(e) => onSessionDetailsChange('specialRequests', e.target.value)}
              placeholder="Tell us about any special requirements, preferred setup, dietary restrictions, accessibility needs, or anything else that would help us prepare for your session..."
              rows={4}
              className="special-requests-textarea"
            />
          </div>
          
          <div className="special-requests-examples">
            <h5>Common requests include:</h5>
            <ul>
              <li>Specific microphone preferences</li>
              <li>Dietary restrictions or food allergies</li>
              <li>Accessibility accommodations</li>
              <li>Preferred studio setup or layout</li>
              <li>Temperature preferences</li>
              <li>Parking or loading requirements</li>
            </ul>
          </div>
        </div>

        {/* Session Summary */}
        {sessionDetails.sessionType && sessionDetails.numberOfPeople && (
          <div className="session-summary">
            <h4>Session Summary</h4>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Session Type:</span>
                <span className="summary-value">{sessionDetails.sessionType}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Attendees:</span>
                <span className="summary-value">
                  {sessionDetails.numberOfPeople} {
                    sessionDetails.numberOfPeople === 1 ? 'person' : 'people'
                  }
                </span>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionDetailsForm;

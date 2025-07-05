import React from 'react';
import type { Studio } from '../types/booking';
import { STUDIOS } from '../types/booking';

interface StudioSelectorProps {
  selectedStudio: Studio | null;
  onStudioSelect: (studio: Studio) => void;
  error?: string;
}

const StudioSelector: React.FC<StudioSelectorProps> = ({
  selectedStudio,
  onStudioSelect,
  error
}) => {
  return (
    <div className="step-content">
      <h3>Select Your Studio</h3>
      <p className="step-description">Choose between our professional recording studios</p>
      
      <div className="studios-grid">
        {STUDIOS.map((studio) => (
          <div
            key={studio.id}
            className={`studio-card ${selectedStudio?.id === studio.id ? 'selected' : ''}`}
            onClick={() => onStudioSelect(studio)}
          >
            <div className="studio-header">
              <h4>{studio.name}</h4>
              <div className="studio-price">
                ${studio.hourlyRate}/hour
                <span className="session-total">
                  (${studio.hourlyRate * 4} per 4-hour session)
                </span>
              </div>
            </div>
            
            <p className="studio-description">{studio.description}</p>
            
            <div className="studio-features">
              <h5>Features:</h5>
              <ul>
                {studio.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            
            <div className="select-indicator">
              {selectedStudio?.id === studio.id && (
                <span className="selected-checkmark">✓ Selected</span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="studio-comparison">
        <h4>Studio Comparison</h4>
        <div className="comparison-table">
          <div className="comparison-row header">
            <div className="comparison-cell">Feature</div>
            <div className="comparison-cell">Studio C</div>
            <div className="comparison-cell">Studio D</div>
          </div>
          <div className="comparison-row">
            <div className="comparison-cell">Hourly Rate</div>
            <div className="comparison-cell">${STUDIOS[0].hourlyRate}/hour</div>
            <div className="comparison-cell">${STUDIOS[1].hourlyRate}/hour</div>
          </div>
          <div className="comparison-row">
            <div className="comparison-cell">Best For</div>
            <div className="comparison-cell">Recording, Mixing, Mastering</div>
            <div className="comparison-cell">Recording, Mixing, Mastering</div>
          </div>
          <div className="comparison-row">
            <div className="comparison-cell">Session Length</div>
            <div className="comparison-cell">4 hours</div>
            <div className="comparison-cell">4 hours</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioSelector;

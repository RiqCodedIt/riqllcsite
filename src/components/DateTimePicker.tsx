import React, { useEffect } from 'react';
import type { Studio, TimeSlot } from '../types/booking';
import { TIME_SLOTS } from '../types/booking';
import { useAvailability } from '../hooks/useAvailability';
import { getNextDays, dateToLocalString, formatDateForDisplay, formatDateShort } from '../utils/dateUtils';

interface DateTimePickerProps {
  selectedStudio: Studio;
  selectedDate: string;
  selectedTimeSlot: TimeSlot | null;
  onDateSelect: (date: string) => void;
  onTimeSlotSelect: (timeSlot: TimeSlot) => void;
  error?: string;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  selectedStudio,
  selectedDate,
  selectedTimeSlot,
  onDateSelect,
  onTimeSlotSelect,
  error
}) => {

  const { getAvailability, isSlotAvailable, isDateLoading, getDateAvailability } = useAvailability();

  // Get the next 30 days for date selection
  const availableDays = getNextDays(30);

  // Load availability when component mounts or studio changes
  useEffect(() => {
    availableDays.forEach(day => {
      const dateString = dateToLocalString(day);
      getAvailability(dateString);
    });
  }, [selectedStudio.id]);

  // Load availability when date is selected
  useEffect(() => {
    if (selectedDate) {
      getAvailability(selectedDate);
    }
  }, [selectedDate]);

  const formatDate = (date: Date) => {
    const dateString = dateToLocalString(date);
    return formatDateShort(dateString);
  };

  const isDateAvailable = (date: Date) => {
    const dateString = dateToLocalString(date);
    const availability = getDateAvailability(dateString);
    
    if (!availability) return false;
    
    // Check if any time slot is available for this studio
    const studioAvailability = selectedStudio.id === 'C' 
      ? availability.studioC 
      : availability.studioD;
    
    return Object.values(studioAvailability).some(available => available);
  };

  const getAvailableSlotCount = (date: Date) => {
    const dateString = dateToLocalString(date);
    const availability = getDateAvailability(dateString);
    
    if (!availability) return 0;
    
    const studioAvailability = selectedStudio.id === 'C' 
      ? availability.studioC 
      : availability.studioD;
    
    return Object.values(studioAvailability).filter(available => available).length;
  };

  return (
    <div className="step-content">
      <h3>Select Date & Time</h3>
      <p className="step-description">
        Choose your preferred date and 4-hour time slot for {selectedStudio.name}
      </p>

      <div className="datetime-picker">
        <div className="date-section">
          <h4>Select Date</h4>
          <div className="date-grid">
            {availableDays.map((day) => {
              const dateString = dateToLocalString(day);
              const isLoading = isDateLoading(dateString);
              const hasAvailability = isDateAvailable(day);
              const availableSlots = getAvailableSlotCount(day);
              const isSelected = selectedDate === dateString;
              
              return (
                <div
                  key={dateString}
                  className={`date-card ${isSelected ? 'selected' : ''} ${
                    !hasAvailability && !isLoading ? 'unavailable' : ''
                  } ${isLoading ? 'loading' : ''}`}
                  onClick={() => hasAvailability && !isLoading && onDateSelect(dateString)}
                >
                  <div className="date-text">
                    {formatDate(day)}
                  </div>
                  {isLoading ? (
                    <div className="availability-status loading">Loading...</div>
                  ) : hasAvailability ? (
                    <div className="availability-status available">
                      {availableSlots} slot{availableSlots !== 1 ? 's' : ''} available
                    </div>
                  ) : (
                    <div className="availability-status unavailable">Fully booked</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {selectedDate && (
          <div className="time-section">
            <h4>Select Time Slot</h4>
            <p className="time-section-subtitle">
              Available slots for {formatDateForDisplay(selectedDate)}
            </p>
            
            <div className="time-slots-grid">
              {TIME_SLOTS.map((timeSlot) => {
                const available = isSlotAvailable(selectedDate, selectedStudio, timeSlot);
                const isSelected = selectedTimeSlot?.id === timeSlot.id;
                
                return (
                  <div
                    key={timeSlot.id}
                    className={`time-slot ${isSelected ? 'selected' : ''} ${
                      !available ? 'unavailable' : ''
                    }`}
                    onClick={() => available && onTimeSlotSelect(timeSlot)}
                  >
                    <div className="time-label">{timeSlot.label}</div>
                    <div className="duration-label">{timeSlot.duration} hours</div>
                    {!available && (
                      <div className="unavailable-overlay">
                        <span>Booked</span>
                      </div>
                    )}
                    {isSelected && (
                      <div className="selected-indicator">✓</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {selectedDate && selectedTimeSlot && (
        <div className="selection-summary">
          <h4>Your Selection</h4>
          <div className="summary-details">
            <p><strong>Studio:</strong> {selectedStudio.name}</p>
            <p><strong>Date:</strong> {formatDateForDisplay(selectedDate)}</p>
            <p><strong>Time:</strong> {selectedTimeSlot.label}</p>
            <p><strong>Duration:</strong> {selectedTimeSlot.duration} hours</p>
            <p><strong>Total Cost:</strong> ${selectedStudio.hourlyRate * selectedTimeSlot.duration}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;

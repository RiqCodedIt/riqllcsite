import { useState, useCallback } from 'react';
import type { ValidationErrors, FormStepValidation, ContactInfo, SessionDetails } from '../types/booking';

export const useBookingValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  const validateStep1 = useCallback((data: { studio: any }): FormStepValidation => {
    const stepErrors: ValidationErrors = {};

    if (!data.studio?.id) {
      stepErrors.studio = 'Please select a studio';
    }

    return {
      isValid: Object.keys(stepErrors).length === 0,
      errors: stepErrors
    };
  }, []);

  const validateStep2 = useCallback((data: { date: string; timeSlot: any }): FormStepValidation => {
    const stepErrors: ValidationErrors = {};

    if (!data.date) {
      stepErrors.date = 'Please select a date';
    }

    if (!data.timeSlot?.id) {
      stepErrors.timeSlot = 'Please select a time slot';
    }

    // Validate date is not in the past
    if (data.date) {
      const selectedDate = new Date(data.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        stepErrors.date = 'Please select a future date';
      }
    }

    return {
      isValid: Object.keys(stepErrors).length === 0,
      errors: stepErrors
    };
  }, []);

  const validateStep3 = useCallback((contactInfo: Partial<ContactInfo>): FormStepValidation => {
    const stepErrors: ValidationErrors = {};

    // Full name validation
    if (!contactInfo.fullName?.trim()) {
      stepErrors.fullName = 'Full name is required';
    }

    // Email validation
    if (!contactInfo.email?.trim()) {
      stepErrors.email = 'Email is required';
    } else if (!validateEmail(contactInfo.email)) {
      stepErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (!contactInfo.phone?.trim()) {
      stepErrors.phone = 'Phone number is required';
    } else if (!validatePhone(contactInfo.phone)) {
      stepErrors.phone = 'Please enter phone number in format: (555) 123-4567';
    }



    return {
      isValid: Object.keys(stepErrors).length === 0,
      errors: stepErrors
    };
  }, []);

  const validateStep4 = useCallback((sessionDetails: Partial<SessionDetails>): FormStepValidation => {
    const stepErrors: ValidationErrors = {};

    if (!sessionDetails.sessionType?.trim()) {
      stepErrors.sessionType = 'Session type is required';
    }

    if (!sessionDetails.numberOfPeople || sessionDetails.numberOfPeople < 1) {
      stepErrors.numberOfPeople = 'Number of people must be at least 1';
    }

    if (sessionDetails.numberOfPeople && sessionDetails.numberOfPeople > 10) {
      stepErrors.numberOfPeople = 'Maximum 10 people allowed per session';
    }



    return {
      isValid: Object.keys(stepErrors).length === 0,
      errors: stepErrors
    };
  }, []);



  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  return {
    errors,
    validateStep1,
    validateStep2,
    validateStep3,
    validateStep4,
    clearErrors,
    setFieldError,
    clearFieldError,
    setErrors
  };
};

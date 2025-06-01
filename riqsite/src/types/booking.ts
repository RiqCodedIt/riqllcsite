// Studio Booking System Types

export interface Studio {
  id: 'C' | 'D';
  name: string;
  description: string;
  hourlyRate: number;
  features: string[];
  imageUrl?: string;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  label: string;
  duration: number; // Always 4 hours for studio sessions
}

export interface BookingAvailability {
  date: string;
  studioC: {
    [slotId: string]: boolean; // true = available, false = booked
  };
  studioD: {
    [slotId: string]: boolean;
  };
}

export interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
}

export interface SessionDetails {
  studio: Studio;
  date: string;
  timeSlot: TimeSlot;
  sessionType: string;
  numberOfPeople: number;
  specialRequests: string;
}

export interface BookingMetadata {
  referenceNumber: string;
  totalCost: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface StudioBookingData {
  contactInfo: ContactInfo;
  sessionDetails: SessionDetails;
  booking: BookingMetadata;
}

// Form validation types
export interface ValidationErrors {
  [field: string]: string;
}

export interface FormStepValidation {
  isValid: boolean;
  errors: ValidationErrors;
}

// Availability checking types
export interface AvailabilityRequest {
  date: string;
  studioId?: 'C' | 'D';
}

export interface AvailabilityResponse {
  date: string;
  availability: BookingAvailability;
}

// Constants
export const STUDIOS: Studio[] = [
  {
    id: 'C',
    name: 'Studio C',
    description: 'Professional studio perfect for recording, mixing and mastering',
    hourlyRate: 70,
    features: [
      'Recording, Mixing & Mastering',
      'Vintage Analog Gear',
      'Industry Standard Studio Space',
      'Isolated Vocal booth',
      'Industry level microphones',
      'Snacks + Drinks'
    ]
  },
  {
    id: 'D',
    name: 'Studio D',
    description: 'Professional studio perfect for recording, mixing and mastering',
    hourlyRate: 70,
    features: [
      'Recording, Mixing & Mastering',
      'Vintage Analog Gear',
      'Industry Standard Studio Space',
      'Isolated Vocal booth',
      'Industry level microphones',
      'Snacks + Drinks'
    ]
  }
];

export const TIME_SLOTS: TimeSlot[] = [
  {
    id: 'morning',
    startTime: '10:30',
    endTime: '14:30',
    label: '10:30 AM - 2:30 PM',
    duration: 4
  },
  {
    id: 'afternoon',
    startTime: '15:00',
    endTime: '19:00',
    label: '3:00 PM - 7:00 PM',
    duration: 4
  },
  {
    id: 'evening',
    startTime: '19:30',
    endTime: '23:30',
    label: '7:30 PM - 11:30 PM',
    duration: 4
  }
];

export const SESSION_TYPES = [
  'Recording',
  'Mixing',
  'Mastering',
  'Other'
];

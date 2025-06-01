import { useState, useCallback } from 'react';
import type { BookingAvailability, Studio, TimeSlot } from '../types/booking';
import { TIME_SLOTS } from '../types/booking';

// Mock availability data - in production, this would come from an API
const generateMockAvailability = (date: string): BookingAvailability => {
  const availability: BookingAvailability = {
    date,
    studioC: {},
    studioD: {}
  };

  // Generate some realistic availability patterns
  TIME_SLOTS.forEach(slot => {
    // Studio C: randomly make some slots unavailable (70% available)
    availability.studioC[slot.id] = Math.random() > 0.3;
    
    // Studio D: randomly make some slots unavailable (80% available)
    availability.studioD[slot.id] = Math.random() > 0.2;
  });

  return availability;
};

// Mock function to simulate checking availability with a backend
const fetchAvailability = async (date: string): Promise<BookingAvailability> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return generateMockAvailability(date);
};

export const useAvailability = () => {
  const [availability, setAvailability] = useState<Map<string, BookingAvailability>>(new Map());
  const [loading, setLoading] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const getAvailability = useCallback(async (date: string): Promise<BookingAvailability | null> => {
    // Check if we already have this date cached
    const cached = availability.get(date);
    if (cached) {
      return cached;
    }

    // Check if we're already loading this date
    if (loading.has(date)) {
      return null;
    }

    try {
      setLoading(prev => new Set(prev).add(date));
      setError(null);

      const result = await fetchAvailability(date);
      
      setAvailability(prev => new Map(prev).set(date, result));
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch availability');
      return null;
    } finally {
      setLoading(prev => {
        const newLoading = new Set(prev);
        newLoading.delete(date);
        return newLoading;
      });
    }
  }, [availability, loading]);

  const isSlotAvailable = useCallback((date: string, studio: Studio, timeSlot: TimeSlot): boolean => {
    const dateAvailability = availability.get(date);
    if (!dateAvailability) return false;

    const studioAvailability = studio.id === 'C' ? dateAvailability.studioC : dateAvailability.studioD;
    return studioAvailability[timeSlot.id] === true;
  }, [availability]);

  const isDateLoading = useCallback((date: string): boolean => {
    return loading.has(date);
  }, [loading]);

  const getDateAvailability = useCallback((date: string): BookingAvailability | null => {
    return availability.get(date) || null;
  }, [availability]);

  // Preload availability for the next 30 days
  const preloadAvailability = useCallback(async () => {
    const today = new Date();
    const promises: Promise<void>[] = [];

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      
      promises.push(getAvailability(dateString).then(() => {}));
    }

    await Promise.all(promises);
  }, [getAvailability]);

  // Mock function to temporarily reserve a slot (optimistic update)
  const reserveSlot = useCallback((date: string, studio: Studio, timeSlot: TimeSlot) => {
    setAvailability(prev => {
      const newAvailability = new Map(prev);
      const dateAvailability = newAvailability.get(date);
      
      if (dateAvailability) {
        const updatedAvailability = { ...dateAvailability };
        if (studio.id === 'C') {
          updatedAvailability.studioC = {
            ...updatedAvailability.studioC,
            [timeSlot.id]: false
          };
        } else {
          updatedAvailability.studioD = {
            ...updatedAvailability.studioD,
            [timeSlot.id]: false
          };
        }
        newAvailability.set(date, updatedAvailability);
      }
      
      return newAvailability;
    });
  }, []);

  // Mock function to release a reserved slot
  const releaseSlot = useCallback((date: string, studio: Studio, timeSlot: TimeSlot) => {
    setAvailability(prev => {
      const newAvailability = new Map(prev);
      const dateAvailability = newAvailability.get(date);
      
      if (dateAvailability) {
        const updatedAvailability = { ...dateAvailability };
        if (studio.id === 'C') {
          updatedAvailability.studioC = {
            ...updatedAvailability.studioC,
            [timeSlot.id]: true
          };
        } else {
          updatedAvailability.studioD = {
            ...updatedAvailability.studioD,
            [timeSlot.id]: true
          };
        }
        newAvailability.set(date, updatedAvailability);
      }
      
      return newAvailability;
    });
  }, []);

  const clearAvailabilityCache = useCallback(() => {
    setAvailability(new Map());
  }, []);

  return {
    getAvailability,
    isSlotAvailable,
    isDateLoading,
    getDateAvailability,
    preloadAvailability,
    reserveSlot,
    releaseSlot,
    clearAvailabilityCache,
    loading: loading.size > 0,
    error
  };
};

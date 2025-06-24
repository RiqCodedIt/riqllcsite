/**
 * Utility functions for safe date handling in the booking system
 * Prevents timezone-related bugs when working with date strings
 */

/**
 * Safely parse a date string (YYYY-MM-DD) to a Date object in local timezone
 * Prevents the common timezone shift bug when using new Date() with ISO strings
 */
export const parseLocalDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day); // month is 0-indexed
};

/**
 * Format a date string (YYYY-MM-DD) for display
 * Uses local timezone to prevent date shifting
 */
export const formatDateForDisplay = (dateString: string, options?: Intl.DateTimeFormatOptions): string => {
  const date = parseLocalDate(dateString);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

/**
 * Format a date string for short display (e.g., "Mon, Jun 2")
 */
export const formatDateShort = (dateString: string): string => {
  return formatDateForDisplay(dateString, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Convert a Date object to YYYY-MM-DD string in local timezone
 */
export const dateToLocalString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get the next N days as Date objects starting from today
 */
export const getNextDays = (count: number): Date[] => {
  const days: Date[] = [];
  const today = new Date();
  
  for (let i = 0; i < count; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    days.push(date);
  }
  
  return days;
};

/**
 * Get the next N days as YYYY-MM-DD strings starting from today
 */
export const getNextDaysAsStrings = (count: number): string[] => {
  return getNextDays(count).map(dateToLocalString);
};

/**
 * Check if a date string represents today
 */
export const isToday = (dateString: string): boolean => {
  const today = dateToLocalString(new Date());
  return dateString === today;
};

/**
 * Check if a date string represents a past date
 */
export const isPastDate = (dateString: string): boolean => {
  const today = dateToLocalString(new Date());
  return dateString < today;
};

/**
 * Get a human-readable relative date description
 */
export const getRelativeDateDescription = (dateString: string): string => {
  if (isToday(dateString)) {
    return 'Today';
  }
  
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (dateString === dateToLocalString(tomorrow)) {
    return 'Tomorrow';
  }
  
  return formatDateShort(dateString);
};

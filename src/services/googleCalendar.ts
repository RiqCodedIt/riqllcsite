interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  description?: string;
}

interface AvailabilityEvent {
  date: string;
  studio_id: string;
  time_slot_id: string;
  available: boolean;
}

class GoogleCalendarService {
  private apiKey: string;
  private studioCCalendarId: string;
  private studioDCalendarId: string;
  private isInitialized: boolean = false;

  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    this.studioCCalendarId = import.meta.env.VITE_GOOGLE_CALENDAR_STUDIO_C_ID;
    this.studioDCalendarId = import.meta.env.VITE_GOOGLE_CALENDAR_STUDIO_D_ID;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load Google API
      await this.loadGoogleAPI();
      
      // Initialize the API
      await new Promise<void>((resolve, reject) => {
        window.gapi.load('client', async () => {
          try {
            await window.gapi.client.init({
              apiKey: this.apiKey,
              discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
            });
            this.isInitialized = true;
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error('Failed to initialize Google Calendar API:', error);
      throw error;
    }
  }

  private loadGoogleAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google API'));
      document.head.appendChild(script);
    });
  }

  async fetchCalendarEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Fetch events from both studio calendars
      const [studioCResponse, studioDResponse] = await Promise.all([
        window.gapi.client.calendar.events.list({
          calendarId: this.studioCCalendarId,
          timeMin: startDate.toISOString(),
          timeMax: endDate.toISOString(),
          singleEvents: true,
          orderBy: 'startTime'
        }),
        window.gapi.client.calendar.events.list({
          calendarId: this.studioDCalendarId,
          timeMin: startDate.toISOString(),
          timeMax: endDate.toISOString(),
          singleEvents: true,
          orderBy: 'startTime'
        })
      ]);

      // Combine events from both calendars
      const studioCEvents = (studioCResponse.result.items || []).map((event: any) => ({
        ...event,
        studioSource: 'C'
      }));
      
      const studioDEvents = (studioDResponse.result.items || []).map((event: any) => ({
        ...event,
        studioSource: 'D'
      }));

      return [...studioCEvents, ...studioDEvents];
    } catch (error) {
      console.error('Failed to fetch calendar events:', error);
      throw error;
    }
  }

  processEventsToAvailability(events: CalendarEvent[]): AvailabilityEvent[] {
    const availabilityEvents: AvailabilityEvent[] = [];

    events.forEach(event => {
      try {
        // Get studio from source calendar (studioSource property)
        const studioId = (event as any).studioSource || 'C'; // Default to C if not specified
        const timeSlot = this.parseTimeSlot(event);
        const date = this.parseEventDate(event);

        if (date && timeSlot) {
          availabilityEvents.push({
            date: date,
            studio_id: studioId,
            time_slot_id: timeSlot,
            available: true
          });
        }
      } catch (error) {
        console.warn('Failed to process event:', event.summary, error);
      }
    });

    return availabilityEvents;
  }

  private parseTimeSlot(event: CalendarEvent): string | null {
    const startTime = event.start.dateTime || event.start.date;
    const endTime = event.end.dateTime || event.end.date;
    
    if (!startTime || !endTime) return null;

    const start = new Date(startTime);
    const end = new Date(endTime);
    
    // Map time ranges to our time slots
    const startHour = start.getHours();
    const endHour = end.getHours();
    
    // Morning: 10:30 AM - 2:30 PM (10-14)
    if (startHour >= 10 && endHour <= 14) {
      return 'morning';
    }
    
    // Afternoon: 3:00 PM - 7:00 PM (15-19)
    if (startHour >= 15 && endHour <= 19) {
      return 'afternoon';
    }
    
    // Evening: 7:30 PM - 11:30 PM (19-23)
    if (startHour >= 19 && endHour <= 23) {
      return 'evening';
    }
    
    // If event spans multiple periods, determine primary period
    const duration = end.getTime() - start.getTime();
    const hours = duration / (1000 * 60 * 60);
    
    if (hours >= 4) {
      // Long event, map to primary time based on start time
      if (startHour < 14) return 'morning';
      if (startHour < 19) return 'afternoon';
      return 'evening';
    }
    
    return null;
  }

  private parseEventDate(event: CalendarEvent): string | null {
    const dateStr = event.start.dateTime || event.start.date;
    if (!dateStr) return null;
    
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  }

  async syncCalendarToBackend(startDate: Date, endDate: Date): Promise<{ success: boolean; message: string }> {
    try {
      // Fetch calendar events
      const events = await this.fetchCalendarEvents(startDate, endDate);
      console.log(`Fetched ${events.length} calendar events`);
      
      // Process events to availability format
      const availabilityEvents = this.processEventsToAvailability(events);
      console.log(`Processed ${availabilityEvents.length} availability events`);
      
      // Send to backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/sync-calendar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          events: availabilityEvents
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        return {
          success: true,
          message: result.message || 'Calendar sync successful'
        };
      } else {
        throw new Error(result.message || 'Calendar sync failed');
      }
      
    } catch (error) {
      console.error('Calendar sync error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

// Global type declarations
declare global {
  interface Window {
    gapi: any;
  }
}

export default GoogleCalendarService;
export type { CalendarEvent, AvailabilityEvent };

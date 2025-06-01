import { gapi } from 'gapi-script';

// Extend gapi types for better TypeScript support
declare global {
  namespace gapi {
    namespace auth2 {
      interface GoogleAuth {
        isSignedIn: {
          get(): boolean;
        };
        signIn(): Promise<any>;
        signOut(): Promise<any>;
      }
      function getAuthInstance(): GoogleAuth;
      function init(params: any): void;
    }
    namespace client {
      namespace sheets {
        namespace spreadsheets {
          namespace values {
            function append(params: any): Promise<any>;
            function get(params: any): Promise<any>;
            function update(params: any): Promise<any>;
          }
        }
      }
    }
  }
}

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

interface StudioBookingData {
  timestamp: string;
  booking_id: string;
  customer_name: string;
  email: string;
  phone: string;
  studio_name: string;
  session_date: string;
  session_time: string;
  session_type: string;
  duration: number;
  total_cost: number;
  special_requests: string;
  payment_status: string;
}

class GoogleSheetsService {
  private isInitialized = false;
  private authInstance: any = null;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await new Promise<void>((resolve, reject) => {
        gapi.load('auth2:client', {
          callback: resolve,
          onerror: reject
        });
      });

      await gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: [DISCOVERY_DOC],
        scope: SCOPES
      });

      this.authInstance = (gapi as any).auth2.getAuthInstance();
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing Google API:', error);
      throw error;
    }
  }

  async signIn(): Promise<void> {
    if (!this.authInstance) {
      throw new Error('Google API not initialized');
    }

    if (!this.authInstance.isSignedIn.get()) {
      await this.authInstance.signIn();
    }
  }

  async signOut(): Promise<void> {
    if (!this.authInstance) return;
    
    if (this.authInstance.isSignedIn.get()) {
      await this.authInstance.signOut();
    }
  }

  async sendStudioBookingToSheets(bookingData: StudioBookingData): Promise<void> {
    try {
      await this.initialize();
      await this.signIn();

      // Prepare the row data
      const values = [
        [
          bookingData.timestamp,
          bookingData.booking_id,
          bookingData.customer_name,
          bookingData.email,
          bookingData.phone,
          bookingData.studio_name,
          bookingData.session_date,
          bookingData.session_time,
          bookingData.session_type,
          bookingData.duration,
          bookingData.total_cost,
          bookingData.special_requests,
          bookingData.payment_status
        ]
      ];

      // Check if headers exist, if not add them
      await this.ensureHeaders();

      // Append the data
      const response = await (gapi as any).client.sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: 'Sheet1!A:M',
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: values
        }
      });

      console.log('Data successfully sent to Google Sheets:', response);
      
      // Sign out immediately after sending data
      await this.signOut();
      
    } catch (error) {
      console.error('Error sending data to Google Sheets:', error);
      await this.signOut(); // Ensure we sign out even on error
      throw error;
    }
  }

  private async ensureHeaders(): Promise<void> {
    try {
      // Check if the first row has headers
      const response = await (gapi as any).client.sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: 'Sheet1!A1:M1'
      });

      const values = response.result.values;
      
      // If no data or first row doesn't look like headers, add them
      if (!values || values.length === 0 || values[0][0] !== 'Timestamp') {
        const headers = [
          'Timestamp',
          'Booking ID',
          'Customer Name',
          'Email',
          'Phone',
          'Studio Name',
          'Session Date',
          'Session Time',
          'Session Type',
          'Duration (Hours)',
          'Total Cost',
          'Special Requests',
          'Payment Status'
        ];

        await (gapi as any).client.sheets.spreadsheets.values.update({
          spreadsheetId: SHEET_ID,
          range: 'Sheet1!A1:M1',
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: [headers]
          }
        });
      }
    } catch (error) {
      console.error('Error ensuring headers:', error);
      // Continue anyway, the append will still work
    }
  }

  isSignedIn(): boolean {
    return this.authInstance?.isSignedIn.get() || false;
  }
}

export const googleSheetsService = new GoogleSheetsService();
export type { StudioBookingData };

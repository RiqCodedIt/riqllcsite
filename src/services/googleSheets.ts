export interface StudioBookingData {
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
  async sendStudioBookingToSheets(data: StudioBookingData): Promise<void> {
    try {
      // Google Sheets integration is now handled on the backend
      // This method is kept for compatibility but doesn't need to do anything
      // since the backend automatically sends studio session data to Google Sheets
      // when a payment is completed via the webhook
      
      console.log('Studio booking data (handled by backend):', data);
      return Promise.resolve();
    } catch (error) {
      console.error('Error in Google Sheets service:', error);
      throw error;
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();

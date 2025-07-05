import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Customer {
  id: string;
  email?: string;
  full_name?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  customer_id?: string;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_amount: number;
  has_studio_session: boolean;
  has_consultation: boolean;
  stripe_session_id?: string;
  created_at: string;
  updated_at: string;
}

export interface BookingItem {
  id: string;
  booking_id: string;
  item_type: 'studio_session' | 'service' | 'beat';
  item_data: any; // JSONB data
  price: number;
  created_at: string;
}

export interface BookingDetails {
  id: string;
  timestamp: string;
  status: string;
  total_amount: number;
  has_studio_session: boolean;
  has_consultation: boolean;
  stripe_session_id?: string;
  customer_email?: string;
  customer_name?: string;
  customer_phone?: string;
  items: Array<{
    id: string;
    type: string;
    data: any;
    price: number;
  }>;
}

// Service functions
export class BookingService {
  // Get all bookings with details
  static async getAllBookings(): Promise<BookingDetails[]> {
    const { data, error } = await supabase
      .from('booking_details')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch bookings: ${error.message}`);
    }

    return data || [];
  }

  // Get booking by ID
  static async getBookingById(id: string): Promise<BookingDetails | null> {
    const { data, error } = await supabase
      .from('booking_details')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch booking: ${error.message}`);
    }

    return data;
  }

  // Create booking with items
  static async createBooking(
    bookingData: any,
    customerData?: any
  ): Promise<string> {
    const { data, error } = await supabase.rpc('create_booking_with_items', {
      booking_data: bookingData,
      customer_data: customerData
    });

    if (error) {
      throw new Error(`Failed to create booking: ${error.message}`);
    }

    return data;
  }

  // Update booking status
  static async updateBookingStatus(
    id: string,
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  ): Promise<void> {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to update booking status: ${error.message}`);
    }
  }

  // Get bookings by status
  static async getBookingsByStatus(status: string): Promise<BookingDetails[]> {
    const { data, error } = await supabase
      .from('booking_details')
      .select('*')
      .eq('status', status)
      .order('timestamp', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch bookings by status: ${error.message}`);
    }

    return data || [];
  }

  // Get studio sessions (bookings with studio sessions)
  static async getStudioSessions(): Promise<BookingDetails[]> {
    const { data, error } = await supabase
      .from('booking_details')
      .select('*')
      .eq('has_studio_session', true)
      .order('timestamp', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch studio sessions: ${error.message}`);
    }

    return data || [];
  }

  // Search bookings by customer email
  static async searchBookingsByEmail(email: string): Promise<BookingDetails[]> {
    const { data, error } = await supabase
      .from('booking_details')
      .select('*')
      .ilike('customer_email', `%${email}%`)
      .order('timestamp', { ascending: false });

    if (error) {
      throw new Error(`Failed to search bookings: ${error.message}`);
    }

    return data || [];
  }
}

// Customer service functions
export class CustomerService {
  // Get all customers
  static async getAllCustomers(): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch customers: ${error.message}`);
    }

    return data || [];
  }

  // Get customer by email
  static async getCustomerByEmail(email: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch customer: ${error.message}`);
    }

    return data;
  }

  // Create or update customer
  static async upsertCustomer(customerData: {
    email?: string;
    full_name?: string;
    phone?: string;
  }): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .upsert(customerData, { onConflict: 'email' })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to upsert customer: ${error.message}`);
    }

    return data;
  }
}
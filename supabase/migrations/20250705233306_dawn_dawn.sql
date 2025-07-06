/*
  # Create Booking System Database Schema

  1. New Tables
    - `customers`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `full_name` (text)
      - `phone` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `bookings`
      - `id` (text, primary key) - matches order IDs like "order_20250601124200_9085"
      - `customer_id` (uuid, foreign key to customers)
      - `timestamp` (timestamptz)
      - `status` (text) - pending, confirmed, cancelled, completed
      - `total_amount` (decimal)
      - `has_studio_session` (boolean)
      - `has_consultation` (boolean)
      - `stripe_session_id` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `booking_items`
      - `id` (uuid, primary key)
      - `booking_id` (text, foreign key to bookings)
      - `item_type` (text) - studio_session, service, beat
      - `item_data` (jsonb) - stores the specific item details
      - `price` (decimal)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access
    - Add policies for public read access where appropriate

  3. Indexes
    - Add indexes for common query patterns
    - Add indexes on foreign keys
*/

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  full_name text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id text PRIMARY KEY,
  customer_id uuid REFERENCES customers(id),
  timestamp timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  total_amount decimal(10,2) NOT NULL DEFAULT 0,
  has_studio_session boolean DEFAULT false,
  has_consultation boolean DEFAULT false,
  stripe_session_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create booking_items table
CREATE TABLE IF NOT EXISTS booking_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id text NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  item_type text NOT NULL CHECK (item_type IN ('studio_session', 'service', 'beat')),
  item_data jsonb NOT NULL,
  price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_timestamp ON bookings(timestamp);
CREATE INDEX IF NOT EXISTS idx_bookings_stripe_session ON bookings(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_booking_items_booking_id ON booking_items(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_items_type ON booking_items(item_type);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for customers
CREATE POLICY "Customers can read own data"
  ON customers
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Customers can update own data"
  ON customers
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Allow customer creation"
  ON customers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create RLS policies for bookings
CREATE POLICY "Users can read own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Users can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (customer_id = auth.uid());

-- Create RLS policies for booking_items
CREATE POLICY "Users can read own booking items"
  ON booking_items
  FOR SELECT
  TO authenticated
  USING (
    booking_id IN (
      SELECT id FROM bookings WHERE customer_id = auth.uid()
    )
  );

CREATE POLICY "Users can create booking items"
  ON booking_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    booking_id IN (
      SELECT id FROM bookings WHERE customer_id = auth.uid()
    )
  );

-- Admin policies (for service role access)
CREATE POLICY "Service role full access to customers"
  ON customers
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access to bookings"
  ON bookings
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access to booking_items"
  ON booking_items
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create helpful views for common queries
CREATE OR REPLACE VIEW booking_details AS
SELECT 
  b.id,
  b.timestamp,
  b.status,
  b.total_amount,
  b.has_studio_session,
  b.has_consultation,
  b.stripe_session_id,
  c.email as customer_email,
  c.full_name as customer_name,
  c.phone as customer_phone,
  json_agg(
    json_build_object(
      'id', bi.id,
      'type', bi.item_type,
      'data', bi.item_data,
      'price', bi.price
    )
  ) as items
FROM bookings b
LEFT JOIN customers c ON b.customer_id = c.id
LEFT JOIN booking_items bi ON b.id = bi.booking_id
GROUP BY b.id, b.timestamp, b.status, b.total_amount, b.has_studio_session, 
         b.has_consultation, b.stripe_session_id, c.email, c.full_name, c.phone
ORDER BY b.timestamp DESC;

-- Create function to insert complete booking with items
CREATE OR REPLACE FUNCTION create_booking_with_items(
  booking_data jsonb,
  customer_data jsonb DEFAULT NULL
)
RETURNS text AS $$
DECLARE
  customer_uuid uuid;
  booking_id text;
  item jsonb;
  total decimal(10,2) := 0;
BEGIN
  -- Extract booking ID from booking_data
  booking_id := booking_data->>'id';
  
  -- Handle customer data if provided
  IF customer_data IS NOT NULL THEN
    -- Try to find existing customer by email
    SELECT id INTO customer_uuid 
    FROM customers 
    WHERE email = customer_data->>'email';
    
    -- If customer doesn't exist, create new one
    IF customer_uuid IS NULL THEN
      INSERT INTO customers (email, full_name, phone)
      VALUES (
        customer_data->>'email',
        customer_data->>'full_name',
        customer_data->>'phone'
      )
      RETURNING id INTO customer_uuid;
    END IF;
  END IF;
  
  -- Calculate total from items
  FOR item IN SELECT jsonb_array_elements(booking_data->'items')
  LOOP
    total := total + (item->>'price')::decimal;
  END LOOP;
  
  -- Insert booking
  INSERT INTO bookings (
    id,
    customer_id,
    timestamp,
    status,
    total_amount,
    has_studio_session,
    has_consultation,
    stripe_session_id
  )
  VALUES (
    booking_id,
    customer_uuid,
    (booking_data->>'timestamp')::timestamptz,
    booking_data->>'status',
    total,
    (booking_data->>'has_studio_session')::boolean,
    (booking_data->>'has_consultation')::boolean,
    booking_data->>'stripe_session_id'
  );
  
  -- Insert booking items
  FOR item IN SELECT jsonb_array_elements(booking_data->'items')
  LOOP
    INSERT INTO booking_items (
      booking_id,
      item_type,
      item_data,
      price
    )
    VALUES (
      booking_id,
      item->>'type',
      item,
      (item->>'price')::decimal
    );
  END LOOP;
  
  RETURN booking_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
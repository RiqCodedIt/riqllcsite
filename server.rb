require 'stripe'
require 'sinatra'
require 'json'
require 'sinatra/cross_origin'
require 'date'
require 'fileutils'
require 'dotenv/load' if File.exist?(File.join(__dir__, '.env'))
require 'google/apis/sheets_v4'
require 'googleauth'
require_relative 'lib/availability_manager'
require_relative 'lib/calendar_sync_service'

# Configure Stripe API key
Stripe.api_key = ENV['stripe_test_secret_key'] || 'sk_test_51RUqX5ARuWdY7S8gcq4XRiuKsK1xw5LcAtBr7Z3MS1AtguVzBCWd2zLHQNYt8UYUz0VMCzkaUhtY8lgj8i0dFaRS00KBbm08B0'

# Configure Sinatra
set :port, ENV['PORT'] || 4242
set :bind, '0.0.0.0'

# Enable CORS
configure do
  enable :cross_origin
end

before do
  # Use environment variable for frontend URL, fallback to Railway production URL
  frontend_url = ENV['FRONTEND_URL'] || 'https://llc-frontend-production.up.railway.app'
  response.headers['Access-Control-Allow-Origin'] = frontend_url
  response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
  response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
end

options "*" do
  response.headers["Allow"] = "GET, POST, OPTIONS"
  200
end

# Create a bookings directory if it doesn't exist
bookings_dir = File.join(Dir.pwd, 'bookings')
FileUtils.mkdir_p(bookings_dir) unless File.directory?(bookings_dir)

# Google Sheets configuration
SHEET_ID = '1ZtjDAftjp6eUW4Cv2CfS4FKhQcDXnYDM3jJdrekTJqo'
CREDENTIALS_PATH = File.join(Dir.pwd, '..', 'client_secret_125505298187-vh9hnuno3uq1gjrojtqo0k63iq4g5i0p.apps.googleusercontent.com.json')

# Initialize Google Sheets service
def get_sheets_service
  scope = ['https://www.googleapis.com/auth/spreadsheets']
  authorizer = Google::Auth::ServiceAccountCredentials.make_creds(
    json_key_io: File.open(CREDENTIALS_PATH),
    scope: scope
  )
  
  service = Google::Apis::SheetsV4::SheetsService.new
  service.authorization = authorizer
  service
end

# Function to add studio session data to Google Sheets
def add_to_google_sheets(order_data)
  return unless order_data['has_studio_session']
  
  begin
    service = get_sheets_service
    
    # Find studio session items
    studio_sessions = order_data['items'].select { |item| item['type'] == 'studio_session' }
    
    studio_sessions.each do |session|
      # Prepare row data
      row_data = [
        Time.now.strftime('%Y-%m-%d %H:%M:%S'),  # Timestamp
        order_data['id'],                         # Order ID
        order_data['customer_info']['name'] || 'N/A',     # Client Name
        order_data['customer_info']['email'] || 'N/A',    # Client Email
        order_data['customer_info']['phone'] || 'N/A',    # Client Phone
        session['studio_name'] || 'N/A',         # Studio
        session['date'] || 'N/A',                # Date
        session['time_slot'] || 'N/A',           # Time
        session['duration'] || 1,                # Duration
        session['project_type'] || 'N/A',        # Project Type
        session['additional_notes'] || 'N/A',    # Notes
        order_data['status'] || 'pending'        # Status
      ]
      
      # Append to sheet
      range = 'Sheet1!A:L'  # Adjust range as needed
      value_range = Google::Apis::SheetsV4::ValueRange.new(
        values: [row_data]
      )
      
      service.append_spreadsheet_values(
        SHEET_ID,
        range,
        value_range,
        value_input_option: 'RAW'
      )
    end
    
    puts "Successfully added studio session data to Google Sheets"
  rescue StandardError => e
    puts "Error adding to Google Sheets: #{e.message}"
  end
end

# Product ID mapping for all products
PRODUCT_MAPPING = {
  'artist_consultation' => 'price_1RdfUTCIy4pumtGlddDMgml3',
  'clean_version' => 'price_1RdfUCCIy4pumtGllq1NV0iV',
  'performance_version' => 'price_1RdfTLCIy4pumtGltYvG2RoH',
  'mastering' => 'price_1RdfSlCIy4pumtGlD7ywOVG1',
  'mixing_only' => 'price_1RdfRyCIy4pumtGlyQEXKIfL',
  'mixing_mastering' => 'price_1RdfR9CIy4pumtGleJ3B5yBj',
  'studio_session' => 'price_1RdfYACIy4pumtGl2zcGu7Hg'
}

# Create checkout session with price IDs
post '/create-checkout-session' do
  content_type :json
  
  # Parse the request body
  request_body = JSON.parse(request.body.read)
  
  begin
    # Extract data from request
    items = request_body['items']
    customer_info = request_body['customerInfo']
    
    # Create a unique identifier for the order
    timestamp = Time.now.strftime('%Y%m%d%H%M%S')
    order_id = "order_#{timestamp}_#{rand(1000..9999)}"
    
    # Check if there are any studio sessions or consultations in the cart
    has_studio_session = items.any? { |item| item['type'] == 'studio_session' }
    has_consultation = items.any? { |item| item['type'] == 'service' && item['service_id'] == 'artist_consultation' }
    
    # Create line items for Stripe using dynamic pricing (fallback until price IDs are created)
    line_items = []
    
    items.each do |item|
      case item['type']
      when 'service'
        line_items << {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item['service_name'] || 'Service',
              description: item['category'] || 'Professional service'
            },
            unit_amount: (item['price'] * 100).to_i
          },
          quantity: 1
        }
      when 'beat'
        line_items << {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item['beat_title'] || 'Beat',
              description: "#{item['license_type'].capitalize} License"
            },
            unit_amount: (item['price'] * 100).to_i
          },
          quantity: 1
        }
      when 'studio_session'
        line_items << {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Studio Session',
              description: "#{item['studio_name']} • #{item['date']} • #{item['time_slot']}"
            },
            unit_amount: (35 * 100).to_i  # $35.00 per hour
          },
          quantity: item['duration'] || 1
        }
      end
    end
    
    # Format the order data for saving
    order_data = {
      id: order_id,
      timestamp: Time.now.to_s,
      items: items,
      customer_info: customer_info,
      status: 'pending',
      has_studio_session: has_studio_session,
      has_consultation: has_consultation
    }
    
    # Save order data to a JSON file
    order_file = File.join(bookings_dir, "#{order_id}.json")
    File.open(order_file, 'w') do |file|
      file.write(JSON.pretty_generate(order_data))
    end
    
    # Get frontend URL for redirects
    frontend_url = ENV['FRONTEND_URL'] || 'https://llc-frontend-production.up.railway.app'
    
    # Create a Stripe Checkout Session
    session = Stripe::Checkout::Session.create({
      payment_method_types: ['card'],
      line_items: line_items,
      metadata: {
        order_id: order_id,
        has_studio_session: has_studio_session.to_s,
        has_consultation: has_consultation.to_s
      },
      mode: 'payment',
      success_url: "#{frontend_url}/success?session_id={CHECKOUT_SESSION_ID}&order_id=#{order_id}",
      cancel_url: "#{frontend_url}/cart?canceled=true",
    })
    
    # Update order data with Stripe session ID
    order_data[:stripe_session_id] = session.id
    File.open(order_file, 'w') do |file|
      file.write(JSON.pretty_generate(order_data))
    end
    
    # Return the session URL for redirect
    { url: session.url }.to_json
    
  rescue StandardError => e
    status 400
    { error: e.message }.to_json
  end
end

# Legacy studio booking endpoint (keep for existing studio booking form)
post '/create-studio-checkout-session' do
  content_type :json
  
  # Parse the request body
  request_body = JSON.parse(request.body.read)
  
  begin
    # Extract data from request
    service = request_body['service']
    client = request_body['client']
    session_details = request_body['session']
    project = request_body['project']
    
    # Create a unique identifier for the booking
    timestamp = Time.now.strftime('%Y%m%d%H%M%S')
    booking_id = "booking_#{timestamp}_#{client['fullName'].gsub(/\s+/, '_')}"
    
    # Format the booking data for saving
    booking_data = {
      id: booking_id,
      timestamp: Time.now.to_s,
      service: service,
      client: client,
      session: session_details,
      project: project,
      status: 'pending'
    }
    
    # Save booking data to a JSON file
    booking_file = File.join(bookings_dir, "#{booking_id}.json")
    File.open(booking_file, 'w') do |file|
      file.write(JSON.pretty_generate(booking_data))
    end
    
    # Get frontend URL for redirects
    frontend_url = ENV['FRONTEND_URL'] || 'https://llc-frontend-production.up.railway.app'
    
    # Create a Stripe Checkout Session using studio session price ID
    session = Stripe::Checkout::Session.create({
      payment_method_types: ['card'],
      line_items: [{
        price: PRODUCT_MAPPING['studio_session'],
        quantity: service['duration'] || 1,  # Use duration as quantity
      }],
      metadata: {
        booking_id: booking_id,
        has_studio_session: 'true'
      },
      mode: 'payment',
      success_url: "#{frontend_url}/success?session_id={CHECKOUT_SESSION_ID}&booking_id=#{booking_id}",
      cancel_url: "#{frontend_url}/booking?canceled=true",
    })
    
    # Update booking data with Stripe session ID
    booking_data[:stripe_session_id] = session.id
    File.open(booking_file, 'w') do |file|
      file.write(JSON.pretty_generate(booking_data))
    end
    
    # Return the session URL
    { url: session.url }.to_json
    
  rescue StandardError => e
    status 400
    { error: e.message }.to_json
  end
end

# Webhook for Stripe events
post '/webhook' do
  payload = request.body.read
  sig_header = request.env['HTTP_STRIPE_SIGNATURE']
  
  begin
    event = Stripe::Webhook.construct_event(
      payload, sig_header, ENV['STRIPE_WEBHOOK_SECRET'] || 'whsec_your_webhook_signing_secret'
    )
    
    case event['type']
    when 'checkout.session.completed'
      session = event['data']['object']
      order_id = session['metadata']['order_id']
      booking_id = session['metadata']['booking_id']
      
      # Handle cart orders
      if order_id
        order_file = File.join(bookings_dir, "#{order_id}.json")
        if File.exist?(order_file)
          order_data = JSON.parse(File.read(order_file))
          order_data['status'] = 'confirmed'
          order_data['payment_status'] = session['payment_status']
          order_data['payment_intent'] = session['payment_intent']
          
          File.open(order_file, 'w') do |file|
            file.write(JSON.pretty_generate(order_data))
          end
          
          # Add to Google Sheets if it contains studio sessions
          add_to_google_sheets(order_data)
        end
      end
      
      # Handle legacy studio bookings
      if booking_id
        booking_file = File.join(bookings_dir, "#{booking_id}.json")
        if File.exist?(booking_file)
          booking_data = JSON.parse(File.read(booking_file))
          booking_data['status'] = 'confirmed'
          booking_data['payment_status'] = session['payment_status']
          booking_data['payment_intent'] = session['payment_intent']
          
          File.open(booking_file, 'w') do |file|
            file.write(JSON.pretty_generate(booking_data))
          end
        end
      end
    end
    
    status 200
    { received: true }.to_json
  rescue JSON::ParserError, Stripe::SignatureVerificationError => e
    status 400
    { error: e.message }.to_json
  end
end

# Success endpoint
get '/success' do
  "Payment successful! Your order has been confirmed."
end

# Railway healthcheck endpoint
get '/health' do
  content_type :json
  {
    status: 'healthy',
    timestamp: Time.now.utc.iso8601,
    service: 'riq-booking-server',
    port: ENV['PORT'] || 4242
  }.to_json
end

# For testing
get '/' do
  "RIQ Booking Server is running!"
end

# Get all bookings - for admin purposes
get '/bookings' do
  content_type :json
  
  bookings = []
  Dir.glob(File.join(bookings_dir, '*.json')).each do |file|
    bookings << JSON.parse(File.read(file))
  end
  
  bookings.to_json
end

# Initialize availability manager and calendar sync service
availability_manager = AvailabilityManager.new
calendar_sync_service = CalendarSyncService.new(availability_manager)

# Start background calendar sync when server starts
if ENV['RACK_ENV'] == 'production' || ENV['ENABLE_CALENDAR_SYNC'] == 'true'
  puts "Starting automatic calendar sync service..."
  calendar_sync_service.start_background_sync
  
  # Perform initial sync
  Thread.new do
    sleep(10) # Wait 10 seconds for server to fully start
    puts "Performing initial calendar sync..."
    calendar_sync_service.sync_calendars
  end
else
  puts "Calendar sync service disabled (set ENABLE_CALENDAR_SYNC=true to enable)"
end

# Graceful shutdown
at_exit do
  puts "Shutting down calendar sync service..."
  calendar_sync_service.stop_background_sync if calendar_sync_service
end

# Availability API endpoints
get '/api/availability/:date' do
  content_type :json
  
  begin
    date = params[:date]
    availability = availability_manager.get_availability(date)
    availability.to_json
  rescue => e
    status 500
    { error: "Failed to get availability: #{e.message}" }.to_json
  end
end

# Sync calendar availability from frontend
post '/api/sync-calendar' do
  content_type :json
  
  begin
    request_body = JSON.parse(request.body.read)
    calendar_events = request_body['events'] || []
    
    result = availability_manager.sync_calendar_availability(calendar_events)
    result.to_json
  rescue => e
    status 500
    { success: false, message: "Calendar sync failed: #{e.message}" }.to_json
  end
end

# Get sync status
get '/api/sync-status' do
  content_type :json
  
  begin
    status_info = availability_manager.get_sync_status
    status_info.to_json
  rescue => e
    status 500
    { error: "Failed to get sync status: #{e.message}" }.to_json
  end
end

# Manual availability override (for admin use)
post '/api/availability/override' do
  content_type :json
  
  begin
    request_body = JSON.parse(request.body.read)
    date = request_body['date']
    studio_id = request_body['studio_id']
    time_slot_id = request_body['time_slot_id']
    available = request_body['available']
    
    availability_manager.manual_override(date, studio_id, time_slot_id, available)
    
    { success: true, message: 'Availability override applied' }.to_json
  rescue => e
    status 500
    { success: false, message: "Override failed: #{e.message}" }.to_json
  end
end

# Manual calendar sync trigger (for admin use)
post '/api/sync-calendar-now' do
  content_type :json
  
  begin
    result = calendar_sync_service.sync_calendars
    result.to_json
  rescue => e
    status 500
    { success: false, message: "Manual sync failed: #{e.message}" }.to_json
  end
end

# Get calendar sync service status
get '/api/calendar-sync-status' do
  content_type :json
  
  begin
    {
      running: calendar_sync_service.instance_variable_get(:@running),
      sync_interval: calendar_sync_service.instance_variable_get(:@sync_interval),
      next_sync_in: calendar_sync_service.instance_variable_get(:@sync_interval)
    }.to_json
  rescue => e
    status 500
    { error: "Failed to get sync service status: #{e.message}" }.to_json
  end
end

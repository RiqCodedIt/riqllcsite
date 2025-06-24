require 'net/http'
require 'json'
require 'uri'
require 'date'

class CalendarSyncService
  def initialize(availability_manager)
    @availability_manager = availability_manager
    @api_key = ENV['VITE_GOOGLE_API_KEY']
    @studio_c_calendar_id = ENV['VITE_GOOGLE_CALENDAR_STUDIO_C_ID']
    @studio_d_calendar_id = ENV['VITE_GOOGLE_CALENDAR_STUDIO_D_ID']
    @sync_interval = (ENV['CALENDAR_SYNC_INTERVAL'] || '1800').to_i # Default 30 minutes
    @running = false
  end
  
  def start_background_sync
    return if @running
    
    @running = true
    puts "Starting calendar sync service (every #{@sync_interval / 60} minutes)"
    
    Thread.new do
      while @running
        begin
          sync_calendars
          sleep(@sync_interval)
        rescue => e
          puts "Calendar sync error: #{e.message}"
          sleep(60) # Wait 1 minute before retrying on error
        end
      end
    end
  end
  
  def stop_background_sync
    @running = false
    puts "Stopping calendar sync service"
  end
  
  def sync_calendars
    puts "Starting calendar sync at #{Time.now}"
    
    begin
      # Fetch events from both calendars
      studio_c_events = fetch_calendar_events(@studio_c_calendar_id, 'Studio C')
      studio_d_events = fetch_calendar_events(@studio_d_calendar_id, 'Studio D')
      
      # Process events to availability format
      availability_events = process_events_to_availability(studio_c_events, studio_d_events)
      
      # Clear existing calendar-sourced availability for the sync period
      clear_calendar_availability
      
      # Update availability in database
      result = @availability_manager.sync_calendar_availability(availability_events)
      
      puts "Calendar sync completed: #{result[:message]}"
      result
      
    rescue => e
      puts "Calendar sync failed: #{e.message}"
      { success: false, message: e.message }
    end
  end
  
  private
  
  def fetch_calendar_events(calendar_id, studio_name)
    return [] if !calendar_id || calendar_id.empty?
    
    begin
      # Prepare time range (next 30 days)
      time_min = Time.now.utc.strftime('%Y-%m-%dT%H:%M:%SZ')
      time_max = (Time.now + (30 * 24 * 60 * 60)).utc.strftime('%Y-%m-%dT%H:%M:%SZ')
      
      # Build API URL
      base_url = "https://www.googleapis.com/calendar/v3/calendars/#{URI.encode_www_form_component(calendar_id)}/events"
      params = {
        'key' => @api_key,
        'timeMin' => time_min,
        'timeMax' => time_max,
        'singleEvents' => 'true',
        'orderBy' => 'startTime',
        'maxResults' => '100'
      }
      
      url = "#{base_url}?#{URI.encode_www_form(params)}"
      
      # Make HTTP request
      uri = URI(url)
      response = Net::HTTP.get_response(uri)
      
      if response.code == '200'
        data = JSON.parse(response.body)
        events = data['items'] || []
        
        puts "Fetched #{events.length} events from #{studio_name} calendar"
        
        # Add studio source to events
        studio_id = studio_name.include?('C') ? 'C' : 'D'
        events.map { |event| event.merge('studioSource' => studio_id) }
      else
        puts "Error fetching #{studio_name} calendar: HTTP #{response.code}"
        []
      end
      
    rescue => e
      puts "Error fetching #{studio_name} calendar: #{e.message}"
      []
    end
  end
  
  def process_events_to_availability(studio_c_events, studio_d_events)
    availability_events = []
    all_events = studio_c_events + studio_d_events
    
    all_events.each do |event|
      begin
        # Get studio from source
        studio_id = event['studioSource'] || 'C'
        
        # Parse event timing
        start_time = event.dig('start', 'dateTime') || event.dig('start', 'date')
        end_time = event.dig('end', 'dateTime') || event.dig('end', 'date')
        
        next unless start_time && end_time
        
        start_date = DateTime.parse(start_time)
        end_date = DateTime.parse(end_time)
        
        # Determine time slot
        time_slot = determine_time_slot(start_date, end_date)
        next unless time_slot
        
        # Format date
        date = start_date.strftime('%Y-%m-%d')
        
        availability_events << {
          'date' => date,
          'studio_id' => studio_id,
          'time_slot_id' => time_slot,
          'available' => true
        }
        
      rescue => e
        puts "Error processing event: #{e.message}"
      end
    end
    
    puts "Processed #{availability_events.length} availability events"
    availability_events
  end
  
  def determine_time_slot(start_date, end_date)
    start_hour = start_date.hour
    end_hour = end_date.hour
    
    # Morning: 10:30 AM - 2:30 PM (10-14)
    if start_hour >= 10 && end_hour <= 14
      'morning'
    # Afternoon: 3:00 PM - 7:00 PM (15-19)
    elsif start_hour >= 15 && end_hour <= 19
      'afternoon'
    # Evening: 7:30 PM - 11:30 PM (19-23)
    elsif start_hour >= 19 && end_hour <= 23
      'evening'
    else
      # For events that span multiple periods or custom times
      duration = (end_date - start_date) * 24 # hours
      
      if duration >= 4
        # Long event, map to primary time based on start time
        if start_hour < 14
          'morning'
        elsif start_hour < 19
          'afternoon'
        else
          'evening'
        end
      else
        nil # Skip events that don't fit our time slots
      end
    end
  end
  
  def clear_calendar_availability
    # This would clear calendar-sourced availability for the sync period
    # Implementation depends on your database structure
    # For now, we'll let the availability manager handle conflicts
  end
end

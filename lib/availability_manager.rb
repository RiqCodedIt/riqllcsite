require 'sequel'

class AvailabilityManager
  def initialize
    @db = setup_database
  end
  
  def get_availability(date)
    date_str = date.is_a?(String) ? date : date.to_s
    
    # Check if we have cached data for this date
    cached_data = get_cached_availability(date_str)
    
    if cached_data.empty?
      # Generate default availability based on rules
      default_availability = generate_default_availability(Date.parse(date_str))
      update_availability_data(default_availability)
      cached_data = get_cached_availability(date_str)
    end
    
    format_availability_response(date_str, cached_data)
  end
  
  def sync_calendar_availability(calendar_events)
    # This will be called by the frontend with Google Calendar events
    puts "Syncing calendar availability with #{calendar_events.length} events"
    
    begin
      records_updated = 0
      
      calendar_events.each do |event|
        date = event['date']
        studio_id = event['studio_id']
        time_slot_id = event['time_slot_id']
        available = event['available']
        
        # Update or insert availability record
        @db[:availability].insert_conflict(
          target: [:date, :studio_id, :time_slot_id],
          update: {
            available: available,
            source: 'calendar',
            last_updated: Time.now,
            sync_status: 'synced'
          }
        ).insert(
          date: date,
          studio_id: studio_id,
          time_slot_id: time_slot_id,
          available: available,
          source: 'calendar',
          last_updated: Time.now,
          sync_status: 'synced'
        )
        
        records_updated += 1
      end
      
      log_sync('success', records_updated)
      
      {
        success: true,
        message: "Successfully synced #{records_updated} availability records from calendar",
        records_updated: records_updated
      }
      
    rescue => e
      log_sync('error', 0, e.message)
      {
        success: false,
        message: "Calendar sync failed: #{e.message}"
      }
    end
  end
  
  def get_sync_status
    last_sync = @db[:sync_logs].order(:sync_time).last
    
    {
      last_sync_time: last_sync ? last_sync[:sync_time] : nil,
      last_sync_status: last_sync ? last_sync[:status] : 'never',
      records_in_db: @db[:availability].count,
      latest_date: @db[:availability].max(:date)
    }
  end
  
  def manual_override(date, studio_id, time_slot_id, available)
    date_str = date.is_a?(String) ? date : date.to_s
    
    @db[:availability].insert_conflict(
      target: [:date, :studio_id, :time_slot_id],
      update: {
        available: available,
        source: 'manual',
        last_updated: Time.now,
        sync_status: 'manual_override'
      }
    ).insert(
      date: date_str,
      studio_id: studio_id,
      time_slot_id: time_slot_id,
      available: available,
      source: 'manual',
      last_updated: Time.now,
      sync_status: 'manual_override'
    )
    
    puts "Manual override set: #{date_str} #{studio_id} #{time_slot_id} = #{available}"
  end
  
  def clear_date_availability(date)
    # Clear all availability for a specific date (useful for calendar sync)
    date_str = date.is_a?(String) ? date : date.to_s
    @db[:availability].where(date: date_str).delete
  end
  
  private
  
  def setup_database
    db_path = ENV['DATABASE_URL'] || 'sqlite://availability.db'
    db = Sequel.connect(db_path)
    
    # Run migrations if tables don't exist
    unless db.table_exists?(:availability)
      puts "Running database migrations..."
      Sequel.extension :migration
      Sequel::Migrator.run(db, 'db/migrate')
    end
    
    db
  end
  
  def get_cached_availability(date_str)
    @db[:availability].where(date: date_str).all
  end
  
  def generate_default_availability(date)
    # Default availability rules
    # Closed on Mondays, open other days
    is_available = !date.monday?
    
    availability_records = []
    
    # Generate records for both studios and all time slots
    ['C', 'D'].each do |studio_id|
      ['morning', 'afternoon', 'evening'].each do |time_slot_id|
        availability_records << {
          date: date.to_s,
          studio_id: studio_id,
          time_slot_id: time_slot_id,
          available: is_available,
          source: 'default',
          last_updated: Time.now,
          sync_status: 'default'
        }
      end
    end
    
    availability_records
  end
  
  def format_availability_response(date, cached_data)
    # Convert database format to frontend format
    response = {
      date: date,
      studioC: {},
      studioD: {}
    }
    
    # Default all slots to unavailable
    %w[morning afternoon evening].each do |slot|
      response[:studioC][slot] = false
      response[:studioD][slot] = false
    end
    
    # Update with actual availability data
    cached_data.each do |record|
      studio_key = record[:studio_id] == 'C' ? :studioC : :studioD
      response[studio_key][record[:time_slot_id]] = record[:available]
    end
    
    response
  end
  
  def update_availability_data(availability_records)
    records_updated = 0
    
    @db.transaction do
      availability_records.each do |record|
        @db[:availability].insert_conflict(
          target: [:date, :studio_id, :time_slot_id],
          update: {
            available: record[:available],
            source: record[:source],
            last_updated: record[:last_updated],
            sync_status: record[:sync_status] || 'synced'
          }
        ).insert(record)
        
        records_updated += 1
      end
    end
    
    records_updated
  end
  
  def log_sync(status, records_updated, error_message = nil)
    @db[:sync_logs].insert(
      sync_time: Time.now,
      status: status,
      records_updated: records_updated,
      errors: error_message,
      details: "Synced #{records_updated} records"
    )
  end
end

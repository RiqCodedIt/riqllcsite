require 'sequel'
require_relative 'record_co_scraper'

class AvailabilityManager
  def initialize
    @db = setup_database
    @scraper = RecordCoScraper.new
  end
  
  def get_availability(date)
    date_str = date.is_a?(String) ? date : date.to_s
    
    # Check if we have recent data for this date
    cached_data = get_cached_availability(date_str)
    
    if cached_data.empty? || data_is_stale?(cached_data.first[:last_updated])
      # Scrape fresh data
      sync_date_availability(Date.parse(date_str))
      cached_data = get_cached_availability(date_str)
    end
    
    format_availability_response(date_str, cached_data)
  end
  
  def sync_availability(start_date = Date.today, days = 30)
    puts "Starting availability sync for #{days} days from #{start_date}"
    
    begin
      # Scrape data from Record Co
      scraped_data = @scraper.scrape_availability(start_date, days)
      
      if scraped_data.empty?
        log_sync('error', 0, 'No data returned from scraper')
        return { success: false, message: 'Failed to scrape data' }
      end
      
      # Update database with scraped data
      records_updated = update_availability_data(scraped_data)
      
      log_sync('success', records_updated)
      
      {
        success: true,
        message: "Successfully synced #{records_updated} availability records",
        records_updated: records_updated
      }
      
    rescue => e
      log_sync('error', 0, e.message)
      {
        success: false,
        message: "Sync failed: #{e.message}"
      }
    end
  end
  
  def sync_date_availability(date)
    scraped_data = @scraper.scrape_availability(date, 1)
    update_availability_data(scraped_data) unless scraped_data.empty?
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
  
  def data_is_stale?(last_updated, max_age_hours = 1)
    return true unless last_updated
    Time.now - last_updated > (max_age_hours * 3600)
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
  
  def update_availability_data(scraped_data)
    records_updated = 0
    
    @db.transaction do
      scraped_data.each do |record|
        @db[:availability].insert_conflict(
          target: [:date, :studio_id, :time_slot_id],
          update: {
            available: record[:available],
            source: record[:source],
            last_updated: record[:last_updated],
            sync_status: 'synced'
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

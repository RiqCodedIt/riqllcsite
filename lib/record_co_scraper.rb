require 'selenium-webdriver'
require 'nokogiri'
require 'json'
require 'date'

class RecordCoScraper
  RECORD_CO_URL = 'https://therecordco.org/reserve-space/'
  LOGIN_URL = 'https://therecordco.org/wp-login.php'
  
  # Map Record Co time slots to our system
  TIME_SLOT_MAPPING = {
    '10:30' => 'morning',    # 10:30 AM - 2:30 PM
    '15:00' => 'afternoon',  # 3:00 PM - 7:00 PM  
    '19:30' => 'evening'     # 7:30 PM - 11:30 PM
  }.freeze
  
  # Map Record Co studios to our system
  STUDIO_MAPPING = {
    'Studio C' => 'C',
    'Studio D' => 'D'
  }.freeze
  
  def initialize
    @username = ENV['recordco_user'] || 'prodbyriq@gmail.com'
    @password = ENV['recordco_pass'] || 'sasqib-cyjjo7-Xecjik'
    @driver = nil
  end
  
  def scrape_availability(start_date = Date.today, days = 30)
    setup_driver
    
    begin
      login_to_record_co
      availability_data = extract_calendar_data(start_date, days)
      log_sync_result('success', availability_data.length)
      availability_data
    rescue => e
      log_sync_result('error', 0, e.message)
      puts "Scraping error: #{e.message}"
      []
    ensure
      cleanup_driver
    end
  end
  
  private
  
  def setup_driver
    options = Selenium::WebDriver::Chrome::Options.new
    
    # Headless mode for production
    options.add_argument('--headless') if ENV['RAILS_ENV'] == 'production'
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    options.add_argument('--window-size=1920,1080')
    
    @driver = Selenium::WebDriver.for(:chrome, options: options)
    @driver.manage.timeouts.implicit_wait = 10
  end
  
  def cleanup_driver
    @driver&.quit
    @driver = nil
  end
  
  def login_to_record_co
    puts "Logging into Record Co..."
    @driver.navigate.to(LOGIN_URL)
    
    # Wait for login form to load
    wait = Selenium::WebDriver::Wait.new(timeout: 10)
    
    # Fill in login credentials
    username_field = wait.until { @driver.find_element(id: 'user_login') }
    password_field = @driver.find_element(id: 'user_pass')
    
    username_field.send_keys(@username)
    password_field.send_keys(@password)
    
    # Submit login form
    login_button = @driver.find_element(id: 'wp-submit')
    login_button.click
    
    # Wait for redirect after login
    wait.until { @driver.current_url != LOGIN_URL }
    
    # Navigate to booking calendar
    @driver.navigate.to(RECORD_CO_URL)
    puts "Successfully logged in and navigated to calendar"
  end
  
  def extract_calendar_data(start_date, days)
    puts "Extracting calendar data for #{days} days starting from #{start_date}"
    availability_data = []
    
    current_date = start_date
    days.times do
      date_availability = scrape_date_availability(current_date)
      availability_data.concat(date_availability) if date_availability
      current_date += 1
    end
    
    availability_data
  end
  
  def scrape_date_availability(date)
    puts "Scraping availability for #{date}"
    
    begin
      # Navigate to specific date (this will depend on Record Co's calendar interface)
      navigate_to_date(date)
      
      # Extract availability for both studios
      availability = []
      
      STUDIO_MAPPING.each do |record_co_studio, our_studio_id|
        TIME_SLOT_MAPPING.each do |time, our_slot_id|
          is_available = check_slot_availability(record_co_studio, time, date)
          
          availability << {
            date: date.to_s,
            studio_id: our_studio_id,
            time_slot_id: our_slot_id,
            available: is_available,
            source: 'recordco',
            last_updated: Time.now
          }
        end
      end
      
      availability
    rescue => e
      puts "Error scraping date #{date}: #{e.message}"
      nil
    end
  end
  
  def navigate_to_date(date)
    # This method will need to be customized based on Record Co's calendar interface
    # For now, we'll implement a basic approach
    
    wait = Selenium::WebDriver::Wait.new(timeout: 10)
    
    # Look for date navigation elements
    # This is a placeholder - will need to be updated based on actual calendar structure
    begin
      # Try to find and click on the specific date
      date_element = @driver.find_element(xpath: "//td[@data-date='#{date}'] | //div[@data-date='#{date}'] | //*[contains(text(), '#{date.strftime('%d')}')]")
      date_element.click if date_element
    rescue Selenium::WebDriver::Error::NoSuchElementError
      puts "Could not find date element for #{date}, using current view"
    end
  end
  
  def check_slot_availability(studio_name, time_slot, date)
    # This method checks if a specific studio/time slot is available
    # Implementation will depend on Record Co's calendar structure
    
    begin
      # Look for booking elements that indicate unavailability
      # This is a placeholder implementation
      
      # Try multiple selectors that might indicate a booked slot
      booked_selectors = [
        "//div[contains(@class, 'booked') and contains(text(), '#{studio_name}') and contains(text(), '#{time_slot}')]",
        "//td[contains(@class, 'unavailable') and @data-studio='#{studio_name}' and @data-time='#{time_slot}']",
        "//*[contains(@class, 'reserved') and contains(text(), '#{studio_name}')]"
      ]
      
      booked_selectors.each do |selector|
        begin
          element = @driver.find_element(xpath: selector)
          return false if element # Found a booked indicator
        rescue Selenium::WebDriver::Error::NoSuchElementError
          # Continue checking other selectors
        end
      end
      
      # If no booked indicators found, assume available
      true
      
    rescue => e
      puts "Error checking availability for #{studio_name} at #{time_slot}: #{e.message}"
      # Default to unavailable if we can't determine status
      false
    end
  end
  
  def log_sync_result(status, records_updated, error_message = nil)
    # This will be used by the AvailabilityManager to log sync results
    puts "Sync #{status}: #{records_updated} records updated"
    puts "Error: #{error_message}" if error_message
  end
end

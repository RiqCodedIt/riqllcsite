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
    # Record Co shows one date per page, need to navigate to specific date
    wait = Selenium::WebDriver::Wait.new(timeout: 10)
    
    begin
      # Get current date shown on page
      current_date_element = wait.until { @driver.find_element(css: '.calendar-date, .date-header, h2, h3') }
      current_date_text = current_date_element.text
      
      # Parse current date from text like "Sun, 1 June 2025"
      current_date = parse_date_from_text(current_date_text)
      
      # Navigate to target date if different from current
      if current_date != date
        navigate_to_target_date(current_date, date)
      end
      
      puts "Successfully navigated to #{date}"
    rescue => e
      puts "Error navigating to date #{date}: #{e.message}"
      # Try alternative navigation methods
      try_alternative_navigation(date)
    end
  end
  
  def parse_date_from_text(date_text)
    # Parse dates like "Sun, 1 June 2025" or "June 1, 2025"
    begin
      # Try different date formats
      if date_text.match?(/\w+,\s*\d+\s+\w+\s+\d{4}/)
        # Format: "Sun, 1 June 2025"
        Date.parse(date_text.gsub(/^\w+,\s*/, ''))
      elsif date_text.match?(/\w+\s+\d+,\s*\d{4}/)
        # Format: "June 1, 2025"
        Date.parse(date_text)
      else
        # Try direct parsing
        Date.parse(date_text)
      end
    rescue
      Date.today # Fallback to today if parsing fails
    end
  end
  
  def navigate_to_target_date(current_date, target_date)
    # Calculate days difference
    days_diff = (target_date - current_date).to_i
    
    if days_diff > 0
      # Navigate forward
      days_diff.times do
        click_next_day
        sleep(1) # Wait for page to load
      end
    elsif days_diff < 0
      # Navigate backward
      days_diff.abs.times do
        click_previous_day
        sleep(1) # Wait for page to load
      end
    end
  end
  
  def click_next_day
    begin
      # Try different selectors for next button
      next_selectors = [
        "//button[contains(text(), 'next')]",
        "//a[contains(text(), 'next')]",
        "//button[contains(@class, 'next')]",
        "//a[contains(@class, 'next')]",
        "//button[@title='Next day']",
        "//a[@title='Next day']",
        "//button[contains(@aria-label, 'next')]"
      ]
      
      next_selectors.each do |selector|
        begin
          element = @driver.find_element(xpath: selector)
          element.click
          return
        rescue Selenium::WebDriver::Error::NoSuchElementError
          next
        end
      end
      
      puts "Could not find next day button"
    rescue => e
      puts "Error clicking next day: #{e.message}"
    end
  end
  
  def click_previous_day
    begin
      # Try different selectors for previous button
      prev_selectors = [
        "//button[contains(text(), 'previous')]",
        "//a[contains(text(), 'previous')]",
        "//button[contains(@class, 'prev')]",
        "//a[contains(@class, 'prev')]",
        "//button[@title='Previous day']",
        "//a[@title='Previous day']",
        "//button[contains(@aria-label, 'previous')]"
      ]
      
      prev_selectors.each do |selector|
        begin
          element = @driver.find_element(xpath: selector)
          element.click
          return
        rescue Selenium::WebDriver::Error::NoSuchElementError
          next
        end
      end
      
      puts "Could not find previous day button"
    rescue => e
      puts "Error clicking previous day: #{e.message}"
    end
  end
  
  def try_alternative_navigation(date)
    # Try to use URL manipulation if buttons don't work
    begin
      current_url = @driver.current_url
      # Try to modify URL with date parameter
      date_param = date.strftime('%Y-%m-%d')
      
      if current_url.include?('?')
        new_url = "#{current_url}&date=#{date_param}"
      else
        new_url = "#{current_url}?date=#{date_param}"
      end
      
      @driver.navigate.to(new_url)
      sleep(2) # Wait for page to load
    rescue => e
      puts "Alternative navigation failed: #{e.message}"
    end
  end
  
  def check_slot_availability(studio_name, time_slot, date)
    # Check availability based on Record Co's grid calendar structure
    # Green cells = available, Gray cells = unavailable
    
    begin
      # Find the studio row
      studio_row = find_studio_row(studio_name)
      return false unless studio_row
      
      # Find the time slot column for our target time
      time_column_index = find_time_column_index(time_slot)
      return false unless time_column_index
      
      # Get the cell at the intersection of studio row and time column
      cell = find_availability_cell(studio_row, time_column_index)
      return false unless cell
      
      # Check if cell indicates availability (green background)
      is_available = cell_is_available?(cell)
      
      puts "#{studio_name} at #{time_slot}: #{is_available ? 'Available' : 'Unavailable'}"
      is_available
      
    rescue => e
      puts "Error checking availability for #{studio_name} at #{time_slot}: #{e.message}"
      # Default to unavailable if we can't determine status
      false
    end
  end
  
  def find_studio_row(studio_name)
    # Find the row containing the studio name
    studio_selectors = [
      "//tr[td[contains(text(), '#{studio_name}')]]",
      "//div[contains(@class, 'studio-row') and contains(text(), '#{studio_name}')]",
      "//*[contains(text(), '#{studio_name}')]/ancestor::tr",
      "//*[contains(text(), '#{studio_name}')]/parent::*"
    ]
    
    studio_selectors.each do |selector|
      begin
        element = @driver.find_element(xpath: selector)
        return element if element
      rescue Selenium::WebDriver::Error::NoSuchElementError
        next
      end
    end
    
    puts "Could not find studio row for #{studio_name}"
    nil
  end
  
  def find_time_column_index(target_time)
    # Find the column index for the target time slot
    # Convert our time format to match Record Co's format
    record_co_time = convert_to_record_co_time(target_time)
    
    begin
      # Look for time headers in the calendar
      time_headers = @driver.find_elements(xpath: "//th[contains(text(), 'am') or contains(text(), 'pm')] | //td[contains(text(), 'am') or contains(text(), 'pm')]")
      
      time_headers.each_with_index do |header, index|
        header_text = header.text.strip
        if time_matches?(header_text, record_co_time)
          return index + 1 # +1 because first column is studio names
        end
      end
      
      puts "Could not find time column for #{target_time} (#{record_co_time})"
      nil
    rescue => e
      puts "Error finding time column: #{e.message}"
      nil
    end
  end
  
  def convert_to_record_co_time(our_time)
    # Convert our time format to Record Co's format
    case our_time
    when '10:30'
      ['10 am', '10:30', '10:30 am']
    when '15:00'
      ['3 pm', '15:00', '3:00 pm']
    when '19:30'
      ['7 pm', '19:30', '7:30 pm']
    else
      [our_time]
    end
  end
  
  def time_matches?(header_text, target_times)
    # Check if header text matches any of our target time formats
    target_times = [target_times] unless target_times.is_a?(Array)
    
    target_times.any? do |target_time|
      header_text.include?(target_time) || 
      header_text.gsub(/\s+/, '').include?(target_time.gsub(/\s+/, ''))
    end
  end
  
  def find_availability_cell(studio_row, column_index)
    # Find the specific cell in the studio row at the given column
    begin
      # Try different cell selectors
      cell_selectors = [
        ".//td[#{column_index}]",
        ".//div[#{column_index}]",
        "(.//td | .//div)[#{column_index}]"
      ]
      
      cell_selectors.each do |selector|
        begin
          cell = studio_row.find_element(xpath: selector)
          return cell if cell
        rescue Selenium::WebDriver::Error::NoSuchElementError
          next
        end
      end
      
      puts "Could not find cell at column #{column_index}"
      nil
    rescue => e
      puts "Error finding availability cell: #{e.message}"
      nil
    end
  end
  
  def cell_is_available?(cell)
    # Check if the cell indicates availability
    # Available cells typically have green background, unavailable are gray
    
    begin
      # Get cell styling and classes
      cell_class = cell.attribute('class') || ''
      cell_style = cell.attribute('style') || ''
      background_color = cell.css_value('background-color')
      
      # Check for availability indicators
      available_indicators = [
        cell_class.include?('available'),
        cell_class.include?('free'),
        cell_class.include?('open'),
        !cell_class.include?('unavailable'),
        !cell_class.include?('booked'),
        !cell_class.include?('reserved'),
        background_color.include?('green') || background_color.include?('rgb(144, 238, 144)'), # Light green
        cell_style.include?('green')
      ]
      
      # Check for unavailability indicators
      unavailable_indicators = [
        cell_class.include?('unavailable'),
        cell_class.include?('booked'),
        cell_class.include?('reserved'),
        cell_class.include?('disabled'),
        background_color.include?('gray') || background_color.include?('grey'),
        background_color.include?('rgb(128, 128, 128)'), # Gray
        cell_style.include?('gray') || cell_style.include?('grey')
      ]
      
      # If we have explicit unavailable indicators, it's unavailable
      return false if unavailable_indicators.any?
      
      # If we have explicit available indicators, it's available
      return true if available_indicators.any?
      
      # Default to available if we can't determine (conservative approach)
      true
      
    rescue => e
      puts "Error checking cell availability: #{e.message}"
      # Default to unavailable on error
      false
    end
  end
  
  def log_sync_result(status, records_updated, error_message = nil)
    # This will be used by the AvailabilityManager to log sync results
    puts "Sync #{status}: #{records_updated} records updated"
    puts "Error: #{error_message}" if error_message
  end
end

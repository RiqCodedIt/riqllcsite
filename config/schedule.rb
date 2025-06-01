# Use this file to easily define all of your cron jobs.
# Learn more: http://github.com/javan/whenever

# Set environment variables
set :environment, ENV['RAILS_ENV'] || 'production'
set :output, 'log/cron.log'

# Sync Record Co calendar every 30 minutes
every 30.minutes do
  runner "AvailabilityManager.new.sync_availability"
end

# Daily full sync at 6 AM
every 1.day, at: '6:00 am' do
  runner "AvailabilityManager.new.sync_availability(Date.today, 60)"
end

# Weekly cleanup of old availability data (older than 90 days)
every 1.week, at: '2:00 am' do
  runner "
    db = Sequel.connect(ENV['DATABASE_URL'] || 'sqlite://availability.db')
    cutoff_date = Date.today - 90
    deleted = db[:availability].where { date < cutoff_date }.delete
    puts \"Cleaned up #{deleted} old availability records\"
  "
end

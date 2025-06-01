# Record Co Calendar Sync System

This system automatically syncs studio availability from The Record Co's booking calendar to ensure your site's availability data is always up-to-date.

## Overview

The sync system consists of several components:

1. **Record Co Scraper** (`lib/record_co_scraper.rb`) - Scrapes availability data from Record Co's calendar
2. **Availability Manager** (`lib/availability_manager.rb`) - Manages database operations and coordinates syncing
3. **Database Schema** (`db/migrate/001_create_availability.rb`) - Stores availability data and sync logs
4. **API Endpoints** (`server.rb`) - Provides availability data to your frontend
5. **Automated Sync Jobs** (`config/schedule.rb`) - Runs periodic syncs

## Features

- **Automated Syncing**: Syncs every 30 minutes with daily full syncs
- **Manual Override**: Admin can manually set availability for specific slots
- **Error Handling**: Comprehensive logging and fallback mechanisms
- **Date Navigation**: Handles Record Co's single-date-per-page calendar format
- **Grid Detection**: Reads availability from calendar grid using color detection
- **Caching**: Caches data to reduce unnecessary scraping

## Setup

### 1. Environment Variables

Add these to your `.env` file:

```bash
# Record Co Login Credentials
recordco_user=your_email@example.com
recordco_pass=your_password

# Database (optional, defaults to SQLite)
DATABASE_URL=sqlite://availability.db

# Chrome Driver (for production)
RAILS_ENV=production
```

### 2. Dependencies

The system requires these gems (already in Gemfile):

```ruby
gem 'selenium-webdriver'
gem 'sequel'
gem 'nokogiri'
gem 'whenever'  # For cron jobs
```

### 3. Database Setup

Run the migration to create the database tables:

```bash
bundle exec sequel -m db/migrate sqlite://availability.db
```

### 4. Chrome Driver

For the scraper to work, you need Chrome and ChromeDriver installed:

```bash
# On macOS
brew install chromedriver

# On Ubuntu/Debian
sudo apt-get install chromium-browser chromium-chromedriver

# On Railway (automatically handled by buildpack)
```

## API Endpoints

### Get Availability for a Date

```
GET /api/availability/:date
```

Returns availability data for a specific date:

```json
{
  "date": "2025-06-01",
  "studioC": {
    "morning": true,
    "afternoon": false,
    "evening": true
  },
  "studioD": {
    "morning": false,
    "afternoon": true,
    "evening": true
  }
}
```

### Trigger Manual Sync

```
POST /api/sync-calendar
```

Body (optional):
```json
{
  "start_date": "2025-06-01",
  "days": 30
}
```

### Get Sync Status

```
GET /api/sync-status
```

Returns information about the last sync:

```json
{
  "last_sync_time": "2025-06-01T12:00:00Z",
  "last_sync_status": "success",
  "records_in_db": 180,
  "latest_date": "2025-06-30"
}
```

### Manual Override (Admin)

```
POST /api/availability/override
```

Body:
```json
{
  "date": "2025-06-01",
  "studio_id": "C",
  "time_slot_id": "morning",
  "available": false
}
```

## Time Slot Mapping

The system maps Record Co's time slots to your system:

| Record Co Time | Your System | Description |
|----------------|-------------|-------------|
| 10:30 AM | morning | 10:30 AM - 2:30 PM |
| 3:00 PM | afternoon | 3:00 PM - 7:00 PM |
| 7:30 PM | evening | 7:30 PM - 11:30 PM |

## Studio Mapping

| Record Co Studio | Your System |
|------------------|-------------|
| Studio C | C |
| Studio D | D |

## How It Works

### 1. Scraping Process

1. **Login**: Authenticates with Record Co using provided credentials
2. **Navigate**: Goes to the booking calendar page
3. **Date Navigation**: Navigates through dates (one date per page)
4. **Grid Reading**: Reads the calendar grid to determine availability
5. **Color Detection**: Green cells = available, Gray cells = unavailable
6. **Data Storage**: Stores results in the database

### 2. Calendar Structure

Record Co's calendar shows:
- One date per page
- Studios listed vertically (Studio A, B, C, D, etc.)
- Time slots horizontally (10 am, 11 am, 12 pm, etc.)
- Color-coded availability (green = available, gray = unavailable)

### 3. Sync Schedule

- **Every 30 minutes**: Quick sync for recent dates
- **Daily at 6 AM**: Full sync for next 60 days
- **Weekly at 2 AM**: Cleanup old data (90+ days)

## Deployment

### Railway Deployment

1. **Push to GitHub**: The backend branch is ready for deployment
2. **Connect to Railway**: Link your GitHub repo to Railway
3. **Set Environment Variables**: Add your Record Co credentials
4. **Deploy**: Railway will automatically build and deploy

### Environment Variables for Railway

```bash
recordco_user=your_email@example.com
recordco_pass=your_password
DATABASE_URL=postgresql://... (Railway will provide this)
RAILS_ENV=production
```

## Monitoring

### Logs

Check sync logs in the database:

```sql
SELECT * FROM sync_logs ORDER BY sync_time DESC LIMIT 10;
```

### Manual Testing

Test the scraper manually:

```ruby
# In Rails console or Ruby script
require_relative 'lib/availability_manager'

manager = AvailabilityManager.new
result = manager.sync_availability(Date.today, 7)
puts result
```

## Troubleshooting

### Common Issues

1. **Login Fails**
   - Check credentials in environment variables
   - Verify Record Co account has access to calendar

2. **Scraping Fails**
   - Check if Record Co changed their calendar structure
   - Verify ChromeDriver is installed and compatible

3. **Date Navigation Issues**
   - Record Co may have changed navigation buttons
   - Check console logs for specific errors

4. **No Data Returned**
   - Verify studios C and D exist in Record Co's calendar
   - Check time slot mappings are correct

### Debug Mode

Enable debug logging:

```ruby
# Add to scraper initialization
@driver.manage.logs.level = :debug
```

## Frontend Integration

Update your frontend to use the new API:

```typescript
// Replace your existing availability hook
const useAvailability = (date: string) => {
  const [availability, setAvailability] = useState(null);
  
  useEffect(() => {
    fetch(`/api/availability/${date}`)
      .then(res => res.json())
      .then(setAvailability);
  }, [date]);
  
  return availability;
};
```

## Security

- Credentials are stored as environment variables
- Database access is restricted to the application
- Scraping runs in headless mode in production
- API endpoints can be protected with authentication if needed

## Maintenance

### Regular Tasks

1. **Monitor sync logs** for failures
2. **Update credentials** if Record Co password changes
3. **Check for calendar structure changes** at Record Co
4. **Clean up old availability data** (automated weekly)

### Updates

When Record Co changes their calendar:

1. Update selectors in `record_co_scraper.rb`
2. Test with manual sync
3. Deploy updates
4. Monitor for successful syncs

## Support

For issues with the sync system:

1. Check the sync logs in the database
2. Review server logs for error details
3. Test manual sync to isolate issues
4. Update scraper selectors if Record Co changed their site

The system is designed to be robust and handle most changes automatically, but may need updates if Record Co significantly changes their calendar interface.

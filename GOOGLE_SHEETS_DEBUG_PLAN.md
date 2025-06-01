# Google Sheets Integration Debug Plan

## 🚨 **Issue**: Requests are being sent to Google Sheets API but nothing is getting written

## 🔍 **Root Cause Analysis**

Based on the code review, the most likely causes are:

1. **Authentication/Permission Issues** (90% probability)
2. **Data Structure Problems** (8% probability) 
3. **API Configuration Issues** (2% probability)

---

## 📋 **PHASE 1: Authentication & Permissions (CRITICAL)**

### ✅ **Task 1.1: Extract Service Account Email**
**Priority**: URGENT
**Location**: `client_secret_125505298187-vh9hnuno3uq1gjrojtqo0k63iq4g5i0p.apps.googleusercontent.com.json`

**Steps**:
1. Open the JSON credentials file
2. Find the `client_email` field
3. Copy the service account email address

**Expected Format**: `your-service-account@project-id.iam.gserviceaccount.com`

### ✅ **Task 1.2: Share Google Sheet with Service Account**
**Priority**: URGENT
**Sheet ID**: `1ZtjDAftjp6eUW4Cv2CfS4FKhQcDXnYDM3jJdrekTJqo`

**Steps**:
1. Open the Google Sheet in browser
2. Click "Share" button
3. Add the service account email from Task 1.1
4. Set permissions to "Editor"
5. Click "Send"

### ✅ **Task 1.3: Verify Credentials File Path**
**Priority**: HIGH
**Current Path**: `File.join(Dir.pwd, '..', 'client_secret_125505298187-vh9hnuno3uq1gjrojtqo0k63iq4g5i0p.apps.googleusercontent.com.json')`

**Verification**:
```ruby
# Add this to server.rb for testing
puts "Credentials file exists: #{File.exist?(CREDENTIALS_PATH)}"
puts "Credentials file path: #{CREDENTIALS_PATH}"
```

---

## 📋 **PHASE 2: Enhanced Logging & Data Validation**

### ✅ **Task 2.1: Add Comprehensive Error Logging**
**Priority**: HIGH
**Location**: `spotify-backend/server.rb` - `add_to_google_sheets` function

**Current Code**:
```ruby
rescue StandardError => e
  puts "Error adding to Google Sheets: #{e.message}"
end
```

**Enhanced Code**:
```ruby
rescue StandardError => e
  puts "=== GOOGLE SHEETS ERROR ==="
  puts "Error message: #{e.message}"
  puts "Error class: #{e.class}"
  puts "Backtrace:"
  puts e.backtrace.join("\n")
  puts "=========================="
end
```

### ✅ **Task 2.2: Add Data Structure Logging**
**Priority**: HIGH
**Location**: `spotify-backend/server.rb` - `add_to_google_sheets` function

**Add at the beginning of function**:
```ruby
def add_to_google_sheets(order_data)
  puts "=== GOOGLE SHEETS DEBUG ==="
  puts "Order data keys: #{order_data.keys}"
  puts "Has studio session: #{order_data['has_studio_session']}"
  puts "Items count: #{order_data['items']&.length || 0}"
  
  if order_data['items']
    order_data['items'].each_with_index do |item, index|
      puts "Item #{index}: type=#{item['type']}, keys=#{item.keys}"
    end
  end
  puts "=========================="
  
  return unless order_data['has_studio_session']
  # ... rest of function
```

### ✅ **Task 2.3: Add Google Sheets API Call Logging**
**Priority**: HIGH

**Add before API call**:
```ruby
puts "=== GOOGLE SHEETS API CALL ==="
puts "Sheet ID: #{SHEET_ID}"
puts "Range: #{range}"
puts "Row data: #{row_data.inspect}"
puts "=============================="

# Make API call
result = service.append_spreadsheet_values(
  SHEET_ID,
  range,
  value_range,
  value_input_option: 'RAW'
)

puts "=== API RESPONSE ==="
puts "Response: #{result.inspect}"
puts "===================="
```

---

## 📋 **PHASE 3: Webhook & Data Flow Validation**

### ✅ **Task 3.1: Add Webhook Logging**
**Priority**: MEDIUM
**Location**: `spotify-backend/server.rb` - webhook handler

**Add in webhook handler**:
```ruby
when 'checkout.session.completed'
  session = event['data']['object']
  order_id = session['metadata']['order_id']
  booking_id = session['metadata']['booking_id']
  
  puts "=== WEBHOOK RECEIVED ==="
  puts "Session ID: #{session['id']}"
  puts "Order ID: #{order_id}"
  puts "Booking ID: #{booking_id}"
  puts "Metadata: #{session['metadata'].inspect}"
  puts "======================="
```

### ✅ **Task 3.2: Validate Order Data Structure**
**Priority**: MEDIUM

**Add before calling add_to_google_sheets**:
```ruby
if order_id
  order_file = File.join(bookings_dir, "#{order_id}.json")
  if File.exist?(order_file)
    order_data = JSON.parse(File.read(order_file))
    
    puts "=== ORDER DATA VALIDATION ==="
    puts "Order file: #{order_file}"
    puts "Order data structure:"
    puts JSON.pretty_generate(order_data)
    puts "============================="
    
    # ... existing code ...
    add_to_google_sheets(order_data)
  end
end
```

---

## 📋 **PHASE 4: API Testing & Configuration**

### ✅ **Task 4.1: Create Test Endpoint**
**Priority**: MEDIUM
**Location**: `spotify-backend/server.rb`

**Add test endpoint**:
```ruby
# Test endpoint for Google Sheets
get '/test-google-sheets' do
  content_type :json
  
  test_data = {
    'id' => 'test_order_123',
    'has_studio_session' => true,
    'customer_info' => {
      'name' => 'Test User',
      'email' => 'test@example.com',
      'phone' => '555-1234'
    },
    'items' => [{
      'type' => 'studio_session',
      'studio_name' => 'Test Studio',
      'date' => '2025-06-01',
      'time_slot' => '2:00 PM',
      'duration' => 2,
      'project_type' => 'Recording',
      'additional_notes' => 'Test session'
    }],
    'status' => 'confirmed'
  }
  
  begin
    add_to_google_sheets(test_data)
    { success: true, message: "Test data sent to Google Sheets" }.to_json
  rescue => e
    { success: false, error: e.message }.to_json
  end
end
```

### ✅ **Task 4.2: Verify Google Sheets Configuration**
**Priority**: LOW

**Check**:
- Sheet ID is correct: `1ZtjDAftjp6eUW4Cv2CfS4FKhQcDXnYDM3jJdrekTJqo`
- Range is valid: `Sheet1!A:L`
- Sheet has proper headers (optional)

---

## 🧪 **Testing Checklist**

### **Before Making Changes**:
- [ ] Backup current `server.rb` file
- [ ] Note current Google Sheet state
- [ ] Test current webhook functionality

### **After Phase 1 (Authentication)**:
- [ ] Service account email extracted
- [ ] Google Sheet shared with service account
- [ ] Credentials file path verified
- [ ] Test with `/test-google-sheets` endpoint

### **After Phase 2 (Logging)**:
- [ ] Enhanced error logging added
- [ ] Data structure logging added
- [ ] API call logging added
- [ ] Test a real studio session booking

### **After Phase 3 (Validation)**:
- [ ] Webhook logging added
- [ ] Order data validation added
- [ ] Complete data flow traced

---

## 🔧 **Quick Fixes to Try First**

1. **Extract service account email and share the sheet** (5 minutes)
2. **Add basic error logging** (5 minutes)
3. **Test with the test endpoint** (2 minutes)

---

## 📞 **Support Information**

- **Google Sheets API Documentation**: https://developers.google.com/sheets/api
- **Service Account Setup**: https://cloud.google.com/iam/docs/service-accounts
- **Ruby Google API Client**: https://github.com/googleapis/google-api-ruby-client

---

## 📝 **Notes**

- The current implementation only sends data for `studio_session` type items
- Data is appended to the next available row in the sheet
- Authentication uses service account credentials (not OAuth)
- The integration is triggered by Stripe webhook events

---

**Last Updated**: June 1, 2025
**Status**: Ready for implementation

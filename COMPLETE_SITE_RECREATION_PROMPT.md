# Complete Site Recreation Guide: RIQ Music Production Portfolio & Booking Platform

## Overview
Create a professional music production portfolio and booking platform with integrated Spotify showcase, Stripe payment processing, and GitHub Pages deployment. The site features a React frontend with a Ruby Sinatra backend for handling bookings and payments.

**Live Site:** www.prodbyriq.com  
**Tech Stack:** React + TypeScript + Vite (Frontend), Ruby Sinatra (Backend), Stripe (Payments), Spotify API (Music Integration)

## Featured Spotify Tracks
The site showcases these specific tracks:
- `https://open.spotify.com/track/3rlbQrNDUyIpF5QPjpFCkV` - Mixed & Mastered by RIQ
- `https://open.spotify.com/track/2hNLyPN3fM0Ds7LASznUkX` - Mixed & Mastered by RIQ
- `https://open.spotify.com/track/7ngZ2kMSW18SHZ7RG3QeOG` - Produced by RIQ

## Project Structure
```
project-root/
├── riqsite/                    # Frontend React application
│   ├── public/
│   │   ├── CNAME              # Custom domain configuration
│   │   ├── .nojekyll          # GitHub Pages configuration
│   │   └── 404.html           # GitHub Pages 404 handling
│   ├── src/
│   │   ├── components/
│   │   │   ├── NavBar.tsx
│   │   │   └── SpotifyTrack.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Beats.tsx
│   │   │   ├── Mixing.tsx
│   │   │   ├── Booking.tsx
│   │   │   └── Success.tsx
│   │   ├── styles/
│   │   │   ├── Home.css
│   │   │   ├── About.css
│   │   │   ├── BeatsStyles.css
│   │   │   ├── MixingServices.css
│   │   │   ├── Booking.css
│   │   │   ├── Success.css
│   │   │   ├── NavBar.css
│   │   │   └── PageContent.css
│   │   ├── assets/
│   │   │   └── cropped.png     # Profile image
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.tsx
│   ├── deploy.sh              # Custom deployment script
│   ├── package.json
│   └── vite.config.ts
└── spotify-backend/           # Ruby Sinatra backend
    ├── server.rb             # Main server file
    ├── Gemfile              # Ruby dependencies
    ├── bookings/            # Directory for booking data
    └── .env                 # Environment variables (create this)
```

## Part 1: Frontend Setup (riqsite/)

### 1.1 Initialize React Project
```bash
npm create vite@latest riqsite -- --template react-ts
cd riqsite
npm install
npm install react-router-dom gh-pages
```

### 1.2 Package.json Configuration
```json
{
  "homepage": "https://www.prodbyriq.com",
  "name": "riqsite",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist",
    "deploy:custom": "./deploy.sh"
  },
  "dependencies": {
    "gh-pages": "^6.3.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.2.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.21.0",
    "@types/react": "^19.0.10",
    "@types/react-dom": "^19.0.4",
    "@vitejs/plugin-react": "^4.3.4",
    "eslint": "^9.21.0",
    "eslint-plugin-react-hooks": "^5.1.0",
    "eslint-plugin-react-refresh": "^0.4.19",
    "globals": "^15.15.0",
    "typescript": "~5.7.2",
    "typescript-eslint": "^8.24.1",
    "vite": "^6.2.0"
  }
}
```

### 1.3 Environment Variables (.env)
Create a `.env` file in the riqsite root:
```env
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

### 1.4 Main App Component (src/App.tsx)
```tsx
import './App.css'
import Home from './pages/Home'
import { Routes, Route } from 'react-router-dom'
import About from './pages/About'
import Beats from './pages/Beats'
import Mixing from './pages/Mixing'
import Booking from './pages/Booking'
import Success from './pages/Success'
import NavBar from './components/NavBar'

function App() {
  return (
    <div className="app-container">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/beats" element={<Beats />} />
        <Route path="/mixing" element={<Mixing />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </div>
  )
}

export default App
```

### 1.5 Main Entry Point (src/main.tsx)
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

### 1.6 Success Page (src/pages/Success.tsx)
```tsx
import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../styles/PageContent.css';
import '../styles/Success.css';

const Success = () => {
    const [bookingId, setBookingId] = useState<string | null>(null);
    const location = useLocation();

    useEffect(() => {
        // Get query parameters from URL
        const params = new URLSearchParams(location.search);
        const bookingIdParam = params.get('booking_id');

        if (bookingIdParam) {
            setBookingId(bookingIdParam);
        }
    }, [location]);

    return (
        <div className="page-content">
            <h2>Payment Successful!</h2>
            
            <div className="success-container">
                <div className="success-icon">✓</div>
                
                <div className="success-message">
                    <h3>Thank you for your booking</h3>
                    <p>Your booking has been confirmed and you will receive a confirmation shortly.</p>
                    
                    {bookingId && (
                        <p className="booking-reference">
                            Booking Reference: <span>{bookingId}</span>
                        </p>
                    )}
                    
                    <div className="next-steps">
                        <h4>Next Steps</h4>
                        <ol>
                            <li>You'll receive an text message with booking details</li>
                            <li>RIQ will reach out to confirm your session time</li>
                            <li>Prepare any reference tracks or materials before your session</li>
                        </ol>
                    </div>
                    
                    <div className="action-buttons">
                        <Link to="/" className="home-button">Return to Home</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Success;
```

## Part 2: Ruby Backend Setup (spotify-backend/)

### 2.1 Initialize Ruby Project
```bash
mkdir spotify-backend
cd spotify-backend
```

### 2.2 Gemfile
```ruby
source 'https://rubygems.org'

gem 'sinatra'
gem 'stripe'
gem 'json'
gem 'sinatra-cross_origin'
gem 'puma'
gem 'dotenv'
```

### 2.3 Install Dependencies
```bash
bundle install
```

### 2.4 Environment Variables (.env)
Create a `.env` file in the spotify-backend directory:
```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_signing_secret_here
```

### 2.5 Main Server File (server.rb)
```ruby
require 'stripe'
require 'sinatra'
require 'json'
require 'sinatra/cross_origin'
require 'date'
require 'fileutils'
require 'dotenv/load' if File.exist?(File.join(__dir__, '.env'))

# Configure Stripe API key
Stripe.api_key = ENV['STRIPE_SECRET_KEY'] || 'sk_test_your_stripe_key_here'

# Configure Sinatra
set :port, 4242
set :bind, '0.0.0.0'

# Enable CORS
configure do
  enable :cross_origin
end

before do
  response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
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

# Create checkout session and save booking data
post '/create-checkout-session' do
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
    
    # Create a Stripe Checkout Session
    session = Stripe::Checkout::Session.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: service['name'],
            description: "Session on #{session_details['date']} at #{session_details['time']}",
          },
          unit_amount: service['price'] * 100, # Convert dollars to cents
        },
        quantity: 1,
      }],
      metadata: {
        booking_id: booking_id,
      },
      mode: 'payment',
      success_url: "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}&booking_id=#{booking_id}",
      cancel_url: "http://localhost:5173/booking?canceled=true",
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
      booking_id = session['metadata']['booking_id']
      
      # Update booking status to 'confirmed'
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
    
    status 200
    { received: true }.to_json
  rescue JSON::ParserError, Stripe::SignatureVerificationError => e
    status 400
    { error: e.message }.to_json
  end
end

# Success endpoint
get '/success' do
  "Payment successful! Your booking has been confirmed."
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
```

## Part 3: GitHub Pages Deployment

### 3.1 Custom Deployment Script (riqsite/deploy.sh)
```bash
#!/usr/bin/env bash

# Build the project
npm run build

# Navigate into the build output directory
cd dist

# Create a .nojekyll file to bypass Jekyll processing
touch .nojekyll

# Copy the CNAME file
cp ../public/CNAME .

# Deploy to GitHub Pages
git init
git add -A
git commit -m 'deploy'

# Deploy to GitHub Pages (replace with your repository)
git push -f https://github.com/RiqCodedIt/prodriq-site.git main:gh-pages

cd -
```

### 3.2 CNAME File (riqsite/public/CNAME)
```
www.prodbyriq.com
```

### 3.3 404 Page (riqsite/public/404.html)
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>RIQ - Page Not Found</title>
    <script type="text/javascript">
      // Single Page Apps for GitHub Pages
      var pathSegmentsToKeep = 0;
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body>
  </body>
</html>
```

### 3.4 .nojekyll File (riqsite/public/.nojekyll)
Create an empty file named `.nojekyll` in the public directory.

## Part 4: CSS Styling (Basic Structure)

### 4.1 Base Styles (src/styles/PageContent.css)
```css
.page-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: calc(100vh - 80px);
}

.content-section {
  margin: 2rem 0;
}

.content-section h3 {
  margin-bottom: 1rem;
  color: #333;
}

.error-message {
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.loading-indicator {
  text-align: center;
  padding: 2rem;
  color: #666;
}
```

### 4.2 Navigation Styles (src/styles/NavBar.css)
```css
.navbar {
  background-color: #1a1a1a;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
}

.nav-logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
}

.nav-menu {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #ccc;
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-link:hover,
.nav-link.active {
  color: #fff;
}
```

## Part 5: Running the Application

### 5.1 Start the Backend Server
```bash
cd spotify-backend
bundle exec ruby server.rb
```
Server will run on `http://localhost:4242`

### 5.2 Start the Frontend Development Server
```bash
cd riqsite
npm run dev
```
Frontend will run on `http://localhost:5173`

### 5.3 Deploy to GitHub Pages
```bash
cd riqsite
chmod +x deploy.sh
./deploy.sh
```

## Part 6: Required API Keys and Setup

### 6.1 Spotify API Setup
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Get your Client ID and Client Secret
4. Add them to your `.env` file in the riqsite directory

### 6.2 Stripe Setup
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your test API keys
3. Set up webhooks for payment confirmation
4. Add keys to your `.env` file in the spotify-backend directory

### 6.3 GitHub Repository Setup
1. Create a new GitHub repository
2. Update the repository URL in `deploy.sh`
3. Enable GitHub Pages in repository settings
4. Set custom domain to `www.prodbyriq.com`

## Part 7: Key Features Implemented

### 7.1 Spotify Integration
- Fetches track data using Spotify Web API
- Displays embedded Spotify players
- Shows track metadata (title, artist, album art)
- Handles API errors gracefully

### 7.2 Booking System
- Multi-step booking flow
- Form validation
- Phone number formatting
- Date/time selection
- Service pricing

### 7.3 Payment Processing
- Stripe Checkout integration
- Secure payment handling
- Booking confirmation
- Webhook processing

### 7.4 Data Management
- JSON file-based booking storage
- Unique booking IDs
- Status tracking
- Admin booking retrieval

## Part 8: Production Considerations

### 8.1 Environment Variables
- Never commit API keys to version control
- Use different keys for development and production
- Set up proper webhook endpoints for production

### 8.2 Security
- Validate all user inputs
- Sanitize data before storage
- Use HTTPS in production
- Implement proper CORS policies

### 8.3 Monitoring
- Set up error logging
- Monitor Stripe webhooks
- Track booking success rates
- Monitor API rate limits

This guide provides everything needed to recreate the RIQ music production portfolio and booking platform with all current functionality, including the specific Spotify tracks, backend payment processing, and GitHub Pages deployment.

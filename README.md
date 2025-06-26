# RIQ Site Frontend

A React/TypeScript frontend for RIQ's music production website, featuring beat sales, studio booking, and service offerings.

## Features

- **Beat Marketplace**: Browse and purchase beats with different license types
- **Studio Booking**: Book recording sessions with calendar integration
- **Service Booking**: Book mixing, mastering, and consultation services
- **Stripe Integration**: Secure payment processing
- **Google Calendar Sync**: Automatic calendar integration for bookings
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: CSS3 with custom styles
- **Payment**: Stripe
- **Calendar**: Google Calendar API
- **Deployment**: Docker + Railway

## Docker Deployment

This application is containerized using Docker for easy deployment to Railway.

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Docker Build

```bash
# Build Docker image
docker build -t riqsite-frontend .

# Run container locally
docker run -p 8080:80 riqsite-frontend

# Test health endpoint
curl http://localhost:8080/health
```

### Railway Deployment

The application is configured for Railway deployment with:

- **Multi-stage Docker build** (Node.js → nginx)
- **Health check endpoint** at `/health`
- **Dynamic PORT support** via environment variable
- **SPA routing support** for React Router
- **Production optimizations** (gzip, caching, minification)

### Environment Variables

Required environment variables for production:

```env
# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_...

# Google APIs
VITE_GOOGLE_CLIENT_ID=...
VITE_GOOGLE_API_KEY=...
VITE_GOOGLE_SHEET_ID=...

# Backend API
VITE_API_URL=https://your-backend-url.com
```

### Project Structure

```
src/
├── components/          # React components
│   ├── beats/          # Beat marketplace components
│   ├── cart/           # Shopping cart components
│   └── checkout/       # Payment components
├── pages/              # Page components
├── services/           # API services
├── styles/             # CSS stylesheets
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend Integration

The frontend connects to a Ruby/Sinatra backend for:
- Payment processing
- Booking management
- Google Sheets integration
- Calendar synchronization

Backend should be running on the URL specified in `VITE_API_URL`.

## Deployment

1. **Build and test locally**:
   ```bash
   docker build -t riqsite-frontend .
   docker run -p 8080:80 riqsite-frontend
   ```

2. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Update frontend"
   git push origin frontend
   ```

3. **Deploy to Railway**:
   - Railway automatically detects the Dockerfile
   - Builds and deploys the container
   - Provides a public URL

## Health Checks

The application includes a health check endpoint at `/health` that returns:

```json
{
  "status": "healthy",
  "timestamp": "2025-06-26T19:01:47.000Z"
}
```

This endpoint is used by Railway to verify the application is running correctly.

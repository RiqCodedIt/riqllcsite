# Single-stage build for React/Vite frontend with Node.js server
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

#Inject Backend URL
ARG REACT_APP_API_URL

# Debug: Echo the VITE_API_URL environment variable
RUN echo "BACKEND_URL during build: $REACT_APP_API_URL"

# Build the application
RUN npm run build

# Expose port (Railway will override this)
EXPOSE 4000

# Start the Express server
CMD ["npm", "start"]

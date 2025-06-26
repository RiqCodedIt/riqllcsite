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

# Build the application
RUN npm run build

# Expose port (Railway will override this)
EXPOSE 4000

# Start the Express server
CMD ["npm", "start"]

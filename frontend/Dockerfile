# Stage 1: Build the Vue.js application
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

# Install dependencies cleanly
RUN npm ci

COPY . .

# Build the application for production
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

# Copy built assets from the build stage to the Nginx public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Create a new Nginx configuration optimized for a Single Page Application (SPA)
# This configuration directs all non-file requests to index.html for Vue Router to handle
RUN echo "server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files \$uri \$uri/ /index.html; \
    } \
}" > /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]

# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Copy source code
COPY . .

# Build the application
RUN yarn && \
    yarn build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /var/www/dist

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
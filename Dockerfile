FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Create uploads directory
RUN mkdir -p public/uploads

# Expose the port the app will run on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]


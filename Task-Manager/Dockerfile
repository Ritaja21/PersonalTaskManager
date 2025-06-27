# Use official Node.js image
FROM node:18

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your app
COPY . .

# Expose the port your app runs on (5000 for your case)
EXPOSE 5000

# Start the application
CMD ["npm", "start"]

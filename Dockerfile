# Use the official Node.js image as the base image
FROM node:latest

# Set the working directory for the app
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install the app's dependencies
RUN npm install

# Copy the app's source code into the container
COPY . .

# Expose the port your app listens on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]

# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# install nodemon
RUN npm install -g nodemon

# Set the working directory to /app
WORKDIR /app


# Copy files to the working directory
COPY . .

# Install app dependencies
RUN npm install

# Expose the necessary ports
EXPOSE 5001

# Start the application
ENTRYPOINT ["npm", "run", "start"]

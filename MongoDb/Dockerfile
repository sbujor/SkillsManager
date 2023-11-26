# Use the official MongoDB image from the Docker Hub
FROM mongo

# Set environment variables to configure MongoDB
ENV MONGO_INITDB_ROOT_USERNAME=admin
ENV MONGO_INITDB_ROOT_PASSWORD=adminpassword

# Install dos2unix
RUN apt-get update && apt-get install -y dos2unix
RUN  apt-get update && apt-get install -y net-tools

# Copy a script to the container that will be executed on initialization
COPY init-mongo.js /docker-entrypoint-initdb.d/
# Make sure the script is in Unix format
RUN dos2unix /docker-entrypoint-initdb.d/init-mongo.js


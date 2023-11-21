FROM mongo:latest

RUN apt-get update && apt-get install -y mongodb-shell

# Create the quiz_manager database
RUN mongo -h localhost -p 27017 --quiet --execute="use quiz_manager; db.createCollection('quizzes');"

# Expose port 27017
EXPOSE 27018

# Set environment variables
ENV MONGO_INITDB_ROOT_USERNAME=silviu.bujor
ENV MONGO_INITDB_ROOT_PASSWORD=silviu.bujor
ENV MONGO_INITDB_DATABASE=quiz_manager
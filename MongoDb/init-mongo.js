// Create the quiz_manager database
db = db.getSiblingDB("quiz_manager");

// Create a user with read-write permissions on the quiz_manager database
db.createUser({
  user: "silviu1",
  pwd: "silviu1",
  roles: [
    {
      role: "dbOwner",
      db: "quiz_manager",
    },
  ],
});

db.createCollection("quizzes");

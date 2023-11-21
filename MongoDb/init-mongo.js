// Create the quiz_manager database
db = db.getSiblingDB("quiz_manager");

// Create a user for the database
db.createUser({
  user: "silviu.bujor",
  pwd: "silviu.bujor",
  roles: [{ role: "readWrite", db: "quiz_manager" }],
});

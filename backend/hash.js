const bcrypt = require("bcrypt");

const password = "Worker123";
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error("Error hashing password:", err);
    return;
  }

  console.log("Hashed password:", hash);
});

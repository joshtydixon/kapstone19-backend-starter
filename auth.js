const db = require("./database.json");

const login = (req, res) => {
  const { username, password } = req.body;
  const userIndex = db.users.findIndex((user) => user.username === username);
  if (userIndex !== -1) {
    if (db.users[userIndex].password === password) {
      res.status(201).send(db.users[userIndex].username);
    } else {
      res.status(401).send("That password doesn't seem to be right.");
    }
  } else {
    res
      .status(404)
      .send(
        "We can't find that user on our side, maybe check your spelling 😅."
      );
  }
};

module.exports = { login };

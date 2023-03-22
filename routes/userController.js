const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { v4: uuid } = require("uuid");

const user = {
  username: "admin",
  password: "$2a$10$.MNJ/ID5F61lGoOza.tozOPo3xgCoMf0SPENefP5xdJzltMvqxe8S",
};

let userTokens = [];

router.get("/login", (req, res) => {
  const { username, password } = req.query;
  if (
    user.username === username &&
    bcrypt.compareSync(password, user.password)
  ) {
    const token = uuid();
    userTokens.push(token);
    res.json({ token });
  } else {
    res.sendStatus(401);
  }
});

module.exports = {
  userRouter: router,
};
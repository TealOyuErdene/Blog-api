const express = require("express");
const cors = require("cors");
const { v4: uuid } = require("uuid");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { categoryRouter } = require("./routes/categoryController");
const { articleRouter } = require("./routes/articleController");

const port = 8000;
const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://OyuErdene:tK5CntxmvG3iuBXk@cluster0.u09hg9h.mongodb.net/blog"
  )
  .then(() => console.log("Connected!"));

// const hash = bcrypt.hashSync("password123");
// console.log({ hash });
const user = {
  username: "admin",
  password: "$2a$10$.MNJ/ID5F61lGoOza.tozOPo3xgCoMf0SPENefP5xdJzltMvqxe8S",
};

let userTokens = [];

app.get("/login", (req, res) => {
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

app.use("/categories", categoryRouter);
app.use("/articles", articleRouter);

app.listen(port, () => {
  console.log("App is listening at port", port);
});

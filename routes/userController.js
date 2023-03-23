const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { v4: uuid } = require("uuid");
const mongoose = require("mongoose");

const User = mongoose.model("User", {
  _id: { type: String, default: () => uuid() },
  username: {
    type: String,
    required: [true, "Хэрэглэгчийн нэрээ оруулна уу"],
    unique: [true, "Ийм нэртэй хэрэглэгч бүртгэгдсэн байна"],
  },
  password: { type: String, required: [true, "Нууц үгээ оруулна уу"] },
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 8);

  if (!username) {
    res.status(400).json({ message: "Хэрэглэгчийн нэрээ оруулна уу" });
  }

  if (!password) {
    res.status(400).json({ message: "Нууц үгээ оруулна уу" });
  }

  const newUser = new User({
    username,
    password: hashedPassword,
  });

  try {
    const result = await newUser.save();
    res.sendStatus(201);
  } catch (e) {
    res.sendStatus(400).json(e);
  }
});

router.post("/login", async (req, res) => {
  const [username, password] = req.body;
  const one = await User.findOne({ username });

  if (one) {
    const auth = bcrypt.compareSync(password, one.password);
    if (auth) {
      res.json({ token: uuid() });
    } else {
      res.sendStatus(400).json({ message: "Буруу байна" });
    }
  } else {
    res.sendStatus(400).json({ message: "Буруу байна" });
  }
});

module.exports = {
  userRouter: router,
};

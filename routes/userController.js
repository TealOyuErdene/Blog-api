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
});

module.exports = {
  userRouter: router,
};

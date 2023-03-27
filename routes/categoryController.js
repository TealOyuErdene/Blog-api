const express = require("express");
const { v4: uuid } = require("uuid");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const categorySchema = new mongoose.Schema({
  _id: String,
  name: String,
});

const Category = mongoose.model("Category", categorySchema);

router.get("/", async (req, res) => {
  const token = req.headers.authorization;
  jwt.verify(token, process.env.JWT_SECRET_KEY, async function (err, decoded) {
    if (err) {
      res.sendStatus(401);
    } else {
      var decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const { q } = req.query;
      const qregex = q ? new RegExp(`${q}`, "i") : RegExp(``, "i");
      const list = await Category.find({ name: qregex }, "", {
        sort: { name: 1 },
      });
      res.json(list);
    }
  });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const one = await Category.findById(id);
  res.json(one);
});

router.post("/", async (req, res) => {
  const { name } = req.body;
  const newCategory = new Category({
    _id: uuid(),
    name: name,
  });

  const result = await newCategory.save();
  res.sendStatus(201);
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  Category.deleteOne({ _id: id }).then(() => {
    res.json({ deleted: id });
  });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  Category.updateOne({ _id: id }, { name }).then(() => {
    res.json({ updatedId: id });
  });
});

module.exports = {
  categoryRouter: router,
};

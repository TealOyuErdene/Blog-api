const express = require("express");
const { v4: uuid } = require("uuid");
const router = express.Router();
const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  _id: { type: String, default: () => uuid() },
  title: String,
  text: String,
  categoryId: { type: String, ref: "Category" },
  image: {
    path: String,
    width: Number,
    height: Number,
  },
});

const Article = mongoose.model("Article", articleSchema);

router.get("/", async (req, res) => {
  const list = await Article.find({}).populate("categoryId");

  res.json({
    list: list,
    count: 10,
  });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const one = await Article.findById(id);
  res.json(one);
});

router.post("/", async (req, res) => {
  const { title, text, categoryId, image } = req.body;
  await Article.create({
    title,
    text,
    categoryId,
    image,
  });

  res.sendStatus(201);
});

router.get("/category/:categoryId", async (req, res) => {
  const { categoryId } = req.params;
  // console.log(categoryId);
  const filteredArticle = await Article.find({
    categoryId: categoryId,
  }).populate("categoryId");
  res.json(filteredArticle);
  // console.log(filteredArticle);
});

router.delete("/item/:id", async (req, res) => {
  const { id } = req.params;
  await Article.deleteOne({ _id: id });
  res.json({ DeletedId: id });
});

module.exports = {
  articleRouter: router,
};

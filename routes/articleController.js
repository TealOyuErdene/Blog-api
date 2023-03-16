const express = require("express");
const fs = require("fs");
const { v4 } = require("uuid");
const { connection } = require("../config/mysql");
const router = express.Router();

function readArticles() {
  const content = fs.readFileSync("articles.json");
  const articles = JSON.parse(content);
  return articles;
}

router.get("/", (req, res) => {
  connection.query(
    `SELECT article.id, title, category.name, image FROM article left join category on article.category_id=category.id`,
    function (err, results, fields) {
      res.json({
        list: results,
        count: 10,
      });
    }
  );
});

router.post("/", (req, res) => {
  const { title, categoryId, text, image } = req.body;
  const newArticle = {
    id: v4(),
    title: title,
    text: text,
    categoryId: categoryId,
    image: image,
  };
  const articles = readArticles();
  articles.unshift(newArticle);
  fs.writeFileSync("articles.json", JSON.stringify(articles));
  res.sendStatus(201);
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const articles = readArticles();
  const one = articles.find((article) => article.id === id);
  const categories = readCategories();
  let category = categories.find((category) => category.id === one.categoryId);
  one.category = category;
  if (one) {
    res.json(one);
  } else {
    res.sendStatus(404);
  }
});

router.get("/category/:categoryId", (req, res) => {
  const { categoryId } = req.params;
  const articles = readArticles();
  const filteredArticle = articles.filter(
    (article) => article.categoryId === categoryId
  );
  if (filteredArticle) {
    res.json(filteredArticle);
  } else {
    res.sendStatus(404);
  }
});

router.delete("/item/:id", (req, res) => {
  const { id } = req.params;
  const articles = readArticles();
  const one = articles.find((article) => article.id === id);
  if (one) {
    const newList = articles.filter((article) => article.id !== id);
    fs.writeFileSync("articles.json", JSON.stringify(newList));
    res.json({ deletedId: id });
  } else {
    res.sendStatus(404);
  }
});

module.exports = {
  articleRouter: router,
};

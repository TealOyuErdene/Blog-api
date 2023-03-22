const express = require("express");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const { connection } = require("../config/mysql");
const router = express.Router();

// function readArticles() {
//   const content = fs.readFileSync("articles.json");
//   const articles = JSON.parse(content);
//   return articles;
// }

router.get("/", (req, res) => {
  connection.query(
    `SELECT article.id, title, category.name FROM article left join category on article.category_id=category.id`,
    function (err, results, fields) {
      res.json({
        list: results,
        count: 10,
      });
    }
  );
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    `SELECT * FROM article where id=?`,
    [id],
    function (err, results, fields) {
      res.json(results[0]);
    }
  );
});

router.post("/", (req, res) => {
  const { title, text, categoryId } = req.body;
  const newArticle = {
    id: uuid(),
    title,
    text,
    category_id: categoryId,
  };

  console.log(newArticle);

  connection.query(
    `insert into article values (?,?,?,?)`,
    [newArticle.id, newArticle.title, newArticle.text, newArticle.category_id],
    function (err, results, fields) {
      res.sendStatus(201);
    }
  );
});

router.get("/category/:categoryId", (req, res) => {
  const { categoryId } = req.params;

  const filteredArticle = connection.query(
    `SELECT * FROM article where categoryId=?`,
    [categoryId],
    function (err, results, fields) {
      res.json(filteredArticle);
    }
  );
});

router.delete("/item/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    `DELETE FROM article where id=?`,
    [id],
    function (err, results, fields) {
      res.json({ deletedId: id });
    }
  );
});

module.exports = {
  articleRouter: router,
};

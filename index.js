const express = require("express");
const cors = require("cors");
const { v4 } = require("uuid");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const { connection } = require("./config/mysql");

const port = 8000;
const app = express();

app.use(cors());
app.use(express.json());

const user = {
  username: "Admin",
  password: "$2a$10$.MNJ/ID5F61lGoOza.tozOPo3xgCoMf0SPENefP5xdJzltMvqxe8S",
  //password123
};

let userTokens = [];

app.get("/login", (req, res) => {
  const { username, password } = req.query;
  if (
    user.username === username &&
    bcrypt.compareSync(password, user.password)
  ) {
    const token = v4();
    userTokens.push(token);
    res.json({ token });
  } else {
    res.sendStatus(401);
  }
});

//......Categories
// function readCategories() {
//   const content = fs.readFileSync("categories.json");
//   const categories = JSON.parse(content);
//   return categories;
// }

function readCategories() {
  connection.query(`select * from category`, function (err, results, fields) {
    return results;
  });
}
app.get("/categories", (req, res) => {
  connection.query(`select * from category`, function (err, results, fields) {
    res.json(results);
  });
});

app.get("/categories/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    `select * from category where id=?`,
    [id],
    function (err, results, fields) {
      res.json(results[0]);
    }
  );
});

app.post("/categories", (req, res) => {
  const { name } = req.body;
  connection.query(
    `insert into category values(?, ?)`,
    [v4(), name],
    function (err, results, fields) {
      res.sendStatus(201);
    }
  );
});

app.delete("/categories/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    `delete from category where id=?`,
    [id],
    function (err, results, fields) {
      res.json({ deletedId: id });
    }
  );
});

app.put("/categories/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  connection.query(
    `update category set name=? where id=?`,
    [name, id],
    function (err, results, fields) {
      res.json({ updatedId: id });
    }
  );
});

//......Articles
function readArticles() {
  const content = fs.readFileSync("articles.json");
  const articles = JSON.parse(content);
  return articles;
}

app.get("/articles", (req, res) => {
  const { q, page } = req.query;
  const articles = readArticles();

  if (q) {
    const filteredList = articles.filter((article) =>
      article.title.toLowerCase().includes(q.toLowerCase())
    );
    res.json({
      list: filteredList,
      count: filteredList.length,
    });
  } else {
    const pageList = articles.slice((page - 1) * 12, page * 12);
    res.json({
      list: pageList,
      count: articles.length,
    });
  }
  res.json({
    list: articles,
    count: articles.length,
  });
});

app.post("/articles", (req, res) => {
  const { title, categoryId, text, image } = req.body;
  const newArticles = {
    id: v4(),
    title: title,
    text: text,
    categoryId: categoryId,
    image: image,
  };
  const articles = readArticles();
  articles.unshift(newArticles);
  fs.writeFileSync("articles.json", JSON.stringify(articles));
  res.sendStatus(201);
});

app.get("/articles/:id", (req, res) => {
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

app.get("/articles/category/:categoryId", (req, res) => {
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

app.delete("/articles/item/:id", (req, res) => {
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

app.listen(port, () => {
  console.log("App is listening at port", port);
});

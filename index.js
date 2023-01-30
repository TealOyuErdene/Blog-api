const express = require("express");
const cors = require("cors");
const { v4 } = require("uuid");
const fs = require("fs");

const port = 8000;
const app = express();

app.use(cors());
app.use(express.json());

let categories = [
  {
    id: v4(),
    name: "Улс төр",
  },

  {
    id: v4(),
    name: "Спорт",
  },

  {
    id: v4(),
    name: "Эрүүл мэнд",
  },
];

function readCategories() {
  const content = fs.readFileSync("categories.json");
  const categories = JSON.parse(content);
  return categories;
}

app.get("/categories", (req, res) => {
  const categories = readCategories();
  res.json(categories);
});

app.get("/categories/:id", (req, res) => {
  const { id } = req.params;
  const categories = readCategories();
  const one = categories.find((category) => category.id === id);
  console.log("one", id, categories);
  if (one) {
    res.json(one);
  } else {
    res.sendStatus(404);
  }
});

app.post("/categories", (req, res) => {
  const { name } = req.body;
  const newCategory = { id: v4(), name: name };
  const categories = readCategories();
  categories.unshift(newCategory);
  fs.writeFileSync("categories.json", JSON.stringify(categories));
  res.sendStatus(201);
});

app.delete("/categories/:id", (req, res) => {
  const { id } = req.params;
  const categories = readCategories();
  const one = categories.find((category) => category.id === id);
  if (one) {
    const newList = categories.filter((category) => category.id !== id);
    fs.writeFileSync("categories.json", JSON.stringify(newList));
    res.json({ deletedId: id });
  } else {
    res.sendStatus(404);
  }
});

app.put("/categories/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const categories = readCategories();
  const index = categories.findIndex((category) => category.id === id);
  if (index > -1) {
    categories[index].name = name;
    fs.writeFileSync("categories.json", JSON.stringify(categories));
    res.json({ updateId: id });
  } else {
    res.sendStatus(404);
  }
});

///

app.get("/user/save", (req, res) => {
  const newUser = [
    {
      name: "Sarnai",
      id: 1,
    },
  ];
  fs.writeFileSync("data.json", JSON.stringify(newUser));
  res.json(["success"]);
});

app.get("/user/read", (req, res) => {
  const content = fs.readFileSync("data.json");
  res.json(JSON.parse(content));
});

app.get("/user/update", (req, res) => {
  const content = fs.readFileSync("data.json");
  const users = JSON.parse(content);
  users.push({ name: "Bold", id: 2 });
  fs.writeFileSync("data.json", JSON.stringify(users));
  res.json({});
});

app.listen(port, () => {
  console.log("App is listening at port", port);
});

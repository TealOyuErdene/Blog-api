const express = require("express");
const cors = require("cors");
const { v4 } = require("uuid");

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

app.get("/categories", (req, res) => {
  res.json(categories);
});

app.get("/categories/:id", (req, res) => {
  const { id } = req.params;
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
  categories.push(newCategory);
  res.sendStatus(201);
});

app.delete("/categories/:id", (req, res) => {
  const { id } = req.params;
  const one = categories.find((category) => category.id === id);
  if (one) {
    const newList = categories.filter((category) => category.id !== id);
    categories = newList;
    res.json({ deletedId: id });
  } else {
    res.sendStatus(404);
  }
});

app.put("/categories/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const index = categories.findIndex((category) => category.id === id);
  if (index > -1) {
    categories[index].name = name;
    res.json({ updateId: id });
  } else {
    res.sendStatus(404);
  }
});

app.listen(port, () => {
  console.log("App i1s listening at port", port);
});

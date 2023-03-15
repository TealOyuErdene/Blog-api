const express = require("express");
const { v4 } = require("uuid");
const { connection } = require("../config/mysql");
const router = express.Router();

function readCategories() {
  connection.query(`select * from category`, function (err, results, fields) {
    return results;
  });
}

router.get("/", (req, res) => {
  connection.query(`select * from category`, function (err, results, fields) {
    res.json(results);
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    `select * from category where id=?`,
    [id],
    function (err, results, fields) {
      res.json(results[0]);
    }
  );
});

router.post("/", (req, res) => {
  const { name } = req.body;
  connection.query(
    `insert into category values(?, ?)`,
    [v4(), name],
    function (err, results, fields) {
      res.sendStatus(201);
    }
  );
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    `delete from category where id=?`,
    [id],
    function (err, results, fields) {
      res.json({ deletedId: id });
    }
  );
});

router.put("/:id", (req, res) => {
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

module.exports = {
  categoryRouter: router,
};

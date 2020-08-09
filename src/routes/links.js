const router = require("express").Router();
const pool = require("../database");

router.get("/add", (req, res) => {
  res.render("links/add");
});

router.post("/add", (req, res) => {
  res.send("recibido");
});

module.exports = router;
